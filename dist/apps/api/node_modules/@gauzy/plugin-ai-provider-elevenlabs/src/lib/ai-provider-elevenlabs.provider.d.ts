import { IAiChatProviderDefinition } from '@gauzy/plugin-ai-chat';
/**
 * ElevenLabs provider definition for the AI chat engine — SPEECH-TO-TEXT ONLY.
 *
 * ElevenLabs has no chat models here, so `chatCapable` is `false` and `createModel` throws (the
 * placeholder pattern): the provider shows in the catalogue as a voice provider, can be the
 * tenant's voice default, and is never selectable for chat.
 */
export declare const elevenLabsProviderDefinition: IAiChatProviderDefinition;
