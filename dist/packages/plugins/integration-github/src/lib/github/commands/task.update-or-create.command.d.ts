import { IGetTaskOptions, ITask } from '@gauzy/contracts';
export declare class GithubTaskUpdateOrCreateCommand {
    readonly task: ITask;
    readonly options: IGetTaskOptions;
    constructor(task: ITask, options: IGetTaskOptions);
}
