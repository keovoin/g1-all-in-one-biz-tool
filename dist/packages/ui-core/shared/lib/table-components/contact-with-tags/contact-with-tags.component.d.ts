import { Router } from '@angular/router';
import { NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { PictureNameTagsComponent } from '../picture-name-tags/picture-name-tags.component';
import * as i0 from "@angular/core";
export declare class ContactWithTagsComponent extends PictureNameTagsComponent {
    private readonly _router;
    readonly themeService: NbThemeService;
    readonly translateService: TranslateService;
    constructor(_router: Router, themeService: NbThemeService, translateService: TranslateService);
    navigateToContact(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContactWithTagsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ContactWithTagsComponent, "ga-contact-link-with-tags", never, {}, {}, never, never, false, never>;
}
