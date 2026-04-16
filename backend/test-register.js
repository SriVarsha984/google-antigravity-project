const axios = require('axios');

const testRegister = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      username: 'testuser_' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      password: 'password123'
    });
    console.log('SUCCESS:', res.data);
  } catch (err) {
    console.error('FAILED:', err.response?.status, err.response?.data || err.message);
  }
};

testRegister();
