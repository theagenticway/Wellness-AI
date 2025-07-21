import 'dotenv/config'; // Load .env file
import http from 'http';

const agentServiceUrl = 'http://localhost:8000/generate-plan';

const data = JSON.stringify({
  user_profile: {
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    type: 'member',
  },
  professional_override: '',
  currentPhase: "phase1",
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

const request = http.request(agentServiceUrl, options, (response) => {
  let result = '';

  response.on('data', (chunk) => {
    result += chunk;
  });

  response.on('end', () => {
    console.log('Graph Result:', result);
  });
});

request.on('error', (error) => {
  console.error('Error calling agent service:', error);
});

request.write(data);
request.end();
