import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo } from 'react';
import { playgroundTheme as t } from '../../playground-theme';
/**
 * ModelSelector — dropdown for selecting an AI model.
 *
 * Options are grouped by provider label. Selection reports both the
 * model id and the provider id so the caller can route the request to
 * the right backend provider.
 */
export function ModelSelector({ models, selectedModelId, selectedProviderId, onModelChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const isSelected = (model) => model.id === selectedModelId &&
        (!selectedProviderId || !model.providerId || model.providerId === selectedProviderId);
    const selected = models.find(isSelected);
    /** Options grouped by provider label, preserving input order. */
    const groups = useMemo(() => {
        const map = new Map();
        for (const model of models) {
            const key = model.provider ?? '';
            const group = map.get(key);
            if (group) {
                group.push(model);
            }
            else {
                map.set(key, [model]);
            }
        }
        return [...map.entries()];
    }, [models]);
    const triggerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0.5rem 0.75rem',
        fontSize: t.fontSizeSm,
        fontWeight: 500,
        fontFamily: t.font,
        color: t.textPrimary,
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: t.radius,
        cursor: 'pointer',
        outline: 'none',
        boxSizing: 'border-box'
    };
    const dropdownStyle = {
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: 0,
        right: 0,
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: t.radius,
        boxShadow: t.shadow,
        zIndex: 50,
        maxHeight: '240px',
        overflowY: 'auto'
    };
    const groupLabelStyle = {
        padding: '0.375rem 0.75rem 0.25rem',
        fontSize: t.fontSizeXs,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: t.textSecondary,
        background: t.bgSubtle,
        borderBottom: `1px solid ${t.border}`
    };
    const optionBaseStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.125rem',
        padding: '0.5rem 0.75rem',
        cursor: 'pointer',
        fontSize: t.fontSizeSm,
        color: t.textPrimary,
        borderBottom: `1px solid ${t.border}`
    };
    const emptyStyle = {
        padding: '0.75rem',
        fontSize: t.fontSizeSm,
        color: t.textHint
    };
    const select = (model) => {
        onModelChange(model.id, model.providerId);
        setOpen(false);
    };
    return (_jsxs("div", { ref: ref, style: { position: 'relative', marginBottom: '0.75rem' }, children: [_jsx("label", { style: {
                    display: 'block',
                    fontSize: t.fontSizeSm,
                    fontWeight: 500,
                    color: t.textPrimary,
                    marginBottom: '0.375rem'
                }, children: "Model" }), _jsxs("button", { type: "button", style: triggerStyle, onClick: () => setOpen(!open), "aria-haspopup": "listbox", "aria-expanded": open, children: [_jsx("span", { children: selected?.name ?? 'Select a model' }), _jsx("svg", { style: { width: '0.75rem', height: '0.75rem', flexShrink: 0, color: t.textSecondary }, viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z", clipRule: "evenodd" }) })] }), open && (_jsxs("div", { style: dropdownStyle, role: "listbox", children: [models.length === 0 && _jsx("div", { style: emptyStyle, children: "No models available" }), groups.map(([provider, groupModels]) => (_jsxs("div", { children: [provider && _jsx("div", { style: groupLabelStyle, children: provider }), groupModels.map((model) => (_jsxs("div", { role: "option", "aria-selected": isSelected(model), style: {
                                    ...optionBaseStyle,
                                    background: isSelected(model) ? t.accentSubtle : 'transparent'
                                }, onClick: () => select(model), onKeyDown: (e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        select(model);
                                    }
                                }, tabIndex: 0, children: [_jsx("span", { style: { fontWeight: 500 }, children: model.name }), _jsx("span", { style: { fontSize: t.fontSizeXs, color: t.textSecondary, fontWeight: 400 }, children: model.id })] }, `${model.providerId ?? ''}:${model.id}`)))] }, provider || '_ungrouped')))] }))] }));
}
//# sourceMappingURL=ModelSelector.js.map