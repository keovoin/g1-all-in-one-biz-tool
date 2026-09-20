import { Directive, ElementRef, Renderer2, Input, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class TextMaskDirective {
    constructor() {
        // Constructor to inject dependencies
        this.el = inject(ElementRef);
        this.renderer = inject(Renderer2);
        // Default configuration for text masking
        this._config = {
            text: '',
            showOriginal: false,
            replacement: 0.5
        };
    }
    // Apply the configured text mask to the element
    applyTextMask() {
        // Get the text based on the showOriginal configuration
        const text = this.config.showOriginal ? this.config.text : this.maskText(this.config.text);
        // Set the masked or original text to the element's inner text
        this.renderer.setProperty(this.el.nativeElement, 'innerText', text);
    }
    // Mask the given text based on the configured replacement percentage
    maskText(value) {
        // If text is not provided, return an empty string
        if (!value) {
            return '';
        }
        // Convert the text into an array of characters
        const text = value.split('');
        // Replace the specified percentage of characters with asterisks ('*')
        for (let i = 0; i < Math.floor(this.config.replacement * text.length); i++) {
            text[i] = '*';
        }
        // Join the array back into a string and return the masked text
        return text.join('');
    }
    // Getter for the current configuration
    get config() {
        return this._config;
    }
    // Setter for updating the configuration and applying the text mask
    set config(partialConfig) {
        // Merge the provided partial configuration with the default configuration
        Object.assign(this._config, partialConfig);
        // Apply the text mask with the updated configuration
        this.applyTextMask();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TextMaskDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: TextMaskDirective, isStandalone: true, selector: "[gaTextMask]", inputs: { config: "config" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TextMaskDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[gaTextMask]',
                    standalone: true
                }]
        }], propDecorators: { config: [{
                type: Input
            }] } });
//# sourceMappingURL=text-mask.directive.js.map