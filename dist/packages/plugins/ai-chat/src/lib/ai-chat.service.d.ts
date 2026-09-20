import type { Response } from 'express';
import type { UIMessage } from 'ai';
import { IAiChatConfig, IAiChatModelCatalogue } from '@gauzy/contracts';
import { AiProviderCredentialService } from './credentials/ai-provider-credential.service';
import { AiChatConversationService } from './conversations/ai-chat-conversation.service';
/**
 * Largest dictation upload accepted, matching what the upstream speech APIs take anyway.
 *
 * Audio is user-supplied and otherwise bounded only by how long someone holds the button.
 * Exported so the controller can declare the SAME cap as a multer `limits` on the route — one
 * constant, two enforcement points that cannot drift.
 */
export declare const MAX_AUDIO_BYTES: number;
export interface IStreamChatArgs {
    /** UI messages from the `useChat` client. */
    messages: UIMessage[];
    /** Optional provider override (defaults to tenant/env default). */
    providerId?: string;
    /** Optional model override. */
    modelId?: string;
    /**
     * Conversation to append this turn to (client-generated UUID).
     * The full message list is persisted for the requesting user after
     * the stream finishes; omitted → the turn is not persisted.
     */
    conversationId?: string;
    /** The requesting user's `Authorization` header — forwarded to all API tools. */
    authorizationHeader: string;
    /** Preferred response language (ISO code). */
    languageCode?: string;
    /** Express response to stream the UI message stream into. */
    response: Response;
}
/**
 * AiChatService
 *
 * The chat engine: resolves the tenant's AI provider + model, assembles the
 * tool set (curated Gauzy REST tools with the user's own JWT, client/canvas
 * tools, optional MCP tools) and streams a Vercel AI SDK UI message stream
 * back to the browser.
 */
export declare class AiChatService {
    private readonly credentialService;
    private readonly conversationService;
    private readonly logger;
    constructor(credentialService: AiProviderCredentialService, conversationService: AiChatConversationService);
    /**
     * Handle one chat turn: run the agent loop and pipe the UI message
     * stream into the HTTP response.
     */
    streamChat(args: IStreamChatArgs): Promise<void>;
    /**
     * Runtime config for the current tenant — which providers are usable,
     * which is the default, which models exist. Never exposes secrets.
     */
    getConfig(): Promise<IAiChatConfig>;
    private resolveModel;
    /**
     * Tenant BYOK credential, then the operator's own environment key, then the shared platform key.
     *
     * The order is the whole design. The platform key is a free tier the product supplies so the AI
     * agent works with no setup, and it is the ONLY source restricted to free models — so it must be
     * reached only when nothing else applies. An operator who deliberately sets the provider's own
     * env var keeps unrestricted access, and a tenant that brings its own key always wins outright.
     */
    private resolveCredentials;
    /**
     * The provider's model catalogue for the settings picker.
     *
     * Deliberately NOT folded into getConfig(): that endpoint is fetched at app bootstrap for every
     * user with chat access and already loops every registered provider, so keyed upstream calls there
     * would put the app shell behind six third-party APIs on every login. This is called lazily, for
     * one provider, when its config view opens.
     *
     * DISPLAY ONLY, and it fails OPEN: any error degrades to the provider's curated list. A settings
     * page that cannot show a dropdown because a vendor is having a bad day is a worse outcome than a
     * slightly short list.
     */
    listProviderModels(providerId: string): Promise<IAiChatModelCatalogue>;
    /**
     * Transcribe recorded speech for the chat's dictation control.
     *
     * Order of attempts:
     *
     * 1. the tenant's VOICE DEFAULT (the credential flagged `isVoiceDefault`), when that provider can
     *    transcribe and its credentials resolve;
     * 2. then every other registered provider that CAN transcribe, in display order, using the first
     *    one the tenant actually has a credential for.
     *
     * Dictation is a property of the workspace, not of the chat model: a tenant whose chat runs on
     * Anthropic (no speech model) should still be able to dictate if they also have an OpenAI key or a
     * local whisper server, without being told to go and change their chat provider. The pinned voice
     * default is what lets a tenant say "always this one" (mirrors the operator-pinned transcription
     * provider with capable-fallback model of ever-works).
     *
     * Failures throw a 503 whose body is an OBJECT — `{ message, code, settingsPath }` — so the chat
     * client can render an actionable, translated message with a link to the AI Providers page, while
     * old clients still find a readable `message`.
     *
     * @param audio Bytes as recorded by the browser.
     * @param mimeType Container the browser produced.
     * @param options Optional language hint forwarded to the provider.
     * @returns The transcript, which may legitimately be empty for silence.
     */
    transcribe(audio: Buffer, mimeType: string, options?: {
        language?: string;
    }): Promise<string>;
    /**
     * Build the 503 thrown by {@link transcribe}: a structured body the client can branch on, with a
     * human-readable `message` for clients that only read that.
     */
    private speechUnavailable;
    /**
     * The tenant's pinned voice (dictation) provider, if it is among `capableIds`.
     *
     * @param capableIds Provider ids eligible right now (speech-capable, and — for `/config` —
     *                   with resolvable credentials).
     */
    private resolveVoiceDefault;
    /**
     * Models permitted for this credential — the full catalogue, or the free subset on the platform
     * key.
     *
     * Returns `null` when there is no restriction, so callers can distinguish "unrestricted" from
     * "restricted to nothing" (the latter disables the tier rather than silently allowing anything).
     */
    private resolvePlatformModels;
    private getTenantCredential;
    /** Tenant default provider (BYOK `isDefault`) → env default → first configured. */
    private resolveDefaultProvider;
}
