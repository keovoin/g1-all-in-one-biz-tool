import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DocumentKindEnum, DocumentKnowledgeStatusEnum, DocumentSourceEnum, DocumentStatusEnum } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DOCS_CONTENT_SEARCH_MIN_CHARS } from '../../docs.constants';
import { foldStatusFacetBuckets } from '../../models/docs-filter.model';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/forms";
import * as i3 from "@nebular/theme";
import * as i4 from "@gauzy/ui-core/shared";
import * as i5 from "./preset-chips.component";
import * as i6 from "./saved-views.component";
import * as i7 from "./facet-multiselect.component";
/**
 * Filter bar: multi-select facet dropdowns (with live counts), the create-capable
 * tag selector, created/updated date-range pickers, the name-vs-content search
 * scope toggle (content search needs ≥ `DOCS_CONTENT_SEARCH_MIN_CHARS` characters
 * — the backend's own minimum, never a locally chosen one) and clear-all. Emits a
 * single `filterChange` per mutation; the browse page owns debouncing + URL sync.
 */
export class DocsFilterBarComponent extends TranslationBaseComponent {
    constructor(translateService) {
        super(translateService);
        this.translateService = translateService;
        this.facets = null;
        this.value = null;
        /** Live URL query params — what the saved-views control captures and compares against. */
        this.urlParams = {};
        /**
         * Counts behind the preset chips, which are rendered on this band's first row.
         */
        this.presetCounts = null;
        this.filterChange = new EventEmitter();
        this.searchChange = new EventEmitter();
        this.clearAll = new EventEmitter();
        /** A saved view was applied — payload is the query-param merge patch. */
        this.applyView = new EventEmitter();
        /** Re-emitted from the preset chips on this band's first row. */
        this.presetToggled = new EventEmitter();
        /** Interpolated into `DOCS.FILTERS.SEARCH_CONTENT_DISABLED` so the hint can never quote a stale number. */
        this.contentSearchMinChars = DOCS_CONTENT_SEARCH_MIN_CHARS;
        // ─── Facet buckets (fall back to full enums when facets are unloaded) ───
        //
        // 🛑 These are consumed as `[buckets]="kindBuckets"` template bindings, which Angular
        // re-evaluates on EVERY change-detection cycle. They must therefore return a STABLE array
        // reference while `facets` is unchanged — a fresh `Object.values(...).map(...)` each cycle
        // fed the downstream select a new identity every tick, which recreated its option children
        // and self-retriggered change detection (the Documents-hub main-thread wedge). The cache
        // below is keyed on the `facets` INPUT REFERENCE: the parent (browse page) replaces
        // `facets` wholesale on each load, so identity equality is the correct and cheap
        // invalidation signal.
        this.bucketsCache = {
            source: undefined,
            buckets: {}
        };
        this.kindLabel = (value) => this.getTranslation(`DOCS.KIND.${value}`);
        this.statusLabel = (value) => this.getTranslation(`DOCS.STATUS.${value}`);
        this.knowledgeLabel = (value) => this.getTranslation(`DOCS.KNOWLEDGE.${value}`);
        this.sourceLabel = (value) => this.getTranslation(`DOCS.SOURCE.${value}`);
        // ─── Tag filter (ga-tags-color-input ↔ tagIds mapping) ──────
        //
        // The shared selector works in `ITag[]` while the filter state carries bare
        // ids (`tagIds` — the URL codec's `tags` CSV param). The getter below derives
        // ITag stubs from the ids, resolving names from the facet buckets and full
        // entities from whatever the selector last emitted (so a store round-trip
        // keeps chip colors). Same stable-reference rule as the buckets above:
        // `[selectedTags]` re-evaluates every cycle and the selector's input is a
        // plain setter, so a fresh array each cycle would re-enter it forever.
        this.tagEntityCache = new Map();
        this.tagStubsCache = { signature: '', tags: [] };
    }
    facetBuckets(key, compute) {
        if (this.bucketsCache.source !== this.facets) {
            this.bucketsCache = { source: this.facets, buckets: {} };
        }
        return (this.bucketsCache.buckets[key] ??= compute());
    }
    get kindBuckets() {
        return this.facetBuckets('kind', () => this.bucketsOrEnum(this.facets?.kind, Object.values(DocumentKindEnum)));
    }
    get statusBuckets() {
        // UPLOADED folds into PROCESSING — filters offer only READY/PROCESSING/FAILED,
        // and the Processing count carries the still-UPLOADED rows with it (R-STA-02).
        const values = [DocumentStatusEnum.READY, DocumentStatusEnum.PROCESSING, DocumentStatusEnum.FAILED];
        return this.facetBuckets('status', () => this.bucketsOrEnum(foldStatusFacetBuckets(this.facets?.status), values));
    }
    get knowledgeBuckets() {
        return this.facetBuckets('knowledge', () => this.bucketsOrEnum(this.facets?.knowledgeStatus, Object.values(DocumentKnowledgeStatusEnum)));
    }
    get sourceBuckets() {
        return this.facetBuckets('source', () => this.bucketsOrEnum(this.facets?.source, Object.values(DocumentSourceEnum)));
    }
    get categoryBuckets() {
        return this.facetBuckets('categories', () => this.facets?.categories ?? []);
    }
    get tagBuckets() {
        return this.facetBuckets('tags', () => this.facets?.tags ?? []);
    }
    get selectedTagEntities() {
        const ids = this.value?.tagIds ?? [];
        const buckets = this.tagBuckets;
        const signature = JSON.stringify([ids, buckets.map((bucket) => [bucket.value, bucket.label])]);
        if (signature !== this.tagStubsCache.signature) {
            this.tagStubsCache = {
                signature,
                tags: ids.map((id) => {
                    const known = this.tagEntityCache.get(String(id));
                    if (known)
                        return known;
                    const bucket = buckets.find((b) => String(b.value) === String(id));
                    // Deep-linked ids without a facet match stay selectable — a neutral
                    // chip beats silently dropping the filter. The color is explicit:
                    // the shared selector's `background()` maps a missing color to
                    // #000000, so a colorless stub rendered as a black chip. (Nebular's
                    // basic-600 gray — facet buckets carry no color to resolve from.)
                    return { id, name: bucket?.label ?? String(id), color: '#8f9bb3' };
                })
            };
        }
        return this.tagStubsCache.tags;
    }
    onTagsChange(tags) {
        const next = tags ?? [];
        next.forEach((tag) => {
            if (tag?.id)
                this.tagEntityCache.set(String(tag.id), tag);
        });
        this.filterChange.emit({ tagIds: next.map((tag) => tag.id) });
    }
    // ─── Emitters ────────────────────────────────────────────────
    onSearchInput(q) {
        this.searchChange.emit(q ?? '');
    }
    onSearchScopeToggle(content) {
        this.filterChange.emit({ searchIn: content ? 'content' : 'name' });
    }
    onFacet(field, values) {
        this.filterChange.emit({ [field]: values });
    }
    onCreatedRange(range) {
        this.filterChange.emit({
            createdFrom: this.toIsoDate(range?.start),
            createdTo: this.toIsoDate(range?.end)
        });
    }
    onUpdatedRange(range) {
        this.filterChange.emit({
            updatedFrom: this.toIsoDate(range?.start),
            updatedTo: this.toIsoDate(range?.end)
        });
    }
    get hasCreatedRange() {
        return !!(this.value?.createdFrom || this.value?.createdTo);
    }
    get hasUpdatedRange() {
        return !!(this.value?.updatedFrom || this.value?.updatedTo);
    }
    // The rangepicker directive owns the input's text, so clearing the state
    // alone would leave stale text behind — blank the input alongside the emit.
    clearCreatedRange(input) {
        input.value = '';
        this.onCreatedRange({});
    }
    clearUpdatedRange(input) {
        input.value = '';
        this.onUpdatedRange({});
    }
    onPresetToggled(preset) {
        this.presetToggled.emit(preset);
    }
    onClearAll() {
        this.clearAll.emit();
    }
    get contentSearchDisabled() {
        return (this.value?.q ?? '').length < this.contentSearchMinChars;
    }
    // ─── Internals ───────────────────────────────────────────────
    bucketsOrEnum(buckets, values) {
        if (buckets?.length)
            return buckets;
        return values.map((value) => ({ value, count: undefined }));
    }
    toIsoDate(date) {
        if (!date)
            return undefined;
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsFilterBarComponent, deps: [{ token: i1.TranslateService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsFilterBarComponent, isStandalone: false, selector: "gz-docs-filter-bar", inputs: { facets: "facets", value: "value", urlParams: "urlParams", presetCounts: "presetCounts" }, outputs: { filterChange: "filterChange", searchChange: "searchChange", clearAll: "clearAll", applyView: "applyView", presetToggled: "presetToggled" }, usesInheritance: true, ngImport: i0, template: "<div class=\"docs-filter-bar\">\n\t<div class=\"docs-filter-row docs-filter-row--primary\">\n\t\t<gz-docs-preset-chips\n\t\t\tclass=\"docs-filter-presets\"\n\t\t\t[counts]=\"presetCounts\"\n\t\t\t[active]=\"value?.preset\"\n\t\t\t(presetToggled)=\"onPresetToggled($event)\"\n\t\t></gz-docs-preset-chips>\n\n\t\t<div class=\"docs-filter-field docs-filter-field--search\">\n\t\t\t<label class=\"docs-filter-label docs-filter-label--hidden\" for=\"docs-filter-search\">{{\n\t\t\t\t'DOCS.FILTERS.SEARCH_LABEL' | translate\n\t\t\t}}</label>\n\t\t\t<span class=\"docs-filter-search-input\">\n\t\t\t\t<nb-icon icon=\"search-outline\"></nb-icon>\n\t\t\t\t<input\n\t\t\t\t\tnbInput\n\t\t\t\t\tfullWidth\n\t\t\t\t\ttype=\"text\"\n\t\t\t\t\tid=\"docs-filter-search\"\n\t\t\t\t\t[placeholder]=\"'DOCS.FILTERS.SEARCH_PLACEHOLDER' | translate\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.FILTERS.SEARCH_PLACEHOLDER' | translate\"\n\t\t\t\t\t[ngModel]=\"value?.q\"\n\t\t\t\t\t(ngModelChange)=\"onSearchInput($event)\"\n\t\t\t\t/>\n\t\t\t</span>\n\t\t</div>\n\n\t\t<div class=\"docs-filter-scope\">\n\t\t\t<nb-toggle\n\t\t\t\tlabelPosition=\"end\"\n\t\t\t\t[checked]=\"value?.searchIn === 'content'\"\n\t\t\t\t[disabled]=\"contentSearchDisabled && value?.searchIn !== 'content'\"\n\t\t\t\t(checkedChange)=\"onSearchScopeToggle($event)\"\n\t\t\t\t[nbTooltip]=\"\n\t\t\t\t\t(contentSearchDisabled\n\t\t\t\t\t\t? 'DOCS.FILTERS.SEARCH_CONTENT_DISABLED'\n\t\t\t\t\t\t: 'DOCS.FILTERS.SEARCH_CONTENT_HINT'\n\t\t\t\t\t) | translate: { min: contentSearchMinChars }\n\t\t\t\t\"\n\t\t\t>\n\t\t\t\t{{ 'DOCS.FILTERS.SEARCH_CONTENT' | translate }}\n\t\t\t</nb-toggle>\n\t\t</div>\n\t</div>\n\n\t<div class=\"docs-filter-row docs-filter-row--facets\">\n\t\t<div class=\"docs-filter-field\">\n\t\t\t<label class=\"docs-filter-label\">{{ 'DOCS.FILTERS.KIND' | translate }}</label>\n\t\t\t<gz-docs-facet-multiselect\n\t\t\t\tlabelKey=\"DOCS.FILTERS.KIND\"\n\t\t\t\t[buckets]=\"kindBuckets\"\n\t\t\t\t[selected]=\"value?.kind || []\"\n\t\t\t\t[labelFor]=\"kindLabel\"\n\t\t\t\t(selectionChange)=\"onFacet('kind', $event)\"\n\t\t\t></gz-docs-facet-multiselect>\n\t\t</div>\n\n\t\t<div class=\"docs-filter-field\">\n\t\t\t<label class=\"docs-filter-label\">{{ 'DOCS.FILTERS.STATUS' | translate }}</label>\n\t\t\t<gz-docs-facet-multiselect\n\t\t\t\tlabelKey=\"DOCS.FILTERS.STATUS\"\n\t\t\t\t[buckets]=\"statusBuckets\"\n\t\t\t\t[selected]=\"value?.status || []\"\n\t\t\t\t[labelFor]=\"statusLabel\"\n\t\t\t\t(selectionChange)=\"onFacet('status', $event)\"\n\t\t\t></gz-docs-facet-multiselect>\n\t\t</div>\n\n\t\t<div class=\"docs-filter-field\">\n\t\t\t<label class=\"docs-filter-label\">{{ 'DOCS.FILTERS.KNOWLEDGE' | translate }}</label>\n\t\t\t<gz-docs-facet-multiselect\n\t\t\t\tlabelKey=\"DOCS.FILTERS.KNOWLEDGE\"\n\t\t\t\t[buckets]=\"knowledgeBuckets\"\n\t\t\t\t[selected]=\"value?.knowledgeStatus || []\"\n\t\t\t\t[labelFor]=\"knowledgeLabel\"\n\t\t\t\t(selectionChange)=\"onFacet('knowledgeStatus', $event)\"\n\t\t\t></gz-docs-facet-multiselect>\n\t\t</div>\n\t</div>\n\n\t<div class=\"docs-filter-row docs-filter-row--facets\">\n\t\t<div class=\"docs-filter-field\">\n\t\t\t<label class=\"docs-filter-label\">{{ 'DOCS.FILTERS.SOURCE' | translate }}</label>\n\t\t\t<gz-docs-facet-multiselect\n\t\t\t\tlabelKey=\"DOCS.FILTERS.SOURCE\"\n\t\t\t\t[buckets]=\"sourceBuckets\"\n\t\t\t\t[selected]=\"value?.source || []\"\n\t\t\t\t[labelFor]=\"sourceLabel\"\n\t\t\t\t(selectionChange)=\"onFacet('source', $event)\"\n\t\t\t></gz-docs-facet-multiselect>\n\t\t</div>\n\n\t\t<div class=\"docs-filter-field\">\n\t\t\t<label class=\"docs-filter-label\">{{ 'DOCS.FILTERS.CATEGORY' | translate }}</label>\n\t\t\t<gz-docs-facet-multiselect\n\t\t\t\tlabelKey=\"DOCS.FILTERS.CATEGORY\"\n\t\t\t\t[buckets]=\"categoryBuckets\"\n\t\t\t\t[selected]=\"value?.categoryIds || []\"\n\t\t\t\t(selectionChange)=\"onFacet('categoryIds', $event)\"\n\t\t\t></gz-docs-facet-multiselect>\n\t\t</div>\n\n\t\t<!-- Tag \u2014 the shared create-capable selector; the filter state stays ids-only\n\t\t     (`tagIds`), the ITag[]\u2194ids mapping lives in the component class. -->\n\t\t<div class=\"docs-filter-field docs-filter-field--tags\">\n\t\t\t<label class=\"docs-filter-label\">{{ 'DOCS.FILTERS.TAG' | translate }}</label>\n\t\t\t<ga-tags-color-input\n\t\t\t\tclass=\"docs-filter-tags\"\n\t\t\t\t[multiple]=\"true\"\n\t\t\t\t[isOrgLevel]=\"true\"\n\t\t\t\t[label]=\"false\"\n\t\t\t\t[selectedTags]=\"selectedTagEntities\"\n\t\t\t\t(selectedTagsEvent)=\"onTagsChange($event)\"\n\t\t\t></ga-tags-color-input>\n\t\t</div>\n\t</div>\n\n\t<div class=\"docs-filter-row docs-filter-row--meta\">\n\t\t<div class=\"docs-filter-field\">\n\t\t\t<label class=\"docs-filter-label\" for=\"docs-filter-created-range\">{{\n\t\t\t\t'DOCS.FILTERS.CREATED_RANGE' | translate\n\t\t\t}}</label>\n\t\t\t<nb-form-field class=\"docs-filter-range-field\">\n\t\t\t\t<input\n\t\t\t\t\t#createdInput\n\t\t\t\t\tnbInput\n\t\t\t\t\tfullWidth\n\t\t\t\t\tclass=\"docs-filter-range\"\n\t\t\t\t\tid=\"docs-filter-created-range\"\n\t\t\t\t\t[placeholder]=\"'DOCS.FILTERS.CREATED_RANGE' | translate\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.FILTERS.CREATED_RANGE' | translate\"\n\t\t\t\t\t[nbDatepicker]=\"createdRange\"\n\t\t\t\t/>\n\t\t\t\t<!-- One suffix slot: calendar affordance while empty, clear once a range is set\n\t\t\t\t     (a set range could previously only be cleared via Clear all). -->\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tnbSuffix\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t[attr.aria-label]=\"\n\t\t\t\t\t\t(hasCreatedRange ? 'DOCS.FILTERS.CLEAR_RANGE' : 'DOCS.FILTERS.OPEN_CALENDAR') | translate\n\t\t\t\t\t\"\n\t\t\t\t\t(click)=\"hasCreatedRange ? clearCreatedRange(createdInput) : createdInput.focus()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon [icon]=\"hasCreatedRange ? 'close-outline' : 'calendar-outline'\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</nb-form-field>\n\t\t\t<nb-rangepicker #createdRange (rangeChange)=\"onCreatedRange($event)\"></nb-rangepicker>\n\t\t</div>\n\n\t\t<div class=\"docs-filter-field\">\n\t\t\t<label class=\"docs-filter-label\" for=\"docs-filter-updated-range\">{{\n\t\t\t\t'DOCS.FILTERS.UPDATED_RANGE' | translate\n\t\t\t}}</label>\n\t\t\t<nb-form-field class=\"docs-filter-range-field\">\n\t\t\t\t<input\n\t\t\t\t\t#updatedInput\n\t\t\t\t\tnbInput\n\t\t\t\t\tfullWidth\n\t\t\t\t\tclass=\"docs-filter-range\"\n\t\t\t\t\tid=\"docs-filter-updated-range\"\n\t\t\t\t\t[placeholder]=\"'DOCS.FILTERS.UPDATED_RANGE' | translate\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.FILTERS.UPDATED_RANGE' | translate\"\n\t\t\t\t\t[nbDatepicker]=\"updatedRange\"\n\t\t\t\t/>\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tnbSuffix\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t[attr.aria-label]=\"\n\t\t\t\t\t\t(hasUpdatedRange ? 'DOCS.FILTERS.CLEAR_RANGE' : 'DOCS.FILTERS.OPEN_CALENDAR') | translate\n\t\t\t\t\t\"\n\t\t\t\t\t(click)=\"hasUpdatedRange ? clearUpdatedRange(updatedInput) : updatedInput.focus()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon [icon]=\"hasUpdatedRange ? 'close-outline' : 'calendar-outline'\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</nb-form-field>\n\t\t\t<nb-rangepicker #updatedRange (rangeChange)=\"onUpdatedRange($event)\"></nb-rangepicker>\n\t\t</div>\n\n\t\t<div class=\"docs-filter-field docs-filter-field--actions\">\n\t\t\t<gz-docs-saved-views [params]=\"urlParams\" (applyView)=\"applyView.emit($event)\"></gz-docs-saved-views>\n\n\t\t\t<button type=\"button\" nbButton ghost size=\"small\" (click)=\"onClearAll()\">\n\t\t\t\t<nb-icon icon=\"close-circle-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.FILTERS.CLEAR_ALL' | translate }}\n\t\t\t</button>\n\t\t</div>\n\t</div>\n</div>\n", styles: [":host{display:block;min-width:0}.docs-filter-bar{display:flex;flex-direction:column;gap:.625rem;min-width:0;--docs-filter-control-height: var(--docs-control-height, 2rem);--docs-filter-column-min: 7.5rem}.docs-filter-row{width:100%;min-width:0}.docs-filter-row--primary{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem .75rem}.docs-filter-presets{flex:0 1 auto;min-width:0}.docs-filter-row--facets{display:grid;grid-template-columns:repeat(3,minmax(var(--docs-filter-column-min, 7.5rem),1fr));gap:.5rem .75rem}.docs-filter-row--meta{display:grid;grid-template-columns:minmax(var(--docs-filter-column-min, 7.5rem),1fr) minmax(var(--docs-filter-column-min, 7.5rem),1fr) auto;gap:.5rem .75rem;align-items:end}.docs-filter-field{display:flex;flex-direction:column;justify-content:flex-end;gap:.25rem;min-width:0}.docs-filter-field>gz-docs-facet-multiselect,.docs-filter-field>ga-tags-color-input,.docs-filter-field>.docs-filter-search-input{display:block;width:100%;min-width:0}.docs-filter-field>nb-rangepicker{display:none}.docs-filter-field--search{flex:1 1 18rem;min-width:12rem}.docs-filter-scope{flex:0 0 auto;display:flex;align-items:center;min-height:var(--docs-filter-control-height)}.docs-filter-scope nb-toggle{font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color));white-space:nowrap}.docs-filter-field--actions{flex-direction:row;align-items:center;gap:.375rem;min-width:0}.docs-filter-label{display:block;min-width:0;font-size:var(--docs-label-size, .6875rem);font-weight:500;line-height:1;color:var(--docs-text-muted, var(--text-hint-color));white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.docs-filter-label--hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.docs-filter-search-input{position:relative;display:block;min-width:0}.docs-filter-search-input nb-icon{position:absolute;inset-inline-start:.5rem;top:50%;transform:translateY(-50%);font-size:.875rem;color:var(--docs-text-muted, var(--text-hint-color));pointer-events:none}.docs-filter-search-input input[nbInput]{width:100%;min-width:0;padding-inline-start:1.875rem}.docs-filter-bar input[nbInput]{height:var(--docs-filter-control-height);min-height:var(--docs-filter-control-height);border-radius:var(--docs-radius, .375rem);font-size:var(--docs-body-size, .8125rem)}.docs-filter-bar ::ng-deep .ng-select .ng-select-container{min-height:var(--docs-filter-control-height);border:0;background-color:var(--docs-surface, var(--gauzy-card-1))!important;border-radius:var(--docs-radius, .375rem)!important;box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18))!important;color:var(--docs-text, var(--text-basic-color));font-size:var(--docs-body-size, .8125rem)}.docs-filter-bar ::ng-deep .docs-filter-range-field button[nbSuffix]{height:var(--docs-filter-control-height);min-height:var(--docs-filter-control-height);width:var(--docs-filter-control-height);padding:0}.docs-filter-range-field{width:100%}.docs-filter-range{width:100%;padding:.375rem 2rem .375rem .625rem!important;text-overflow:ellipsis}.docs-filter-tags{display:block;width:100%;min-width:0}.docs-filter-tags ::ng-deep .tag-label{font-size:.75rem!important;line-height:1rem;padding:.125rem .5rem}.docs-filter-tags ::ng-deep .tag-color{width:.75rem;height:.75rem;margin-inline:.5rem}.docs-filter-field--actions button[nbButton]{display:inline-flex;align-items:center;gap:.375rem;height:1.5rem!important;min-height:1.5rem!important;padding-inline:.375rem!important;border-radius:var(--docs-radius, .375rem);font-size:.6875rem!important;white-space:nowrap}.docs-filter-field--actions button[nbButton] nb-icon{margin:0;font-size:.875rem}.docs-filter-bar ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:wrap;align-content:center;padding-block:.1875rem;padding-inline-start:.375rem;gap:.1875rem}.docs-filter-bar ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{display:inline-flex;align-items:center;max-width:100%;min-width:0;height:1.25rem;margin:0;padding:0;border:0;border-radius:var(--docs-radius, .375rem);background:var(--color-primary-default);color:var(--text-control-color, #ffffff);font-size:.6875rem;font-weight:500;line-height:1}.docs-filter-bar ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value-label{min-width:0;padding:0 .375rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-filter-bar ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value-icon{order:1;padding:0 .3125rem 0 0;border:0!important;color:inherit;opacity:.8}.docs-filter-bar ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value-icon:hover{background:transparent;opacity:1}.docs-filter-bar ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{padding:0;color:var(--docs-text-muted, var(--text-hint-color));font-size:var(--docs-body-size, .8125rem);line-height:1.25rem}.docs-filter-bar ::ng-deep .ng-select .ng-value-container .ng-input>input{font-size:var(--docs-body-size, .8125rem)}.docs-filter-bar ::ng-deep .ng-select .ng-arrow-wrapper,.docs-filter-bar ::ng-deep .ng-select .ng-clear-wrapper{color:var(--docs-text-muted, var(--text-hint-color))}.docs-filter-tags ::ng-deep .ng-value .tag-color.tag-label{position:static;display:inline-flex;align-items:center;width:auto;max-width:8rem;height:1.25rem;margin:0;padding:0 .375rem;border-radius:var(--docs-radius, .375rem);font-size:.6875rem;font-weight:500;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transform:none}.docs-filter-tags ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:wrap;align-content:center;gap:.1875rem;padding-block:.1875rem;padding-inline-start:.375rem}.docs-filter-tags ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin:0;background:transparent}@media(max-width:1199px){.docs-filter-row--facets{grid-template-columns:repeat(2,minmax(0,1fr))}.docs-filter-presets{flex:1 1 100%}}@media(max-width:991px){.docs-filter-row--meta{grid-template-columns:repeat(2,minmax(0,1fr))}.docs-filter-field--actions{grid-column:1/-1;justify-content:flex-start}}@media(max-width:575px){.docs-filter-bar{--docs-filter-column-min: 0}.docs-filter-field--search{flex:1 1 100%;min-width:0}.docs-filter-scope{flex:1 1 100%;min-height:0}}\n"], dependencies: [{ kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i3.NbDatepickerDirective, selector: "input[nbDatepicker]", inputs: ["nbDatepicker"] }, { kind: "component", type: i3.NbRangepickerComponent, selector: "nb-rangepicker", inputs: ["range"], outputs: ["rangeChange"] }, { kind: "component", type: i3.NbFormFieldComponent, selector: "nb-form-field" }, { kind: "directive", type: i3.NbSuffixDirective, selector: "[nbSuffix]" }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i3.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "directive", type: i3.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i4.TagsColorInputComponent, selector: "ga-tags-color-input", inputs: ["selectedTags", "isOrgLevel", "isTenantLevel", "multiple", "label", "addTag"], outputs: ["selectedTagsEvent"] }, { kind: "component", type: i5.PresetChipsComponent, selector: "gz-docs-preset-chips", inputs: ["counts", "active"], outputs: ["presetToggled"] }, { kind: "component", type: i6.SavedViewsComponent, selector: "gz-docs-saved-views", inputs: ["params"], outputs: ["applyView"] }, { kind: "component", type: i7.FacetMultiselectComponent, selector: "gz-docs-facet-multiselect", inputs: ["buckets", "selected", "labelKey", "labelFor"], outputs: ["selectionChange"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsFilterBarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-filter-bar', standalone: false, template: "<div class=\"docs-filter-bar\">\n\t<div class=\"docs-filter-row docs-filter-row--primary\">\n\t\t<gz-docs-preset-chips\n\t\t\tclass=\"docs-filter-presets\"\n\t\t\t[counts]=\"presetCounts\"\n\t\t\t[active]=\"value?.preset\"\n\t\t\t(presetToggled)=\"onPresetToggled($event)\"\n\t\t></gz-docs-preset-chips>\n\n\t\t<div class=\"docs-filter-field docs-filter-field--search\">\n\t\t\t<label class=\"docs-filter-label docs-filter-label--hidden\" for=\"docs-filter-search\">{{\n\t\t\t\t'DOCS.FILTERS.SEARCH_LABEL' | translate\n\t\t\t}}</label>\n\t\t\t<span class=\"docs-filter-search-input\">\n\t\t\t\t<nb-icon icon=\"search-outline\"></nb-icon>\n\t\t\t\t<input\n\t\t\t\t\tnbInput\n\t\t\t\t\tfullWidth\n\t\t\t\t\ttype=\"text\"\n\t\t\t\t\tid=\"docs-filter-search\"\n\t\t\t\t\t[placeholder]=\"'DOCS.FILTERS.SEARCH_PLACEHOLDER' | translate\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.FILTERS.SEARCH_PLACEHOLDER' | translate\"\n\t\t\t\t\t[ngModel]=\"value?.q\"\n\t\t\t\t\t(ngModelChange)=\"onSearchInput($event)\"\n\t\t\t\t/>\n\t\t\t</span>\n\t\t</div>\n\n\t\t<div class=\"docs-filter-scope\">\n\t\t\t<nb-toggle\n\t\t\t\tlabelPosition=\"end\"\n\t\t\t\t[checked]=\"value?.searchIn === 'content'\"\n\t\t\t\t[disabled]=\"contentSearchDisabled && value?.searchIn !== 'content'\"\n\t\t\t\t(checkedChange)=\"onSearchScopeToggle($event)\"\n\t\t\t\t[nbTooltip]=\"\n\t\t\t\t\t(contentSearchDisabled\n\t\t\t\t\t\t? 'DOCS.FILTERS.SEARCH_CONTENT_DISABLED'\n\t\t\t\t\t\t: 'DOCS.FILTERS.SEARCH_CONTENT_HINT'\n\t\t\t\t\t) | translate: { min: contentSearchMinChars }\n\t\t\t\t\"\n\t\t\t>\n\t\t\t\t{{ 'DOCS.FILTERS.SEARCH_CONTENT' | translate }}\n\t\t\t</nb-toggle>\n\t\t</div>\n\t</div>\n\n\t<div class=\"docs-filter-row docs-filter-row--facets\">\n\t\t<div class=\"docs-filter-field\">\n\t\t\t<label class=\"docs-filter-label\">{{ 'DOCS.FILTERS.KIND' | translate }}</label>\n\t\t\t<gz-docs-facet-multiselect\n\t\t\t\tlabelKey=\"DOCS.FILTERS.KIND\"\n\t\t\t\t[buckets]=\"kindBuckets\"\n\t\t\t\t[selected]=\"value?.kind || []\"\n\t\t\t\t[labelFor]=\"kindLabel\"\n\t\t\t\t(selectionChange)=\"onFacet('kind', $event)\"\n\t\t\t></gz-docs-facet-multiselect>\n\t\t</div>\n\n\t\t<div class=\"docs-filter-field\">\n\t\t\t<label class=\"docs-filter-label\">{{ 'DOCS.FILTERS.STATUS' | translate }}</label>\n\t\t\t<gz-docs-facet-multiselect\n\t\t\t\tlabelKey=\"DOCS.FILTERS.STATUS\"\n\t\t\t\t[buckets]=\"statusBuckets\"\n\t\t\t\t[selected]=\"value?.status || []\"\n\t\t\t\t[labelFor]=\"statusLabel\"\n\t\t\t\t(selectionChange)=\"onFacet('status', $event)\"\n\t\t\t></gz-docs-facet-multiselect>\n\t\t</div>\n\n\t\t<div class=\"docs-filter-field\">\n\t\t\t<label class=\"docs-filter-label\">{{ 'DOCS.FILTERS.KNOWLEDGE' | translate }}</label>\n\t\t\t<gz-docs-facet-multiselect\n\t\t\t\tlabelKey=\"DOCS.FILTERS.KNOWLEDGE\"\n\t\t\t\t[buckets]=\"knowledgeBuckets\"\n\t\t\t\t[selected]=\"value?.knowledgeStatus || []\"\n\t\t\t\t[labelFor]=\"knowledgeLabel\"\n\t\t\t\t(selectionChange)=\"onFacet('knowledgeStatus', $event)\"\n\t\t\t></gz-docs-facet-multiselect>\n\t\t</div>\n\t</div>\n\n\t<div class=\"docs-filter-row docs-filter-row--facets\">\n\t\t<div class=\"docs-filter-field\">\n\t\t\t<label class=\"docs-filter-label\">{{ 'DOCS.FILTERS.SOURCE' | translate }}</label>\n\t\t\t<gz-docs-facet-multiselect\n\t\t\t\tlabelKey=\"DOCS.FILTERS.SOURCE\"\n\t\t\t\t[buckets]=\"sourceBuckets\"\n\t\t\t\t[selected]=\"value?.source || []\"\n\t\t\t\t[labelFor]=\"sourceLabel\"\n\t\t\t\t(selectionChange)=\"onFacet('source', $event)\"\n\t\t\t></gz-docs-facet-multiselect>\n\t\t</div>\n\n\t\t<div class=\"docs-filter-field\">\n\t\t\t<label class=\"docs-filter-label\">{{ 'DOCS.FILTERS.CATEGORY' | translate }}</label>\n\t\t\t<gz-docs-facet-multiselect\n\t\t\t\tlabelKey=\"DOCS.FILTERS.CATEGORY\"\n\t\t\t\t[buckets]=\"categoryBuckets\"\n\t\t\t\t[selected]=\"value?.categoryIds || []\"\n\t\t\t\t(selectionChange)=\"onFacet('categoryIds', $event)\"\n\t\t\t></gz-docs-facet-multiselect>\n\t\t</div>\n\n\t\t<!-- Tag \u2014 the shared create-capable selector; the filter state stays ids-only\n\t\t     (`tagIds`), the ITag[]\u2194ids mapping lives in the component class. -->\n\t\t<div class=\"docs-filter-field docs-filter-field--tags\">\n\t\t\t<label class=\"docs-filter-label\">{{ 'DOCS.FILTERS.TAG' | translate }}</label>\n\t\t\t<ga-tags-color-input\n\t\t\t\tclass=\"docs-filter-tags\"\n\t\t\t\t[multiple]=\"true\"\n\t\t\t\t[isOrgLevel]=\"true\"\n\t\t\t\t[label]=\"false\"\n\t\t\t\t[selectedTags]=\"selectedTagEntities\"\n\t\t\t\t(selectedTagsEvent)=\"onTagsChange($event)\"\n\t\t\t></ga-tags-color-input>\n\t\t</div>\n\t</div>\n\n\t<div class=\"docs-filter-row docs-filter-row--meta\">\n\t\t<div class=\"docs-filter-field\">\n\t\t\t<label class=\"docs-filter-label\" for=\"docs-filter-created-range\">{{\n\t\t\t\t'DOCS.FILTERS.CREATED_RANGE' | translate\n\t\t\t}}</label>\n\t\t\t<nb-form-field class=\"docs-filter-range-field\">\n\t\t\t\t<input\n\t\t\t\t\t#createdInput\n\t\t\t\t\tnbInput\n\t\t\t\t\tfullWidth\n\t\t\t\t\tclass=\"docs-filter-range\"\n\t\t\t\t\tid=\"docs-filter-created-range\"\n\t\t\t\t\t[placeholder]=\"'DOCS.FILTERS.CREATED_RANGE' | translate\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.FILTERS.CREATED_RANGE' | translate\"\n\t\t\t\t\t[nbDatepicker]=\"createdRange\"\n\t\t\t\t/>\n\t\t\t\t<!-- One suffix slot: calendar affordance while empty, clear once a range is set\n\t\t\t\t     (a set range could previously only be cleared via Clear all). -->\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tnbSuffix\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t[attr.aria-label]=\"\n\t\t\t\t\t\t(hasCreatedRange ? 'DOCS.FILTERS.CLEAR_RANGE' : 'DOCS.FILTERS.OPEN_CALENDAR') | translate\n\t\t\t\t\t\"\n\t\t\t\t\t(click)=\"hasCreatedRange ? clearCreatedRange(createdInput) : createdInput.focus()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon [icon]=\"hasCreatedRange ? 'close-outline' : 'calendar-outline'\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</nb-form-field>\n\t\t\t<nb-rangepicker #createdRange (rangeChange)=\"onCreatedRange($event)\"></nb-rangepicker>\n\t\t</div>\n\n\t\t<div class=\"docs-filter-field\">\n\t\t\t<label class=\"docs-filter-label\" for=\"docs-filter-updated-range\">{{\n\t\t\t\t'DOCS.FILTERS.UPDATED_RANGE' | translate\n\t\t\t}}</label>\n\t\t\t<nb-form-field class=\"docs-filter-range-field\">\n\t\t\t\t<input\n\t\t\t\t\t#updatedInput\n\t\t\t\t\tnbInput\n\t\t\t\t\tfullWidth\n\t\t\t\t\tclass=\"docs-filter-range\"\n\t\t\t\t\tid=\"docs-filter-updated-range\"\n\t\t\t\t\t[placeholder]=\"'DOCS.FILTERS.UPDATED_RANGE' | translate\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.FILTERS.UPDATED_RANGE' | translate\"\n\t\t\t\t\t[nbDatepicker]=\"updatedRange\"\n\t\t\t\t/>\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tnbSuffix\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t[attr.aria-label]=\"\n\t\t\t\t\t\t(hasUpdatedRange ? 'DOCS.FILTERS.CLEAR_RANGE' : 'DOCS.FILTERS.OPEN_CALENDAR') | translate\n\t\t\t\t\t\"\n\t\t\t\t\t(click)=\"hasUpdatedRange ? clearUpdatedRange(updatedInput) : updatedInput.focus()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon [icon]=\"hasUpdatedRange ? 'close-outline' : 'calendar-outline'\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</nb-form-field>\n\t\t\t<nb-rangepicker #updatedRange (rangeChange)=\"onUpdatedRange($event)\"></nb-rangepicker>\n\t\t</div>\n\n\t\t<div class=\"docs-filter-field docs-filter-field--actions\">\n\t\t\t<gz-docs-saved-views [params]=\"urlParams\" (applyView)=\"applyView.emit($event)\"></gz-docs-saved-views>\n\n\t\t\t<button type=\"button\" nbButton ghost size=\"small\" (click)=\"onClearAll()\">\n\t\t\t\t<nb-icon icon=\"close-circle-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.FILTERS.CLEAR_ALL' | translate }}\n\t\t\t</button>\n\t\t</div>\n\t</div>\n</div>\n", styles: [":host{display:block;min-width:0}.docs-filter-bar{display:flex;flex-direction:column;gap:.625rem;min-width:0;--docs-filter-control-height: var(--docs-control-height, 2rem);--docs-filter-column-min: 7.5rem}.docs-filter-row{width:100%;min-width:0}.docs-filter-row--primary{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem .75rem}.docs-filter-presets{flex:0 1 auto;min-width:0}.docs-filter-row--facets{display:grid;grid-template-columns:repeat(3,minmax(var(--docs-filter-column-min, 7.5rem),1fr));gap:.5rem .75rem}.docs-filter-row--meta{display:grid;grid-template-columns:minmax(var(--docs-filter-column-min, 7.5rem),1fr) minmax(var(--docs-filter-column-min, 7.5rem),1fr) auto;gap:.5rem .75rem;align-items:end}.docs-filter-field{display:flex;flex-direction:column;justify-content:flex-end;gap:.25rem;min-width:0}.docs-filter-field>gz-docs-facet-multiselect,.docs-filter-field>ga-tags-color-input,.docs-filter-field>.docs-filter-search-input{display:block;width:100%;min-width:0}.docs-filter-field>nb-rangepicker{display:none}.docs-filter-field--search{flex:1 1 18rem;min-width:12rem}.docs-filter-scope{flex:0 0 auto;display:flex;align-items:center;min-height:var(--docs-filter-control-height)}.docs-filter-scope nb-toggle{font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color));white-space:nowrap}.docs-filter-field--actions{flex-direction:row;align-items:center;gap:.375rem;min-width:0}.docs-filter-label{display:block;min-width:0;font-size:var(--docs-label-size, .6875rem);font-weight:500;line-height:1;color:var(--docs-text-muted, var(--text-hint-color));white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.docs-filter-label--hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.docs-filter-search-input{position:relative;display:block;min-width:0}.docs-filter-search-input nb-icon{position:absolute;inset-inline-start:.5rem;top:50%;transform:translateY(-50%);font-size:.875rem;color:var(--docs-text-muted, var(--text-hint-color));pointer-events:none}.docs-filter-search-input input[nbInput]{width:100%;min-width:0;padding-inline-start:1.875rem}.docs-filter-bar input[nbInput]{height:var(--docs-filter-control-height);min-height:var(--docs-filter-control-height);border-radius:var(--docs-radius, .375rem);font-size:var(--docs-body-size, .8125rem)}.docs-filter-bar ::ng-deep .ng-select .ng-select-container{min-height:var(--docs-filter-control-height);border:0;background-color:var(--docs-surface, var(--gauzy-card-1))!important;border-radius:var(--docs-radius, .375rem)!important;box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18))!important;color:var(--docs-text, var(--text-basic-color));font-size:var(--docs-body-size, .8125rem)}.docs-filter-bar ::ng-deep .docs-filter-range-field button[nbSuffix]{height:var(--docs-filter-control-height);min-height:var(--docs-filter-control-height);width:var(--docs-filter-control-height);padding:0}.docs-filter-range-field{width:100%}.docs-filter-range{width:100%;padding:.375rem 2rem .375rem .625rem!important;text-overflow:ellipsis}.docs-filter-tags{display:block;width:100%;min-width:0}.docs-filter-tags ::ng-deep .tag-label{font-size:.75rem!important;line-height:1rem;padding:.125rem .5rem}.docs-filter-tags ::ng-deep .tag-color{width:.75rem;height:.75rem;margin-inline:.5rem}.docs-filter-field--actions button[nbButton]{display:inline-flex;align-items:center;gap:.375rem;height:1.5rem!important;min-height:1.5rem!important;padding-inline:.375rem!important;border-radius:var(--docs-radius, .375rem);font-size:.6875rem!important;white-space:nowrap}.docs-filter-field--actions button[nbButton] nb-icon{margin:0;font-size:.875rem}.docs-filter-bar ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:wrap;align-content:center;padding-block:.1875rem;padding-inline-start:.375rem;gap:.1875rem}.docs-filter-bar ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{display:inline-flex;align-items:center;max-width:100%;min-width:0;height:1.25rem;margin:0;padding:0;border:0;border-radius:var(--docs-radius, .375rem);background:var(--color-primary-default);color:var(--text-control-color, #ffffff);font-size:.6875rem;font-weight:500;line-height:1}.docs-filter-bar ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value-label{min-width:0;padding:0 .375rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-filter-bar ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value-icon{order:1;padding:0 .3125rem 0 0;border:0!important;color:inherit;opacity:.8}.docs-filter-bar ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value-icon:hover{background:transparent;opacity:1}.docs-filter-bar ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{padding:0;color:var(--docs-text-muted, var(--text-hint-color));font-size:var(--docs-body-size, .8125rem);line-height:1.25rem}.docs-filter-bar ::ng-deep .ng-select .ng-value-container .ng-input>input{font-size:var(--docs-body-size, .8125rem)}.docs-filter-bar ::ng-deep .ng-select .ng-arrow-wrapper,.docs-filter-bar ::ng-deep .ng-select .ng-clear-wrapper{color:var(--docs-text-muted, var(--text-hint-color))}.docs-filter-tags ::ng-deep .ng-value .tag-color.tag-label{position:static;display:inline-flex;align-items:center;width:auto;max-width:8rem;height:1.25rem;margin:0;padding:0 .375rem;border-radius:var(--docs-radius, .375rem);font-size:.6875rem;font-weight:500;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transform:none}.docs-filter-tags ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:wrap;align-content:center;gap:.1875rem;padding-block:.1875rem;padding-inline-start:.375rem}.docs-filter-tags ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin:0;background:transparent}@media(max-width:1199px){.docs-filter-row--facets{grid-template-columns:repeat(2,minmax(0,1fr))}.docs-filter-presets{flex:1 1 100%}}@media(max-width:991px){.docs-filter-row--meta{grid-template-columns:repeat(2,minmax(0,1fr))}.docs-filter-field--actions{grid-column:1/-1;justify-content:flex-start}}@media(max-width:575px){.docs-filter-bar{--docs-filter-column-min: 0}.docs-filter-field--search{flex:1 1 100%;min-width:0}.docs-filter-scope{flex:1 1 100%;min-height:0}}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }], propDecorators: { facets: [{
                type: Input
            }], value: [{
                type: Input
            }], urlParams: [{
                type: Input
            }], presetCounts: [{
                type: Input
            }], filterChange: [{
                type: Output
            }], searchChange: [{
                type: Output
            }], clearAll: [{
                type: Output
            }], applyView: [{
                type: Output
            }], presetToggled: [{
                type: Output
            }] } });
//# sourceMappingURL=docs-filter-bar.component.js.map