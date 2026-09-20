import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithApprovalResponses, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { useInjector } from '@gauzy/ui-react';
import { Store } from '@gauzy/ui-core/core';
import { environment } from '@gauzy/ui-config';
import { playgroundTheme as t } from '../../playground-theme';
import { chatMarkdownCss } from '../../chat-markdown-css';
import { PlaygroundHeader } from './PlaygroundHeader';
import { PlaygroundSettings } from './PlaygroundSettings';
import { PlaygroundChatPanel } from './PlaygroundChatPanel';
/**
 * Playground — full AI chat playground wired to the Gauzy backend.
 *
 * Renders a settings panel (model selector, system prompt, parameter
 * sliders) on the left and a streaming chat panel on the right.
 *
 * Built on the Vercel AI SDK (`useChat` from @ai-sdk/react v4 / AI SDK 7):
 * - loads available providers/models from `GET /api/ai-chat/config`
 *   (only configured providers are offered; defaults are preselected);
 * - streams from `POST /api/ai-chat` with the user's own JWT, passing
 *   the selected `providerId` / `modelId` in the request body;
 * - the system prompt editor and parameter sliders are shown but
 *   disabled — the backend builds its own system prompt and does not
 *   accept temperature / topP / maxTokens yet.
 */
export function Playground({ title, settingsExtra, chatHeader, inputPlaceholder, style }) {
    const injector = useInjector();
    const store = useMemo(() => injector.get(Store), [injector]);
    // ── AI chat configuration (providers / models) ──────────────
    const [config, setConfig] = useState(null);
    const [configError, setConfigError] = useState(null);
    const [configReloadKey, setConfigReloadKey] = useState(0);
    // ── Settings state ──────────────────────────────────────────
    const [providerId, setProviderId] = useState('');
    const [modelId, setModelId] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('');
    const [temperature, setTemperature] = useState(0.7);
    const [maxTokens, setMaxTokens] = useState(4096);
    const [topP, setTopP] = useState(1);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setConfigError(null);
                const response = await fetch(`${environment.API_BASE_URL}/api/ai-chat/config`, {
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                        ...(store.tenantId ? { 'Tenant-Id': store.tenantId } : {}),
                        ...(store.organizationId ? { 'Organization-Id': store.organizationId } : {})
                    }
                });
                if (!response.ok) {
                    throw new Error(`Failed to load AI chat configuration (HTTP ${response.status})`);
                }
                const loaded = await response.json();
                if (cancelled)
                    return;
                setConfig(loaded);
                // Preselect the default provider/model (configured providers only).
                const configured = loaded.providers.filter((p) => p.configured);
                const defaultProvider = configured.find((p) => p.id === loaded.defaultProvider) ?? configured[0];
                const defaultModel = defaultProvider?.models.find((m) => m.id === loaded.defaultModel) ?? defaultProvider?.models[0];
                setProviderId(defaultProvider?.id ?? '');
                setModelId(defaultModel?.id ?? '');
            }
            catch (error) {
                if (!cancelled) {
                    setConfigError(error instanceof Error ? error.message : String(error));
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [store, configReloadKey]);
    /** Flat model options from configured providers, grouped by provider label. */
    const models = useMemo(() => {
        if (!config)
            return [];
        return config.providers
            .filter((provider) => provider.configured)
            .flatMap((provider) => provider.models.map((model) => ({
            id: model.id,
            name: model.label,
            provider: provider.label,
            providerId: provider.id
        })));
    }, [config]);
    const handleModelChange = useCallback((newModelId, newProviderId) => {
        setModelId(newModelId);
        const resolved = newProviderId ?? models.find((m) => m.id === newModelId)?.providerId;
        if (resolved)
            setProviderId(resolved);
    }, [models]);
    // ── Chat transport ──────────────────────────────────────────
    // The latest selection is read through a ref so the transport does
    // not have to be recreated (and the chat reset) on every change.
    const selectionRef = useRef({ providerId, modelId });
    selectionRef.current = { providerId, modelId };
    const transport = useMemo(() => new DefaultChatTransport({
        api: `${environment.API_BASE_URL}/api/ai-chat`,
        headers: () => ({
            Authorization: `Bearer ${store.token}`,
            ...(store.tenantId ? { 'Tenant-Id': store.tenantId } : {}),
            ...(store.organizationId ? { 'Organization-Id': store.organizationId } : {})
        }),
        // Extra JSON body fields merged into every POST /api/ai-chat request.
        body: () => ({
            ...(selectionRef.current.providerId ? { providerId: selectionRef.current.providerId } : {}),
            ...(selectionRef.current.modelId ? { modelId: selectionRef.current.modelId } : {})
        })
    }), [store]);
    const { messages, sendMessage, status, stop, error, regenerate, setMessages, addToolApprovalResponse } = useChat({
        transport,
        // Resume the agent loop once all tool results / approvals are in.
        sendAutomaticallyWhen: (options) => lastAssistantMessageIsCompleteWithToolCalls(options) ||
            lastAssistantMessageIsCompleteWithApprovalResponses(options)
    });
    const handleSend = useCallback((text) => {
        void sendMessage({ text });
    }, [sendMessage]);
    const handleApprovalResponse = useCallback((id, approved) => {
        void addToolApprovalResponse({ id, approved });
    }, [addToolApprovalResponse]);
    const handleNewChat = useCallback(() => {
        void stop();
        setMessages([]);
    }, [stop, setMessages]);
    const toggleSidebar = useCallback(() => setSidebarExpanded((v) => !v), []);
    const retryConfig = useCallback(() => setConfigReloadKey((k) => k + 1), []);
    // ── Styles ──────────────────────────────────────────────────
    const rootStyle = {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: t.font,
        background: t.bg,
        color: t.textPrimary,
        borderRadius: t.radius,
        border: `1px solid ${t.border}`,
        boxShadow: t.shadow,
        overflow: 'hidden'
    };
    const bodyStyle = {
        display: 'flex',
        flex: 1,
        minHeight: 0
    };
    const stateStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '2rem',
        color: t.textSecondary,
        textAlign: 'center'
    };
    /** Centered informational state (loading / error / not configured). */
    const renderState = (heading, detail, action) => (_jsxs("div", { style: stateStyle, children: [_jsx("span", { style: { fontSize: t.fontSizeLg, fontWeight: 600, color: t.textPrimary }, children: heading }), _jsx("span", { style: { fontSize: t.fontSizeSm, maxWidth: '28rem', lineHeight: 1.5 }, children: detail }), action] }));
    let body;
    if (configError) {
        body = renderState('Could not load AI chat configuration', configError, _jsx("button", { type: "button", onClick: retryConfig, style: {
                marginTop: '0.5rem',
                padding: '0.375rem 1rem',
                fontSize: t.fontSizeSm,
                fontFamily: t.font,
                color: t.accent,
                background: t.accentSubtle,
                border: `1px solid ${t.accent}33`,
                borderRadius: t.radius,
                cursor: 'pointer'
            }, children: "Retry" }));
    }
    else if (!config) {
        body = renderState('Loading…', 'Fetching the available AI providers and models.');
    }
    else if (!config.enabled) {
        body = renderState('AI chat is not configured', 'No AI provider is configured for your tenant yet. Ask your administrator to add a provider API key, then reload this page.');
    }
    else {
        body = (_jsxs(_Fragment, { children: [_jsx(PlaygroundSettings, { models: models, selectedModelId: modelId, selectedProviderId: providerId, onModelChange: handleModelChange, systemPrompt: systemPrompt, onSystemPromptChange: setSystemPrompt, systemPromptDisabled: true, temperature: temperature, onTemperatureChange: setTemperature, maxTokens: maxTokens, onMaxTokensChange: setMaxTokens, topP: topP, onTopPChange: setTopP, parametersDisabled: true, collapsed: !sidebarExpanded, children: settingsExtra }), _jsx(PlaygroundChatPanel, { messages: messages, onSend: handleSend, status: status, error: error ? error.message || 'Something went wrong.' : undefined, onRetry: () => void regenerate(), header: chatHeader, inputPlaceholder: inputPlaceholder, onApprovalResponse: handleApprovalResponse })] }));
    }
    return (_jsxs("div", { style: { ...rootStyle, ...style }, children: [_jsx("style", { children: `
				@keyframes pgPulse {
					0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
					40% { transform: scale(1); opacity: 1; }
				}

				${chatMarkdownCss}
			` }), _jsx(PlaygroundHeader, { title: title, onNewChat: handleNewChat, sidebarExpanded: sidebarExpanded, onToggleSidebar: toggleSidebar }), _jsx("div", { style: bodyStyle, children: body })] }));
}
//# sourceMappingURL=Playground.js.map