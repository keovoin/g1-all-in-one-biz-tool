import { IConfigurationOptions } from './configuration.interface';
export declare class RequestConfigProvider {
    protected readonly options: IConfigurationOptions;
    private defaultConfig;
    private config;
    constructor(options: IConfigurationOptions);
    /**
     * Set the default configuration options.
     * @param defaultConfig - The default configuration options to set.
     */
    setDefaultConfig(defaultConfig: IConfigurationOptions): void;
    /**
     * Reset the configuration options to the default values.
     */
    resetConfig(): void;
    /**
     * Set the configuration options.
     * @param config - The configuration options to set.
     */
    setConfig(config: IConfigurationOptions): void;
    /**
     * Get the current configuration options.
     * @returns The current configuration options.
     */
    getConfig(): IConfigurationOptions;
}
