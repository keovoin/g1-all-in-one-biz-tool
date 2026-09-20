import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class ProjectNamesComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectNamesComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProjectNamesComponent, isStandalone: false, selector: "ng-component", inputs: { rowData: "rowData" }, ngImport: i0, template: `
		<div>
		  @for (project of rowData.projectNames; track project) {
		    <div
		      class="project-badge mr-2 mb-2 text-alternate"
		      >
		      {{ project }}
		    </div>
		  }
		</div>
		`, isInline: true, styles: [":host .project-badge{display:inline-block;border-radius:.25rem;padding:.25rem .4rem;background-color:var(--color-primary-default)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectNamesComponent, decorators: [{
            type: Component,
            args: [{ template: `
		<div>
		  @for (project of rowData.projectNames; track project) {
		    <div
		      class="project-badge mr-2 mb-2 text-alternate"
		      >
		      {{ project }}
		    </div>
		  }
		</div>
		`, standalone: false, styles: [":host .project-badge{display:inline-block;border-radius:.25rem;padding:.25rem .4rem;background-color:var(--color-primary-default)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=project-names.component.js.map