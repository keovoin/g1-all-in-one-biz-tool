import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { useTranslation } from '@gauzy/ui-react';
import { NbButton } from '../NbButton';
import { NbIcon } from '../NbIcon';
/**
 * The second header row of the Angular tab: the "Auto Refresh" `nb-toggle` (small, basic) and
 * the outline "Refresh" button, which is disabled while auto-refresh is on.
 */
export function HeaderToolbar({ autoRefresh, onAutoRefreshChange, onRefresh }) {
    const { t } = useTranslation();
    const inputId = useId();
    return (_jsxs("div", { className: "gz-rtt-toolbar", children: [_jsxs("label", { className: "gz-rtt-toggle", htmlFor: inputId, children: [_jsx("input", { id: inputId, className: "gz-rtt-toggle-input", type: "checkbox", role: "switch", checked: autoRefresh, "aria-checked": autoRefresh, onChange: (event) => onAutoRefreshChange(event.target.checked) }), _jsx("span", { className: `gz-rtt-toggle-track${autoRefresh ? ' checked' : ''}`, "aria-hidden": "true", children: _jsx("span", { className: "gz-rtt-toggle-switcher" }) }), _jsx("span", { className: "gz-rtt-toggle-text", children: t('BUTTONS.AUTO_REFRESH') })] }), _jsxs(NbButton, { className: "gz-rtt-refresh", appearance: "outline", status: "basic", size: "small", disabled: autoRefresh, onClick: onRefresh, children: [_jsx(NbIcon, { icon: "sync-outline" }), t('BUTTONS.REFRESH')] })] }));
}
//# sourceMappingURL=HeaderToolbar.js.map