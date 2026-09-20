import { PostHogServiceManager } from './posthog-manager.service';
import { PostHogModuleConfig } from '../interfaces/posthog.interface';
/**
 * Factory function for initializing PostHog during app startup
 */
export declare function initializePostHogFactory(posthogManager: PostHogServiceManager, config: PostHogModuleConfig): () => Promise<void>;
