import { __decorate, __metadata } from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { BaseEntityEnum } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { GenericFavoriteService, Store } from '@gauzy/ui-core/core';
import { ToastrService } from '@gauzy/ui-core/core';
import { filter, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@nebular/theme";
let FavoriteToggleComponent = class FavoriteToggleComponent extends TranslationBaseComponent {
    constructor(translateService, _genericFavoriteService, _store, _toastrService) {
        super(translateService);
        this.translateService = translateService;
        this._genericFavoriteService = _genericFavoriteService;
        this._store = _store;
        this._toastrService = _toastrService;
        this.size = 'small';
        this.status = 'basic';
        this.disabled = false;
        this.showLabel = false;
        this.spacing = 'default';
        this.favoriteToggled = new EventEmitter();
        this.favorites = [];
        this.loading = false;
    }
    ngOnInit() {
        // Watch for organization changes
        this._store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => {
            this.organization = organization;
            this._loadFavorites();
        }), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Load favorites for the current entity type
     */
    async _loadFavorites() {
        if (!this.organization || !this.entityType) {
            return;
        }
        try {
            this.favorites = await this._genericFavoriteService.loadFavorites(this.entityType, this.organization, this._store.user?.employee?.id);
        }
        catch (error) {
            console.error('Error loading favorites:', error);
            this.favorites = [];
        }
    }
    /**
     * Check if the current entity is a favorite
     */
    get isFavorite() {
        if (!this.entityId || !this.entityType || !this.favorites) {
            return false;
        }
        return this._genericFavoriteService.isFavorite(this.entityId, this.entityType, this.favorites);
    }
    /**
     * Get CSS classes for the button based on spacing preference
     */
    get buttonClasses() {
        const baseClass = 'favorite-toggle-button';
        const activeClass = this.isFavorite ? 'favorite-active' : '';
        const spacingClass = this.spacing === 'detail'
            ? 'favorite-toggle-detail'
            : this.spacing === 'list'
                ? 'favorite-toggle-list'
                : '';
        return [baseClass, activeClass, spacingClass].filter(Boolean).join(' ');
    }
    /**
     * Get the favorite object for the current entity
     */
    get favoriteObject() {
        if (!this.entityId || !this.entityType || !this.favorites) {
            return undefined;
        }
        return this._genericFavoriteService.getFavoriteForEntity(this.entityId, this.entityType, this.favorites);
    }
    /**
     * Get the appropriate icon based on favorite status
     */
    get icon() {
        return this.isFavorite ? 'star' : 'star-outline';
    }
    /**
     * Get the appropriate icon status based on favorite status
     */
    get iconStatus() {
        return this.isFavorite ? 'warning' : this.status;
    }
    /**
     * Get the appropriate tooltip text
     */
    get tooltipText() {
        const entityName = this.entityName || 'item';
        return this.isFavorite
            ? this.getTranslation('BUTTONS.REMOVE_FROM_FAVORITES', { name: entityName })
            : this.getTranslation('BUTTONS.ADD_TO_FAVORITES', { name: entityName });
    }
    /**
     * Get the appropriate button label
     */
    get buttonLabel() {
        return this.isFavorite
            ? this.getTranslation('BUTTONS.REMOVE_FROM_FAVORITES')
            : this.getTranslation('BUTTONS.ADD_TO_FAVORITES');
    }
    /**
     * Toggle favorite status
     */
    async toggleFavorite() {
        if (!this.entityType || !this.entityId || !this.organization || this.disabled || this.loading) {
            return;
        }
        this.loading = true;
        try {
            await this._genericFavoriteService.toggleFavorite(this.entityType, this.entityId, this.organization, this._store.user?.employee?.id, this.favorites);
            // Reload favorites to get updated state
            await this._loadFavorites();
            // Emit the toggle event
            this.favoriteToggled.emit({
                isFavorite: this.isFavorite,
                favorite: this.favoriteObject
            });
            // Show success message
            const entityName = this.entityName || 'item';
            const messageKey = this.isFavorite ? 'TOASTR.MESSAGE.FAVORITE_ADDED' : 'TOASTR.MESSAGE.FAVORITE_REMOVED';
            this._toastrService.success(messageKey, { name: entityName });
        }
        catch (error) {
            console.error('Error toggling favorite:', error);
            this._toastrService.danger('TOASTR.MESSAGE.FAVORITE_ERROR');
        }
        finally {
            this.loading = false;
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FavoriteToggleComponent, deps: [{ token: i1.TranslateService }, { token: i2.GenericFavoriteService }, { token: i2.Store }, { token: i2.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: FavoriteToggleComponent, isStandalone: false, selector: "ngx-favorite-toggle", inputs: { entityType: "entityType", entityId: "entityId", entityName: "entityName", size: "size", status: "status", disabled: "disabled", showLabel: "showLabel", spacing: "spacing" }, outputs: { favoriteToggled: "favoriteToggled" }, usesInheritance: true, ngImport: i0, template: "<button\n  type=\"button\"\n  nbButton\n  role=\"switch\"\n  [attr.aria-label]=\"tooltipText || (entityName ? 'Toggle ' + entityName : 'Toggle favorite')\"\n  [attr.aria-pressed]=\"isFavorite\"\n  [status]=\"status\"\n  [size]=\"size\"\n  [disabled]=\"disabled || loading\"\n  [nbTooltip]=\"tooltipText\"\n  (click)=\"toggleFavorite()\"\n  [class]=\"buttonClasses\"\n  >\n  <nb-icon [icon]=\"loading ? 'loader-outline' : icon\" [status]=\"iconStatus\" [class.spin]=\"loading\"></nb-icon>\n  @if (showLabel) {\n    <span class=\"button-label\">\n      {{ buttonLabel }}\n    </span>\n  }\n</button>\n", styles: [":host{display:inline-flex;align-items:center;justify-content:center}.favorite-toggle-button{transition:all .2s ease-in-out;margin:0 .25rem;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;vertical-align:middle;line-height:1}.favorite-toggle-button:hover{transform:scale(1.05)}.favorite-toggle-button.favorite-active nb-icon{color:var(--warning-color, #ffaa00)}.favorite-toggle-button .button-label{margin-left:.5rem}.favorite-toggle-button nb-icon{display:flex;align-items:center;justify-content:center}.favorite-toggle-button nb-icon.spin{animation:spin 1s linear infinite}.favorite-toggle-detail{margin-left:1rem;margin-right:.5rem}.favorite-toggle-list{margin:0 .125rem}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n"], dependencies: [{ kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }] }); }
};
FavoriteToggleComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        GenericFavoriteService,
        Store,
        ToastrService])
], FavoriteToggleComponent);
export { FavoriteToggleComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FavoriteToggleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-favorite-toggle', standalone: false, template: "<button\n  type=\"button\"\n  nbButton\n  role=\"switch\"\n  [attr.aria-label]=\"tooltipText || (entityName ? 'Toggle ' + entityName : 'Toggle favorite')\"\n  [attr.aria-pressed]=\"isFavorite\"\n  [status]=\"status\"\n  [size]=\"size\"\n  [disabled]=\"disabled || loading\"\n  [nbTooltip]=\"tooltipText\"\n  (click)=\"toggleFavorite()\"\n  [class]=\"buttonClasses\"\n  >\n  <nb-icon [icon]=\"loading ? 'loader-outline' : icon\" [status]=\"iconStatus\" [class.spin]=\"loading\"></nb-icon>\n  @if (showLabel) {\n    <span class=\"button-label\">\n      {{ buttonLabel }}\n    </span>\n  }\n</button>\n", styles: [":host{display:inline-flex;align-items:center;justify-content:center}.favorite-toggle-button{transition:all .2s ease-in-out;margin:0 .25rem;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;vertical-align:middle;line-height:1}.favorite-toggle-button:hover{transform:scale(1.05)}.favorite-toggle-button.favorite-active nb-icon{color:var(--warning-color, #ffaa00)}.favorite-toggle-button .button-label{margin-left:.5rem}.favorite-toggle-button nb-icon{display:flex;align-items:center;justify-content:center}.favorite-toggle-button nb-icon.spin{animation:spin 1s linear infinite}.favorite-toggle-detail{margin-left:1rem;margin-right:.5rem}.favorite-toggle-list{margin:0 .125rem}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.GenericFavoriteService }, { type: i2.Store }, { type: i2.ToastrService }], propDecorators: { entityType: [{
                type: Input
            }], entityId: [{
                type: Input
            }], entityName: [{
                type: Input
            }], size: [{
                type: Input
            }], status: [{
                type: Input
            }], disabled: [{
                type: Input
            }], showLabel: [{
                type: Input
            }], spacing: [{
                type: Input
            }], favoriteToggled: [{
                type: Output
            }] } });
//# sourceMappingURL=favorite-toggle.component.js.map