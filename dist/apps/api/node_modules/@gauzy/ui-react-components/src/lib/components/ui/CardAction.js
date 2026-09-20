"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardAction = CardAction;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * CardAction — interactive elements positioned in the header's top-right corner.
 *
 * Placed inside `<CardHeader>`, rendered absolutely in the top-right.
 */
function CardAction({ children, style, className }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: className, style: {
            position: 'absolute',
            top: '1rem',
            right: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            ...style
        }, children: children }));
}
//# sourceMappingURL=CardAction.js.map