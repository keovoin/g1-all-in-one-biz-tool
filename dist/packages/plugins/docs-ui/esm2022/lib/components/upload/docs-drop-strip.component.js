import { Component, EventEmitter, Input, Output } from '@angular/core';
import { humanizeBytes } from '../../models/docs-format.util';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
/**
 * Always-visible upload strip between the filter bar and the list — VISUAL-ONLY
 * on purpose.
 *
 * 🛑 It carries no `gzDocsUploadDropzone` of its own: the directive's `onDrop`
 * calls `preventDefault()` but never `stopPropagation()`, so a second instance
 * nested inside the page-wide one would emit `filesDropped` on the strip AND
 * bubble to the page root — two `onFilesPicked` calls, two classification
 * dialogs per drop. The page-wide directive keeps owning every drop; the strip
 * only mirrors its `dragActiveChange` via `[active]` and forwards clicks/keys to
 * the existing upload flow through `(browse)`.
 */
export class DocsDropStripComponent {
    constructor() {
        /** Mirrors the page-wide dropzone's drag state (highlight while a drag hovers the page). */
        this.active = false;
        /** Live org limit (`GET /settings` capabilities via UploadQueueService), not the constant. */
        this.maxFileSizeBytes = 0;
        this.maxFiles = 0;
        this.browse = new EventEmitter();
        this.formats = '';
    }
    /** The hidden file input's accept list (`.pdf,.docx,…`) — the hint derives from it. */
    set accept(value) {
        const seen = new Set();
        const names = [];
        for (const raw of (value ?? '').split(',')) {
            const name = raw.trim().replace(/^\./, '').toUpperCase();
            // JPG/JPEG are one format to a reader.
            const canonical = name === 'JPEG' ? 'JPG' : name;
            if (canonical && !seen.has(canonical)) {
                seen.add(canonical);
                names.push(canonical);
            }
        }
        this.formats = names.join(', ');
    }
    get maxFileSize() {
        return humanizeBytes(this.maxFileSizeBytes);
    }
    /**
     * Space activates the strip like a button — without scrolling the page
     * (preventDefault) and without key-repeat machine-gunning the file picker.
     * A typed METHOD rather than template statements: for `keydown.space`
     * pseudo-key bindings the strict template checker types `$event` too
     * narrowly to reach `KeyboardEvent.repeat` — it fails the PRODUCTION
     * (full-compilation) build only, which is exactly how it slipped past the
     * dev-config PR checks and broke the demo webapp image.
     */
    onSpace(event) {
        event.preventDefault();
        if (!event.repeat)
            this.browse.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsDropStripComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsDropStripComponent, isStandalone: false, selector: "gz-docs-drop-strip", inputs: { active: "active", maxFileSizeBytes: "maxFileSizeBytes", maxFiles: "maxFiles", accept: "accept" }, outputs: { browse: "browse" }, ngImport: i0, template: "<!-- role=button + tabindex: the whole strip is one click/keyboard target whose\n     accessible name is its visible copy (no aria-label override needed). -->\n<div\n\tclass=\"docs-drop-strip\"\n\trole=\"button\"\n\ttabindex=\"0\"\n\t[class.docs-drop-strip--active]=\"active\"\n\t(click)=\"browse.emit()\"\n\t(keydown.enter)=\"browse.emit()\"\n\t(keydown.space)=\"onSpace($any($event))\"\n>\n\t<nb-icon icon=\"cloud-upload-outline\"></nb-icon>\n\t<div class=\"docs-drop-strip-copy\">\n\t\t<span class=\"docs-drop-strip-title\">{{ 'DOCS.UPLOAD.DROP_STRIP_TITLE' | translate }}</span>\n\t\t<span\n\t\t\tclass=\"docs-drop-strip-hint\"\n\t\t\t[nbTooltip]=\"'DOCS.UPLOAD.DROP_STRIP_HINT' | translate: { formats: formats, max: maxFileSize, files: maxFiles }\"\n\t\t\tnbTooltipStatus=\"basic\"\n\t\t\t>{{\n\t\t\t\t'DOCS.UPLOAD.DROP_STRIP_HINT' | translate: { formats: formats, max: maxFileSize, files: maxFiles }\n\t\t\t}}</span\n\t\t>\n\t</div>\n</div>\n", styles: [":host{display:block;min-width:0}.docs-drop-strip{display:flex;align-items:center;gap:.75rem;padding:.5rem .875rem;min-height:3rem;border:1px dashed var(--docs-hairline, rgba(126, 126, 143, .35));border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--gauzy-card-1));color:var(--docs-text-muted, var(--text-hint-color));cursor:pointer;-webkit-user-select:none;user-select:none;transition:border-color .15s ease,background-color .15s ease,color .15s ease}.docs-drop-strip nb-icon{font-size:1.25rem;flex-shrink:0}.docs-drop-strip:hover{border-color:var(--color-primary-default);background:var(--docs-hover, var(--gauzy-card-2))}.docs-drop-strip:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:2px}.docs-drop-strip--active{border-color:var(--color-primary-default);background:var(--color-primary-transparent-100, rgba(51, 102, 255, .08));color:var(--color-primary-default)}.docs-drop-strip-copy{display:flex;align-items:baseline;flex-wrap:wrap;gap:.125rem .5rem;min-width:0}.docs-drop-strip-title{font-size:var(--docs-body-size, .8125rem);font-weight:600;color:var(--docs-text, var(--text-basic-color));white-space:nowrap}.docs-drop-strip--active .docs-drop-strip-title{color:inherit}.docs-drop-strip-hint{flex:1 1 auto;min-width:0;font-size:var(--docs-meta-size, .75rem);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@media(max-width:767px){.docs-drop-strip{padding:.5rem .75rem}.docs-drop-strip-copy{flex-direction:column;align-items:flex-start;gap:.125rem}.docs-drop-strip-hint{width:100%;min-width:0;white-space:normal}}\n"], dependencies: [{ kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsDropStripComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-drop-strip', standalone: false, template: "<!-- role=button + tabindex: the whole strip is one click/keyboard target whose\n     accessible name is its visible copy (no aria-label override needed). -->\n<div\n\tclass=\"docs-drop-strip\"\n\trole=\"button\"\n\ttabindex=\"0\"\n\t[class.docs-drop-strip--active]=\"active\"\n\t(click)=\"browse.emit()\"\n\t(keydown.enter)=\"browse.emit()\"\n\t(keydown.space)=\"onSpace($any($event))\"\n>\n\t<nb-icon icon=\"cloud-upload-outline\"></nb-icon>\n\t<div class=\"docs-drop-strip-copy\">\n\t\t<span class=\"docs-drop-strip-title\">{{ 'DOCS.UPLOAD.DROP_STRIP_TITLE' | translate }}</span>\n\t\t<span\n\t\t\tclass=\"docs-drop-strip-hint\"\n\t\t\t[nbTooltip]=\"'DOCS.UPLOAD.DROP_STRIP_HINT' | translate: { formats: formats, max: maxFileSize, files: maxFiles }\"\n\t\t\tnbTooltipStatus=\"basic\"\n\t\t\t>{{\n\t\t\t\t'DOCS.UPLOAD.DROP_STRIP_HINT' | translate: { formats: formats, max: maxFileSize, files: maxFiles }\n\t\t\t}}</span\n\t\t>\n\t</div>\n</div>\n", styles: [":host{display:block;min-width:0}.docs-drop-strip{display:flex;align-items:center;gap:.75rem;padding:.5rem .875rem;min-height:3rem;border:1px dashed var(--docs-hairline, rgba(126, 126, 143, .35));border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--gauzy-card-1));color:var(--docs-text-muted, var(--text-hint-color));cursor:pointer;-webkit-user-select:none;user-select:none;transition:border-color .15s ease,background-color .15s ease,color .15s ease}.docs-drop-strip nb-icon{font-size:1.25rem;flex-shrink:0}.docs-drop-strip:hover{border-color:var(--color-primary-default);background:var(--docs-hover, var(--gauzy-card-2))}.docs-drop-strip:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:2px}.docs-drop-strip--active{border-color:var(--color-primary-default);background:var(--color-primary-transparent-100, rgba(51, 102, 255, .08));color:var(--color-primary-default)}.docs-drop-strip-copy{display:flex;align-items:baseline;flex-wrap:wrap;gap:.125rem .5rem;min-width:0}.docs-drop-strip-title{font-size:var(--docs-body-size, .8125rem);font-weight:600;color:var(--docs-text, var(--text-basic-color));white-space:nowrap}.docs-drop-strip--active .docs-drop-strip-title{color:inherit}.docs-drop-strip-hint{flex:1 1 auto;min-width:0;font-size:var(--docs-meta-size, .75rem);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@media(max-width:767px){.docs-drop-strip{padding:.5rem .75rem}.docs-drop-strip-copy{flex-direction:column;align-items:flex-start;gap:.125rem}.docs-drop-strip-hint{width:100%;min-width:0;white-space:normal}}\n"] }]
        }], propDecorators: { active: [{
                type: Input
            }], maxFileSizeBytes: [{
                type: Input
            }], maxFiles: [{
                type: Input
            }], accept: [{
                type: Input
            }], browse: [{
                type: Output
            }] } });
//# sourceMappingURL=docs-drop-strip.component.js.map