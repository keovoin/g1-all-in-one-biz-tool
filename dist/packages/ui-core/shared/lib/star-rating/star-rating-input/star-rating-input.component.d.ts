import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class StarRatingInputComponent implements ControlValueAccessor {
    stars: number[];
    currentRating: number;
    coloredStar: string;
    onChange: Function;
    highlightRating: number | null;
    writeValue(rating: number): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(): void;
    starSelect(index: number): void;
    starMouseEnter(index: number): void;
    starMouseLeave(): void;
    highlight(index: number): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<StarRatingInputComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<StarRatingInputComponent, "ga-star-rating-input", never, {}, {}, never, never, false, never>;
}
