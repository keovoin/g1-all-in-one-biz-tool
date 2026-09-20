import { TimerStartedHandler } from './timer-started.handler';
import { TimerStatusUpdatedHandler } from './timer-status-updated.handler';
import { TimerStoppedHandler } from './timer-stopped.handler';
export declare const EventHandlers: (typeof TimerStartedHandler | typeof TimerStatusUpdatedHandler | typeof TimerStoppedHandler)[];
