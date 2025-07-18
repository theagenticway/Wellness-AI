import * as fs from 'fs';
import * as path from 'path';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
// Placeholder for a potential Grok model integration
// import { ChatGrok } from '@langchain/community/chat_models/grok';

// Define types for our configuration
interface ProviderConfig {
  apiKey: string;
}

interface ModelConfig {
  provider: string;
  model: string;
  temperature: number;
}

interface LlmConfig {
  providers: Record<string, ProviderConfig>;
  agentModelMapping: Record<string, ModelConfig>;
}

class LlmGateway {
  private static instance: LlmGateway;
  private config: LlmConfig;
  private models: Map<string, BaseChatModel> = new Map();

  private constructor() {
    const configPath = path.resolve(__dirname, '../config/llm-providers.json');
    const rawConfig = fs.readFileSync(configPath, 'utf-8');
    this.config = JSON.parse(rawConfig);
    this.resolveEnvVariables();
    this.initializeModels();
  }

  public static getInstance(): LlmGateway {
    if (!LlmGateway.instance) {
      LlmGateway.instance = new LlmGateway();
    }
    return LlmGateway.instance;
  }

  private resolveEnvVariables() {
    for (const providerKey in this.config.providers) {
      const provider = this.config.providers[providerKey];
      if (provider.apiKey.startsWith('env:')) {
        const envVar = provider.apiKey.split(':')[1];
        provider.apiKey = process.env[envVar] || '';
        if (!provider.apiKey) {
          console.warn(`Environment variable ${envVar} not found for LLM provider ${providerKey}`);
        }
      }
    }
  }

  private initializeModels() {
    console.log('Initializing LLM models for all agents...');
    for (const agentName in this.config.agentModelMapping) {
      const modelConfig = this.config.agentModelMapping[agentName];
      const providerConfig = this.config.providers[modelConfig.provider];

      if (!providerConfig || !providerConfig.apiKey) {
        console.warn(`API key for provider ${modelConfig.provider} not found. Skipping model initialization for agent ${agentName}.`);
        continue;
      }

      let model: BaseChatModel;

      switch (modelConfig.provider) {
        case 'openai':
          model = new ChatOpenAI({
            apiKey: providerConfig.apiKey,
            modelName: modelConfig.model,
            temperature: modelConfig.temperature,
          });
          break;
        case 'google':
          model = new ChatGoogleGenerativeAI({
            apiKey: providerConfig.apiKey,
            model: modelConfig.model,
            temperature: modelConfig.temperature,
          });
          break;
        // case 'grok':
        //   // Assuming a ChatGrok class exists or will be created
        //   model = new ChatGrok({
        //     apiKey: providerConfig.apiKey,
        //     modelName: modelConfig.model,
        //     temperature: modelConfig.temperature,
        //   });
        //   break;
        default:
          console.warn(`Unsupported LLM provider: ${modelConfig.provider}`);
          continue;
      }

      this.models.set(agentName, model);
      console.log(`Initialized model for agent: ${agentName}`);
    }
  }

  public getModelForAgent(agentName: string): BaseChatModel {
    const model = this.models.get(agentName);
    if (!model) {
      throw new Error(`Model for agent ${agentName} is not initialized. Check your configuration and API keys.`);
    }
    return model;
  }
}

export const llmGateway = LlmGateway.getInstance();
