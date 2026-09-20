import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgModel, UntypedFormGroup } from '@angular/forms';
import { SkillsService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@ng-select/ng-select";
import * as i3 from "@nebular/theme";
import * as i4 from "@angular/forms";
import * as i5 from "@ngx-translate/core";
export class SkillsInputComponent {
    constructor(skillsService) {
        this.skillsService = skillsService;
        this.selectedSkillsEvent = new EventEmitter();
    }
    async onChange() {
        const skills = [];
        for (const skill of this.selectedSkills) {
            const skillToCheck = await this.skillsService.findByName(skill.name);
            if (!skillToCheck) {
                const skillNew = await this.skillsService.insertSkill({
                    name: skill.name,
                    description: '',
                    color: ''
                });
                console.log(skillNew);
                if (skillNew.id) {
                    skills.push(skillNew);
                }
            }
            else {
                skills.push(skillToCheck);
            }
        }
        this.selectedSkillsEvent.emit(skills);
    }
    ngOnInit() {
        this.getAllSkills();
    }
    selectedSkillsHandler(ev) {
        this.form.get('selectedSkills').setValue(ev);
    }
    async getAllSkills() {
        const { items } = await this.skillsService.getAllSkills();
        this.skills = items;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SkillsInputComponent, deps: [{ token: i1.SkillsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: SkillsInputComponent, isStandalone: false, selector: "ngx-skills-input", inputs: { skills: "skills", form: "form", selectedSkills: "selectedSkills", items: "items" }, outputs: { selectedSkillsEvent: "selectedSkillsEvent" }, viewQueries: [{ propertyName: "shownInput", first: true, predicate: ["shownInput"], descendants: true, static: true }], ngImport: i0, template: "@if (form) {\n  <form [formGroup]=\"form\">\n    <label class=\"label\" for=\"addSkills\">\n      {{ 'SKILLS_PAGE.HEADER' | translate }}\n    </label>\n    <ng-select\n      bindLabel=\"name\"\n      [addTag]=\"true\"\n      formControlName=\"skills\"\n      [items]=\"skills\"\n      [(ngModel)]=\"selectedSkills\"\n      multiple=\"true\"\n      (change)=\"onChange()\"\n      placeholder=\" {{ 'SKILLS_PAGE.HEADER' | translate }} \"\n      appendTo=\"body\"\n      >\n      <ng-template ng-label-tmp let-item=\"item\" let-clear=\"clear\">\n        <span class=\"ng-value-label\"\n          ><nb-badge\n          width=\"20px\"\n          height=\"20px\"\n          [style.background]=\"item.color\"\n          text=\"{{ item.name }}\"\n          ></nb-badge\n        ></span>\n        <span\n          class=\"ng-value-icon right\"\n          (click)=\"clear(item)\"\n          aria-hidden=\"true\"\n          >\u00D7</span\n          >\n        </ng-template>\n        <ng-template ng-option-tmp let-item=\"item\">\n          <nb-badge\n            width=\"20px\"\n            height=\"20px\"\n            [style.background]=\"item.color\"\n            text=\"{{ item.name }}\"\n          ></nb-badge>\n        </ng-template>\n      </ng-select>\n    </form>\n  }\n\n  @if (!form) {\n    <form>\n      <label class=\"label\" for=\"addSkills\">\n        {{ 'SKILLS_PAGE.HEADER' | translate }}\n      </label>\n      <ng-select\n        [items]=\"skills\"\n        [(ngModel)]=\"selectedSkills\"\n        bindLabel=\"id\"\n        multiple=\"true\"\n        (change)=\"onChange()\"\n        [ngModelOptions]=\"{ standalone: true }\"\n        placeholder=\" {{ 'SKILLS_PAGE.HEADER' | translate }} \"\n        appendTo=\"body\"\n        >\n        <ng-template ng-label-tmp let-item=\"item\" let-clear=\"clear\">\n          <span class=\"ng-value-label\"\n            ><nb-badge\n            width=\"20px\"\n            height=\"20px\"\n            [style.background]=\"item.color\"\n            text=\"{{ item.name }}\"\n            ></nb-badge\n          ></span>\n          <span\n            class=\"ng-value-icon right\"\n            (click)=\"clear(item)\"\n            aria-hidden=\"true\"\n            >\u00D7</span\n            >\n          </ng-template>\n          <ng-template ng-option-tmp let-item=\"item\">\n            <nb-badge\n              width=\"20px\"\n              height=\"20px\"\n              [style.background]=\"item.color\"\n              text=\"{{ item.name }}\"\n            ></nb-badge>\n          </ng-template>\n        </ng-select>\n      </form>\n    }\n", styles: ["nb-badge ::ng-deep{position:static!important;color:#fff!important}\n"], dependencies: [{ kind: "component", type: i2.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i2.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i2.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "component", type: i3.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "directive", type: i4.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i4.NgForm, selector: "form:not([ngNoForm]):not([formGroup]):not([formArray]),ng-form,[ngForm]", inputs: ["ngFormOptions"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i4.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i4.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SkillsInputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-skills-input', standalone: false, template: "@if (form) {\n  <form [formGroup]=\"form\">\n    <label class=\"label\" for=\"addSkills\">\n      {{ 'SKILLS_PAGE.HEADER' | translate }}\n    </label>\n    <ng-select\n      bindLabel=\"name\"\n      [addTag]=\"true\"\n      formControlName=\"skills\"\n      [items]=\"skills\"\n      [(ngModel)]=\"selectedSkills\"\n      multiple=\"true\"\n      (change)=\"onChange()\"\n      placeholder=\" {{ 'SKILLS_PAGE.HEADER' | translate }} \"\n      appendTo=\"body\"\n      >\n      <ng-template ng-label-tmp let-item=\"item\" let-clear=\"clear\">\n        <span class=\"ng-value-label\"\n          ><nb-badge\n          width=\"20px\"\n          height=\"20px\"\n          [style.background]=\"item.color\"\n          text=\"{{ item.name }}\"\n          ></nb-badge\n        ></span>\n        <span\n          class=\"ng-value-icon right\"\n          (click)=\"clear(item)\"\n          aria-hidden=\"true\"\n          >\u00D7</span\n          >\n        </ng-template>\n        <ng-template ng-option-tmp let-item=\"item\">\n          <nb-badge\n            width=\"20px\"\n            height=\"20px\"\n            [style.background]=\"item.color\"\n            text=\"{{ item.name }}\"\n          ></nb-badge>\n        </ng-template>\n      </ng-select>\n    </form>\n  }\n\n  @if (!form) {\n    <form>\n      <label class=\"label\" for=\"addSkills\">\n        {{ 'SKILLS_PAGE.HEADER' | translate }}\n      </label>\n      <ng-select\n        [items]=\"skills\"\n        [(ngModel)]=\"selectedSkills\"\n        bindLabel=\"id\"\n        multiple=\"true\"\n        (change)=\"onChange()\"\n        [ngModelOptions]=\"{ standalone: true }\"\n        placeholder=\" {{ 'SKILLS_PAGE.HEADER' | translate }} \"\n        appendTo=\"body\"\n        >\n        <ng-template ng-label-tmp let-item=\"item\" let-clear=\"clear\">\n          <span class=\"ng-value-label\"\n            ><nb-badge\n            width=\"20px\"\n            height=\"20px\"\n            [style.background]=\"item.color\"\n            text=\"{{ item.name }}\"\n            ></nb-badge\n          ></span>\n          <span\n            class=\"ng-value-icon right\"\n            (click)=\"clear(item)\"\n            aria-hidden=\"true\"\n            >\u00D7</span\n            >\n          </ng-template>\n          <ng-template ng-option-tmp let-item=\"item\">\n            <nb-badge\n              width=\"20px\"\n              height=\"20px\"\n              [style.background]=\"item.color\"\n              text=\"{{ item.name }}\"\n            ></nb-badge>\n          </ng-template>\n        </ng-select>\n      </form>\n    }\n", styles: ["nb-badge ::ng-deep{position:static!important;color:#fff!important}\n"] }]
        }], ctorParameters: () => [{ type: i1.SkillsService }], propDecorators: { shownInput: [{
                type: ViewChild,
                args: ['shownInput', { static: true }]
            }], skills: [{
                type: Input,
                args: ['skills']
            }], form: [{
                type: Input,
                args: ['form']
            }], selectedSkills: [{
                type: Input,
                args: ['selectedSkills']
            }], items: [{
                type: Input,
                args: ['items']
            }], selectedSkillsEvent: [{
                type: Output
            }] } });
//# sourceMappingURL=skills-input.component.js.map