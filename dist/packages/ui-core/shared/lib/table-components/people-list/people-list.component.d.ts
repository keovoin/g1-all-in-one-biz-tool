import { EventEmitter } from '@angular/core';
import { ID } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * A single person, normalized out of whatever shape the caller had.
 *
 * People reach the grid in three different shapes depending on the endpoint:
 * a plain `IEmployee` (with `user`), a join row (`{ employee, isManager }`),
 * or a bare `{ name, imageUrl }`. Normalizing once here is what lets a single
 * template render all of them.
 */
export interface IPersonListItem {
    /** Unique per rendered list — `@for` needs a stable, collision-free track key. */
    key: string;
    /** Employee id, when we have one. `null` means "not clickable". */
    id: ID | null;
    name: string;
    initials: string;
    imageUrl: string | null;
    /** The object we were handed, so the caller keeps its own navigation logic. */
    raw: any;
}
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
export declare class PeopleListComponent {
    /** People rendered with their name next to the avatar. */
    named: IPersonListItem[];
    /** People rendered as an avatar only, after the named ones. */
    stacked: IPersonListItem[];
    /** People that did not fit at all — surfaced through the `+N` chip. */
    overflow: IPersonListItem[];
    private _items;
    private _maxNames;
    private _maxAvatars;
    /**
     * The people to render. Accepts an array (or a single object) of employees,
     * member join rows, or `{ name, imageUrl }` records.
     */
    set people(value: any);
    /** How many people get their name shown before the group falls back to avatars. */
    set maxNames(value: number);
    get maxNames(): number;
    /** How many avatar-only people are shown after the named ones. */
    set maxAvatars(value: number);
    get maxAvatars(): number;
    /**
     * Allow the group to wrap onto several lines. Off inside data grids (a cell
     * must cost the row one line box), on inside cards, where there is room.
     */
    wrap: boolean;
    /** Emitted when a person is activated. Empty for people without an id. */
    readonly selectPerson: EventEmitter<IPersonListItem>;
    /** Total number of people handed to the component. */
    get total(): number;
    /** How many people the `+N` chip stands for. */
    get overflowCount(): number;
    /** Tooltip for the `+N` chip: the names it is hiding. */
    get overflowNames(): string;
    /**
     * Activates a person, unless they have no employee page to open.
     *
     * @param person The person that was clicked.
     */
    onSelect(person: IPersonListItem): void;
    /**
     * Falls back to the initials bubble when an avatar image fails to load.
     * Employee image URLs routinely outlive the file they point at, and a broken
     * image icon is worse than initials.
     *
     * @param person The person whose image failed to load.
     */
    onImageError(person: IPersonListItem): void;
    /**
     * Splits the normalized people into the named / avatar-only / overflow buckets.
     *
     * Up to `maxNames` people keep their name. Past that only the first person
     * does, so a row always shows at least one name, and the rest collapse into
     * avatars plus a `+N` chip.
     */
    private split;
    /**
     * Normalizes an arbitrary collection of people into renderable items.
     *
     * @param value An array (or single object) of employees / member join rows.
     * @returns The renderable items, skipping anything we cannot name.
     */
    private static normalize;
    /**
     * Builds a single renderable item out of one entry.
     *
     * @param entry An employee, a member join row, or a `{ name, imageUrl }` record.
     * @param index Position in the source collection, used to keep track keys unique.
     * @returns The item, or `null` when the entry carries no name to show.
     */
    private static toItem;
    /**
     * Derives the initials bubble shown when a person has no avatar image.
     *
     * @param name The person's display name.
     * @returns One or two uppercase letters.
     */
    private static toInitials;
    static ɵfac: i0.ɵɵFactoryDeclaration<PeopleListComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PeopleListComponent, "ngx-people-list", never, { "people": { "alias": "people"; "required": false; }; "maxNames": { "alias": "maxNames"; "required": false; }; "maxAvatars": { "alias": "maxAvatars"; "required": false; }; "wrap": { "alias": "wrap"; "required": false; }; }, { "selectPerson": "selectPerson"; }, never, never, false, never>;
}
