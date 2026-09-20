import { IOnPluginBootstrap, IOnPluginDestroy } from '@gauzy/plugin';
export declare class IntegrationEverAsyncPlugin implements IOnPluginBootstrap, IOnPluginDestroy {
    private logEnabled;
    onPluginBootstrap(): void | Promise<void>;
    onPluginDestroy(): void | Promise<void>;
}
