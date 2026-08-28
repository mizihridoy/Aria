import type { AriaRequestContext } from '../types.js';
import { createMemoryTools } from './memory.js';
import { createKnowledgeTools } from './knowledge.js';
import { clashLookupTool } from './clash.js';

export class ToolRegistry {
  /**
   * Generates the active tool dictionary available to the agent for a given request.
   */
  public static getToolsForContext(context: AriaRequestContext) {
    const memoryTools = createMemoryTools(context);
    const knowledgeTools = createKnowledgeTools(context);

    return {
      ...memoryTools,
      ...knowledgeTools,
      clash_meta_lookup: clashLookupTool,
    };
  }
}
