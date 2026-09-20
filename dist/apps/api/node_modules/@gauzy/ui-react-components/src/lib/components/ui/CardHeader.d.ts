import { type ReactNode, type CSSProperties } from 'react';
export interface CardHeaderProps {
    children?: ReactNode;
    style?: CSSProperties;
    className?: string;
}
/**
 * CardHeader — organizes the card's top section.
 *
 * Typically contains `<CardTitle>`, `<CardDescription>`, and optionally `<CardAction>`.
 * Renders with padding and a bottom border separator.
 */
export declare function CardHeader({ children, style, className }: CardHeaderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CardHeader.d.ts.map