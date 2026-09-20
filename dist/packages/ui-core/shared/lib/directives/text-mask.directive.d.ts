import * as i0 from "@angular/core";
interface IMaskConfig {
    text: string;
    showOriginal: boolean;
    replacement: number;
}
export declare class TextMaskDirective {
    private readonly el;
    private readonly renderer;
    private readonly _config;
    private applyTextMask;
    private maskText;
    get config(): IMaskConfig;
    set config(partialConfig: Partial<IMaskConfig>);
    static ɵfac: i0.ɵɵFactoryDeclaration<TextMaskDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<TextMaskDirective, "[gaTextMask]", never, { "config": { "alias": "config"; "required": false; }; }, {}, never, never, true, never>;
}
export {};
