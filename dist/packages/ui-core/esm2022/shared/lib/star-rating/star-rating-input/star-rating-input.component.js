import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
export class StarRatingInputComponent {
    constructor() {
        this.stars = [1, 2, 3, 4, 5];
        this.currentRating = 0;
        this.coloredStar = '';
        this.highlightRating = null;
    }
    writeValue(rating) {
        this.currentRating = rating || 0;
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched() { }
    starSelect(index) {
        this.currentRating = index;
        this.onChange(this.currentRating);
    }
    starMouseEnter(index) {
        this.highlightRating = index + 1;
    }
    starMouseLeave() {
        this.highlightRating = null;
    }
    highlight(index) {
        if (!this.highlightRating ||
            this.highlightRating < this.currentRating) {
            return index < this.currentRating;
        }
        return index < this.highlightRating;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StarRatingInputComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: StarRatingInputComponent, isStandalone: false, selector: "ga-star-rating-input", providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: StarRatingInputComponent,
                multi: true
            }
        ], ngImport: i0, template: "<div class=\"rating\">\n\t@for (star of stars; track star; let i = $index) {\n\t<div class=\"rating-star\">\n\t\t<span\n\t\t\tclass=\"ion rating-star-icon\"\n\t\t\t[class.ion-md-star]=\"highlight(i)\"\n\t\t\t[class.selected]=\"highlight(i)\"\n\t\t\t[class.ion-md-star-outline]=\"!highlight(i)\"\n\t\t\t(click)=\"starSelect(i + 1)\"\n\t\t\t(mouseenter)=\"starMouseEnter(i)\"\n\t\t\t(mouseleave)=\"starMouseLeave()\"\n\t\t></span>\n\t</div>\n\t}\n</div>\n", styles: [".rating{display:flex;flex-direction:row;justify-content:center;align-items:center}.rating-star-icon{font-size:1.5rem;color:#d2d2d2}.rating-star-icon:hover{color:#ffa900;cursor:pointer}.selected{color:#ffa900}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StarRatingInputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-star-rating-input', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: StarRatingInputComponent,
                            multi: true
                        }
                    ], standalone: false, template: "<div class=\"rating\">\n\t@for (star of stars; track star; let i = $index) {\n\t<div class=\"rating-star\">\n\t\t<span\n\t\t\tclass=\"ion rating-star-icon\"\n\t\t\t[class.ion-md-star]=\"highlight(i)\"\n\t\t\t[class.selected]=\"highlight(i)\"\n\t\t\t[class.ion-md-star-outline]=\"!highlight(i)\"\n\t\t\t(click)=\"starSelect(i + 1)\"\n\t\t\t(mouseenter)=\"starMouseEnter(i)\"\n\t\t\t(mouseleave)=\"starMouseLeave()\"\n\t\t></span>\n\t</div>\n\t}\n</div>\n", styles: [".rating{display:flex;flex-direction:row;justify-content:center;align-items:center}.rating-star-icon{font-size:1.5rem;color:#d2d2d2}.rating-star-icon:hover{color:#ffa900;cursor:pointer}.selected{color:#ffa900}\n"] }]
        }] });
//# sourceMappingURL=star-rating-input.component.js.map