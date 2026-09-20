import type { Request, Response } from 'express';
import type { UIMessage } from 'ai';
import { IAiChatConfig, IAiChatModelCatalogue, UploadedFile as IUploadedFile } from '@gauzy/contracts';
import { AiChatService } from './ai-chat.service';
import { AiChatAttachmentService, IAiChatAttachmentResult } from './attachments/ai-chat-attachment.service';
/** Request body sent by the `useChat` client (Vercel AI SDK UI). */
export interface IAiChatRequestBody {
    messages: UIMessage[];
    /** Optional provider/model override (playground). */
    providerId?: string;
    modelId?: string;
    /** Conversation to persist this turn to (client-generated UUID). */
    conversationId?: string;
}
export declare class AiChatController {
    private readonly aiChatService;
    private readonly attachmentService;
    constructor(aiChatService: AiChatService, attachmentService: AiChatAttachmentService);
    /**
     * Stream one chat turn as a Vercel AI SDK UI message stream (SSE).
     * The agent's API tools run with the caller's own JWT — the agent can
     * only see and do what the calling user is permitted to.
     */
    chat(body: IAiChatRequestBody, request: Request, response: Response, languageCode?: string): Promise<void>;
    /**
     * Runtime configuration for the current tenant: registered providers,
     * their models, configuration status and defaults. No secrets.
     *
     * Accessible with EITHER `AI_CHAT_ACCESS` (the chat surfaces need it) OR
     * `AI_CHAT_SETTINGS` (the BYOK "AI Providers" settings page needs it) —
     * overriding the controller-wide `AI_CHAT_ACCESS`. Without this, a tenant
     * admin granted only `AI_CHAT_SETTINGS` could open the settings page but got
     * a 403 here, blanking the whole page. The payload exposes no secrets.
     */
    config(): Promise<IAiChatConfig>;
    /**
     * Speech to text for the chat's dictation control.
     *
     * `AI_CHAT_ACCESS` only: dictation is a way of typing a message, so anyone who may use the chat
     * may dictate into it. Requiring AI_CHAT_SETTINGS here would gate an input method behind an
     * administrative permission.
     *
     * The size cap is the real guard — audio is user-supplied and would otherwise be bounded only by
     * how long someone holds the button. 25 MB matches what the upstream speech APIs accept, so a
     * larger upload could never have succeeded anyway.
     */
    transcribe(file: {
        buffer: Buffer;
        mimetype: string;
    }, body?: {
        language?: string;
    }): Promise<{
        text: string;
    }>;
    /**
     * Attach a file to a chat conversation.
     *
     * The bytes are streamed straight into the configured `FileStorage` provider (never buffered
     * in memory — unlike dictation, which forwards the audio upstream and so must hold it), and
     * the save is announced as `AiChatAttachmentSavedEvent`. `@gauzy/plugin-docs` subscribes to
     * that event and turns the attachment into a `Document { source: CHAT }`, after which the
     * chat's own `docs_search` / `docs_read` tools can read it. Installs without that plugin
     * simply have no subscriber.
     *
     * `AI_CHAT_ACCESS` only, for the same reason as dictation: attaching a file is part of
     * composing a message, not an administrative act.
     */
    attach(file: IUploadedFile, body: {
        conversationId?: string;
    }): Promise<IAiChatAttachmentResult>;
    /**
     * One provider's model catalogue, for the settings model picker.
     *
     * Separate from `/config` on purpose. `/config` is fetched at app bootstrap for every user with
     * chat access and loops every registered provider; fetching six upstream catalogues there would
     * put the app shell behind third-party APIs on every login. This is called lazily, for the one
     * provider whose config view was opened.
     *
     * Same two-permission rule as `/config`: an admin holding only AI_CHAT_SETTINGS must be able to
     * use the settings page. Exposes no secrets — model ids and labels only.
     */
    providerModels(providerId: string): Promise<IAiChatModelCatalogue>;
}
