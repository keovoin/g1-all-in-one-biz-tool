import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class InfoBlockComponent {
    title: string;
    meta: string;
    value: string;
    color: string;
    blockType: boolean;
    accordion: boolean;
    listItem: boolean;
    openInfo: EventEmitter<void>;
    handleClick: () => void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InfoBlockComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InfoBlockComponent, "ga-info-block", never, { "title": { "alias": "title"; "required": false; }; "meta": { "alias": "meta"; "required": false; }; "value": { "alias": "value"; "required": false; }; "color": { "alias": "color"; "required": false; }; "blockType": { "alias": "blockType"; "required": false; }; "accordion": { "alias": "accordion"; "required": false; }; "listItem": { "alias": "listItem"; "required": false; }; }, { "openInfo": "openInfo"; }, never, ["*"], false, never>;
}
