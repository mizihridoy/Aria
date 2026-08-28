import type { CoreTool } from 'ai';
import type { AriaRequestContext } from '../types.js';

export interface ToolDefinition {
  name: string;
  description: string;
  createTool: (context: AriaRequestContext) => CoreTool;
}
