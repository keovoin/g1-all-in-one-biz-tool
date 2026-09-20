import { type ReactNode, type CSSProperties } from 'react';
export interface CardProps {
    children?: ReactNode;
    /** 'default' = white card, 'accent' = tinted background (gauzy-card-2) */
    variant?: 'default' | 'accent';
    style?: CSSProperties;
    className?: string;
}
/**
 * Card — root layout card container (compound component).
 *
 * Compose with `<CardHeader>`, `<CardContent>`, and `<CardFooter>`.
 */
export declare function Card({ children, variant, style, className }: CardProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Card.d.ts.map