import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from 'react';
import { chatTheme } from '../chat-theme';
/** How many results the picker shows at a time. */
const PAGE_SIZE = 20;
/** Debounce on the search box, so typing does not fire a request per keystroke. */
const SEARCH_DEBOUNCE_MS = 250;
/**
 * DocsAttachPicker
 *
 * "Attach from Documents": a compact search-and-pick list over the Documents hub, so a user can
 * point the assistant at a document that is ALREADY in the workspace instead of re-uploading it.
 *
 * Reads `GET /api/plugins/docs/documents`, the hub's own list endpoint, with the caller's own
 * JWT — so the picker can only ever show documents that user is allowed to read, and there is no
 * second authorization path to keep in sync. Folders are excluded: a folder has nothing the
 * assistant can read.
 *
 * A picked document is attached BY ID, which is what makes it useful: the chat's `docs_read`
 * tool takes a document id, so the assistant can open exactly what the user pointed at rather
 * than searching for something with a similar name.
 */
export function DocsAttachPicker({ apiBaseUrl, headers, scope, onPick, onClose, translate }) {
    const t = translate ?? ((_key, fallback) => fallback);
    const [query, setQuery] = useState('');
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [failure, setFailure] = useState(null);
    const searchRef = useRef(null);
    // Bumped on every request so a slow earlier response can never overwrite a newer one.
    const requestSeq = useRef(0);
    useEffect(() => {
        searchRef.current?.focus();
    }, []);
    const load = useCallback((search) => {
        const seq = ++requestSeq.current;
        setIsLoading(true);
        setFailure(null);
        const params = new URLSearchParams({ take: String(PAGE_SIZE), sort: 'updatedAt', sortOrder: 'DESC' });
        // The endpoint's DTO requires the scope inside a `where` object (bracket syntax — the
        // API's extended query parser reassembles it into the nested shape the validator wants).
        const { organizationId, tenantId } = scope();
        if (organizationId)
            params.set('where[organizationId]', organizationId);
        if (tenantId)
            params.set('where[tenantId]', tenantId);
        // Folders hold no readable content — offering one would attach nothing.
        params.set('kind', 'FILE,PAGE');
        if (search.trim()) {
            params.set('q', search.trim());
        }
        fetch(`${apiBaseUrl}/api/plugins/docs/documents?${params.toString()}`, { headers: headers() })
            .then((response) => {
            if (response.ok)
                return response.json();
            // The status rides the rejection as a typed field — classifying on a
            // stringified message would couple the catch to this throw-site's wording.
            return Promise.reject(Object.assign(new Error(`docs list failed (${response.status})`), { status: response.status }));
        })
            .then((page) => {
            if (seq !== requestSeq.current)
                return;
            setDocuments(Array.isArray(page?.items) ? page.items : []);
        })
            .catch((error) => {
            if (seq !== requestSeq.current)
                return;
            setDocuments([]);
            // Only "the feature is not here for you" statuses may claim unavailability:
            // 404 = docs plugin not installed, 403 = no DOCS_READ / feature disabled.
            // Anything else is a FAILURE and must say so — the first version showed
            // "Documents are not available" for its own 400s, hiding a plain bug behind
            // a message that blamed the workspace.
            const status = error?.status;
            setFailure(status === 403 || status === 404 ? 'unavailable' : 'error');
        })
            .finally(() => {
            if (seq === requestSeq.current)
                setIsLoading(false);
        });
    }, [apiBaseUrl, headers, scope]);
    useEffect(() => {
        const timer = setTimeout(() => load(query), SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [query, load]);
    const overlayStyle = {
        // Fills the chat BODY (the panel mounts this inside its position:relative body container),
        // so the panel's own header row stays visible and operable above it.
        position: 'absolute',
        inset: 0,
        zIndex: 6,
        display: 'flex',
        flexDirection: 'column',
        // The chat theme has no opaque surface token (surfaces are currentColor tints over
        // transparent — the Angular layout paints the real background), so a tint alone let the
        // conversation show through the picker. The layout publishes its sidebar surface as
        // --gz-chat-surface; the blur is the fallback for hosts that do not (detached window).
        backgroundColor: 'var(--gz-chat-surface, transparent)',
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.15s ease'
    };
    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 10px',
        borderBottom: `1px solid ${chatTheme.border}`
    };
    const searchStyle = {
        flex: 1,
        padding: '6px 8px',
        borderRadius: 6,
        border: `1px solid ${chatTheme.border}`,
        backgroundColor: chatTheme.surfaceDeep,
        color: chatTheme.textPrimary,
        fontSize: chatTheme.fontSizeBase,
        outline: 'none'
    };
    const listStyle = { flex: 1, overflowY: 'auto', padding: 6 };
    const itemStyle = {
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '7px 9px',
        borderRadius: 6,
        border: 'none',
        background: 'transparent',
        color: chatTheme.textPrimary,
        fontSize: chatTheme.fontSizeBase,
        cursor: 'pointer'
    };
    const emptyStyle = {
        padding: 14,
        color: chatTheme.textSecondary,
        fontSize: chatTheme.fontSizeSmall,
        textAlign: 'center'
    };
    return (_jsxs("div", { style: overlayStyle, role: "dialog", "aria-label": t('AI_ASSISTANT.ATTACH_FROM_DOCUMENTS', 'Attach from Documents'), children: [_jsxs("div", { style: headerStyle, children: [_jsx("input", { ref: searchRef, type: "search", value: query, onChange: (event) => setQuery(event.target.value), onKeyDown: (event) => {
                            if (event.key === 'Escape') {
                                event.preventDefault();
                                onClose();
                            }
                        }, placeholder: t('AI_ASSISTANT.ATTACH_SEARCH', 'Search documents…'), "aria-label": t('AI_ASSISTANT.ATTACH_SEARCH', 'Search documents…'), style: searchStyle }), _jsx("button", { type: "button", onClick: onClose, style: {
                            ...itemStyle,
                            width: 'auto',
                            padding: '6px 10px',
                            border: `1px solid ${chatTheme.border}`
                        }, children: t('AI_ASSISTANT.CANCEL', 'Cancel') })] }), _jsxs("div", { style: listStyle, children: [isLoading && _jsx("div", { style: emptyStyle, children: t('AI_ASSISTANT.LOADING', 'Loading…') }), !isLoading &&
                        documents.map((document) => (_jsxs("button", { type: "button", style: itemStyle, onClick: () => onPick(document), title: document.name, children: [_jsx("span", { "aria-hidden": "true", children: document.kind === 'PAGE' ? '📝' : '📄' }), ' ', _jsx("span", { children: document.name })] }, document.id))), !isLoading && !documents.length && (_jsx("div", { style: emptyStyle, children: failure === 'unavailable'
                            ? t('AI_ASSISTANT.ATTACH_UNAVAILABLE', 'Documents are not available in this workspace.')
                            : failure === 'error'
                                ? t('AI_ASSISTANT.ATTACH_LOAD_FAILED', 'The document list could not be loaded — please try again.')
                                : t('AI_ASSISTANT.ATTACH_NO_RESULTS', 'No matching documents.') }))] })] }));
}
//# sourceMappingURL=DocsAttachPicker.js.map