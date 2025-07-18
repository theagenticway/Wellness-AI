import os
from fastapi import FastAPI
from langgraph.graph import StateGraph, END
from langchain_core.pydantic_v1 import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv
from typing import TypedDict, Annotated, List
import operator

# Construct the path to the .env file relative to this script's location
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=dotenv_path)

# --- State Definition ---
class UserProfile(TypedDict):
    firstName: str
    lastName: str
    email: str
    type: str

class WellnessGraphState(TypedDict):
    user_profile: UserProfile
    professional_override: str
    nutrition_plan: Annotated[dict, operator.add]
    cbt_task: Annotated[dict, operator.add]
    daily_plan: dict
    next_agent: str
    currentPhase: str

# --- Prompts ---
wellness_agent_prompt = PromptTemplate.from_template(
    """You are the lead Wellness Agent... (prompt content)"""
)
nutrition_agent_prompt = PromptTemplate.from_template(
    """You are the GMRP Nutrition Agent... (prompt content)"""
)
cbt_agent_prompt = PromptTemplate.from_template(
    """You are the CBT Agent... (prompt content)"""
)

# --- Models ---
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")

llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.7, google_api_key=api_key)
json_parser = JsonOutputParser()

# --- Nodes ---
def wellness_agent_node(state: WellnessGraphState):
    print("--- WELLNESS AGENT NODE ---")
    # Logic to decide next step
    user_profile = state["user_profile"]
    print(f"User profile: {user_profile}")

    # Placeholder plan
    plan = {
        "exercise": "30 minutes of cardio",
        "nutrition": "Balanced meal with lean protein and vegetables",
        "mindfulness": "5 minutes of meditation"
    }

    return {"daily_plan": plan, "next_agent": "nutrition"}

def nutrition_agent_node(state: WellnessGraphState):
    print("--- NUTRITION AGENT NODE ---")
    chain = nutrition_agent_prompt | llm | json_parser
    plan = chain.invoke({"directive": "Generate a standard Phase 1 meal plan.", "latestData": "N/A", "professionalOverride": "None"})
    return {"nutrition_plan": plan, "next_agent": "cbt"}

def cbt_agent_node(state: WellnessGraphState):
    print("--- CBT AGENT NODE ---")
    chain = cbt_agent_prompt | llm | json_parser
    task = chain.invoke({"directive": "Provide a session on managing cravings.", "moodData": "Stressed"})
    return {"cbt_task": task, "next_agent": "finalize"}

def finalize_plan_node(state: WellnessGraphState):
    print("--- FINALIZE PLAN NODE ---")
    daily_plan = {"nutrition": state["nutrition_plan"], "mindfulness": state["cbt_task"]}
    return {"daily_plan": daily_plan, "next_agent": "END"}

# --- Edges ---
def route_next_agent(state: WellnessGraphState):
    return state.get("next_agent", "END")

# --- Graph ---
workflow = StateGraph(WellnessGraphState)
workflow.add_node("wellnessAgent", wellness_agent_node)
workflow.add_node("nutritionAgent", nutrition_agent_node)
workflow.add_node("cbtAgent", cbt_agent_node)
workflow.add_node("finalizePlan", finalize_plan_node)

workflow.set_entry_point("wellnessAgent")
workflow.add_conditional_edges(
    "wellnessAgent",
    route_next_agent,
    {"nutrition": "nutritionAgent", "cbt": "cbtAgent", "finalize": "finalizePlan", "END": END}
)
workflow.add_conditional_edges(
    "nutritionAgent",
    route_next_agent,
    {"cbt": "cbtAgent", "finalize": "finalizePlan", "END": END}
)
workflow.add_conditional_edges(
    "cbtAgent",
    route_next_agent,
    {"finalize": "finalizePlan", "END": END}
)
workflow.add_edge("finalizePlan", END)

app_graph = workflow.compile()

# --- API ---
app = FastAPI()

class RequestBody(BaseModel):
    user_profile: UserProfile
    professional_override: str = ""
    currentPhase: str = "phase1"

@app.post("/generate-plan")
async def generate_plan(body: RequestBody):
    initial_state = {
        "user_profile": body.user_profile,
        "professional_override": body.professional_override,
        "nutrition_plan": {},
        "cbt_task": {},
    }
    result = app_graph.invoke(initial_state)
    return result
