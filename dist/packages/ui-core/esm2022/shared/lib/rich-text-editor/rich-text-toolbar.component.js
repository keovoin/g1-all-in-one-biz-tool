import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, NgZone } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@nebular/theme";
import * as i4 from "@ngx-translate/core";
/**
 * `ga-rich-text-toolbar` — internal toolbar of `ga-rich-text-editor`
 * (05-editor-spec.md §3.4). Button clusters are driven by the preset's
 * `ToolbarGroup[]`; individual buttons additionally gate on schema membership so
 * a cluster never renders a command its editor cannot execute. Active state is
 * re-read on every editor transaction (re-entered into Angular's zone).
 *
 * Keyboard model (05-editor-spec.md §13 / §3.10): each `role="toolbar"` row is a single
 * composite widget — ONE tab stop, with ←/→/Home/End moving between its controls — so Tab
 * from the field before the editor lands on the toolbar once and Tab again enters
 * `.ProseMirror`, instead of walking ~25 separate stops.
 */
export class RichTextToolbarComponent {
    set editor(value) {
        this._detachFromEditor();
        this._editor = value;
        this._attachToEditor();
        this._updateState();
    }
    get editor() {
        return this._editor;
    }
    /**
     * The controls that take part in a toolbar row's roving tabindex.
     *
     * 🛑 Matched with `>` on purpose: the link / image / colour popovers live INSIDE
     * `.rich-text-toolbar__group` but are separate widgets with their own inputs and buttons, and
     * a descendant selector would swallow them into the arrow-key ring. `nb-select` contributes
     * its internal trigger button, which is the element that actually takes focus.
     */
    static { this.ROVING_ITEM_SELECTOR = '.rich-text-toolbar__group > button:not([disabled]), .rich-text-toolbar__group > nb-select button:not([disabled])'; }
    constructor(_zone, _cdr, _host) {
        this._zone = _zone;
        this._cdr = _cdr;
        this._host = _host;
        this.groups = [];
        this.options = { marks: [], alignments: [] };
        this.disabled = false;
        /** editor.isActive(...) snapshot, refreshed per transaction. */
        this.active = {};
        this.blockFormat = 'paragraph';
        this.currentFontFamily = '';
        this.canUndo = false;
        this.canRedo = false;
        /** Inline popovers (tier 1 keeps link/image/color as lightweight popovers — no NbDialog round-trip). */
        this.linkFormOpen = false;
        this.linkUrl = '';
        this.imageFormOpen = false;
        this.imageUrl = '';
        this.textColorOpen = false;
        this.highlightOpen = false;
        /** 12 text-color swatches from the Gauzy/Nebular palette. */
        this.textColors = [
            '#222b45',
            '#8f9bb3',
            '#ffffff',
            '#e74c3c',
            '#e67e22',
            '#f1c40f',
            '#27ae60',
            '#16a085',
            '#3366ff',
            '#0095ff',
            '#8e44ad',
            '#e84393'
        ];
        /** 5 highlight swatches. */
        this.highlightColors = ['#fff3cd', '#d4edda', '#cce5ff', '#f8d7da', '#e2d9f3'];
        /** 6 font-stack presets (05-editor-spec.md §3.3). */
        this.fontFamilies = [
            { label: 'Sans Serif', value: 'Arial, Helvetica, sans-serif' },
            { label: 'Serif', value: 'Georgia, serif' },
            { label: 'Times', value: '"Times New Roman", Times, serif' },
            { label: 'Monospace', value: '"Courier New", Courier, monospace' },
            { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
            { label: 'Trebuchet', value: '"Trebuchet MS", Helvetica, sans-serif' }
        ];
        this._editor = null;
        this._transactionHandler = () => {
            this._zone.run(() => this._updateState());
        };
        /**
         * Active item index per toolbar row. Keyed by the row element rather than held as a single
         * field because the contextual table-operations row is a second, independent `role="toolbar"`.
         * A `WeakMap` so the entry for that row disappears with it when the caret leaves the table.
         */
        this._activeIndex = new WeakMap();
    }
    ngAfterViewChecked() {
        this._syncRovingTabIndex();
    }
    ngOnDestroy() {
        this._detachFromEditor();
    }
    // -------------------------------------------------------------------------
    // Keyboard navigation (roving tabindex)
    // -------------------------------------------------------------------------
    /**
     * ←/→ wrap around the row, Home/End jump to its ends.
     *
     * Only keys pressed on a control that is part of the ring are handled — a keystroke inside a
     * popover input keeps its native behaviour, and Tab is never intercepted so it still exits the
     * toolbar into `.ProseMirror`.
     */
    onToolbarKeydown(event) {
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') {
            return;
        }
        const toolbar = this._toolbarOf(event.target);
        if (!toolbar) {
            return;
        }
        const items = this._itemsOf(toolbar);
        const current = items.indexOf(event.target);
        if (current === -1) {
            return;
        }
        let next;
        switch (event.key) {
            case 'ArrowRight':
                next = (current + 1) % items.length;
                break;
            case 'ArrowLeft':
                next = (current - 1 + items.length) % items.length;
                break;
            case 'Home':
                next = 0;
                break;
            default:
                next = items.length - 1;
                break;
        }
        // Swallowed even when the index does not move, so Home/End never scroll the page instead.
        event.preventDefault();
        this._activeIndex.set(toolbar, next);
        items[current].tabIndex = -1;
        items[next].tabIndex = 0;
        items[next].focus();
    }
    /**
     * Adopts whatever the user focused — by click or by tabbing in — as the row's tab stop, so the
     * next Tab-out / Tab-in round-trip returns to where they left off.
     */
    onToolbarFocusIn(event) {
        const toolbar = this._toolbarOf(event.target);
        if (!toolbar) {
            return;
        }
        const index = this._itemsOf(toolbar).indexOf(event.target);
        if (index === -1) {
            return;
        }
        this._activeIndex.set(toolbar, index);
        this._syncRovingTabIndex();
    }
    /** The `role="toolbar"` row owning `target`, or `null` when it is outside this component. */
    _toolbarOf(target) {
        const element = target;
        if (!element || typeof element.closest !== 'function') {
            return null;
        }
        const toolbar = element.closest('.rich-text-toolbar');
        return toolbar && this._host.nativeElement.contains(toolbar) ? toolbar : null;
    }
    /** The focusable controls of one toolbar row, in DOM order. */
    _itemsOf(toolbar) {
        return Array.from(toolbar.querySelectorAll(RichTextToolbarComponent.ROVING_ITEM_SELECTOR));
    }
    /**
     * Gives each toolbar row exactly one item with `tabindex="0"` and `-1` for the rest.
     *
     * Driven from the DOM after every check rather than bound per button because nearly every
     * button sits behind an `*ngIf` (preset cluster, schema membership, `canUndo`/`canRedo`): a
     * template-bound index would drift the moment a preset drops a cluster or a command becomes
     * unavailable. Writes are diffed, so a keystroke that only refreshes active state touches
     * nothing.
     */
    _syncRovingTabIndex() {
        const toolbars = this._host.nativeElement.querySelectorAll('.rich-text-toolbar');
        toolbars.forEach((toolbar) => {
            const items = this._itemsOf(toolbar);
            if (!items.length) {
                return;
            }
            // Clamp: the previously active control may have been removed or disabled since.
            const active = Math.min(this._activeIndex.get(toolbar) ?? 0, items.length - 1);
            this._activeIndex.set(toolbar, active);
            items.forEach((item, index) => {
                const tabIndex = index === active ? 0 : -1;
                if (item.tabIndex !== tabIndex) {
                    item.tabIndex = tabIndex;
                }
            });
        });
    }
    // -------------------------------------------------------------------------
    // Template helpers
    // -------------------------------------------------------------------------
    /** Whether the preset renders a toolbar cluster. */
    inGroup(group) {
        return this.groups.includes(group);
    }
    /** Whether the preset offers a basic mark button. */
    hasMarkButton(mark) {
        return this.options.marks.includes(mark);
    }
    hasAlignment(alignment) {
        return this.options.alignments.includes(alignment);
    }
    /** Schema-membership gates: never render a command the schema cannot execute. */
    hasNode(name) {
        return !!this._editor?.schema.nodes[name];
    }
    hasMark(name) {
        return !!this._editor?.schema.marks[name];
    }
    // -------------------------------------------------------------------------
    // Commands
    // -------------------------------------------------------------------------
    /**
     * Runs a chained editor command by name (`toggleBold`, `undo`, `addRowAfter`, …).
     * The cast is contained here: command names come from the fixed template, but the
     * chain type only knows commands of statically-registered extensions.
     */
    run(command, attributes) {
        if (!this._editor || this.disabled) {
            return;
        }
        const chain = this._editor.chain().focus();
        chain[command]?.(attributes)?.run?.();
    }
    setBlockFormat(format) {
        if (!this._editor || this.disabled) {
            return;
        }
        const chain = this._editor.chain().focus();
        if (format === 'paragraph') {
            chain.setParagraph().run();
        }
        else {
            chain.setHeading({ level: Number(format.substring(1)) }).run();
        }
    }
    setAlignment(alignment) {
        this._editor?.chain().focus().setTextAlign(alignment).run();
    }
    setFontFamily(fontFamily) {
        if (!this._editor) {
            return;
        }
        if (fontFamily) {
            this._editor.chain().focus().setFontFamily(fontFamily).run();
        }
        else {
            this._editor.chain().focus().unsetFontFamily().run();
        }
    }
    setTextColor(color) {
        if (!this._editor) {
            return;
        }
        if (color) {
            this._editor.chain().focus().setColor(color).run();
        }
        else {
            this._editor.chain().focus().unsetColor().run();
        }
        this.textColorOpen = false;
    }
    setHighlight(color) {
        if (!this._editor) {
            return;
        }
        if (color) {
            this._editor.chain().focus().toggleHighlight({ color }).run();
        }
        else {
            this._editor.chain().focus().unsetHighlight().run();
        }
        this.highlightOpen = false;
    }
    clearFormatting() {
        this._editor?.chain().focus().clearNodes().unsetAllMarks().run();
    }
    insertTable() {
        this._editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
    // ── Link popover ─────────────────────────────────────────────────────────
    toggleLinkForm() {
        if (this.disabled) {
            return;
        }
        this.linkFormOpen = !this.linkFormOpen;
        this.imageFormOpen = this.textColorOpen = this.highlightOpen = false;
        if (this.linkFormOpen) {
            this.linkUrl = this._editor?.getAttributes('link')?.href ?? '';
        }
    }
    applyLink() {
        const url = (this.linkUrl || '').trim();
        if (!this._editor) {
            return;
        }
        if (url) {
            this._editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
        else {
            this.removeLink();
            return;
        }
        this.linkFormOpen = false;
    }
    removeLink() {
        this._editor?.chain().focus().extendMarkRange('link').unsetLink().run();
        this.linkFormOpen = false;
    }
    // ── Image popover (URL dialog — render-only image support, tier 1) ───────
    toggleImageForm() {
        if (this.disabled) {
            return;
        }
        this.imageFormOpen = !this.imageFormOpen;
        this.linkFormOpen = this.textColorOpen = this.highlightOpen = false;
        this.imageUrl = '';
    }
    applyImage() {
        const url = (this.imageUrl || '').trim();
        if (url && this._editor) {
            this._editor.chain().focus().setImage({ src: url }).run();
        }
        this.imageFormOpen = false;
    }
    toggleTextColorPanel() {
        this.textColorOpen = !this.textColorOpen;
        this.highlightOpen = this.linkFormOpen = this.imageFormOpen = false;
    }
    toggleHighlightPanel() {
        this.highlightOpen = !this.highlightOpen;
        this.textColorOpen = this.linkFormOpen = this.imageFormOpen = false;
    }
    // -------------------------------------------------------------------------
    // State tracking
    // -------------------------------------------------------------------------
    _attachToEditor() {
        // 'transaction' covers doc changes AND selection moves — active state stays fresh.
        this._editor?.on('transaction', this._transactionHandler);
    }
    _detachFromEditor() {
        this._editor?.off('transaction', this._transactionHandler);
    }
    _updateState() {
        const editor = this._editor;
        if (!editor) {
            return;
        }
        this.active = {
            bold: editor.isActive('bold'),
            italic: editor.isActive('italic'),
            underline: editor.isActive('underline'),
            strike: editor.isActive('strike'),
            code: editor.isActive('code'),
            codeBlock: editor.isActive('codeBlock'),
            subscript: editor.isActive('subscript'),
            superscript: editor.isActive('superscript'),
            highlight: editor.isActive('highlight'),
            bulletList: editor.isActive('bulletList'),
            orderedList: editor.isActive('orderedList'),
            taskList: editor.isActive('taskList'),
            blockquote: editor.isActive('blockquote'),
            link: editor.isActive('link'),
            table: editor.isActive('table'),
            alignLeft: editor.isActive({ textAlign: 'left' }),
            alignCenter: editor.isActive({ textAlign: 'center' }),
            alignRight: editor.isActive({ textAlign: 'right' }),
            alignJustify: editor.isActive({ textAlign: 'justify' })
        };
        this.blockFormat = this._resolveBlockFormat(editor);
        this.currentFontFamily = editor.getAttributes('textStyle')?.fontFamily ?? '';
        this.canUndo = editor.can().undo();
        this.canRedo = editor.can().redo();
        this._cdr.markForCheck();
    }
    /**
     * Value shown by the block-format dropdown: the first active heading level the toolbar
     * offers, falling back to `paragraph` when none of them is active.
     */
    _resolveBlockFormat(editor) {
        if (editor.isActive('heading', { level: 1 })) {
            return 'h1';
        }
        if (editor.isActive('heading', { level: 2 })) {
            return 'h2';
        }
        if (editor.isActive('heading', { level: 3 })) {
            return 'h3';
        }
        return 'paragraph';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RichTextToolbarComponent, deps: [{ token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: RichTextToolbarComponent, isStandalone: false, selector: "ga-rich-text-toolbar", inputs: { editor: "editor", groups: "groups", options: "options", disabled: "disabled" }, host: { listeners: { "keydown": "onToolbarKeydown($event)", "focusin": "onToolbarFocusIn($event)" } }, ngImport: i0, template: "<div class=\"rich-text-toolbar\" role=\"toolbar\" [attr.aria-label]=\"'RICH_TEXT_EDITOR.TOOLBAR.LABEL' | translate\">\n\t<!-- Undo / redo -->\n\t<ng-container *ngIf=\"inGroup('history')\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.UNDO' | translate\"\n\t\t\t\t[disabled]=\"disabled || !canUndo\"\n\t\t\t\t(click)=\"run('undo')\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"corner-up-left-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.REDO' | translate\"\n\t\t\t\t[disabled]=\"disabled || !canRedo\"\n\t\t\t\t(click)=\"run('redo')\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"corner-up-right-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Block format dropdown: Paragraph / H1 / H2 / H3 -->\n\t<ng-container *ngIf=\"inGroup('blockFormat') && hasNode('heading')\">\n\t\t<div class=\"rich-text-toolbar__group rich-text-toolbar__group--select\">\n\t\t\t<nb-select\n\t\t\t\tsize=\"small\"\n\t\t\t\tclass=\"rich-text-toolbar__select\"\n\t\t\t\t[selected]=\"blockFormat\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(selectedChange)=\"setBlockFormat($event)\"\n\t\t\t>\n\t\t\t\t<nb-option value=\"paragraph\">{{ 'RICH_TEXT_EDITOR.TOOLBAR.PARAGRAPH' | translate }}</nb-option>\n\t\t\t\t<nb-option value=\"h1\">{{ 'RICH_TEXT_EDITOR.TOOLBAR.HEADING' | translate : { level: 1 } }}</nb-option>\n\t\t\t\t<nb-option value=\"h2\">{{ 'RICH_TEXT_EDITOR.TOOLBAR.HEADING' | translate : { level: 2 } }}</nb-option>\n\t\t\t\t<nb-option value=\"h3\">{{ 'RICH_TEXT_EDITOR.TOOLBAR.HEADING' | translate : { level: 3 } }}</nb-option>\n\t\t\t</nb-select>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Basic marks -->\n\t<ng-container *ngIf=\"inGroup('marks')\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasMarkButton('bold')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.BOLD' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['bold']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['bold']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleBold')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-bold\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasMarkButton('italic')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.ITALIC' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['italic']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['italic']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleItalic')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-italic\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasMarkButton('underline')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.UNDERLINE' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['underline']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['underline']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleUnderline')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-underline\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasMarkButton('strike')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.STRIKE' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['strike']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['strike']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleStrike')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-strikethrough\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Code -->\n\t<ng-container *ngIf=\"inGroup('code') && (hasMark('code') || hasNode('codeBlock'))\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasMark('code')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.CODE' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['code']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['code']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleCode')\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"code-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"inGroup('codeBlock') && hasNode('codeBlock')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.CODE_BLOCK' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['codeBlock']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['codeBlock']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleCodeBlock')\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"code-download-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Sub / superscript -->\n\t<ng-container *ngIf=\"inGroup('script') && hasMark('subscript')\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.SUBSCRIPT' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['subscript']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['subscript']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleSubscript')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-subscript\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.SUPERSCRIPT' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['superscript']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['superscript']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleSuperscript')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-superscript\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Color: text color + highlight -->\n\t<ng-container *ngIf=\"inGroup('color') && hasMark('textStyle')\">\n\t\t<div class=\"rich-text-toolbar__group rich-text-toolbar__group--popover-host\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.TEXT_COLOR' | translate\"\n\t\t\t\t[attr.aria-expanded]=\"textColorOpen\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"toggleTextColorPanel()\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-font\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasMark('highlight')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.HIGHLIGHT' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['highlight']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['highlight']\"\n\t\t\t\t[attr.aria-expanded]=\"highlightOpen\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"toggleHighlightPanel()\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-highlighter\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<div *ngIf=\"textColorOpen\" class=\"rich-text-toolbar__popover rich-text-toolbar__popover--swatches\">\n\t\t\t\t<button\n\t\t\t\t\t*ngFor=\"let color of textColors\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tclass=\"rich-text-toolbar__swatch\"\n\t\t\t\t\t[style.background]=\"color\"\n\t\t\t\t\t[attr.aria-label]=\"color\"\n\t\t\t\t\t(click)=\"setTextColor(color)\"\n\t\t\t\t></button>\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tclass=\"rich-text-toolbar__swatch rich-text-toolbar__swatch--reset\"\n\t\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.CLEAR_FORMAT' | translate\"\n\t\t\t\t\t(click)=\"setTextColor(null)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div *ngIf=\"highlightOpen\" class=\"rich-text-toolbar__popover rich-text-toolbar__popover--swatches\">\n\t\t\t\t<button\n\t\t\t\t\t*ngFor=\"let color of highlightColors\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tclass=\"rich-text-toolbar__swatch\"\n\t\t\t\t\t[style.background]=\"color\"\n\t\t\t\t\t[attr.aria-label]=\"color\"\n\t\t\t\t\t(click)=\"setHighlight(color)\"\n\t\t\t\t></button>\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tclass=\"rich-text-toolbar__swatch rich-text-toolbar__swatch--reset\"\n\t\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.CLEAR_FORMAT' | translate\"\n\t\t\t\t\t(click)=\"setHighlight(null)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Font family -->\n\t<ng-container *ngIf=\"inGroup('font') && hasMark('textStyle')\">\n\t\t<div class=\"rich-text-toolbar__group rich-text-toolbar__group--select\">\n\t\t\t<nb-select\n\t\t\t\tsize=\"small\"\n\t\t\t\tclass=\"rich-text-toolbar__select\"\n\t\t\t\t[placeholder]=\"'RICH_TEXT_EDITOR.TOOLBAR.FONT_FAMILY' | translate\"\n\t\t\t\t[selected]=\"currentFontFamily\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(selectedChange)=\"setFontFamily($event)\"\n\t\t\t>\n\t\t\t\t<nb-option value=\"\">{{ 'RICH_TEXT_EDITOR.TOOLBAR.FONT_FAMILY' | translate }}</nb-option>\n\t\t\t\t<nb-option *ngFor=\"let font of fontFamilies\" [value]=\"font.value\" [style.font-family]=\"font.value\">\n\t\t\t\t\t{{ font.label }}\n\t\t\t\t</nb-option>\n\t\t\t</nb-select>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Alignment -->\n\t<ng-container *ngIf=\"inGroup('align') && options.alignments.length\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasAlignment('left')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.ALIGN_LEFT' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['alignLeft']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['alignLeft']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"setAlignment('left')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-align-left\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasAlignment('center')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.ALIGN_CENTER' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['alignCenter']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['alignCenter']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"setAlignment('center')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-align-center\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasAlignment('right')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.ALIGN_RIGHT' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['alignRight']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['alignRight']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"setAlignment('right')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-align-right\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasAlignment('justify')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.ALIGN_JUSTIFY' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['alignJustify']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['alignJustify']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"setAlignment('justify')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-align-justify\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Lists -->\n\t<ng-container *ngIf=\"inGroup('lists')\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.BULLET_LIST' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['bulletList']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['bulletList']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleBulletList')\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"list-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.ORDERED_LIST' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['orderedList']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['orderedList']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleOrderedList')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-list-ol\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasNode('taskList')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.TASK_LIST' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['taskList']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['taskList']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleTaskList')\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"checkmark-square-2-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Blocks: quote, divider -->\n\t<ng-container *ngIf=\"inGroup('blocks')\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.BLOCKQUOTE' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['blockquote']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['blockquote']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleBlockquote')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-quote-right\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasNode('horizontalRule')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.HORIZONTAL_RULE' | translate\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('setHorizontalRule')\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"minus-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Insert: link, table, image -->\n\t<ng-container *ngIf=\"inGroup('insert')\">\n\t\t<div class=\"rich-text-toolbar__group rich-text-toolbar__group--popover-host\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.LINK' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['link']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['link']\"\n\t\t\t\t[attr.aria-expanded]=\"linkFormOpen\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"toggleLinkForm()\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"link-2-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasNode('table')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.TABLE' | translate\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"insertTable()\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-table\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasNode('image')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.IMAGE' | translate\"\n\t\t\t\t[attr.aria-expanded]=\"imageFormOpen\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"toggleImageForm()\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"image-outline\"></nb-icon>\n\t\t\t</button>\n\n\t\t\t<!-- Inline link popover -->\n\t\t\t<div *ngIf=\"linkFormOpen\" class=\"rich-text-toolbar__popover\">\n\t\t\t\t<input\n\t\t\t\t\tnbInput\n\t\t\t\t\tfieldSize=\"small\"\n\t\t\t\t\ttype=\"url\"\n\t\t\t\t\tid=\"rich-text-link-url\"\n\t\t\t\t\tname=\"rich-text-link-url\"\n\t\t\t\t\t[placeholder]=\"'RICH_TEXT_EDITOR.LINK_DIALOG.URL' | translate\"\n\t\t\t\t\t[attr.aria-label]=\"'RICH_TEXT_EDITOR.TOOLBAR.LINK' | translate\"\n\t\t\t\t\t[(ngModel)]=\"linkUrl\"\n\t\t\t\t\t(keyup.enter)=\"applyLink()\"\n\t\t\t\t/>\n\t\t\t\t<button nbButton size=\"small\" status=\"primary\" type=\"button\" (click)=\"applyLink()\">\n\t\t\t\t\t{{ 'RICH_TEXT_EDITOR.LINK_DIALOG.APPLY' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button nbButton ghost size=\"small\" type=\"button\" (click)=\"removeLink()\">\n\t\t\t\t\t{{ 'RICH_TEXT_EDITOR.LINK_DIALOG.REMOVE' | translate }}\n\t\t\t\t</button>\n\t\t\t</div>\n\n\t\t\t<!-- Inline image-URL popover -->\n\t\t\t<div *ngIf=\"imageFormOpen\" class=\"rich-text-toolbar__popover\">\n\t\t\t\t<input\n\t\t\t\t\tnbInput\n\t\t\t\t\tfieldSize=\"small\"\n\t\t\t\t\ttype=\"url\"\n\t\t\t\t\tid=\"rich-text-image-url\"\n\t\t\t\t\tname=\"rich-text-image-url\"\n\t\t\t\t\t[placeholder]=\"'RICH_TEXT_EDITOR.LINK_DIALOG.URL' | translate\"\n\t\t\t\t\t[attr.aria-label]=\"'RICH_TEXT_EDITOR.TOOLBAR.IMAGE' | translate\"\n\t\t\t\t\t[(ngModel)]=\"imageUrl\"\n\t\t\t\t\t(keyup.enter)=\"applyImage()\"\n\t\t\t\t/>\n\t\t\t\t<button nbButton size=\"small\" status=\"primary\" type=\"button\" (click)=\"applyImage()\">\n\t\t\t\t\t{{ 'RICH_TEXT_EDITOR.LINK_DIALOG.APPLY' | translate }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Clear formatting -->\n\t<ng-container *ngIf=\"inGroup('clearFormat')\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.CLEAR_FORMAT' | translate\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"clearFormatting()\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-eraser\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t</div>\n\t</ng-container>\n</div>\n\n<!--\n\tTable row/column operations: contextual second row while the caret is inside a table.\n\tIts own `role=\"toolbar\"` \u2014 and therefore its own roving tabindex ring \u2014 so appearing does not\n\tadd eight more tab stops between the main toolbar and the editor body.\n-->\n<div\n\t*ngIf=\"active['table'] && hasNode('table')\"\n\tclass=\"rich-text-toolbar rich-text-toolbar--table-ops\"\n\trole=\"toolbar\"\n\t[attr.aria-label]=\"'RICH_TEXT_EDITOR.TABLE.TOOLBAR_LABEL' | translate\"\n>\n\t<div class=\"rich-text-toolbar__group\">\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.ROW_ADD_ABOVE' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('addRowBefore')\"\n\t\t>\n\t\t\t<nb-icon icon=\"arrow-upward-outline\"></nb-icon>\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.ROW_ADD_BELOW' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('addRowAfter')\"\n\t\t>\n\t\t\t<nb-icon icon=\"arrow-downward-outline\"></nb-icon>\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.ROW_DELETE' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('deleteRow')\"\n\t\t>\n\t\t\t<nb-icon icon=\"collapse-outline\"></nb-icon>\n\t\t</button>\n\t</div>\n\t<div class=\"rich-text-toolbar__divider\"></div>\n\t<div class=\"rich-text-toolbar__group\">\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.COL_ADD_LEFT' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('addColumnBefore')\"\n\t\t>\n\t\t\t<nb-icon icon=\"arrow-back-outline\"></nb-icon>\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.COL_ADD_RIGHT' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('addColumnAfter')\"\n\t\t>\n\t\t\t<nb-icon icon=\"arrow-forward-outline\"></nb-icon>\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.COL_DELETE' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('deleteColumn')\"\n\t\t>\n\t\t\t<nb-icon icon=\"collapse-outline\" class=\"rich-text-toolbar__icon--rotated\"></nb-icon>\n\t\t</button>\n\t</div>\n\t<div class=\"rich-text-toolbar__divider\"></div>\n\t<div class=\"rich-text-toolbar__group\">\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.HEADER_ROW' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('toggleHeaderRow')\"\n\t\t>\n\t\t\t<i class=\"fas fa-heading\" aria-hidden=\"true\"></i>\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\tstatus=\"danger\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.DELETE' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('deleteTable')\"\n\t\t>\n\t\t\t<nb-icon icon=\"trash-2-outline\"></nb-icon>\n\t\t</button>\n\t</div>\n</div>\n", styles: [":host{display:block}.rich-text-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:.25rem .125rem;padding:.25rem .5rem;background:var(--background-basic-color-2);border-bottom:1px solid var(--border-basic-color-3);border-radius:var(--border-radius) var(--border-radius) 0 0}.rich-text-toolbar--table-ops{border-radius:0}.rich-text-toolbar__group{display:flex;align-items:center;gap:.125rem}.rich-text-toolbar__group--popover-host{position:relative}.rich-text-toolbar__group--select{flex:0 0 auto}.rich-text-toolbar__group--select nb-select{width:6rem}.rich-text-toolbar__group>button[nbButton].size-small.appearance-ghost{padding-left:.25rem;padding-right:.25rem}.rich-text-toolbar__group>button[nbButton].size-small.appearance-ghost i.fas{font-size:.8125rem;line-height:1;width:.875rem;text-align:center}.rich-text-toolbar__group>button[nbButton].size-small.appearance-ghost nb-icon{width:.875rem;height:.875rem;font-size:.8125rem}.rich-text-toolbar__button--active{background-color:var(--color-primary-transparent-200)!important;color:var(--color-primary-default)}.rich-text-toolbar__divider{width:1px;flex:0 0 auto;align-self:stretch;margin:.25rem .125rem;background:var(--border-basic-color-3)}.rich-text-toolbar__popover{position:absolute;top:calc(100% + .25rem);left:0;z-index:100;display:flex;align-items:center;gap:.25rem;padding:.5rem;background:var(--background-basic-color-1);border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);box-shadow:var(--shadow)}.rich-text-toolbar__popover input[nbInput]{min-width:14rem}.rich-text-toolbar__popover--swatches{display:grid;grid-template-columns:repeat(6,1.5rem);gap:.25rem}.rich-text-toolbar__swatch{width:1.5rem;height:1.5rem;padding:0;border:1px solid var(--border-basic-color-3);border-radius:.25rem;cursor:pointer}.rich-text-toolbar__swatch:hover{outline:2px solid var(--color-primary-default)}.rich-text-toolbar__swatch--reset{display:flex;align-items:center;justify-content:center;background:var(--background-basic-color-1);color:var(--text-hint-color)}.rich-text-toolbar__swatch--reset nb-icon{font-size:.875rem}.rich-text-toolbar__icon--rotated{transform:rotate(90deg)}:host .rich-text-toolbar__group--select nb-select ::ng-deep .select-button{min-width:0;min-height:0!important;height:1.875rem;padding-block:0;padding-inline-start:.5rem;padding-inline-end:1.5rem;font-size:.75rem;line-height:1;background-color:var(--background-basic-color-1)!important}:host .rich-text-toolbar__group--select nb-select ::ng-deep .select-button.placeholder{font-size:.75rem}:host .rich-text-toolbar__group--select nb-select ::ng-deep .select-button nb-icon{font-size:.875rem;width:.875rem;height:.875rem}:host .rich-text-toolbar__popover input[nbInput]{min-height:0!important;height:1.875rem;font-size:.75rem}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i3.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i3.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "directive", type: i3.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RichTextToolbarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-rich-text-toolbar', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<div class=\"rich-text-toolbar\" role=\"toolbar\" [attr.aria-label]=\"'RICH_TEXT_EDITOR.TOOLBAR.LABEL' | translate\">\n\t<!-- Undo / redo -->\n\t<ng-container *ngIf=\"inGroup('history')\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.UNDO' | translate\"\n\t\t\t\t[disabled]=\"disabled || !canUndo\"\n\t\t\t\t(click)=\"run('undo')\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"corner-up-left-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.REDO' | translate\"\n\t\t\t\t[disabled]=\"disabled || !canRedo\"\n\t\t\t\t(click)=\"run('redo')\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"corner-up-right-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Block format dropdown: Paragraph / H1 / H2 / H3 -->\n\t<ng-container *ngIf=\"inGroup('blockFormat') && hasNode('heading')\">\n\t\t<div class=\"rich-text-toolbar__group rich-text-toolbar__group--select\">\n\t\t\t<nb-select\n\t\t\t\tsize=\"small\"\n\t\t\t\tclass=\"rich-text-toolbar__select\"\n\t\t\t\t[selected]=\"blockFormat\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(selectedChange)=\"setBlockFormat($event)\"\n\t\t\t>\n\t\t\t\t<nb-option value=\"paragraph\">{{ 'RICH_TEXT_EDITOR.TOOLBAR.PARAGRAPH' | translate }}</nb-option>\n\t\t\t\t<nb-option value=\"h1\">{{ 'RICH_TEXT_EDITOR.TOOLBAR.HEADING' | translate : { level: 1 } }}</nb-option>\n\t\t\t\t<nb-option value=\"h2\">{{ 'RICH_TEXT_EDITOR.TOOLBAR.HEADING' | translate : { level: 2 } }}</nb-option>\n\t\t\t\t<nb-option value=\"h3\">{{ 'RICH_TEXT_EDITOR.TOOLBAR.HEADING' | translate : { level: 3 } }}</nb-option>\n\t\t\t</nb-select>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Basic marks -->\n\t<ng-container *ngIf=\"inGroup('marks')\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasMarkButton('bold')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.BOLD' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['bold']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['bold']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleBold')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-bold\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasMarkButton('italic')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.ITALIC' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['italic']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['italic']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleItalic')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-italic\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasMarkButton('underline')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.UNDERLINE' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['underline']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['underline']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleUnderline')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-underline\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasMarkButton('strike')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.STRIKE' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['strike']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['strike']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleStrike')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-strikethrough\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Code -->\n\t<ng-container *ngIf=\"inGroup('code') && (hasMark('code') || hasNode('codeBlock'))\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasMark('code')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.CODE' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['code']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['code']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleCode')\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"code-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"inGroup('codeBlock') && hasNode('codeBlock')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.CODE_BLOCK' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['codeBlock']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['codeBlock']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleCodeBlock')\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"code-download-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Sub / superscript -->\n\t<ng-container *ngIf=\"inGroup('script') && hasMark('subscript')\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.SUBSCRIPT' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['subscript']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['subscript']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleSubscript')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-subscript\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.SUPERSCRIPT' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['superscript']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['superscript']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleSuperscript')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-superscript\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Color: text color + highlight -->\n\t<ng-container *ngIf=\"inGroup('color') && hasMark('textStyle')\">\n\t\t<div class=\"rich-text-toolbar__group rich-text-toolbar__group--popover-host\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.TEXT_COLOR' | translate\"\n\t\t\t\t[attr.aria-expanded]=\"textColorOpen\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"toggleTextColorPanel()\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-font\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasMark('highlight')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.HIGHLIGHT' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['highlight']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['highlight']\"\n\t\t\t\t[attr.aria-expanded]=\"highlightOpen\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"toggleHighlightPanel()\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-highlighter\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<div *ngIf=\"textColorOpen\" class=\"rich-text-toolbar__popover rich-text-toolbar__popover--swatches\">\n\t\t\t\t<button\n\t\t\t\t\t*ngFor=\"let color of textColors\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tclass=\"rich-text-toolbar__swatch\"\n\t\t\t\t\t[style.background]=\"color\"\n\t\t\t\t\t[attr.aria-label]=\"color\"\n\t\t\t\t\t(click)=\"setTextColor(color)\"\n\t\t\t\t></button>\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tclass=\"rich-text-toolbar__swatch rich-text-toolbar__swatch--reset\"\n\t\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.CLEAR_FORMAT' | translate\"\n\t\t\t\t\t(click)=\"setTextColor(null)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div *ngIf=\"highlightOpen\" class=\"rich-text-toolbar__popover rich-text-toolbar__popover--swatches\">\n\t\t\t\t<button\n\t\t\t\t\t*ngFor=\"let color of highlightColors\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tclass=\"rich-text-toolbar__swatch\"\n\t\t\t\t\t[style.background]=\"color\"\n\t\t\t\t\t[attr.aria-label]=\"color\"\n\t\t\t\t\t(click)=\"setHighlight(color)\"\n\t\t\t\t></button>\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tclass=\"rich-text-toolbar__swatch rich-text-toolbar__swatch--reset\"\n\t\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.CLEAR_FORMAT' | translate\"\n\t\t\t\t\t(click)=\"setHighlight(null)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Font family -->\n\t<ng-container *ngIf=\"inGroup('font') && hasMark('textStyle')\">\n\t\t<div class=\"rich-text-toolbar__group rich-text-toolbar__group--select\">\n\t\t\t<nb-select\n\t\t\t\tsize=\"small\"\n\t\t\t\tclass=\"rich-text-toolbar__select\"\n\t\t\t\t[placeholder]=\"'RICH_TEXT_EDITOR.TOOLBAR.FONT_FAMILY' | translate\"\n\t\t\t\t[selected]=\"currentFontFamily\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(selectedChange)=\"setFontFamily($event)\"\n\t\t\t>\n\t\t\t\t<nb-option value=\"\">{{ 'RICH_TEXT_EDITOR.TOOLBAR.FONT_FAMILY' | translate }}</nb-option>\n\t\t\t\t<nb-option *ngFor=\"let font of fontFamilies\" [value]=\"font.value\" [style.font-family]=\"font.value\">\n\t\t\t\t\t{{ font.label }}\n\t\t\t\t</nb-option>\n\t\t\t</nb-select>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Alignment -->\n\t<ng-container *ngIf=\"inGroup('align') && options.alignments.length\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasAlignment('left')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.ALIGN_LEFT' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['alignLeft']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['alignLeft']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"setAlignment('left')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-align-left\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasAlignment('center')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.ALIGN_CENTER' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['alignCenter']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['alignCenter']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"setAlignment('center')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-align-center\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasAlignment('right')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.ALIGN_RIGHT' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['alignRight']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['alignRight']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"setAlignment('right')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-align-right\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasAlignment('justify')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.ALIGN_JUSTIFY' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['alignJustify']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['alignJustify']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"setAlignment('justify')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-align-justify\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Lists -->\n\t<ng-container *ngIf=\"inGroup('lists')\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.BULLET_LIST' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['bulletList']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['bulletList']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleBulletList')\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"list-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.ORDERED_LIST' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['orderedList']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['orderedList']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleOrderedList')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-list-ol\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasNode('taskList')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.TASK_LIST' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['taskList']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['taskList']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleTaskList')\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"checkmark-square-2-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Blocks: quote, divider -->\n\t<ng-container *ngIf=\"inGroup('blocks')\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.BLOCKQUOTE' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['blockquote']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['blockquote']\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('toggleBlockquote')\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-quote-right\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasNode('horizontalRule')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.HORIZONTAL_RULE' | translate\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"run('setHorizontalRule')\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"minus-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Insert: link, table, image -->\n\t<ng-container *ngIf=\"inGroup('insert')\">\n\t\t<div class=\"rich-text-toolbar__group rich-text-toolbar__group--popover-host\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.LINK' | translate\"\n\t\t\t\t[attr.aria-pressed]=\"active['link']\"\n\t\t\t\t[class.rich-text-toolbar__button--active]=\"active['link']\"\n\t\t\t\t[attr.aria-expanded]=\"linkFormOpen\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"toggleLinkForm()\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"link-2-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasNode('table')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.TABLE' | translate\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"insertTable()\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-table\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"hasNode('image')\"\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.IMAGE' | translate\"\n\t\t\t\t[attr.aria-expanded]=\"imageFormOpen\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"toggleImageForm()\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"image-outline\"></nb-icon>\n\t\t\t</button>\n\n\t\t\t<!-- Inline link popover -->\n\t\t\t<div *ngIf=\"linkFormOpen\" class=\"rich-text-toolbar__popover\">\n\t\t\t\t<input\n\t\t\t\t\tnbInput\n\t\t\t\t\tfieldSize=\"small\"\n\t\t\t\t\ttype=\"url\"\n\t\t\t\t\tid=\"rich-text-link-url\"\n\t\t\t\t\tname=\"rich-text-link-url\"\n\t\t\t\t\t[placeholder]=\"'RICH_TEXT_EDITOR.LINK_DIALOG.URL' | translate\"\n\t\t\t\t\t[attr.aria-label]=\"'RICH_TEXT_EDITOR.TOOLBAR.LINK' | translate\"\n\t\t\t\t\t[(ngModel)]=\"linkUrl\"\n\t\t\t\t\t(keyup.enter)=\"applyLink()\"\n\t\t\t\t/>\n\t\t\t\t<button nbButton size=\"small\" status=\"primary\" type=\"button\" (click)=\"applyLink()\">\n\t\t\t\t\t{{ 'RICH_TEXT_EDITOR.LINK_DIALOG.APPLY' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button nbButton ghost size=\"small\" type=\"button\" (click)=\"removeLink()\">\n\t\t\t\t\t{{ 'RICH_TEXT_EDITOR.LINK_DIALOG.REMOVE' | translate }}\n\t\t\t\t</button>\n\t\t\t</div>\n\n\t\t\t<!-- Inline image-URL popover -->\n\t\t\t<div *ngIf=\"imageFormOpen\" class=\"rich-text-toolbar__popover\">\n\t\t\t\t<input\n\t\t\t\t\tnbInput\n\t\t\t\t\tfieldSize=\"small\"\n\t\t\t\t\ttype=\"url\"\n\t\t\t\t\tid=\"rich-text-image-url\"\n\t\t\t\t\tname=\"rich-text-image-url\"\n\t\t\t\t\t[placeholder]=\"'RICH_TEXT_EDITOR.LINK_DIALOG.URL' | translate\"\n\t\t\t\t\t[attr.aria-label]=\"'RICH_TEXT_EDITOR.TOOLBAR.IMAGE' | translate\"\n\t\t\t\t\t[(ngModel)]=\"imageUrl\"\n\t\t\t\t\t(keyup.enter)=\"applyImage()\"\n\t\t\t\t/>\n\t\t\t\t<button nbButton size=\"small\" status=\"primary\" type=\"button\" (click)=\"applyImage()\">\n\t\t\t\t\t{{ 'RICH_TEXT_EDITOR.LINK_DIALOG.APPLY' | translate }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"rich-text-toolbar__divider\"></div>\n\t</ng-container>\n\n\t<!-- Clear formatting -->\n\t<ng-container *ngIf=\"inGroup('clearFormat')\">\n\t\t<div class=\"rich-text-toolbar__group\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"small\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TOOLBAR.CLEAR_FORMAT' | translate\"\n\t\t\t\t[disabled]=\"disabled\"\n\t\t\t\t(click)=\"clearFormatting()\"\n\t\t\t>\n\t\t\t\t<i class=\"fas fa-eraser\" aria-hidden=\"true\"></i>\n\t\t\t</button>\n\t\t</div>\n\t</ng-container>\n</div>\n\n<!--\n\tTable row/column operations: contextual second row while the caret is inside a table.\n\tIts own `role=\"toolbar\"` \u2014 and therefore its own roving tabindex ring \u2014 so appearing does not\n\tadd eight more tab stops between the main toolbar and the editor body.\n-->\n<div\n\t*ngIf=\"active['table'] && hasNode('table')\"\n\tclass=\"rich-text-toolbar rich-text-toolbar--table-ops\"\n\trole=\"toolbar\"\n\t[attr.aria-label]=\"'RICH_TEXT_EDITOR.TABLE.TOOLBAR_LABEL' | translate\"\n>\n\t<div class=\"rich-text-toolbar__group\">\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.ROW_ADD_ABOVE' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('addRowBefore')\"\n\t\t>\n\t\t\t<nb-icon icon=\"arrow-upward-outline\"></nb-icon>\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.ROW_ADD_BELOW' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('addRowAfter')\"\n\t\t>\n\t\t\t<nb-icon icon=\"arrow-downward-outline\"></nb-icon>\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.ROW_DELETE' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('deleteRow')\"\n\t\t>\n\t\t\t<nb-icon icon=\"collapse-outline\"></nb-icon>\n\t\t</button>\n\t</div>\n\t<div class=\"rich-text-toolbar__divider\"></div>\n\t<div class=\"rich-text-toolbar__group\">\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.COL_ADD_LEFT' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('addColumnBefore')\"\n\t\t>\n\t\t\t<nb-icon icon=\"arrow-back-outline\"></nb-icon>\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.COL_ADD_RIGHT' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('addColumnAfter')\"\n\t\t>\n\t\t\t<nb-icon icon=\"arrow-forward-outline\"></nb-icon>\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.COL_DELETE' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('deleteColumn')\"\n\t\t>\n\t\t\t<nb-icon icon=\"collapse-outline\" class=\"rich-text-toolbar__icon--rotated\"></nb-icon>\n\t\t</button>\n\t</div>\n\t<div class=\"rich-text-toolbar__divider\"></div>\n\t<div class=\"rich-text-toolbar__group\">\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.HEADER_ROW' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('toggleHeaderRow')\"\n\t\t>\n\t\t\t<i class=\"fas fa-heading\" aria-hidden=\"true\"></i>\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\tstatus=\"danger\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'RICH_TEXT_EDITOR.TABLE.DELETE' | translate\"\n\t\t\t[disabled]=\"disabled\"\n\t\t\t(click)=\"run('deleteTable')\"\n\t\t>\n\t\t\t<nb-icon icon=\"trash-2-outline\"></nb-icon>\n\t\t</button>\n\t</div>\n</div>\n", styles: [":host{display:block}.rich-text-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:.25rem .125rem;padding:.25rem .5rem;background:var(--background-basic-color-2);border-bottom:1px solid var(--border-basic-color-3);border-radius:var(--border-radius) var(--border-radius) 0 0}.rich-text-toolbar--table-ops{border-radius:0}.rich-text-toolbar__group{display:flex;align-items:center;gap:.125rem}.rich-text-toolbar__group--popover-host{position:relative}.rich-text-toolbar__group--select{flex:0 0 auto}.rich-text-toolbar__group--select nb-select{width:6rem}.rich-text-toolbar__group>button[nbButton].size-small.appearance-ghost{padding-left:.25rem;padding-right:.25rem}.rich-text-toolbar__group>button[nbButton].size-small.appearance-ghost i.fas{font-size:.8125rem;line-height:1;width:.875rem;text-align:center}.rich-text-toolbar__group>button[nbButton].size-small.appearance-ghost nb-icon{width:.875rem;height:.875rem;font-size:.8125rem}.rich-text-toolbar__button--active{background-color:var(--color-primary-transparent-200)!important;color:var(--color-primary-default)}.rich-text-toolbar__divider{width:1px;flex:0 0 auto;align-self:stretch;margin:.25rem .125rem;background:var(--border-basic-color-3)}.rich-text-toolbar__popover{position:absolute;top:calc(100% + .25rem);left:0;z-index:100;display:flex;align-items:center;gap:.25rem;padding:.5rem;background:var(--background-basic-color-1);border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);box-shadow:var(--shadow)}.rich-text-toolbar__popover input[nbInput]{min-width:14rem}.rich-text-toolbar__popover--swatches{display:grid;grid-template-columns:repeat(6,1.5rem);gap:.25rem}.rich-text-toolbar__swatch{width:1.5rem;height:1.5rem;padding:0;border:1px solid var(--border-basic-color-3);border-radius:.25rem;cursor:pointer}.rich-text-toolbar__swatch:hover{outline:2px solid var(--color-primary-default)}.rich-text-toolbar__swatch--reset{display:flex;align-items:center;justify-content:center;background:var(--background-basic-color-1);color:var(--text-hint-color)}.rich-text-toolbar__swatch--reset nb-icon{font-size:.875rem}.rich-text-toolbar__icon--rotated{transform:rotate(90deg)}:host .rich-text-toolbar__group--select nb-select ::ng-deep .select-button{min-width:0;min-height:0!important;height:1.875rem;padding-block:0;padding-inline-start:.5rem;padding-inline-end:1.5rem;font-size:.75rem;line-height:1;background-color:var(--background-basic-color-1)!important}:host .rich-text-toolbar__group--select nb-select ::ng-deep .select-button.placeholder{font-size:.75rem}:host .rich-text-toolbar__group--select nb-select ::ng-deep .select-button nb-icon{font-size:.875rem;width:.875rem;height:.875rem}:host .rich-text-toolbar__popover input[nbInput]{min-height:0!important;height:1.875rem;font-size:.75rem}\n"] }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }], propDecorators: { editor: [{
                type: Input
            }], groups: [{
                type: Input
            }], options: [{
                type: Input
            }], disabled: [{
                type: Input
            }], onToolbarKeydown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }], onToolbarFocusIn: [{
                type: HostListener,
                args: ['focusin', ['$event']]
            }] } });
//# sourceMappingURL=rich-text-toolbar.component.js.map