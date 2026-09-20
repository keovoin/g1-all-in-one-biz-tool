export interface SettingsControlProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    /** Disables the slider (e.g. when the parameter is not wired to the backend). */
    disabled?: boolean;
    /** Tooltip shown on hover (e.g. explaining why the control is disabled). */
    title?: string;
}
/**
 * SettingsControl — labelled range slider for model parameters
 * (temperature, maxTokens, topP, etc.).
 */
export declare function SettingsControl({ label, value, min, max, step, onChange, disabled, title }: SettingsControlProps): import("react/jsx-runtime").JSX.Element;
