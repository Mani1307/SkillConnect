import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import MLWagePrediction from '../components/MLWagePrediction';
import './PostJob.css';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobType: 'Driver',
    workersNeeded: 1,
    duration: {
      estimated: 1,
      unit: 'days'
    },
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  const [mlPrediction, setMlPrediction] = useState(null);

  const jobTypes = ['Driver', 'Painter', 'Electrician', 'Plumber', 'Carpenter', 'Mason', 'Welder', 'Cleaner', 'Gardener', 'Constructor', 'Fabricator', 'Tiler'];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseInt(value) || value : value
      });
    }
  };

  const handleMLPredictionComplete = (prediction) => {
    setMlPrediction(prediction);
    // Auto-fill wage estimation based on ML prediction
    if (prediction && prediction.predicted_wage) {
      const dailyRate = prediction.predicted_wage;
      const totalDays = formData.duration?.estimated || 1;
      const totalEstimated = dailyRate * totalDays * formData.workersNeeded;
      
      setFormData(prev => ({
        ...prev,
        wageCalculation: {
          ratePerDay: dailyRate,
          totalEstimated
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.post('/jobs', formData);
      alert('Job posted successfully!');
      navigate('/employer/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <div className="post-job-container">
      <h1>Post a New Job</h1>
      <form onSubmit={handleSubmit} className="job-form">
        
        {/* ML Wage Prediction Component */}
        <MLWagePrediction onPredictionComplete={handleMLPredictionComplete} />

        <div className="form-grid">
          <div className="form-group">
            <label>Job Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Need House Painting" />
          </div>
          
          <div className="form-group">
            <label>Job Type</label>
            <select name="jobType" value={formData.jobType} onChange={handleChange} required>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Workers Needed</label>
            <input type="number" name="workersNeeded" value={formData.workersNeeded} onChange={handleChange} min="1" required />
          </div>
          
          <div className="form-group">
            <label>Duration</label>
            <div className="duration-inputs">
              <input type="number" name="duration.estimated" value={formData.duration.estimated} onChange={handleChange} min="1" required />
              <select name="duration.unit" value={formData.duration.unit} onChange={handleChange}>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" placeholder="Describe the work details..."></textarea>
        </div>

        <div className="form-section">
          <h3>Location Details</h3>
          <div className="form-grid">
            <input name="location.address" value={formData.location.address} onChange={handleChange} required placeholder="Address" />
            <input name="location.city" value={formData.location.city} onChange={handleChange} required placeholder="City" />
            <input name="location.state" value={formData.location.state} onChange={handleChange} required placeholder="State" />
            <input name="location.pincode" value={formData.location.pincode} onChange={handleChange} required placeholder="Pincode" />
          </div>
        </div>

        {mlPrediction && (
          <div className="estimation-card">
            <h3>💰 Estimated Cost: ₹{formData.wageCalculation?.totalEstimated || 0}</h3>
            <div className="estimation-breakdown">
              <div className="breakdown-item">
                <span>Rate per worker per day</span>
                <span>₹{mlPrediction.predicted_wage}</span>
              </div>
              <div className="breakdown-item">
                <span>Number of workers</span>
                <span>{formData.workersNeeded}</span>
              </div>
              <div className="breakdown-item">
                <span>Duration</span>
                <span>{formData.duration.estimated} {formData.duration.unit}</span>
              </div>
            </div>
            <p className="estimation-note">* This is an ML-based estimate. Actual rates may be negotiated with workers.</p>
          </div>
        )}

        <button type="submit" className="submit-btn">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
