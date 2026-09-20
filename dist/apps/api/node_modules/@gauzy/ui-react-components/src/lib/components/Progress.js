"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = Progress;
const jsx_runtime_1 = require("react/jsx-runtime");
const theme_1 = require("../theme");
function Progress({ percent, color = theme_1.theme.accent }) {
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            width: '100%',
            height: '4px',
            background: theme_1.theme.tint,
            borderRadius: '2px',
            overflow: 'hidden'
        }, children: (0, jsx_runtime_1.jsx)("div", { style: {
                width: `${Math.min(100, Math.max(0, percent))}%`,
                height: '100%',
                background: color,
                borderRadius: '2px',
                transition: 'width 0.4s ease'
            } }) }));
}
//# sourceMappingURL=Progress.js.map