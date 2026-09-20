import { Component, Input } from '@angular/core';
import { ColorAdapter } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../../pipes/replace.pipe";
export class TaskBadgeViewComponent {
    constructor() {
        this._taskBadge = null;
    }
    get taskBadge() {
        return this._taskBadge;
    }
    set taskBadge(value) {
        this._taskBadge = value;
    }
    get textColor() {
        return ColorAdapter.contrast(this.taskBadge.color);
    }
    get backgroundColor() {
        return ColorAdapter.background(this.taskBadge.color);
    }
    get icon() {
        return this.taskBadge.fullIconUrl;
    }
    get name() {
        return this.taskBadge.name;
    }
    get imageFilter() {
        return ColorAdapter.hexToHsl(this.taskBadge.color);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskBadgeViewComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TaskBadgeViewComponent, isStandalone: false, selector: "gauzy-task-badge-view", inputs: { taskBadge: "taskBadge" }, ngImport: i0, template: "<div [style.background]=\"backgroundColor\" [style.color]=\"textColor\" class=\"badge-color\">\n\t<div [style.filter]=\"imageFilter\">\n\t\t<img [src]=\"icon\" alt=\"badge\" class=\"badge-img\" />\n\t</div>\n\t<div>{{ name | replace : '-' : ' ' | titlecase }}</div>\n</div>\n", styles: [":host{align-self:center}:host .badge-color{display:flex;padding:4px;width:fit-content;line-height:1;border-radius:var(--border-radius);white-space:nowrap;text-overflow:ellipsis;overflow:hidden;gap:4px;align-items:center;font-weight:600}:host .badge-color .badge-img{width:18px;height:100%}\n"], dependencies: [{ kind: "pipe", type: i1.TitleCasePipe, name: "titlecase" }, { kind: "pipe", type: i2.ReplacePipe, name: "replace" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskBadgeViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-task-badge-view', standalone: false, template: "<div [style.background]=\"backgroundColor\" [style.color]=\"textColor\" class=\"badge-color\">\n\t<div [style.filter]=\"imageFilter\">\n\t\t<img [src]=\"icon\" alt=\"badge\" class=\"badge-img\" />\n\t</div>\n\t<div>{{ name | replace : '-' : ' ' | titlecase }}</div>\n</div>\n", styles: [":host{align-self:center}:host .badge-color{display:flex;padding:4px;width:fit-content;line-height:1;border-radius:var(--border-radius);white-space:nowrap;text-overflow:ellipsis;overflow:hidden;gap:4px;align-items:center;font-weight:600}:host .badge-color .badge-img{width:18px;height:100%}\n"] }]
        }], propDecorators: { taskBadge: [{
                type: Input
            }] } });
//# sourceMappingURL=task-badge-view.component.js.map