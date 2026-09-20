import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export var StarsIcon;
(function (StarsIcon) {
    StarsIcon["FILLED"] = "star";
    StarsIcon["HALF"] = "star-half";
    StarsIcon["BORDERED"] = "star-outline";
})(StarsIcon || (StarsIcon = {}));
export class StarRatingOutputComponent {
    constructor() {
        this.isGridView = false;
        this.stars = [];
        this.starsCount = 5;
    }
    set rate(rate) {
        if (rate === null) {
            rate = 0;
        }
        const integerPart = Math.floor(rate);
        const doublePart = rate % 1;
        this.stars = [];
        for (let i = 0; i < this.starsCount; i++) {
            if (i > integerPart) {
                this.stars.push({ icon: StarsIcon.BORDERED, active: false });
                continue;
            }
            if (i < integerPart) {
                this.stars.push({ icon: StarsIcon.FILLED, active: true });
                continue;
            }
            if (0 <= doublePart && doublePart < 0.25) {
                this.stars.push({ icon: StarsIcon.BORDERED, active: false });
                continue;
            }
            if (doublePart >= 0.25 && doublePart < 0.75) {
                this.stars.push({ icon: StarsIcon.HALF, active: true });
                continue;
            }
            if (doublePart >= 0.75) {
                this.stars.push({ icon: StarsIcon.FILLED, active: true });
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StarRatingOutputComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: StarRatingOutputComponent, isStandalone: false, selector: "ga-star-rating-output", inputs: { isGridView: "isGridView", rate: "rate" }, ngImport: i0, template: "<div class=\"stars\" [class.gridView]=\"isGridView\">\n\t@for (star of stars; track star; let i = $index) {\n\t<div class=\"stars-icon\">\n\t\t<span\n\t\t\tclass=\"ion ion-md-{{ star.icon }} rating-star-icon\"\n\t\t\t[class.gold-star]=\"star.active\"\n\t\t\t[style.font-size]=\"isGridView ? '1rem' : '1.5rem'\"\n\t\t></span>\n\t</div>\n\t}\n</div>\n", styles: [".stars{position:relative;font-size:1.5rem;font-style:italic;background-size:contain;color:#ccc;margin:.3rem 0;display:flex;flex-direction:row;justify-content:flex-start;align-items:center}.gold-star{color:#ffa900}.grey-star{color:#ccc}.gridView{margin:0 0 .3rem}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StarRatingOutputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-star-rating-output', standalone: false, template: "<div class=\"stars\" [class.gridView]=\"isGridView\">\n\t@for (star of stars; track star; let i = $index) {\n\t<div class=\"stars-icon\">\n\t\t<span\n\t\t\tclass=\"ion ion-md-{{ star.icon }} rating-star-icon\"\n\t\t\t[class.gold-star]=\"star.active\"\n\t\t\t[style.font-size]=\"isGridView ? '1rem' : '1.5rem'\"\n\t\t></span>\n\t</div>\n\t}\n</div>\n", styles: [".stars{position:relative;font-size:1.5rem;font-style:italic;background-size:contain;color:#ccc;margin:.3rem 0;display:flex;flex-direction:row;justify-content:flex-start;align-items:center}.gold-star{color:#ffa900}.grey-star{color:#ccc}.gridView{margin:0 0 .3rem}\n"] }]
        }], propDecorators: { isGridView: [{
                type: Input
            }], rate: [{
                type: Input
            }] } });
//# sourceMappingURL=star-rating-output.component.js.map