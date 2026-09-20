import { jsx as _jsx } from "react/jsx-runtime";
import './nebular-jsx';
import { useMemo } from 'react';
import { NbIconLibraries } from '@nebular/theme';
import { useInjector } from '@gauzy/ui-react';
/**
 * `<nb-icon icon="…">` for React.
 *
 * Resolves the SVG through the very same `NbIconLibraries` the Angular `nb-icon` component asks
 * (the app registers its Tabler pack under the `eva` name — see `@gauzy/ui-core/icons`), and
 * renders it inside a real `<nb-icon>` element so the global Nebular/Gauzy icon rules apply.
 * Unknown names render an empty element instead of throwing.
 */
export function NbIcon({ icon, className, style, title }) {
    const injector = useInjector();
    const libraries = useMemo(() => injector.get(NbIconLibraries, null), [injector]);
    const svg = useMemo(() => {
        try {
            return libraries?.getSvgIcon(icon)?.icon.getContent() ?? '';
        }
        catch {
            return '';
        }
    }, [libraries, icon]);
    return (_jsx("nb-icon", { icon: icon, className: className, style: style, role: title ? 'img' : undefined, "aria-label": title, "aria-hidden": title ? undefined : 'true', dangerouslySetInnerHTML: { __html: svg } }));
}
//# sourceMappingURL=NbIcon.js.map