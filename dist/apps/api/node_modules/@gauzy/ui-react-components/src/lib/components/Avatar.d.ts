import { type CSSProperties, type ReactNode } from 'react';
export type AvatarSize = 'sm' | 'md' | 'lg';
export interface AvatarProps {
    /** Display name (rendered as a link when `onClick` is given). */
    name?: string;
    /** Image URL; when empty only the name/caption render (like `ngx-avatar`). */
    src?: string;
    /** Caption line under the name (e.g. a formatted date). */
    caption?: ReactNode;
    /** Text prepended to the caption (e.g. "Last worked:"). */
    appendCaption?: ReactNode;
    size?: AvatarSize;
    /** Presence flags — draws the green/red status dot when either is defined. */
    presence?: {
        isOnline?: boolean;
        isAway?: boolean;
    } | null;
    /** Fired when the image or the name is clicked (Angular navigates to the employee edit page). */
    onClick?: () => void;
    /** Accessible name of the clickable image when there is no `name` (defaults to "Open profile"). */
    imageLabel?: string;
    /**
     * `dashboard` = the `.avatar-dashboard` look (full-width chip, 32px image, 14px/600 name);
     * `activity` adds the `.activity` circle variant (28px round image).
     */
    variant?: 'dashboard' | 'activity';
    className?: string;
    style?: CSSProperties;
}
/**
 * Avatar — React port of `<ngx-avatar class="avatar-dashboard">`: image (with optional presence
 * dot) + name link + caption, sized `sm|md|lg`, in the dashboard chip layout.
 */
export declare function Avatar({ name, src, imageLabel, caption, appendCaption, size, presence, onClick, variant, className, style }: AvatarProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Avatar.d.ts.map