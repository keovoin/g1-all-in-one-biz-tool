import * as i0 from "@angular/core";
/** A form field as observed on the current page. */
export interface IAgentFormField {
    /** Best-known label for the field (label element, placeholder or control name). */
    label: string;
    /** `formControlName` / `name` attribute when present. */
    name?: string;
    /** Field kind: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'checkbox' | 'radio' | 'select' | 'date' | ... */
    type: string;
    /** Current value (checkbox → 'true'/'false'; selects → selected label). */
    value: string;
    required: boolean;
    /** For selects: the visible option labels (when cheaply enumerable). */
    options?: string[];
}
/** A form as observed on the current page. */
export interface IAgentFormInfo {
    /** Index of the form on the page (use with fillForm/submitForm). */
    index: number;
    /** Heading or aria-label near the form, when detectable. */
    title?: string;
    fields: IAgentFormField[];
    /** Visible submit button labels. */
    submitLabels: string[];
}
/** One field-fill instruction from the agent. */
export interface IAgentFillInstruction {
    /** Field to target — matched against label, name and placeholder (case-insensitive). */
    field: string;
    /** Value to set. For checkboxes use 'true'/'false'; for selects the option label. */
    value: string;
}
export interface IAgentFillResult {
    filled: string[];
    failed: {
        field: string;
        reason: string;
    }[];
}
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
export declare class AgentFormBridgeService {
    /**
     * Describe the forms (and standalone fillable fields) on the current page.
     */
    readPage(): {
        url: string;
        title: string;
        forms: IAgentFormInfo[];
    };
    /**
     * Fill fields of a form on the current page.
     *
     * @param instructions Field/value pairs to apply.
     * @param formIndex Optional index from `readPage()`; when omitted, all forms are searched.
     */
    fillForm(instructions: IAgentFillInstruction[], formIndex?: number): Promise<IAgentFillResult>;
    /**
     * Click the submit button of a form. The AI agent must only call this
     * after explicit user approval (enforced by the chat tool-approval flow).
     */
    submitForm(formIndex?: number): {
        success: boolean;
        error?: string;
        buttonLabel?: string;
    };
    /** Forms first; fall back to dialog/page containers holding fillable fields. */
    private findFormRoots;
    private collectFields;
    private describeField;
    private findLabel;
    private findFormTitle;
    private findSubmitButtons;
    private findField;
    private setFieldValue;
    /**
     * Select the radio button of `input`'s `name` group (within the same form
     * root) whose value or associated label text matches `value`
     * (case-insensitive). Throws when no radio in the group matches.
     */
    private pickRadioOption;
    private setNativeValue;
    /** Open a custom select widget and click the option matching `value`. */
    private pickOverlayOption;
    private waitFor;
    private isVisible;
    static ɵfac: i0.ɵɵFactoryDeclaration<AgentFormBridgeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AgentFormBridgeService>;
}
