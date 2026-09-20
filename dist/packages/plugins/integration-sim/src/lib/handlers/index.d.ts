import { SimTimerStartedHandler } from './sim-timer-started.handler';
import { SimTimerStoppedHandler } from './sim-timer-stopped.handler';
import { SimTimerStatusUpdatedHandler } from './sim-timer-status-updated.handler';
import { SimTaskEventHandler } from './sim-task-event.handler';
import { SimScreenshotEventHandler } from './sim-screenshot-event.handler';
import { SimIntegrationEventHandler } from './sim-integration-event.handler';
import { SimAccountRegistrationHandler } from './sim-account-registration.handler';
import { SimAccountVerifiedHandler } from './sim-account-verified.handler';
export declare const EventHandlers: (typeof SimTimerStartedHandler | typeof SimTimerStoppedHandler | typeof SimTimerStatusUpdatedHandler | typeof SimTaskEventHandler | typeof SimScreenshotEventHandler | typeof SimIntegrationEventHandler | typeof SimAccountRegistrationHandler | typeof SimAccountVerifiedHandler)[];
