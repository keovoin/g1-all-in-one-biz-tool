import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NbBadgeModule, NbButtonModule, NbCardModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { AvatarComponent } from './avatar/avatar.component';
import { BackNavigationComponent } from './back-navigation/back-navigation.component';
import { BadgeLabelComponent } from './badge-label/badge-label.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DashboardSkeletonComponent } from './dashboard-skeleton/dashboard-skeleton.component';
import { DateRangeTitleComponent } from './date-range-title/date-range-title.component';
import { HeaderTitleComponent } from './header-title/header-title.component';
import { LayoutSelectorComponent } from './layout-selector/layout-selector.component';
import { UnderConstructionPopupComponent } from './popup/popup.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { PipesModule } from '../pipes/pipes.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "ngx-permissions";
export const Components = [
    AlertModalComponent,
    AvatarComponent,
    BackNavigationComponent,
    BadgeLabelComponent,
    BreadcrumbComponent,
    DashboardSkeletonComponent,
    DateRangeTitleComponent,
    HeaderTitleComponent,
    LayoutSelectorComponent,
    SearchInputComponent,
    UnderConstructionPopupComponent
];
export class ComponentsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ComponentsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ComponentsModule, declarations: [AlertModalComponent,
            AvatarComponent,
            BackNavigationComponent,
            BadgeLabelComponent,
            BreadcrumbComponent,
            DashboardSkeletonComponent,
            DateRangeTitleComponent,
            HeaderTitleComponent,
            LayoutSelectorComponent,
            SearchInputComponent,
            UnderConstructionPopupComponent], imports: [CommonModule,
            // `ngx-breadcrumbs` renders `routerLink`s for the ancestor levels.
            RouterModule,
            NbCardModule,
            NbBadgeModule,
            NbButtonModule,
            NbTooltipModule,
            NbIconModule,
            PipesModule, i1.TranslateModule, i2.NgxPermissionsModule], exports: [AlertModalComponent,
            AvatarComponent,
            BackNavigationComponent,
            BadgeLabelComponent,
            BreadcrumbComponent,
            DashboardSkeletonComponent,
            DateRangeTitleComponent,
            HeaderTitleComponent,
            LayoutSelectorComponent,
            SearchInputComponent,
            UnderConstructionPopupComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ComponentsModule, imports: [CommonModule,
            // `ngx-breadcrumbs` renders `routerLink`s for the ancestor levels.
            RouterModule,
            NbCardModule,
            NbBadgeModule,
            NbButtonModule,
            NbTooltipModule,
            NbIconModule,
            PipesModule,
            TranslateModule.forChild(),
            NgxPermissionsModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ComponentsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        // `ngx-breadcrumbs` renders `routerLink`s for the ancestor levels.
                        RouterModule,
                        NbCardModule,
                        NbBadgeModule,
                        NbButtonModule,
                        NbTooltipModule,
                        NbIconModule,
                        PipesModule,
                        TranslateModule.forChild(),
                        NgxPermissionsModule.forChild()
                    ],
                    declarations: [...Components],
                    exports: [...Components]
                }]
        }] });
//# sourceMappingURL=components.module.js.map