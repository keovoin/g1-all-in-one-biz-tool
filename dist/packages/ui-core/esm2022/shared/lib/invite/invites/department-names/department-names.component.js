import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class DepartmentNamesComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DepartmentNamesComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: DepartmentNamesComponent, isStandalone: false, selector: "ng-component", inputs: { rowData: "rowData" }, ngImport: i0, template: `
		<div>
		  @for (department of rowData.departmentNames; track department) {
		    <div
		      class="department-badge mr-2 mb-2 text-alternate"
		      >
		      {{ department }}
		    </div>
		  }
		</div>
		`, isInline: true, styles: [":host .department-badge{display:inline-block;border-radius:.25rem;padding:.25rem .4rem;background-color:var(--color-warning-default)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DepartmentNamesComponent, decorators: [{
            type: Component,
            args: [{ template: `
		<div>
		  @for (department of rowData.departmentNames; track department) {
		    <div
		      class="department-badge mr-2 mb-2 text-alternate"
		      >
		      {{ department }}
		    </div>
		  }
		</div>
		`, standalone: false, styles: [":host .department-badge{display:inline-block;border-radius:.25rem;padding:.25rem .4rem;background-color:var(--color-warning-default)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=department-names.component.js.map