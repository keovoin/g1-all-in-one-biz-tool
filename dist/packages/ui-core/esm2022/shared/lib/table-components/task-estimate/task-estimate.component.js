import { Component } from '@angular/core';
import moment from 'moment';
import * as i0 from "@angular/core";
export class TaskEstimateComponent {
    transformSeconds() {
        if (!this.value) {
            return '';
        }
        const duration = moment.duration(this.value, 'seconds');
        const days = duration.days();
        const hours = duration.hours() >= 10 ? duration.hours() : '0' + duration.hours();
        const minutes = duration.minutes() >= 10 ? duration.minutes() : '0' + duration.minutes();
        return `${days}d ${hours}h ${minutes}m`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskEstimateComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TaskEstimateComponent, isStandalone: false, selector: "ng-component", ngImport: i0, template: ` {{ transformSeconds() }} `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskEstimateComponent, decorators: [{
            type: Component,
            args: [{
                    template: ` {{ transformSeconds() }} `,
                    standalone: false
                }]
        }] });
//# sourceMappingURL=task-estimate.component.js.map