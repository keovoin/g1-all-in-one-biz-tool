import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "../../directives/img.directive";
/**
 * The shared treatment for "several people in one grid cell".
 *
 * Renders a single-line horizontal group: the first `maxNames` people as a
 * small round avatar with their name beside it, everything after that as
 * avatar-only, and whatever still does not fit as a `+N` chip. Nothing here
 * has a box or a border of its own, and names truncate on available WIDTH
 * rather than on a character count, so a short name always renders in full.
 *
 * All metrics come from the `gauzy-people-*` tokens in the shared
 * `$gauzy-density` map (`themes.scss`), so the group stays in step with table
 * density and works in all registered themes.
 */
export class PeopleListComponent {
    constructor() {
        /** People rendered with their name next to the avatar. */
        this.named = [];
        /** People rendered as an avatar only, after the named ones. */
        this.stacked = [];
        /** People that did not fit at all — surfaced through the `+N` chip. */
        this.overflow = [];
        this._items = [];
        this._maxNames = 2;
        this._maxAvatars = 3;
        /**
         * Allow the group to wrap onto several lines. Off inside data grids (a cell
         * must cost the row one line box), on inside cards, where there is room.
         */
        this.wrap = false;
        /** Emitted when a person is activated. Empty for people without an id. */
        this.selectPerson = new EventEmitter();
    }
    /**
     * The people to render. Accepts an array (or a single object) of employees,
     * member join rows, or `{ name, imageUrl }` records.
     */
    set people(value) {
        this._items = PeopleListComponent.normalize(value);
        this.split();
    }
    /** How many people get their name shown before the group falls back to avatars. */
    set maxNames(value) {
        this._maxNames = Math.max(1, Number(value) || 1);
        this.split();
    }
    get maxNames() {
        return this._maxNames;
    }
    /** How many avatar-only people are shown after the named ones. */
    set maxAvatars(value) {
        this._maxAvatars = Math.max(0, Number(value) || 0);
        this.split();
    }
    get maxAvatars() {
        return this._maxAvatars;
    }
    /** Total number of people handed to the component. */
    get total() {
        return this._items.length;
    }
    /** How many people the `+N` chip stands for. */
    get overflowCount() {
        return this.overflow.length;
    }
    /** Tooltip for the `+N` chip: the names it is hiding. */
    get overflowNames() {
        return this.overflow.map((person) => person.name).join(', ');
    }
    /**
     * Activates a person, unless they have no employee page to open.
     *
     * @param person The person that was clicked.
     */
    onSelect(person) {
        if (!person?.id) {
            return;
        }
        this.selectPerson.emit(person);
    }
    /**
     * Falls back to the initials bubble when an avatar image fails to load.
     * Employee image URLs routinely outlive the file they point at, and a broken
     * image icon is worse than initials.
     *
     * @param person The person whose image failed to load.
     */
    onImageError(person) {
        person.imageUrl = null;
    }
    /**
     * Splits the normalized people into the named / avatar-only / overflow buckets.
     *
     * Up to `maxNames` people keep their name. Past that only the first person
     * does, so a row always shows at least one name, and the rest collapse into
     * avatars plus a `+N` chip.
     */
    split() {
        const items = this._items;
        if (items.length <= this._maxNames) {
            this.named = items;
            this.stacked = [];
            this.overflow = [];
            return;
        }
        this.named = items.slice(0, 1);
        const rest = items.slice(1);
        this.stacked = rest.slice(0, this._maxAvatars);
        this.overflow = rest.slice(this._maxAvatars);
    }
    /**
     * Normalizes an arbitrary collection of people into renderable items.
     *
     * @param value An array (or single object) of employees / member join rows.
     * @returns The renderable items, skipping anything we cannot name.
     */
    static normalize(value) {
        const source = Array.isArray(value) ? value : value ? [value] : [];
        const items = [];
        source.forEach((entry, index) => {
            const item = PeopleListComponent.toItem(entry, index);
            if (item) {
                items.push(item);
            }
        });
        return items;
    }
    /**
     * Builds a single renderable item out of one entry.
     *
     * @param entry An employee, a member join row, or a `{ name, imageUrl }` record.
     * @param index Position in the source collection, used to keep track keys unique.
     * @returns The item, or `null` when the entry carries no name to show.
     */
    static toItem(entry, index) {
        if (!entry) {
            return null;
        }
        // Some callers hand us bare display names rather than records.
        if (typeof entry === 'string') {
            const label = entry.trim();
            return label
                ? {
                    key: `${label}-${index}`,
                    id: null,
                    name: label,
                    initials: PeopleListComponent.toInitials(label),
                    imageUrl: null,
                    raw: entry
                }
                : null;
        }
        // Member collections sometimes hand us the join row rather than the employee.
        const employee = entry.employee ?? entry;
        const user = employee?.user ?? entry?.user ?? null;
        const name = ([user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
            employee?.fullName ||
            user?.name ||
            employee?.name ||
            '').trim();
        if (!name) {
            return null;
        }
        const imageUrl = user?.imageUrl || user?.image?.fullUrl || employee?.imageUrl || null;
        const id = employee?.id ?? null;
        return {
            key: `${id ?? name}-${index}`,
            id,
            name,
            initials: PeopleListComponent.toInitials(name),
            imageUrl,
            raw: employee
        };
    }
    /**
     * Derives the initials bubble shown when a person has no avatar image.
     *
     * @param name The person's display name.
     * @returns One or two uppercase letters.
     */
    static toInitials(name) {
        const parts = name.split(/\s+/).filter(Boolean);
        const first = parts[0]?.charAt(0) ?? '';
        const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
        return `${first}${last}`.toUpperCase();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PeopleListComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: PeopleListComponent, isStandalone: false, selector: "ngx-people-list", inputs: { people: "people", maxNames: "maxNames", maxAvatars: "maxAvatars", wrap: "wrap" }, outputs: { selectPerson: "selectPerson" }, ngImport: i0, template: "<!--\n  One horizontal group per cell: named people first, then avatar-only people,\n  then a `+N` chip. No per-person box and no per-person border \u2014 see\n  `people-list.component.scss`.\n-->\n@if (total > 0) {\n\t<div class=\"people\" [class.is-wrapped]=\"wrap\">\n\t\t@for (person of named; track person.key) {\n\t\t\t<a class=\"person\" [class.is-link]=\"!!person.id\" [nbTooltip]=\"person.name\" (click)=\"onSelect(person)\">\n\t\t\t\t<span class=\"person-avatar\">\n\t\t\t\t\t@if (person.imageUrl) {\n\t\t\t\t\t\t<img [src]=\"person.imageUrl\" [alt]=\"person.name\" (error)=\"onImageError(person)\" />\n\t\t\t\t\t} @else {\n\t\t\t\t\t\t<span class=\"person-initials\">{{ person.initials }}</span>\n\t\t\t\t\t}\n\t\t\t\t</span>\n\t\t\t\t<span class=\"person-name\">{{ person.name }}</span>\n\t\t\t</a>\n\t\t}\n\t\t@if (stacked.length > 0 || overflowCount > 0) {\n\t\t\t<span class=\"people-stack\">\n\t\t\t\t@for (person of stacked; track person.key) {\n\t\t\t\t\t<a\n\t\t\t\t\t\tclass=\"person-avatar is-stacked\"\n\t\t\t\t\t\t[class.is-link]=\"!!person.id\"\n\t\t\t\t\t\t[nbTooltip]=\"person.name\"\n\t\t\t\t\t\t(click)=\"onSelect(person)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t@if (person.imageUrl) {\n\t\t\t\t\t\t\t<img [src]=\"person.imageUrl\" [alt]=\"person.name\" (error)=\"onImageError(person)\" />\n\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t\t<span class=\"person-initials\">{{ person.initials }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</a>\n\t\t\t\t}\n\t\t\t\t@if (overflowCount > 0) {\n\t\t\t\t\t<span class=\"person-avatar is-stacked is-more\" [nbTooltip]=\"overflowNames\">\n\t\t\t\t\t\t+{{ overflowCount }}\n\t\t\t\t\t</span>\n\t\t\t\t}\n\t\t\t</span>\n\t\t}\n\t</div>\n}\n", styles: [":host{display:block;min-width:0}.people{display:flex;align-items:center;flex-wrap:nowrap;gap:var(--gauzy-people-gap);min-width:0;line-height:var(--gauzy-people-avatar-size)}.people:not(.is-wrapped){padding-block:var(--gauzy-people-chip-padding-y, .25rem)}.people.is-wrapped{flex-wrap:wrap;row-gap:var(--gauzy-people-gap)}.person{display:inline-flex;align-items:center;gap:var(--gauzy-people-gap);min-width:0;max-width:100%;color:var(--text-basic-color);font-size:var(--gauzy-people-font-size);text-decoration:none}.person.is-link{cursor:pointer}.person.is-link:hover{color:var(--text-primary-color);text-decoration:none}.person.is-link:hover .person-name{text-decoration:underline}.person-name{min-width:0;max-width:var(--gauzy-people-name-max-width);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.person-avatar{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:var(--gauzy-people-avatar-size);height:var(--gauzy-people-avatar-size);border-radius:50%;overflow:hidden;background-color:var(--color-primary-transparent-100);color:var(--text-basic-color);text-decoration:none}.person-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%}.person-avatar.is-link{cursor:pointer}.person-initials{font-size:var(--gauzy-people-initials-font-size);font-weight:600;line-height:1;letter-spacing:0;white-space:nowrap}.people-stack{display:inline-flex;align-items:center;flex:0 0 auto;gap:var(--gauzy-people-stack-gap)}.is-more{width:auto;min-width:var(--gauzy-people-avatar-size);padding:0 .25rem;border-radius:var(--gauzy-people-avatar-size);background-color:var(--color-primary-transparent-200);color:var(--text-basic-color);font-size:var(--gauzy-people-initials-font-size);font-weight:600;cursor:default}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "directive", type: i2.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PeopleListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-people-list', standalone: false, template: "<!--\n  One horizontal group per cell: named people first, then avatar-only people,\n  then a `+N` chip. No per-person box and no per-person border \u2014 see\n  `people-list.component.scss`.\n-->\n@if (total > 0) {\n\t<div class=\"people\" [class.is-wrapped]=\"wrap\">\n\t\t@for (person of named; track person.key) {\n\t\t\t<a class=\"person\" [class.is-link]=\"!!person.id\" [nbTooltip]=\"person.name\" (click)=\"onSelect(person)\">\n\t\t\t\t<span class=\"person-avatar\">\n\t\t\t\t\t@if (person.imageUrl) {\n\t\t\t\t\t\t<img [src]=\"person.imageUrl\" [alt]=\"person.name\" (error)=\"onImageError(person)\" />\n\t\t\t\t\t} @else {\n\t\t\t\t\t\t<span class=\"person-initials\">{{ person.initials }}</span>\n\t\t\t\t\t}\n\t\t\t\t</span>\n\t\t\t\t<span class=\"person-name\">{{ person.name }}</span>\n\t\t\t</a>\n\t\t}\n\t\t@if (stacked.length > 0 || overflowCount > 0) {\n\t\t\t<span class=\"people-stack\">\n\t\t\t\t@for (person of stacked; track person.key) {\n\t\t\t\t\t<a\n\t\t\t\t\t\tclass=\"person-avatar is-stacked\"\n\t\t\t\t\t\t[class.is-link]=\"!!person.id\"\n\t\t\t\t\t\t[nbTooltip]=\"person.name\"\n\t\t\t\t\t\t(click)=\"onSelect(person)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t@if (person.imageUrl) {\n\t\t\t\t\t\t\t<img [src]=\"person.imageUrl\" [alt]=\"person.name\" (error)=\"onImageError(person)\" />\n\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t\t<span class=\"person-initials\">{{ person.initials }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</a>\n\t\t\t\t}\n\t\t\t\t@if (overflowCount > 0) {\n\t\t\t\t\t<span class=\"person-avatar is-stacked is-more\" [nbTooltip]=\"overflowNames\">\n\t\t\t\t\t\t+{{ overflowCount }}\n\t\t\t\t\t</span>\n\t\t\t\t}\n\t\t\t</span>\n\t\t}\n\t</div>\n}\n", styles: [":host{display:block;min-width:0}.people{display:flex;align-items:center;flex-wrap:nowrap;gap:var(--gauzy-people-gap);min-width:0;line-height:var(--gauzy-people-avatar-size)}.people:not(.is-wrapped){padding-block:var(--gauzy-people-chip-padding-y, .25rem)}.people.is-wrapped{flex-wrap:wrap;row-gap:var(--gauzy-people-gap)}.person{display:inline-flex;align-items:center;gap:var(--gauzy-people-gap);min-width:0;max-width:100%;color:var(--text-basic-color);font-size:var(--gauzy-people-font-size);text-decoration:none}.person.is-link{cursor:pointer}.person.is-link:hover{color:var(--text-primary-color);text-decoration:none}.person.is-link:hover .person-name{text-decoration:underline}.person-name{min-width:0;max-width:var(--gauzy-people-name-max-width);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.person-avatar{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:var(--gauzy-people-avatar-size);height:var(--gauzy-people-avatar-size);border-radius:50%;overflow:hidden;background-color:var(--color-primary-transparent-100);color:var(--text-basic-color);text-decoration:none}.person-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%}.person-avatar.is-link{cursor:pointer}.person-initials{font-size:var(--gauzy-people-initials-font-size);font-weight:600;line-height:1;letter-spacing:0;white-space:nowrap}.people-stack{display:inline-flex;align-items:center;flex:0 0 auto;gap:var(--gauzy-people-stack-gap)}.is-more{width:auto;min-width:var(--gauzy-people-avatar-size);padding:0 .25rem;border-radius:var(--gauzy-people-avatar-size);background-color:var(--color-primary-transparent-200);color:var(--text-basic-color);font-size:var(--gauzy-people-initials-font-size);font-weight:600;cursor:default}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { people: [{
                type: Input
            }], maxNames: [{
                type: Input
            }], maxAvatars: [{
                type: Input
            }], wrap: [{
                type: Input
            }], selectPerson: [{
                type: Output
            }] } });
//# sourceMappingURL=people-list.component.js.map