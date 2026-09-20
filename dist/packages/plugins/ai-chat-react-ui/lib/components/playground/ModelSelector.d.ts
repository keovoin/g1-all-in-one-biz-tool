export interface ModelOption {
    /** Model identifier as understood by the provider (e.g. 'claude-sonnet-5'). */
    id: string;
    /** Human-readable model label. */
    name: string;
    /** Human-readable provider label (used to group options). */
    provider?: string;
    /** Provider identifier (sent to the backend as `providerId`). */
    providerId?: string;
}
export interface ModelSelectorProps {
    models: ModelOption[];
    selectedModelId: string;
    /** Disambiguates models with the same id across providers. */
    selectedProviderId?: string;
    /** Called with the model id and (when known) its provider id. */
    onModelChange: (modelId: string, providerId?: string) => void;
}
/**
 * ModelSelector — dropdown for selecting an AI model.
 *
 * Options are grouped by provider label. Selection reports both the
 * model id and the provider id so the caller can route the request to
 * the right backend provider.
 */
export declare function ModelSelector({ models, selectedModelId, selectedProviderId, onModelChange }: ModelSelectorProps): import("react/jsx-runtime").JSX.Element;
