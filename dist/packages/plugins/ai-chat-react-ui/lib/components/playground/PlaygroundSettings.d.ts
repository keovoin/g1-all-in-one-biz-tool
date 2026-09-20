import { type ReactNode } from 'react';
import { type ModelOption } from './ModelSelector';
export interface PlaygroundSettingsProps {
    models: ModelOption[];
    selectedModelId: string;
    /** Provider of the selected model (disambiguates duplicate model ids). */
    selectedProviderId?: string;
    /** Called with the model id and (when known) its provider id. */
    onModelChange: (modelId: string, providerId?: string) => void;
    systemPrompt: string;
    onSystemPromptChange: (value: string) => void;
    /**
     * Disables the system prompt editor. The Gauzy backend builds its own
     * system prompt, so the playground keeps this visible but not wired.
     */
    systemPromptDisabled?: boolean;
    temperature: number;
    onTemperatureChange: (value: number) => void;
    maxTokens: number;
    onMaxTokensChange: (value: number) => void;
    topP: number;
    onTopPChange: (value: number) => void;
    /**
     * Disables the parameter sliders. The backend does not accept
     * temperature / topP / maxTokens yet, so the playground keeps the
     * sliders visible but not wired.
     */
    parametersDisabled?: boolean;
    /** Whether the panel is collapsed. */
    collapsed?: boolean;
    /** Extra controls rendered below the default parameter sliders. */
    children?: ReactNode;
}
/**
 * PlaygroundSettings — left panel with model selector, system prompt,
 * and parameter controls (Temperature, Max Tokens, Top P).
 *
 * Controls that the backend does not support yet stay visible but are
 * disabled with an explanatory note, so the UI never pretends a value
 * is being applied when it is not.
 */
export declare function PlaygroundSettings({ models, selectedModelId, selectedProviderId, onModelChange, systemPrompt, onSystemPromptChange, systemPromptDisabled, temperature, onTemperatureChange, maxTokens, onMaxTokensChange, topP, onTopPChange, parametersDisabled, collapsed, children }: PlaygroundSettingsProps): import("react/jsx-runtime").JSX.Element;
