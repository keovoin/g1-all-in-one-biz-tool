import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { asyncScheduler, merge } from 'rxjs';
import { filter, observeOn, take, tap } from 'rxjs/operators';
import { ChangelogService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@nebular/theme";
import * as i3 from "@gauzy/ui-core/shared";
import * as i4 from "@angular/common";
import * as i5 from "@ngx-translate/core";
/** Tag of the Nebular sidebar this component is rendered into. */
export const CHANGELOG_SIDEBAR_TAG = 'changelog_sidebar';
let ChangelogComponent = class ChangelogComponent {
    constructor(_changelogService, _sidebarService) {
        this._changelogService = _changelogService;
        this._sidebarService = _sidebarService;
        this.items$ = this._changelogService.changelogs$;
    }
    ngOnInit() {
        this._changelogService.getAll({ isFeature: 0 }).pipe(untilDestroyed(this)).subscribe();
        this.syncState();
        merge(this._sidebarService.onToggle(), this._sidebarService.onExpand(), this._sidebarService.onCollapse(), this._sidebarService.onCompact())
            .pipe(filter(({ tag }) => tag === CHANGELOG_SIDEBAR_TAG), 
        // DO NOT make this synchronous. The header action calls the sidebar service from a
        // click handler, and `OutsideDirective` listens on `document:click` WITHOUT capture, so
        // it runs later in that same dispatch. If `state` were already true by then, the panel
        // would collapse on the very click that opened it. Same reasoning as the Quick Settings
        // panel next door, which hit exactly that.
        observeOn(asyncScheduler), untilDestroyed(this))
            .subscribe(() => this.syncState());
    }
    /**
     * Read the panel's current state. `take(1)` is what makes this safe to call repeatedly:
     * `getSidebarState()` returns a ReplaySubject that receives exactly one value.
     */
    syncState() {
        this._sidebarService
            .getSidebarState(CHANGELOG_SIDEBAR_TAG)
            .pipe(take(1), tap((state) => (this.state = state === 'expanded')), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Collapses rather than toggles: this is only ever called to close the panel,
     * from the X button and from a click outside it.
     */
    closeSidebar() {
        this._sidebarService.collapse(CHANGELOG_SIDEBAR_TAG);
    }
    /** `gauzyOutside` emits whether the click landed INSIDE the host, not outside it. */
    onClickOutside(clickedInside) {
        if (!clickedInside && this.state) {
            this.closeSidebar();
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ChangelogComponent, deps: [{ token: i1.ChangelogService }, { token: i2.NbSidebarService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ChangelogComponent, isStandalone: false, selector: "ngx-changelog", ngImport: i0, template: "<section class=\"whats-new-panel\" gauzyOutside (clickOutside)=\"onClickOutside($event)\">\n\t<header class=\"panel-header\">\n\t\t<h3 class=\"panel-title\">{{ 'CHANGELOG_MENU.HEADER' | translate }}</h3>\n\t\t<button\n\t\t\ttype=\"button\"\n\t\t\tclass=\"panel-close\"\n\t\t\t[attr.aria-label]=\"'BUTTONS.CLOSE' | translate\"\n\t\t\t(click)=\"closeSidebar()\"\n\t\t>\n\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t</button>\n\t</header>\n\n\t<div class=\"panel-body\">\n\t\t@for (item of items$ | async; track item.id) {\n\t\t\t<ngx-changelog-entry class=\"compact\" [class.last]=\"$last\" [entry]=\"item\" />\n\t\t}\n\t</div>\n</section>\n", styles: [":host{display:block;width:100%}.whats-new-panel{display:flex;flex-direction:column;padding:.375rem;box-sizing:border-box;font-family:var(--font-family-primary);font-size:.75rem;line-height:1.4;color:var(--text-basic-color)}.panel-header{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin:-.375rem -.375rem 0;padding:.5rem .625rem .5rem 1rem;border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));flex:0 0 auto;position:sticky;top:-.375rem;z-index:1;background-color:var(--background-basic-color-1)}.panel-title{margin:0;font-size:.875rem;font-weight:600;letter-spacing:-.006em;line-height:1.125rem;color:var(--text-basic-color)}.panel-close{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:1.375rem;height:1.375rem;padding:0;border:0;border-radius:var(--gauzy-radius-sm, 6px);background:transparent;color:var(--text-hint-color);cursor:pointer;transition:background-color .12s ease-in-out,color .12s ease-in-out}.panel-close:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}.panel-close:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:-2px}.panel-close nb-icon,.panel-close i{font-size:.875rem;width:.875rem;height:.875rem;line-height:1}.panel-body{flex:1 1 auto;min-height:0;padding-top:.375rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.OutsideDirective, selector: "[gauzyOutside]", outputs: ["clickOutside"] }, { kind: "component", type: i3.ChangelogEntryComponent, selector: "ngx-changelog-entry", inputs: ["entry"] }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
ChangelogComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [ChangelogService,
        NbSidebarService])
], ChangelogComponent);
export { ChangelogComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ChangelogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-changelog', standalone: false, template: "<section class=\"whats-new-panel\" gauzyOutside (clickOutside)=\"onClickOutside($event)\">\n\t<header class=\"panel-header\">\n\t\t<h3 class=\"panel-title\">{{ 'CHANGELOG_MENU.HEADER' | translate }}</h3>\n\t\t<button\n\t\t\ttype=\"button\"\n\t\t\tclass=\"panel-close\"\n\t\t\t[attr.aria-label]=\"'BUTTONS.CLOSE' | translate\"\n\t\t\t(click)=\"closeSidebar()\"\n\t\t>\n\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t</button>\n\t</header>\n\n\t<div class=\"panel-body\">\n\t\t@for (item of items$ | async; track item.id) {\n\t\t\t<ngx-changelog-entry class=\"compact\" [class.last]=\"$last\" [entry]=\"item\" />\n\t\t}\n\t</div>\n</section>\n", styles: [":host{display:block;width:100%}.whats-new-panel{display:flex;flex-direction:column;padding:.375rem;box-sizing:border-box;font-family:var(--font-family-primary);font-size:.75rem;line-height:1.4;color:var(--text-basic-color)}.panel-header{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin:-.375rem -.375rem 0;padding:.5rem .625rem .5rem 1rem;border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));flex:0 0 auto;position:sticky;top:-.375rem;z-index:1;background-color:var(--background-basic-color-1)}.panel-title{margin:0;font-size:.875rem;font-weight:600;letter-spacing:-.006em;line-height:1.125rem;color:var(--text-basic-color)}.panel-close{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:1.375rem;height:1.375rem;padding:0;border:0;border-radius:var(--gauzy-radius-sm, 6px);background:transparent;color:var(--text-hint-color);cursor:pointer;transition:background-color .12s ease-in-out,color .12s ease-in-out}.panel-close:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}.panel-close:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:-2px}.panel-close nb-icon,.panel-close i{font-size:.875rem;width:.875rem;height:.875rem;line-height:1}.panel-body{flex:1 1 auto;min-height:0;padding-top:.375rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.ChangelogService }, { type: i2.NbSidebarService }] });
//# sourceMappingURL=changelog.component.js.map