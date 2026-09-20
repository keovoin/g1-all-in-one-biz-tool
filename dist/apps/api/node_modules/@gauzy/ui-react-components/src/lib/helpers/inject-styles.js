"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureStyleTag = ensureStyleTag;
exports.useInjectedStyles = useInjectedStyles;
const react_1 = require("react");
/**
 * Appends a `<style>` block to `document.head` exactly once per `id`.
 *
 * The primitives in this package are styled inline where possible, but pseudo-classes
 * (`:hover`), keyframes and descendant rules need a real stylesheet. There is no CSS pipeline
 * in this package (it is built with plain `tsc`), so each primitive registers the few rules it
 * needs through this helper. Safe to call on every render — the DOM write happens once.
 *
 * @param id Stable, unique element id (prefix it, e.g. `gzrc-spinner`).
 * @param css The stylesheet text.
 */
function ensureStyleTag(id, css) {
    if (typeof document === 'undefined')
        return;
    if (document.getElementById(id))
        return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
}
/**
 * React hook flavour of {@link ensureStyleTag}: injects before paint so the first frame is
 * already styled.
 *
 * @param id Stable, unique element id.
 * @param css The stylesheet text.
 */
function useInjectedStyles(id, css) {
    (0, react_1.useLayoutEffect)(() => {
        ensureStyleTag(id, css);
    }, [id, css]);
}
//# sourceMappingURL=inject-styles.js.map