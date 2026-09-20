import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { AngularNodeViewComponent } from '../node-view/angular-node-view-renderer';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
/**
 * Node view for `embedCard` (spec 05 §6.2): render-only bookmark card — generic
 * globe icon + domain (no external favicon fetch in v1), title (or URL) and an
 * open-in-new-tab affordance.
 */
export class EmbedCardNodeViewComponent extends AngularNodeViewComponent {
    get url() {
        return this.node().attrs['url'] || '';
    }
    get title() {
        return this.node().attrs['title'] || this.url;
    }
    get description() {
        return this.node().attrs['description'] ?? null;
    }
    get domain() {
        try {
            return new URL(this.url).hostname;
        }
        catch {
            return this.url;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmbedCardNodeViewComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: EmbedCardNodeViewComponent, isStandalone: true, selector: "gz-embed-card-node-view", usesInheritance: true, ngImport: i0, template: `
		<div class="gz-embed-card" [class.selected]="selected()" tabindex="0" role="group">
			<nb-icon class="gz-embed-icon" icon="globe-outline"></nb-icon>
			<div class="gz-embed-meta">
				<span class="gz-embed-title">{{ title }}</span>
				<span class="gz-embed-domain">{{ domain }}</span>
				<span class="gz-embed-description" *ngIf="description">{{ description }}</span>
			</div>
			<a
				class="gz-embed-open"
				[href]="url"
				target="_blank"
				rel="noopener noreferrer nofollow"
				[attr.aria-label]="'DOCS.EDITOR.EMBED.OPEN' | translate"
			>
				<nb-icon icon="external-link-outline"></nb-icon>
			</a>
		</div>
	`, isInline: true, styles: [":host{display:block}.gz-embed-card{display:flex;align-items:center;gap:.625rem;margin:.375rem 0;padding:.625rem .75rem;border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);background:var(--background-basic-color-1)}.gz-embed-card.selected{outline:2px solid var(--color-primary-transparent-300)}.gz-embed-icon{font-size:1.5rem;color:var(--text-hint-color)}.gz-embed-meta{flex:1;min-width:0;display:flex;flex-direction:column;gap:.125rem}.gz-embed-title{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gz-embed-domain,.gz-embed-description{font-size:.75rem;color:var(--text-hint-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gz-embed-open{color:var(--text-hint-color)}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmbedCardNodeViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-embed-card-node-view', standalone: true, imports: [CommonModule, TranslateModule, NbIconModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `
		<div class="gz-embed-card" [class.selected]="selected()" tabindex="0" role="group">
			<nb-icon class="gz-embed-icon" icon="globe-outline"></nb-icon>
			<div class="gz-embed-meta">
				<span class="gz-embed-title">{{ title }}</span>
				<span class="gz-embed-domain">{{ domain }}</span>
				<span class="gz-embed-description" *ngIf="description">{{ description }}</span>
			</div>
			<a
				class="gz-embed-open"
				[href]="url"
				target="_blank"
				rel="noopener noreferrer nofollow"
				[attr.aria-label]="'DOCS.EDITOR.EMBED.OPEN' | translate"
			>
				<nb-icon icon="external-link-outline"></nb-icon>
			</a>
		</div>
	`, styles: [":host{display:block}.gz-embed-card{display:flex;align-items:center;gap:.625rem;margin:.375rem 0;padding:.625rem .75rem;border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);background:var(--background-basic-color-1)}.gz-embed-card.selected{outline:2px solid var(--color-primary-transparent-300)}.gz-embed-icon{font-size:1.5rem;color:var(--text-hint-color)}.gz-embed-meta{flex:1;min-width:0;display:flex;flex-direction:column;gap:.125rem}.gz-embed-title{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gz-embed-domain,.gz-embed-description{font-size:.75rem;color:var(--text-hint-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gz-embed-open{color:var(--text-hint-color)}\n"] }]
        }] });
//# sourceMappingURL=embed-card-node-view.component.js.map