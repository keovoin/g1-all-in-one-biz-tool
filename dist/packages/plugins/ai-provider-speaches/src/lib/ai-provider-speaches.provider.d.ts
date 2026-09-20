import { IAiChatProviderDefinition } from '@gauzy/plugin-ai-chat';
/**
 * Speaches (faster-whisper-server) provider definition — LOCAL SPEECH-TO-TEXT ONLY.
 *
 * Runs on the tenant's / operator's own infrastructure (Docker), needs no API key, and is
 * `chatCapable: false`: it appears in the catalogue as a local voice provider and can be the
 * tenant's voice default, but is never selectable for chat.
 */
export declare const speachesProviderDefinition: IAiChatProviderDefinition;
