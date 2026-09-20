import { RegisterQueueOptions } from '@nestjs/bullmq';
import { SchedulerQueueRegistration } from '../interfaces/scheduler-feature-options.interface';
export declare function normalizeQueueRegistrations(queueRegistrations: SchedulerQueueRegistration[]): RegisterQueueOptions[];
export declare function normalizeQueueName(name?: string): string;
