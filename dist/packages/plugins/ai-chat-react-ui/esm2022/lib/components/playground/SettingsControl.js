import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { playgroundTheme as t } from '../../playground-theme';
/**
 * SettingsControl — labelled range slider for model parameters
 * (temperature, maxTokens, topP, etc.).
 */
export function SettingsControl({ label, value, min, max, step, onChange, disabled = false, title }) {
    const labelStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: t.fontSizeSm,
        fontWeight: 500,
        color: disabled ? t.textHint : t.textPrimary,
        marginBottom: '0.375rem'
    };
    const valueStyle = {
        fontSize: t.fontSizeSm,
        fontWeight: 600,
        color: t.textSecondary,
        fontVariantNumeric: 'tabular-nums'
    };
    return (_jsxs("div", { style: { marginBottom: '0.75rem' }, title: title, children: [_jsxs("div", { style: labelStyle, children: [_jsx("span", { children: label }), _jsx("span", { style: valueStyle, children: value })] }), _jsx("input", { type: "range", min: min, max: max, step: step, value: value, disabled: disabled, "aria-label": label, onChange: (e) => onChange(Number(e.target.value)), style: {
                    width: '100%',
                    accentColor: t.accent,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                    margin: 0
                } })] }));
}
//# sourceMappingURL=SettingsControl.js.map