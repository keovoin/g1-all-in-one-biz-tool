import { PosthogModuleOptions } from './posthog.interfaces';
import { PosthogService } from './posthog.service';
export declare function createPosthogProviders(options: PosthogModuleOptions): {
    provide: string;
    useFactory: () => PosthogService;
};
