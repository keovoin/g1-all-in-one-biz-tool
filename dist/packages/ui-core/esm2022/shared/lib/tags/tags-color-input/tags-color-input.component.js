import { __decorate, __metadata } from "tslib";
import { Component, Input, Output, EventEmitter, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbThemeService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import * as randomColor from 'randomcolor';
import { PermissionsEnum } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store, TagsService } from '@gauzy/ui-core/core';
import { PictureNameTagsComponent } from '../../table-components';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
import * as i4 from "@angular/forms";
import * as i5 from "@ng-select/ng-select";
import * as i6 from "@angular/common";
let TagsColorInputComponent = class TagsColorInputComponent extends PictureNameTagsComponent {
    get selectedTags() {
        return this._selectedTags;
    }
    set selectedTags(value) {
        this._selectedTags = value;
    }
    get isOrgLevel() {
        return this._isOrgLevel;
    }
    set isOrgLevel(value) {
        this._isOrgLevel = value;
    }
    get isTenantLevel() {
        return this._isTenantLevel;
    }
    set isTenantLevel(value) {
        this._isTenantLevel = value;
    }
    get multiple() {
        return this._multiple;
    }
    set multiple(value) {
        this._multiple = value;
    }
    get label() {
        return this._label;
    }
    set label(value) {
        this._label = value;
    }
    get addTag() {
        return this._addTag;
    }
    set addTag(value) {
        this._addTag = value;
    }
    onResize() {
        this.checkTagsFit(this.selectedTags);
    }
    constructor(tagsService, store, themeService, translateService, el, renderer) {
        super(themeService, translateService);
        this.tagsService = tagsService;
        this.store = store;
        this.themeService = themeService;
        this.translateService = translateService;
        this.el = el;
        this.renderer = renderer;
        this.subject$ = new Subject();
        this.tags = [];
        /*
         * Getter & Setter selected tags
         */
        this._selectedTags = [];
        /*
         * Getter & Setter for check organization level
         */
        this._isOrgLevel = false;
        /*
         * Getter & Setter for check tenant level
         */
        this._isTenantLevel = false;
        /*
         * Getter & Setter for multiple selection
         */
        this._multiple = true;
        /*
         * Getter & Setter for display label
         */
        this._label = true;
        /*
         * Getter & Setter for dynamic add tag option
         */
        this._addTag = true;
        this.selectedTagsEvent = new EventEmitter();
        this.selectedTagsOverflow = false;
        this.noOfTagsFits = 0;
        /**
         * Create new tag
         *
         * @param name
         * @returns
         */
        this.createNewTag = async (name) => {
            if (!name) {
                return;
            }
            this.loading = true;
            const { tenantId } = this.store.user;
            const { id: organizationId } = this.organization;
            try {
                return await firstValueFrom(this.tagsService.create({
                    name: name,
                    color: randomColor(),
                    description: '',
                    tenantId,
                    ...(this.isOrgLevel ? { organizationId } : {})
                }));
            }
            catch (error) {
                console.log('Error while creating tags', error);
            }
            finally {
                this.loading = false;
            }
        };
    }
    ngOnInit() {
        this.hasAddTag$ = this.store.userRolePermissions$.pipe(map(() => this.store.hasAnyPermission(PermissionsEnum.ALL_ORG_EDIT, PermissionsEnum.ORG_TAGS_ADD)));
        this.subject$
            .pipe(tap(() => this.getTagsByLevel()), untilDestroyed(this))
            .subscribe();
        this.store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.subject$.next(true)), untilDestroyed(this))
            .subscribe();
        this.selectedTagsEvent.pipe(untilDestroyed(this)).subscribe((selectedTags) => {
            this.checkTagsFit(selectedTags);
        });
    }
    /**
     * Get tags by level
     *
     * @returns
     */
    async getTagsByLevel() {
        if (!this.organization) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        if (this.isOrgLevel) {
            const { items } = await this.tagsService.getTagsByLevel({
                organizationId,
                tenantId
            });
            this.tags = items;
        }
        if (this.isTenantLevel) {
            const { items } = await this.tagsService.getTagsByLevel({
                tenantId
            });
            this.tags = items;
        }
    }
    /**
     * Check if selected tags fits on the screen
     */
    checkTagsFit(selectedTags) {
        if (!selectedTags) {
            this.selectedTagsOverflow = false;
            return;
        }
        const selectedContainer = this.el.nativeElement.querySelector('.ng-value-container');
        const containerWidth = selectedContainer.offsetWidth;
        // The row ends with a "+N" chip, so the space it needs has to be held back
        // before any tag is allowed to claim it. That used to be a flat 30px, which
        // is about what a single-digit "+9" measures — at ten or more hidden tags
        // the chip is wider than the room kept for it and the value container clips
        // it. Measured instead, against `selectedTags.length`: the count shown can
        // never exceed the total, so the total's width is an upper bound for it,
        // and taking the bound rather than the count is what keeps this from
        // depending on the `noOfTagsFits` it is being used to work out. Never below
        // the old 30px, which was also doing duty as general slack.
        let usedWidth = Math.max(this.getOverflowLabelWidth(selectedTags.length), 30);
        // A plain loop rather than the `reduce` that was here, which counted by
        // assigning `noOfTagsFits` the first index that did NOT fit while the value
        // still read 0 — so a first tag wider than the whole trigger left the count
        // at 0 on that pass and then picked up index 1 on the next, reporting one
        // fitting tag in the one case where none do.
        let fittingTags = 0;
        for (const tag of selectedTags) {
            usedWidth += this.getTagWidth(tag.name);
            // `>`, not `>=`: a tag that brings the row to exactly the container's
            // width is on screen. Counting it out was what produced a "+1" for a
            // tag that is right there in the trigger, in the case where the set
            // happens to fill the row precisely.
            if (usedWidth > containerWidth) {
                break;
            }
            fittingTags++;
        }
        this.selectedTagsOverflow = fittingTags < selectedTags.length;
        // At least one chip whenever anything is hidden. With none fitting, the
        // honest count is 0, but a trigger showing "+3" and no tag at all says less
        // than one truncated tag and "+2" does — and `.tag-label` already caps at
        // the trigger width and ellipsizes, so the one chip cannot overflow it.
        this.noOfTagsFits = this.selectedTagsOverflow ? Math.max(fittingTags, 1) : selectedTags.length;
    }
    /**
     * Width of the trailing "+N" chip, measured with the classes it actually renders with.
     *
     * @param count the largest number the chip could have to show
     */
    getOverflowLabelWidth(count) {
        const container = this.el.nativeElement;
        const testLabel = this.renderer.createElement('span');
        // Same element and same classes as the template's overflow chip, so the
        // padding, weight and caption font size it is drawn at are the ones being
        // measured rather than a guess at them.
        this.renderer.setProperty(testLabel, 'innerHTML', `+${count}`);
        ['ng-value-label', 'tag-overflow'].forEach((labelClass) => {
            this.renderer.addClass(testLabel, labelClass);
        });
        // Appended to the host, not to the value container: an inline-block's width
        // is its content either way, and this keeps the probe out of the row being
        // measured. Same approach as `getTagWidth`.
        this.renderer.appendChild(container, testLabel);
        // The 10px `getTagWidth` also adds: the chips are spaced by a `margin-right`
        // on their `.ng-value` wrapper, which no single element's width reports.
        const labelWidth = testLabel.offsetWidth + 10;
        this.renderer.removeChild(container, testLabel);
        return labelWidth;
    }
    getTagWidth(badgeText) {
        const container = this.el.nativeElement;
        const testBadge = this.renderer.createElement('nb-badge');
        // Set badge text
        this.renderer.setProperty(testBadge, 'innerHTML', badgeText);
        // Append test badge to the container (not in DOM)
        this.renderer.appendChild(container, testBadge);
        // Add multiple classes to badge
        const badgeClasses = ['tag-color', 'tag-label', 'status-basic', 'position-top', 'position-right'];
        badgeClasses.forEach((badgeClass) => {
            this.renderer.addClass(testBadge, badgeClass);
        });
        const badgeWidth = testBadge.offsetWidth + 10; // 10px is the padding
        // Remove test badge from container (not in DOM)
        this.renderer.removeChild(container, testBadge);
        return badgeWidth;
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsColorInputComponent, deps: [{ token: i1.TagsService }, { token: i1.Store }, { token: i2.NbThemeService }, { token: i3.TranslateService }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TagsColorInputComponent, isStandalone: false, selector: "ga-tags-color-input", inputs: { selectedTags: "selectedTags", isOrgLevel: "isOrgLevel", isTenantLevel: "isTenantLevel", multiple: "multiple", label: "label", addTag: "addTag" }, outputs: { selectedTagsEvent: "selectedTagsEvent" }, host: { listeners: { "window:resize": "onResize()" } }, usesInheritance: true, ngImport: i0, template: "<div>\n  @if (label) {\n    <label class=\"label\" for=\"addTags\">\n      {{ 'TAGS_PAGE.HEADER' | translate }}\n    </label>\n  }\n  <ng-select\n    id=\"addTags\"\n    [items]=\"tags\"\n    [multiple]=\"multiple\"\n    bindLabel=\"name\"\n    appendTo=\"body\"\n    [loading]=\"loading\"\n    [addTag]=\"(hasAddTag$ | async) && addTag ? createNewTag : null\"\n    (change)=\"selectedTagsEvent.emit(selectedTags)\"\n    [(ngModel)]=\"selectedTags\"\n    [closeOnSelect]=\"false\"\n    [placeholder]=\"'MENU.TAGS' | translate\"\n    >\n    <ng-template ng-option-tmp let-tag=\"item\" let-tag$=\"item$\">\n      <div class=\"tag-option\">\n        @if (multiple) {\n          <input type=\"checkbox\" class=\"tag-option-check\" [ngModel]=\"tag$.selected\" />\n        }\n        <nb-badge\n          [style.background]=\"background(tag.color)\"\n          class=\"tag-color\"\n        ></nb-badge>\n        <span class=\"text\">{{ tag.name }}</span>\n      </div>\n    </ng-template>\n    <ng-template ng-multi-label-tmp let-tags=\"selectedTags\" let-clear=\"clear\">\n      <!--\n        `selectedTagsOverflow`, not `noOfTagsFits`. The count is 0 both before the\n        first measurement and when nothing fits, and those two want opposite\n        branches: unmeasured means \"render them all\", nothing-fits means \"render\n        one and say how many are hidden\". Only the overflow flag tells them apart.\n      -->\n      @if (selectedTagsOverflow) {\n        @for (\n          item of selectedTags\n          | slice : 0 : noOfTagsFits || selectedTags.length\n          ; track\n          item) {\n          <div class=\"ng-value\">\n            <nb-badge class=\"tag-color tag-label\" [style.background]=\"background(item.color)\"\n            [style.color]=\"backgroundContrast(item.color)\" [text]=\"item.name\" (click)=\"clear(item)\"></nb-badge>\n          </div>\n        }\n        @if (selectedTags && selectedTags.length > noOfTagsFits) {\n          <div class=\"ng-value\">\n            <!--\n              The overflow indicator. It was a literal \"\u2026\", which says only that\n              something is hidden; the count says how much, which is the one thing\n              the row cannot show. `noOfTagsFits` is the number rendered above it,\n              so the difference is exactly what is not on screen.\n            -->\n            <span class=\"ng-value-label tag-overflow\">+{{ selectedTags.length - noOfTagsFits }}</span>\n          </div>\n        }\n      } @else {\n        @for (item of selectedTags; track item) {\n          <div class=\"ng-value\">\n            <nb-badge class=\"tag-color tag-label\"\n              [style.background]=\"background(item.color)\"\n              [style.color]=\"backgroundContrast(item.color)\"\n              [text]=\"item.name\"\n              (click)=\"clear(item)\"\n            ></nb-badge>\n          </div>\n        }\n      }\n\n    </ng-template>\n  </ng-select>\n</div>\n", styles: [".tag-option{display:flex;align-items:center;gap:.5rem;min-width:0}.tag-option-check{flex:none;width:.875rem;height:.875rem;min-height:0;margin:0;padding:0;border-radius:unset;box-shadow:none;background-color:transparent;accent-color:var(--color-primary-default);pointer-events:none}.tag-color:not(.tag-label){position:unset;flex:none;display:inline-block;width:.5rem;height:.5rem;margin:0;padding:0;border-radius:50%;box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.tag-label{position:unset;display:inline-block;max-width:100%;margin:0;padding:.125rem .5rem;font-size:var(--text-caption-font-size);font-weight:600;line-height:1rem;letter-spacing:0em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;cursor:pointer}.tag-overflow{display:inline-block;padding:.125rem .375rem;border-radius:var(--badge-border-radius);background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--gauzy-text-color-2);font-size:var(--text-caption-font-size);font-weight:600;line-height:1rem;vertical-align:middle}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{background-color:transparent;margin-right:.25rem}:host ::ng-deep .ng-select .ng-select-focused .ng-select-container:hover,:host ::ng-deep .ng-select .ng-select-focused .ng-select-container:focus,:host ::ng-deep .ng-select .ng-select-focused .ng-select-container:active,:host ::ng-deep .ng-select .ng-select-focused .ng-select-container:visited{box-shadow:var(--gauzy-shadow) inset!important}:host ::ng-deep .ng-select .ng-select-container{box-shadow:var(--gauzy-shadow) inset!important}.text{min-width:0;max-width:20rem;overflow:hidden;text-overflow:ellipsis}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i2.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "directive", type: i4.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i5.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i5.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i5.NgMultiLabelTemplateDirective, selector: "[ng-multi-label-tmp]" }, { kind: "pipe", type: i6.AsyncPipe, name: "async" }, { kind: "pipe", type: i6.SlicePipe, name: "slice" }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
};
TagsColorInputComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TagsService,
        Store,
        NbThemeService,
        TranslateService,
        ElementRef,
        Renderer2])
], TagsColorInputComponent);
export { TagsColorInputComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsColorInputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-tags-color-input', standalone: false, template: "<div>\n  @if (label) {\n    <label class=\"label\" for=\"addTags\">\n      {{ 'TAGS_PAGE.HEADER' | translate }}\n    </label>\n  }\n  <ng-select\n    id=\"addTags\"\n    [items]=\"tags\"\n    [multiple]=\"multiple\"\n    bindLabel=\"name\"\n    appendTo=\"body\"\n    [loading]=\"loading\"\n    [addTag]=\"(hasAddTag$ | async) && addTag ? createNewTag : null\"\n    (change)=\"selectedTagsEvent.emit(selectedTags)\"\n    [(ngModel)]=\"selectedTags\"\n    [closeOnSelect]=\"false\"\n    [placeholder]=\"'MENU.TAGS' | translate\"\n    >\n    <ng-template ng-option-tmp let-tag=\"item\" let-tag$=\"item$\">\n      <div class=\"tag-option\">\n        @if (multiple) {\n          <input type=\"checkbox\" class=\"tag-option-check\" [ngModel]=\"tag$.selected\" />\n        }\n        <nb-badge\n          [style.background]=\"background(tag.color)\"\n          class=\"tag-color\"\n        ></nb-badge>\n        <span class=\"text\">{{ tag.name }}</span>\n      </div>\n    </ng-template>\n    <ng-template ng-multi-label-tmp let-tags=\"selectedTags\" let-clear=\"clear\">\n      <!--\n        `selectedTagsOverflow`, not `noOfTagsFits`. The count is 0 both before the\n        first measurement and when nothing fits, and those two want opposite\n        branches: unmeasured means \"render them all\", nothing-fits means \"render\n        one and say how many are hidden\". Only the overflow flag tells them apart.\n      -->\n      @if (selectedTagsOverflow) {\n        @for (\n          item of selectedTags\n          | slice : 0 : noOfTagsFits || selectedTags.length\n          ; track\n          item) {\n          <div class=\"ng-value\">\n            <nb-badge class=\"tag-color tag-label\" [style.background]=\"background(item.color)\"\n            [style.color]=\"backgroundContrast(item.color)\" [text]=\"item.name\" (click)=\"clear(item)\"></nb-badge>\n          </div>\n        }\n        @if (selectedTags && selectedTags.length > noOfTagsFits) {\n          <div class=\"ng-value\">\n            <!--\n              The overflow indicator. It was a literal \"\u2026\", which says only that\n              something is hidden; the count says how much, which is the one thing\n              the row cannot show. `noOfTagsFits` is the number rendered above it,\n              so the difference is exactly what is not on screen.\n            -->\n            <span class=\"ng-value-label tag-overflow\">+{{ selectedTags.length - noOfTagsFits }}</span>\n          </div>\n        }\n      } @else {\n        @for (item of selectedTags; track item) {\n          <div class=\"ng-value\">\n            <nb-badge class=\"tag-color tag-label\"\n              [style.background]=\"background(item.color)\"\n              [style.color]=\"backgroundContrast(item.color)\"\n              [text]=\"item.name\"\n              (click)=\"clear(item)\"\n            ></nb-badge>\n          </div>\n        }\n      }\n\n    </ng-template>\n  </ng-select>\n</div>\n", styles: [".tag-option{display:flex;align-items:center;gap:.5rem;min-width:0}.tag-option-check{flex:none;width:.875rem;height:.875rem;min-height:0;margin:0;padding:0;border-radius:unset;box-shadow:none;background-color:transparent;accent-color:var(--color-primary-default);pointer-events:none}.tag-color:not(.tag-label){position:unset;flex:none;display:inline-block;width:.5rem;height:.5rem;margin:0;padding:0;border-radius:50%;box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.tag-label{position:unset;display:inline-block;max-width:100%;margin:0;padding:.125rem .5rem;font-size:var(--text-caption-font-size);font-weight:600;line-height:1rem;letter-spacing:0em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;cursor:pointer}.tag-overflow{display:inline-block;padding:.125rem .375rem;border-radius:var(--badge-border-radius);background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--gauzy-text-color-2);font-size:var(--text-caption-font-size);font-weight:600;line-height:1rem;vertical-align:middle}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{background-color:transparent;margin-right:.25rem}:host ::ng-deep .ng-select .ng-select-focused .ng-select-container:hover,:host ::ng-deep .ng-select .ng-select-focused .ng-select-container:focus,:host ::ng-deep .ng-select .ng-select-focused .ng-select-container:active,:host ::ng-deep .ng-select .ng-select-focused .ng-select-container:visited{box-shadow:var(--gauzy-shadow) inset!important}:host ::ng-deep .ng-select .ng-select-container{box-shadow:var(--gauzy-shadow) inset!important}.text{min-width:0;max-width:20rem;overflow:hidden;text-overflow:ellipsis}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TagsService }, { type: i1.Store }, { type: i2.NbThemeService }, { type: i3.TranslateService }, { type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { selectedTags: [{
                type: Input
            }], isOrgLevel: [{
                type: Input
            }], isTenantLevel: [{
                type: Input
            }], multiple: [{
                type: Input
            }], label: [{
                type: Input
            }], addTag: [{
                type: Input
            }], selectedTagsEvent: [{
                type: Output
            }], onResize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });
//# sourceMappingURL=tags-color-input.component.js.map