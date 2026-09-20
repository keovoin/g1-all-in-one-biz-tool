import * as i0 from "@angular/core";
import * as i1 from "./record-view.component";
import * as i2 from "./record-view-drawer.component";
import * as i3 from "@angular/common";
import * as i4 from "@nebular/theme";
import * as i5 from "../pipes/pipes.module";
import * as i6 from "../status-badge/status-badge.module";
import * as i7 from "../table-components/table-components.module";
import * as i8 from "@ngx-translate/core";
import * as i9 from "ngx-permissions";
/**
 * The shared read-only "View" surface: a descriptor-driven record renderer plus
 * the right-side drawer that hosts it for the simpler records.
 *
 * `TableComponentsModule` is imported for the tag / people / team / amount
 * renderers — a record must read the same in its View as in the grid row it was
 * selected from.
 */
export declare class RecordViewModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<RecordViewModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<RecordViewModule, [typeof i1.RecordViewComponent, typeof i2.RecordViewDrawerComponent], [typeof i3.CommonModule, typeof i4.NbButtonModule, typeof i4.NbIconModule, typeof i5.PipesModule, typeof i6.StatusBadgeModule, typeof i7.TableComponentsModule, typeof i8.TranslateModule, typeof i9.NgxPermissionsModule], [typeof i1.RecordViewComponent, typeof i2.RecordViewDrawerComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<RecordViewModule>;
}
