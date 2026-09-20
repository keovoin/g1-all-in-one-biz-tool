import '../nebular-jsx';
import { type ReactNode } from 'react';
export interface CounterWidgetProps {
    /** Translated title ("Members worked", …). */
    title: string;
    /** The big figure (`counts.employeesCount`, `durationFormat(...)`, `"42%"`). */
    value: ReactNode;
    /** Shows the giant primary spinner over the card (`[nbSpinner]="countsLoading"`). */
    loading: boolean;
    /** Dot-strip capacity (`[total]`); ignored in progress mode. */
    total?: number;
    /** Dot-strip / progress value (`[value]`). */
    counterValue: number;
    /** Dot colour (`[color]`). */
    color?: string;
    /** Progress-bar mode (`[progress]="true"`). */
    progress?: boolean;
}
/**
 * One counter card of the widget row — the `<nb-card [nbSpinner]><nb-card-body>` block each of
 * the six `gaWidgetTemplate`s renders: title (`.header-widget > .title`), figure (`.h1`) and the
 * `gauzy-counter-point` strip inside `.counter-container`.
 */
export declare function CounterWidget({ title, value, loading, total, counterValue, color, progress }: CounterWidgetProps): import("react/jsx-runtime").JSX.Element;
