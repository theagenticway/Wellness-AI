import 'dotenv/config'; // Load .env file
import express, { Request, Response } from 'express';
import { llmGateway } from './services/llmGateway';
import http from 'http';

const app = express();
const port = process.env.PORT || 3001;
const agentServiceUrl = process.env.AGENT_SERVICE_URL || 'http://localhost:8000/generate-plan';

app.use(express.json()); // Enable JSON body parsing

app.get('/', (req: Request, res: Response) => {
  res.send('WellnessAI Backend is running!');
});

app.get('/test-graph', async (req: Request, res: Response) => {
  console.log('--- TESTING GRAPH ---');
  try {
    // Validate user profile
    const firstName = req.query.firstName as string;
    const lastName = req.query.lastName as string;
    const email = req.query.email as string;
    const type = req.query.type as string;

    if (!firstName || !lastName || !email || !type) {
      return res.status(400).json({ error: 'Missing user profile information' });
    }

    const userProfile = {
      firstName,
      lastName,
      email,
      type,
    };

    // Construct the data object
    const data = JSON.stringify({
      user_profile: userProfile,
      professional_override: req.query.professionalOverride || '',
      currentPhase: "phase1",
    });

    // Options for the HTTPS request
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    // Make the HTTP request
    const request = http.request(agentServiceUrl, options, (response: any) => {
      let result = '';

      response.on('data', (chunk: any) => {
        result += chunk;
      });

      response.on('end', () => {
        try {
          const parsedResult = JSON.parse(result);
          console.log('Graph Result:', parsedResult);
          res.json(parsedResult);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          res.status(500).json({ error: 'Error parsing JSON from agent service', details: parseError });
        }
      });
    });

    request.on('error', (error: any) => {
      console.error('Error calling agent service:', error);
      res.status(500).json({ error: 'Error calling agent service', details: error });
    });

    request.write(data);
    request.end();

  } catch (error: any) {
    console.error('Error running graph:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  try {
    llmGateway;
    console.log('LLM Gateway initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize LLM Gateway:', error);
  }
});
