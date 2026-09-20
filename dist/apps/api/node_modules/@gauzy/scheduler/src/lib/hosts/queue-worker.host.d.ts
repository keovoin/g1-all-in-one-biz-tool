import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export declare abstract class QueueWorkerHost extends WorkerHost {
    private handlerMap?;
    process(job: Job, token?: string): Promise<unknown>;
    private getHandlers;
}
