import { StateGraph, END } from '@langchain/langgraph';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { llmGateway } from '../services/enhancedllmGateway';
import { wellnessAgentPrompt, nutritionAgentPrompt, cbtAgentPrompt } from './prompts';
import { WellnessGraphState } from './wellnessGraph.state';

// Helper function to create a node that invokes an agent
const createAgentNode = (agentName: 'wellnessAgent' | 'nutritionAgent' | 'cbtAgent', prompt: any) => {
  return async (state: WellnessGraphState): Promise<Partial<WellnessGraphState>> => {
    console.log(`--- EXECUTING ${agentName.toUpperCase()} NODE ---`);
    try {
      const model = llmGateway.getModelForAgent(agentName);
      const parser = new JsonOutputParser<any>();
      const chain = prompt.pipe(model).pipe(parser);

      const response = await chain.invoke({
        userProfile: JSON.stringify(state.userProfile || {}),
        gmrpPhase: 'Phase 1',
        latestData: 'N/A',
        professionalOverride: state.professionalOverride || 'None',
        directive: 'Generate a plan.',
        moodData: 'N/A',
      });

      console.log(`${agentName} Output:`, response);

      if (agentName === 'wellnessAgent') {
        return { nextAgent: 'nutrition' };
      } else if (agentName === 'nutritionAgent') {
        return { nutritionPlan: response, nextAgent: 'cbt' };
      } else if (agentName === 'cbtAgent') {
        return { cbtTask: response, nextAgent: 'finalize' };
      }
      return {};
    } catch (e) {
      console.error(`Error in ${agentName} node:`, e);
      return { nextAgent: 'END' };
    }
  };
};

// --- DEFINE THE NODES ---
const wellnessAgentNode = createAgentNode('wellnessAgent', wellnessAgentPrompt);
const nutritionAgentNode = createAgentNode('nutritionAgent', nutritionAgentPrompt);
const cbtAgentNode = createAgentNode('cbtAgent', cbtAgentPrompt);

async function finalizePlanNode(state: WellnessGraphState): Promise<Partial<WellnessGraphState>> {
  console.log('--- FINALIZE PLAN NODE ---');
  const dailyPlan = {
    nutrition: state.nutritionPlan,
    mindfulness: state.cbtTask,
  };
  return { dailyPlan, nextAgent: 'END' };
}

// --- DEFINE THE EDGES ---
function routeNextAgent(state: WellnessGraphState): 'nutrition' | 'cbt' | 'finalize' | typeof END {
  const next = state.nextAgent;
  if (!next || next === 'END') {
    return END;
  }
  return next;
}

// --- BUILD THE GRAPH ---
const workflow = new StateGraph<WellnessGraphState>({ channels: {} });

workflow.addNode('wellnessAgent', wellnessAgentNode);
workflow.addNode('nutritionAgent', nutritionAgentNode);
workflow.addNode('cbtAgent', cbtAgentNode);
workflow.addNode('finalizePlan', finalizePlanNode);

workflow.setEntryPoint('wellnessAgent');

workflow.addConditionalEdges('wellnessAgent', routeNextAgent, {
  nutrition: 'nutritionAgent',
  cbt: 'cbtAgent',
  finalize: 'finalizePlan',
});
workflow.addConditionalEdges('nutritionAgent', routeNextAgent, {
  cbt: 'cbtAgent',
  finalize: 'finalizePlan',
});
workflow.addConditionalEdges('cbtAgent', routeNextAgent, {
  finalize: 'finalizePlan',
});

workflow.addEdge('finalizePlan', END);

export const wellnessGraph = workflow.compile();
