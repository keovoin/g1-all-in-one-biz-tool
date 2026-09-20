import { OnChanges, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { PictureNameTagsComponent } from '../picture-name-tags/picture-name-tags.component';
import * as i0 from "@angular/core";
export declare class OrganizationWithTagsComponent extends PictureNameTagsComponent implements OnChanges {
    protected readonly themeService: NbThemeService;
    protected readonly translateService: TranslateService;
    /** Set when the row's logo URL is present but fails to load. */
    logoFailed: boolean;
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * The row's logo.
     *
     * `imageUrl` is the column; `image.fullUrl` is the uploaded asset the Main tab
     * writes to. The card header and the Main tab both resolve the asset first and
     * fall back to the column, and this cell now agrees with them — reading only
     * `imageUrl` left every organization whose logo came from an upload showing no
     * logo in the list.
     */
    get logoUrl(): string;
    constructor(themeService: NbThemeService, translateService: TranslateService);
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationWithTagsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<OrganizationWithTagsComponent, "gauzy-organization-with-tags", never, {}, {}, never, never, false, never>;
}
