import './nebular-jsx';
import { type CSSProperties } from 'react';
export interface NbIconProps {
    /** Icon name in the app's default pack (the Eva names the Angular templates use). */
    icon: string;
    className?: string;
    style?: CSSProperties;
    /** Accessible label; icons are decorative by default. */
    title?: string;
}
/**
 * `<nb-icon icon="…">` for React.
 *
 * Resolves the SVG through the very same `NbIconLibraries` the Angular `nb-icon` component asks
 * (the app registers its Tabler pack under the `eva` name — see `@gauzy/ui-core/icons`), and
 * renders it inside a real `<nb-icon>` element so the global Nebular/Gauzy icon rules apply.
 * Unknown names render an empty element instead of throwing.
 */
export declare function NbIcon({ icon, className, style, title }: NbIconProps): import("react/jsx-runtime").JSX.Element;
