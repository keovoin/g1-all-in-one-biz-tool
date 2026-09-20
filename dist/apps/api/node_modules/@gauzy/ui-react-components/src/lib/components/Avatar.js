"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avatar = Avatar;
const jsx_runtime_1 = require("react/jsx-runtime");
const inject_styles_1 = require("../helpers/inject-styles");
const themeTokens_1 = require("../themeTokens");
const AVATAR_CSS = `
.gzrc-avatar { display: block; width: 100%; border-radius: ${themeTokens_1.themeTokens.radius}; }
.gzrc-avatar .gzrc-avatar-inner { border-radius: 9999px; align-items: center; overflow: hidden; display: flex; gap: 8px; width: 100%; }
.gzrc-avatar .gzrc-avatar-image { cursor: pointer; border-radius: ${themeTokens_1.themeTokens.radius}; display: flex; position: relative; flex: 0 0 auto; }
.gzrc-avatar .gzrc-avatar-image img { object-fit: cover; border-radius: ${themeTokens_1.themeTokens.radius}; }
.gzrc-avatar .gzrc-avatar-image.md, .gzrc-avatar .gzrc-avatar-image.md img { width: 48px; }
.gzrc-avatar .gzrc-avatar-image.md img { height: 48px; }
.gzrc-avatar .gzrc-avatar-image.lg, .gzrc-avatar .gzrc-avatar-image.lg img { width: 64px; }
.gzrc-avatar .gzrc-avatar-image.lg img { height: 64px; }
.gzrc-avatar .gzrc-avatar-image.sm, .gzrc-avatar .gzrc-avatar-image.sm img { width: 32px; }
.gzrc-avatar .gzrc-avatar-image.sm img { height: 32px; }
.gzrc-avatar.activity .gzrc-avatar-image, .gzrc-avatar.activity .gzrc-avatar-image img { width: 28px; border-radius: 50%; }
.gzrc-avatar.activity .gzrc-avatar-image img { height: 28px; }
.gzrc-avatar .gzrc-avatar-status { position: absolute; width: 10px; height: 10px; border-radius: 8px; border: 2px solid ${themeTokens_1.themeTokens.card1}; right: 0; top: 0; }
.gzrc-avatar .gzrc-avatar-status.online { background-color: ${themeTokens_1.themeTokens.success}; }
.gzrc-avatar .gzrc-avatar-status.offline { background-color: ${themeTokens_1.themeTokens.danger}; }
.gzrc-avatar .gzrc-avatar-image[role='button'] { outline: none; }
.gzrc-avatar .gzrc-avatar-image[role='button']:focus-visible { box-shadow: 0 0 0 2px ${themeTokens_1.themeTokens.primary}; }
.gzrc-avatar .gzrc-avatar-names { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; width: 100%; min-width: 0; }
.gzrc-avatar .gzrc-avatar-name { display: block; cursor: pointer; text-decoration: none; font-style: normal; font-size: 14px; font-weight: 600;
	line-height: 16px; letter-spacing: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${themeTokens_1.themeTokens.text1}; background: none; border: 0; padding: 0; text-align: start; max-width: 100%; }
.gzrc-avatar .gzrc-avatar-name.static { cursor: default; }
.gzrc-avatar .gzrc-avatar-name:not(.static):hover { text-decoration: underline; }
.gzrc-avatar .gzrc-avatar-caption { font-size: 11px; font-weight: 400; line-height: 11px; letter-spacing: 0; color: ${themeTokens_1.themeTokens.text2}; }
`;
/**
 * Avatar — React port of `<ngx-avatar class="avatar-dashboard">`: image (with optional presence
 * dot) + name link + caption, sized `sm|md|lg`, in the dashboard chip layout.
 */
function Avatar({ name, src, imageLabel = 'Open profile', caption, appendCaption, size = 'md', presence, onClick, variant = 'dashboard', className, style }) {
    (0, inject_styles_1.useInjectedStyles)('gzrc-avatar-styles', AVATAR_CSS);
    const online = !!presence?.isOnline && !presence?.isAway;
    const classes = ['gzrc-avatar', variant === 'activity' ? 'activity' : '', className ?? ''].filter(Boolean).join(' ');
    return ((0, jsx_runtime_1.jsx)("div", { className: classes, style: style, children: (0, jsx_runtime_1.jsxs)("div", { className: "gzrc-avatar-inner", children: [src ? ((0, jsx_runtime_1.jsxs)("div", { className: `gzrc-avatar-image ${size}`, onClick: onClick, role: onClick ? 'button' : undefined, tabIndex: onClick ? 0 : undefined, "aria-label": onClick ? name || imageLabel : undefined, onKeyDown: onClick
                        ? (event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                onClick();
                            }
                        }
                        : undefined, children: [(0, jsx_runtime_1.jsx)("img", { src: src, alt: name ?? '', draggable: false }), presence ? (0, jsx_runtime_1.jsx)("span", { className: `gzrc-avatar-status ${online ? 'online' : 'offline'}` }) : null] })) : null, (0, jsx_runtime_1.jsxs)("div", { className: "gzrc-avatar-names", children: [name ? (onClick ? ((0, jsx_runtime_1.jsx)("button", { type: "button", className: "gzrc-avatar-name", title: name, onClick: onClick, children: name })) : ((0, jsx_runtime_1.jsx)("span", { className: "gzrc-avatar-name static", title: name, children: name }))) : null, caption ? ((0, jsx_runtime_1.jsxs)("div", { className: "gzrc-avatar-caption", children: [appendCaption ? (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [appendCaption, " "] }) : null, caption] })) : null] })] }) }));
}
//# sourceMappingURL=Avatar.js.map