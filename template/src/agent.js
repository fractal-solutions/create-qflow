import { AsyncFlow, AsyncNode } from "@fractal-solutions/qflow";
import {
  AgentNode,
  DuckDuckGoSearchNode,
  SystemNotificationNode,
  MemoryNode,
  UserInputNode,
  ScrapeURLNode,
} from "@fractal-solutions/qflow/nodes";
import { GenericLLMNode } from "./nodes/GenericLLMNode.js";

export function agentWorkflow() {
  // --- Configuration ---
  const AGENT_LLM_API_KEY = process.env.AGENT_LLM_API_KEY || '';
  const AGENT_LLM_MODEL = process.env.AGENT_LLM_MODEL || "openai/gpt-4o";
  const AGENT_LLM_BASE_URL = process.env.AGENT_LLM_BASE_URL || "https://openrouter.ai/api/v1";
  const AGENT_LLM_SITE_TITLE = process.env.AGENT_LLM_SITE_TITLE || "QFlow Agent";

  if (!AGENT_LLM_API_KEY) {
    console.warn("WARNING: AGENT_LLM_API_KEY is not set. Please set it to run the agent workflow.");
    console.warn("For OpenRouter, you can get a token from https://openrouter.ai/settings/tokens");
    // Return a dummy flow or throw an error if the key is essential
    const dummyFlow = new AsyncFlow();
    dummyFlow.start(new AsyncNode()); // Start with a dummy node
    return dummyFlow;
  }

  console.log("--- Initializing Generic Agent Workflow ---");

  // 1. Node to get the goal from the user
  const getGoalNode = new UserInputNode();
  getGoalNode.setParams({ prompt: "Please enter the agent's goal: " });

  // 2. Instantiate the LLM for the agent's reasoning
  const agentLLM = new GenericLLMNode();
  agentLLM.setParams({
    model: AGENT_LLM_MODEL,
    apiKey: AGENT_LLM_API_KEY,
    baseUrl: AGENT_LLM_BASE_URL,
  });

  // 3. Instantiate the tools the agent can use
  const duckduckgoSearch = new DuckDuckGoSearchNode();
  const systemNotification = new SystemNotificationNode();
  const memoryNode = new MemoryNode();
  const webScraper = new ScrapeURLNode();

  // Map tool names to their instances
  const availableTools = {
    duckduckgo_search: duckduckgoSearch,
    system_notification: systemNotification,
    memory_node: memoryNode,
    web_scraper: webScraper,
    // Add other tools as needed, e.g., read_file, write_file, http_request
  };

  // 4. Instantiate the AgentNode
  // For summarization, we can use the same LLM or a different one if needed.
  const summarizeLLM = new GenericLLMNode();
  summarizeLLM.setParams({
    model: AGENT_LLM_MODEL, // Or a smaller model like 'openai/gpt-3.5-turbo'
    apiKey: AGENT_LLM_API_KEY,
    baseUrl: AGENT_LLM_BASE_URL,
  });

  const agent = new AgentNode(agentLLM, availableTools, summarizeLLM);
  // The goal will be set dynamically from the UserInputNode's output
  agent.prepAsync = async (shared) => {
    agent.setParams({ goal: shared.userInput });
  };

  // 5. Chain the nodes: Get Goal -> Agent
  const flow = new AsyncFlow();
  flow.start(getGoalNode)
    .next(agent);

  return flow;
}
