import { IAiChatProviderDefinition } from '@gauzy/plugin-ai-chat';
/**
 * Deepgram provider definition for the AI chat engine — SPEECH-TO-TEXT ONLY.
 *
 * Deepgram has no chat models, so `chatCapable` is `false` and `createModel` throws (the same
 * placeholder pattern as the Gauzy AI provider): the provider shows in the catalogue as a voice
 * provider, can be the tenant's voice default, and is never selectable for chat.
 */
export declare const deepgramProviderDefinition: IAiChatProviderDefinition;
