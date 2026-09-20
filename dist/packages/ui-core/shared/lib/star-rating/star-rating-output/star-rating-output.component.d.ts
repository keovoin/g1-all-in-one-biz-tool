import * as i0 from "@angular/core";
export declare enum StarsIcon {
    FILLED = "star",
    HALF = "star-half",
    BORDERED = "star-outline"
}
export declare class StarRatingOutputComponent {
    isGridView: boolean;
    set rate(rate: number | null);
    stars: {
        icon: StarsIcon;
        active: boolean;
    }[];
    starsCount: number;
    static ɵfac: i0.ɵɵFactoryDeclaration<StarRatingOutputComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<StarRatingOutputComponent, "ga-star-rating-output", never, { "isGridView": { "alias": "isGridView"; "required": false; }; "rate": { "alias": "rate"; "required": false; }; }, {}, never, never, false, never>;
}
