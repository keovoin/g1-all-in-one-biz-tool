import '../nebular-jsx';
import { type ReactNode } from 'react';
export interface WindowCardProps {
    /** Translated window title (`<nb-card-header>`). */
    title: string;
    /** `[nbSpinner]` flag. */
    loading: boolean;
    /** True when there is data to list; otherwise `emptyMessage` renders (unless loading). */
    hasData: boolean;
    /** Translated per-period empty message. */
    emptyMessage: string;
    /** Class of the `<nb-card-body>` when there is data (`custom-card-body-inner[-list]`). */
    bodyClassName?: string;
    /** Extra classes on `<nb-card>` (`member-list`). */
    className?: string;
    /** Adds the flex `nb-card-header` variant (`class="nb-card-header"`). */
    flexHeader?: boolean;
    /**
     * Where the empty message goes: inside the body (Recent activities / Members) or as a
     * sibling of the header (Manual time / Tasks / Projects / Apps), like the Angular templates.
     */
    emptyInBody?: boolean;
    children?: ReactNode;
}
/**
 * The `<nb-card [nbSpinner]><nb-card-header>…</nb-card-header>…</nb-card>` shell every window
 * template shares, including its loading veil and per-period empty state.
 */
export declare function WindowCard({ title, loading, hasData, emptyMessage, bodyClassName, className, flexHeader, emptyInBody, children }: WindowCardProps): import("react/jsx-runtime").JSX.Element;
