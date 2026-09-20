import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { playgroundTheme as t } from '../../playground-theme';
import { ModelSelector } from './ModelSelector';
import { SettingsControl } from './SettingsControl';
const panelExpandedStyle = {
    width: t.settingsPanelWidth,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${t.border}`,
    background: t.bg,
    overflowY: 'auto',
    transition: `width ${t.transition}, opacity ${t.transition}`,
    opacity: 1
};
const panelCollapsedStyle = {
    width: 0,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    borderRight: 'none',
    background: t.bg,
    overflow: 'hidden',
    transition: `width ${t.transition}, opacity ${t.transition}`,
    opacity: 0
};
const sectionStyle = {
    padding: '1rem',
    borderBottom: `1px solid ${t.border}`
};
const sectionTitleStyle = {
    fontSize: t.fontSizeXs,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: t.textSecondary,
    marginBottom: '0.75rem'
};
const noteStyle = {
    fontSize: t.fontSizeXs,
    color: t.textHint,
    marginTop: '0.375rem',
    lineHeight: 1.4
};
/**
 * PlaygroundSettings — left panel with model selector, system prompt,
 * and parameter controls (Temperature, Max Tokens, Top P).
 *
 * Controls that the backend does not support yet stay visible but are
 * disabled with an explanatory note, so the UI never pretends a value
 * is being applied when it is not.
 */
export function PlaygroundSettings({ models, selectedModelId, selectedProviderId, onModelChange, systemPrompt, onSystemPromptChange, systemPromptDisabled = false, temperature, onTemperatureChange, maxTokens, onMaxTokensChange, topP, onTopPChange, parametersDisabled = false, collapsed = false, children }) {
    const textareaStyle = {
        width: '100%',
        minHeight: '5rem',
        padding: '0.5rem 0.75rem',
        fontSize: t.fontSizeSm,
        fontFamily: t.font,
        color: systemPromptDisabled ? t.textHint : t.textPrimary,
        background: t.bgInput,
        border: `1px solid ${t.border}`,
        borderRadius: t.radius,
        outline: 'none',
        resize: 'vertical',
        lineHeight: 1.5,
        boxSizing: 'border-box',
        cursor: systemPromptDisabled ? 'not-allowed' : 'text'
    };
    return (
    // `inert` removes the collapsed panel's controls from the tab order / a11y tree.
    _jsxs("div", { style: collapsed ? panelCollapsedStyle : panelExpandedStyle, inert: collapsed, children: [_jsx("div", { style: sectionStyle, children: _jsx(ModelSelector, { models: models, selectedModelId: selectedModelId, selectedProviderId: selectedProviderId, onModelChange: onModelChange }) }), _jsxs("div", { style: sectionStyle, children: [_jsx("div", { style: sectionTitleStyle, children: "System Prompt" }), _jsx("textarea", { style: textareaStyle, value: systemPrompt, onChange: (e) => onSystemPromptChange(e.target.value), placeholder: "You are a helpful assistant\u2026", disabled: systemPromptDisabled, title: systemPromptDisabled
                            ? 'The Gauzy backend builds its own system prompt — this editor is not wired yet.'
                            : undefined }), systemPromptDisabled && (_jsx("div", { style: noteStyle, children: "Managed by the server \u2014 custom system prompts are not wired yet." }))] }), _jsxs("div", { style: sectionStyle, children: [_jsx("div", { style: sectionTitleStyle, children: "Parameters" }), _jsx(SettingsControl, { label: "Temperature", value: temperature, min: 0, max: 2, step: 0.1, onChange: onTemperatureChange, disabled: parametersDisabled, title: parametersDisabled ? 'Not supported by the backend yet.' : undefined }), _jsx(SettingsControl, { label: "Max Tokens", value: maxTokens, min: 1, max: 16384, step: 1, onChange: onMaxTokensChange, disabled: parametersDisabled, title: parametersDisabled ? 'Not supported by the backend yet.' : undefined }), _jsx(SettingsControl, { label: "Top P", value: topP, min: 0, max: 1, step: 0.05, onChange: onTopPChange, disabled: parametersDisabled, title: parametersDisabled ? 'Not supported by the backend yet.' : undefined }), parametersDisabled && (_jsx("div", { style: noteStyle, children: "These parameters are not supported by the backend yet." }))] }), children && _jsx("div", { style: sectionStyle, children: children })] }));
}
//# sourceMappingURL=PlaygroundSettings.js.map