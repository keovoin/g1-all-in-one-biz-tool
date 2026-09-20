import { type ReactNode } from 'react';
export interface WidgetCardProps {
    label: string;
    value: string | number;
    loading?: boolean;
    children?: ReactNode;
}
/**
 * WidgetCard — stat/widget card, built on Card + CardContent.
 *
 * Mirrors Angular's widget structure: `<nb-card><nb-card-body>...</nb-card-body></nb-card>`.
 */
export declare function WidgetCard({ label, value, loading, children }: WidgetCardProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WidgetCard.d.ts.map