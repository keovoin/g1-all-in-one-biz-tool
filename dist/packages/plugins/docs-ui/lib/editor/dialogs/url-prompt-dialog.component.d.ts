import * as i0 from "@angular/core";
/**
 * Tiny URL prompt used by the slash commands Video / Embed (spec 05 §6.4).
 * Closes with the trimmed URL, or `null` on cancel.
 */
export declare class UrlPromptDialogComponent {
    titleKey: string;
    private readonly dialogRef;
    url: string;
    get isValid(): boolean;
    confirm(): void;
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UrlPromptDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UrlPromptDialogComponent, "gz-docs-url-prompt-dialog", never, { "titleKey": { "alias": "titleKey"; "required": false; }; }, {}, never, never, true, never>;
}
