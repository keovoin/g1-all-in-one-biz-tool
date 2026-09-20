import { jsx as _jsx } from "react/jsx-runtime";
import './nebular-jsx';
import { forwardRef } from 'react';
/**
 * A `<button nbButton>` for React: emits the attribute + classes the Nebular `NbButtonComponent`
 * host would carry (`appearance-*`, `size-*`, `status-*`, `shape-*`), so the global Nebular
 * button theme — including the app's density overrides — styles it exactly like the Angular
 * buttons on the Time Tracking tab.
 */
export const NbButton = forwardRef(function NbButton({ appearance = 'filled', size = 'medium', status = 'basic', shape = 'rectangle', iconOnly = false, className, type = 'button', children, ...rest }, ref) {
    const classes = [
        `appearance-${appearance}`,
        `size-${size}`,
        `status-${status}`,
        `shape-${shape}`,
        iconOnly ? 'icon-start icon-end' : '',
        'nb-transition',
        className ?? ''
    ]
        .filter(Boolean)
        .join(' ');
    return (_jsx("button", { ref: ref, nbbutton: "", type: type, className: classes, ...rest, children: children }));
});
//# sourceMappingURL=NbButton.js.map