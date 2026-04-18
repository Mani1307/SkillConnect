const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API endpoints...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('Health check:', healthResponse.data);
    
    // Test OTP send endpoint
    console.log('\n2. Testing OTP send endpoint...');
    try {
      const otpResponse = await axios.post('http://localhost:5000/api/auth/send-otp', {
        email: 'test@example.com'
      });
      console.log('OTP send response:', otpResponse.data);
    } catch (error) {
      console.log('OTP send error:', error.response?.data || error.message);
    }
    
    // Test login endpoint
    console.log('\n3. Testing login endpoint...');
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('Login response:', loginResponse.data);
    } catch (error) {
      console.log('Login error:', error.response?.data || error.message);
    }
    
    console.log('\nAPI tests completed!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAPI();