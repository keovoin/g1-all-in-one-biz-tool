import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
const FILLABLE_SELECTOR = [
    'input:not([type=hidden]):not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'nb-select',
    'ng-select',
    'nb-checkbox',
    '[contenteditable="true"]'
].join(',');
/**
 * AgentFormBridgeService
 *
 * Best-effort DOM bridge that lets the embedded AI agent read and fill
 * the forms of whatever page is open in the main content column.
 *
 * The platform's forms are Angular Reactive Forms rendered with a mix of
 * native inputs and Nebular / ng-select widgets:
 * - native inputs/textareas/selects: set value + dispatch `input`/`change`
 *   (picked up by Angular's value accessors);
 * - `nb-checkbox`: click the native checkbox inside;
 * - `nb-select` / `ng-select`: open the overlay and click the option whose
 *   text matches the requested value;
 * - date inputs: set the formatted text and dispatch `input`.
 *
 * Everything is reported back honestly — fields that could not be matched
 * or set are returned in `failed` with a reason, so the agent can tell the
 * user instead of pretending the form is complete.
 */
export class AgentFormBridgeService {
    /**
     * Describe the forms (and standalone fillable fields) on the current page.
     */
    readPage() {
        const forms = [];
        const roots = this.findFormRoots();
        roots.forEach((root, index) => {
            const fields = this.collectFields(root).map((el) => this.describeField(el));
            if (!fields.length)
                return;
            forms.push({
                index,
                title: this.findFormTitle(root),
                fields,
                submitLabels: this.findSubmitButtons(root).map((b) => (b.textContent ?? '').trim()).filter(Boolean)
            });
        });
        return {
            url: typeof location !== 'undefined' ? location.hash.replace(/^#/, '') || location.pathname : '',
            title: typeof document !== 'undefined' ? document.title : '',
            forms
        };
    }
    /**
     * Fill fields of a form on the current page.
     *
     * @param instructions Field/value pairs to apply.
     * @param formIndex Optional index from `readPage()`; when omitted, all forms are searched.
     */
    async fillForm(instructions, formIndex) {
        const roots = this.findFormRoots();
        // An explicit but out-of-range formIndex is an error — silently searching
        // all forms could fill fields of the wrong form.
        if (formIndex != null && !roots[formIndex]) {
            return {
                filled: [],
                failed: instructions.map((instruction) => ({
                    field: instruction.field,
                    reason: `formIndex ${formIndex} not found (page has ${roots.length} forms).`
                }))
            };
        }
        const scope = formIndex != null ? [roots[formIndex]] : roots;
        const result = { filled: [], failed: [] };
        for (const instruction of instructions) {
            const match = this.findField(scope, instruction.field);
            if (!match) {
                result.failed.push({ field: instruction.field, reason: 'No visible field matched this label/name.' });
                continue;
            }
            try {
                const ok = await this.setFieldValue(match, instruction.value);
                if (ok) {
                    result.filled.push(instruction.field);
                }
                else {
                    result.failed.push({
                        field: instruction.field,
                        reason: `Field type '${this.describeField(match).type}' is not supported yet.`
                    });
                }
            }
            catch (error) {
                result.failed.push({ field: instruction.field, reason: error?.message ?? String(error) });
            }
        }
        return result;
    }
    /**
     * Click the submit button of a form. The AI agent must only call this
     * after explicit user approval (enforced by the chat tool-approval flow).
     */
    submitForm(formIndex) {
        const roots = this.findFormRoots();
        const scope = formIndex != null && roots[formIndex] ? [roots[formIndex]] : roots;
        for (const root of scope) {
            const button = this.findSubmitButtons(root).find((b) => !b.disabled);
            if (button) {
                const label = (button.textContent ?? '').trim();
                button.click();
                return { success: true, buttonLabel: label };
            }
        }
        return { success: false, error: 'No enabled submit button found on the current page.' };
    }
    // ── DOM discovery ────────────────────────────────────────────────
    /** Forms first; fall back to dialog/page containers holding fillable fields. */
    findFormRoots() {
        if (typeof document === 'undefined')
            return [];
        const forms = Array.from(document.querySelectorAll('form')).filter((f) => this.isVisible(f));
        if (forms.length)
            return forms;
        // Some pages use template-driven groups without a <form> tag — treat
        // open dialogs and the routed page as a single pseudo-form scope.
        const dialog = document.querySelector('nb-dialog-container, .cdk-overlay-container nb-card');
        if (dialog && this.isVisible(dialog) && dialog.querySelector(FILLABLE_SELECTOR))
            return [dialog];
        const page = document.querySelector('nb-layout-column router-outlet ~ *, nb-layout-column');
        return page && page.querySelector(FILLABLE_SELECTOR) ? [page] : [];
    }
    collectFields(root) {
        const all = Array.from(root.querySelectorAll(FILLABLE_SELECTOR));
        // Native inputs living inside nb-select/ng-select/nb-checkbox wrappers
        // are implementation details — keep the wrapper, drop the inner input.
        return all.filter((el) => {
            if (!this.isVisible(el))
                return false;
            const wrapper = el.closest('nb-select, ng-select, nb-checkbox');
            return !wrapper || wrapper === el;
        });
    }
    describeField(el) {
        const tag = el.tagName.toLowerCase();
        const input = el;
        let type = tag;
        let value = '';
        let options;
        if (tag === 'input') {
            type = input.type || 'text';
            value = input.type === 'checkbox' || input.type === 'radio' ? String(input.checked) : input.value;
        }
        else if (tag === 'textarea') {
            type = 'textarea';
            value = el.value;
        }
        else if (tag === 'select') {
            type = 'select';
            const select = el;
            value = select.selectedOptions[0]?.textContent?.trim() ?? '';
            options = Array.from(select.options).map((o) => o.textContent?.trim() ?? '');
        }
        else if (tag === 'nb-select') {
            type = 'select';
            value = el.querySelector('.select-button')?.textContent?.trim() ?? '';
        }
        else if (tag === 'ng-select') {
            type = 'select';
            value = el.querySelector('.ng-value')?.textContent?.trim() ?? '';
        }
        else if (tag === 'nb-checkbox') {
            type = 'checkbox';
            value = String(el.querySelector('input[type=checkbox]')?.checked ?? false);
        }
        else if (el.isContentEditable) {
            type = 'richtext';
            value = (el.textContent ?? '').trim();
        }
        return {
            label: this.findLabel(el),
            name: el.getAttribute('formcontrolname') ?? el.getAttribute('name') ?? undefined,
            type,
            value,
            required: el.hasAttribute('required') || el.getAttribute('aria-required') === 'true',
            options
        };
    }
    findLabel(el) {
        const id = el.getAttribute('id');
        if (id) {
            const label = document.querySelector(`label[for="${CSS.escape(id)}"]`);
            if (label?.textContent?.trim())
                return label.textContent.trim();
        }
        const wrapped = el.closest('label');
        if (wrapped?.textContent?.trim())
            return wrapped.textContent.trim();
        const container = el.closest('nb-form-field, .form-group, [class*="form-field"]');
        const near = container?.querySelector('label');
        if (near?.textContent?.trim())
            return near.textContent.trim();
        return (el.getAttribute('aria-label') ??
            el.getAttribute('placeholder') ??
            el.getAttribute('formcontrolname') ??
            el.getAttribute('name') ??
            '');
    }
    findFormTitle(root) {
        const heading = root.querySelector('h1, h2, h3, h4, h5, h6, nb-card-header');
        return heading?.textContent?.trim() || undefined;
    }
    findSubmitButtons(root) {
        const explicit = Array.from(root.querySelectorAll('button[type=submit]:not([hidden])'));
        if (explicit.length)
            return explicit.filter((b) => this.isVisible(b));
        // Fall back to primary-styled buttons with an actionable label.
        return Array.from(root.querySelectorAll('button[status=success], button[status=primary], button.appearance-filled')).filter((b) => this.isVisible(b) && /save|submit|add|create|update|confirm|invite|send/i.test(b.textContent ?? ''));
    }
    findField(scope, query) {
        const needle = query.trim().toLowerCase();
        // A blank query would `includes('')`-match the first field — reject it.
        if (!needle)
            return null;
        let fallback = null;
        for (const root of scope) {
            for (const el of this.collectFields(root)) {
                const desc = this.describeField(el);
                const haystacks = [desc.label, desc.name ?? ''].map((s) => s.toLowerCase());
                if (haystacks.some((h) => h === needle))
                    return el;
                if (!fallback && haystacks.some((h) => h && h.includes(needle)))
                    fallback = el;
            }
        }
        return fallback;
    }
    // ── Value setting ────────────────────────────────────────────────
    async setFieldValue(el, value) {
        const tag = el.tagName.toLowerCase();
        if (tag === 'input') {
            const input = el;
            if (input.type === 'radio') {
                return this.pickRadioOption(input, value);
            }
            if (input.type === 'checkbox') {
                const desired = /^(true|yes|1|on|checked)$/i.test(value);
                if (input.checked !== desired)
                    input.click();
                return true;
            }
            return this.setNativeValue(input, value);
        }
        if (tag === 'textarea')
            return this.setNativeValue(el, value);
        if (tag === 'select') {
            const select = el;
            const option = Array.from(select.options).find((o) => (o.textContent ?? '').trim().toLowerCase() === value.trim().toLowerCase());
            if (!option)
                throw new Error(`Option '${value}' not found.`);
            select.value = option.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }
        if (tag === 'nb-checkbox') {
            const input = el.querySelector('input[type=checkbox]');
            if (!input)
                return false;
            const desired = /^(true|yes|1|on|checked)$/i.test(value);
            if (input.checked !== desired)
                input.click();
            return true;
        }
        if (tag === 'nb-select')
            return this.pickOverlayOption(el, '.select-button', 'nb-option', value);
        if (tag === 'ng-select')
            return this.pickOverlayOption(el, '.ng-select-container', '.ng-option', value);
        if (el.isContentEditable) {
            el.focus();
            el.textContent = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
        }
        return false;
    }
    /**
     * Select the radio button of `input`'s `name` group (within the same form
     * root) whose value or associated label text matches `value`
     * (case-insensitive). Throws when no radio in the group matches.
     */
    pickRadioOption(input, value) {
        const needle = value.trim().toLowerCase();
        if (!needle)
            throw new Error('No value provided for the radio group.');
        const scope = input.form ?? input.closest('form') ?? document;
        const group = input.name
            ? Array.from(scope.querySelectorAll(`input[type=radio][name="${CSS.escape(input.name)}"]`))
            : [input];
        const match = group.find((radio) => radio.value.trim().toLowerCase() === needle ||
            this.findLabel(radio).trim().toLowerCase() === needle) ?? group.find((radio) => this.findLabel(radio).toLowerCase().includes(needle));
        if (!match) {
            throw new Error(`No radio option matching '${value}' found in group '${input.name || '(unnamed)'}'.`);
        }
        if (!match.checked)
            match.click();
        return true;
    }
    setNativeValue(el, value) {
        el.focus();
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.blur();
        el.dispatchEvent(new Event('blur', { bubbles: true }));
        return true;
    }
    /** Open a custom select widget and click the option matching `value`. */
    async pickOverlayOption(host, trigger, optionSelector, value) {
        const button = (host.querySelector(trigger) ?? host);
        button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        button.click();
        const needle = value.trim().toLowerCase();
        const option = await this.waitFor(() => {
            const candidates = Array.from(document.querySelectorAll(optionSelector)).filter((o) => this.isVisible(o));
            return (candidates.find((o) => (o.textContent ?? '').trim().toLowerCase() === needle) ??
                candidates.find((o) => (o.textContent ?? '').trim().toLowerCase().includes(needle)) ??
                null);
        }, 2000);
        if (!option) {
            // Close the overlay again to leave the page as we found it.
            document.activeElement?.blur?.();
            document.body.click();
            throw new Error(`Option '${value}' not found in the dropdown.`);
        }
        option.click();
        return true;
    }
    waitFor(probe, timeoutMs) {
        return new Promise((resolve) => {
            const started = Date.now();
            const tick = () => {
                const found = probe();
                if (found)
                    return resolve(found);
                if (Date.now() - started > timeoutMs)
                    return resolve(null);
                setTimeout(tick, 100);
            };
            tick();
        });
    }
    isVisible(el) {
        const html = el;
        return !!(html.offsetParent || html.offsetWidth || html.offsetHeight);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AgentFormBridgeService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AgentFormBridgeService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AgentFormBridgeService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=agent-form-bridge.service.js.map