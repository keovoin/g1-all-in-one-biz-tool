"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = Card;
const jsx_runtime_1 = require("react/jsx-runtime");
const theme_1 = require("../../theme");
/**
 * Card — root layout card container (compound component).
 *
 * Compose with `<CardHeader>`, `<CardContent>`, and `<CardFooter>`.
 */
function Card({ children, variant = 'default', style, className }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: className, style: {
            background: variant === 'accent' ? theme_1.theme.bgCard2 : theme_1.theme.bg,
            borderRadius: theme_1.theme.radius,
            boxShadow: variant === 'accent' ? theme_1.theme.shadowLight : theme_1.theme.shadow,
            border: `1px solid ${theme_1.theme.border}`,
            fontFamily: theme_1.theme.font,
            overflow: 'hidden',
            ...style
        }, children: children }));
}
//# sourceMappingURL=Card.js.map