// apps/backend/src/services/llmGateway.ts
import * as fs from 'fs';
import * as path from 'path';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

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
  private isInitialized: boolean = false;
  private initializationError: string | null = null;

  private constructor() {
    try {
      this.loadConfiguration();
      this.resolveEnvVariables();
      this.initializeModels();
      this.isInitialized = true;
      console.log('✅ LLM Gateway initialized successfully');
    } catch (error: any) {
      this.initializationError = error.message;
      console.error('❌ LLM Gateway initialization failed:', error.message);
      console.log('🔧 Using fallback configuration...');
      this.createFallbackConfiguration();
    }
  }

  public static getInstance(): LlmGateway {
    if (!LlmGateway.instance) {
      LlmGateway.instance = new LlmGateway();
    }
    return LlmGateway.instance;
  }

  private loadConfiguration() {
    const configPath = path.resolve(__dirname, '../config/llm-providers.json');
    
    try {
      if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration file not found at: ${configPath}`);
      }
      
      const rawConfig = fs.readFileSync(configPath, 'utf-8');
      this.config = JSON.parse(rawConfig);
      console.log('📋 Loaded LLM configuration from file');
      
    } catch (error: any) {
      console.warn('⚠️ Could not load config file, using fallback configuration');
      throw new Error(`Failed to load LLM configuration: ${error.message}`);
    }
  }

  private createFallbackConfiguration() {
    // Create a simple fallback configuration
    this.config = {
      providers: {
        google: {
          apiKey: process.env.GOOGLE_API_KEY || ''
        },
        openai: {
          apiKey: process.env.OPENAI_API_KEY || ''
        }
      },
      agentModelMapping: {
        wellnessAgent: {
          provider: 'google',
          model: 'gemini-pro',
          temperature: 0.7
        },
        nutritionAgent: {
          provider: 'google',
          model: 'gemini-pro',
          temperature: 0.7
        }
      }
    };

    try {
      this.resolveEnvVariables();
      this.initializeModels();
      this.isInitialized = true;
      console.log('✅ Fallback LLM Gateway configuration loaded');
    } catch (error: any) {
      console.error('❌ Even fallback configuration failed:', error.message);
      this.isInitialized = false;
    }
  }

  private resolveEnvVariables() {
    for (const providerKey in this.config.providers) {
      const provider = this.config.providers[providerKey];
      
      if (provider.apiKey.startsWith('env:')) {
        const envVar = provider.apiKey.split(':')[1];
        provider.apiKey = process.env[envVar] || '';
        
        if (!provider.apiKey) {
          console.warn(`⚠️ Environment variable ${envVar} not found for LLM provider ${providerKey}`);
        }
      }
    }
  }

  private initializeModels() {
    console.log('🔧 Initializing LLM models for all agents...');
    
    for (const agentName in this.config.agentModelMapping) {
      const modelConfig = this.config.agentModelMapping[agentName];
      const providerConfig = this.config.providers[modelConfig.provider];
      
      if (!providerConfig || !providerConfig.apiKey) {
        console.warn(`⚠️ API key for provider ${modelConfig.provider} not found. Skipping model initialization for agent ${agentName}.`);
        continue;
      }

      try {
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
            
          default:
            console.warn(`❌ Unsupported LLM provider: ${modelConfig.provider}`);
            continue;
        }
        
        this.models.set(agentName, model);
        console.log(`✅ Initialized model for agent: ${agentName} (${modelConfig.provider}/${modelConfig.model})`);
        
      } catch (error: any) {
        console.error(`❌ Failed to initialize model for agent ${agentName}:`, error.message);
      }
    }
    
    if (this.models.size === 0) {
      throw new Error('No LLM models were successfully initialized. Check your API keys.');
    }
  }

  public getModelForAgent(agentName: string): BaseChatModel {
    if (!this.isInitialized) {
      throw new Error(`LLM Gateway not properly initialized. Error: ${this.initializationError}`);
    }
    
    const model = this.models.get(agentName);
    if (!model) {
      const availableAgents = Array.from(this.models.keys()).join(', ');
      throw new Error(
        `Model for agent '${agentName}' is not initialized. ` +
        `Available agents: ${availableAgents}. ` +
        `Check your configuration and API keys.`
      );
    }
    
    return model;
  }

  public getStatus() {
    return {
      isInitialized: this.isInitialized,
      initializationError: this.initializationError,
      availableAgents: Array.from(this.models.keys()),
      totalModels: this.models.size
    };
  }
}

export const llmGateway = LlmGateway.getInstance();