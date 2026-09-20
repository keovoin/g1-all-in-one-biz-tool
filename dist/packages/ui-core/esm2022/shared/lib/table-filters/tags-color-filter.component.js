import { Component } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import * as i0 from "@angular/core";
import * as i1 from "../tags/tags-color-input/tags-color-input.component";
export class TagsColorFilterComponent extends DefaultFilter {
    constructor() {
        super();
    }
    ngOnChanges(changes) { }
    /**
     *
     * @param tags
     */
    selectedTagsEvent(value) {
        this.column.filterFunction(value, this.column.id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsColorFilterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TagsColorFilterComponent, isStandalone: false, selector: "ga-tag-color-filter", usesInheritance: true, usesOnChanges: true, ngImport: i0, template: `
		<ga-tags-color-input
			(selectedTagsEvent)="selectedTagsEvent($event)"
			[multiple]="true"
			[isOrgLevel]="true"
			[label]="false"
		></ga-tags-color-input>
	`, isInline: true, dependencies: [{ kind: "component", type: i1.TagsColorInputComponent, selector: "ga-tags-color-input", inputs: ["selectedTags", "isOrgLevel", "isTenantLevel", "multiple", "label", "addTag"], outputs: ["selectedTagsEvent"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsColorFilterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-tag-color-filter',
                    template: `
		<ga-tags-color-input
			(selectedTagsEvent)="selectedTagsEvent($event)"
			[multiple]="true"
			[isOrgLevel]="true"
			[label]="false"
		></ga-tags-color-input>
	`,
                    standalone: false
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=tags-color-filter.component.js.map