import type { Injector } from '@angular/core';
/** Tool names executed in the browser (declared server-side without `execute`). */
export declare const CLIENT_TOOL_NAMES: readonly ["list_pages", "open_page", "read_page", "fill_form", "submit_form"];
export type ClientToolName = (typeof CLIENT_TOOL_NAMES)[number];
export declare function isClientTool(toolName: string): toolName is ClientToolName;
/**
 * Execute a client-side ("canvas") tool call in the browser.
 *
 * These tools drive the Angular app next to the chat: opening pages via
 * the router and reading / filling / submitting the forms of whatever
 * page is on screen. The heavy lifting lives in `AgentPageBridgeService`
 * and `AgentFormBridgeService` (@gauzy/ui-core), reached through the
 * Angular injector provided by the React bridge.
 *
 * Returns the tool output to stream back to the model. Throws are caught
 * by the caller and reported as tool errors.
 */
export declare function executeClientTool(injector: Injector, toolName: string, input: any): Promise<unknown>;
