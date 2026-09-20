import { ConfigService } from '@gauzy/config';
import { ITaskMetadataBootstrapQuery, ITaskMetadataBootstrapResponse } from '@gauzy/contracts';
import { TagService } from '../../tags/tag.service';
import { IssueTypeService } from '../issue-type/issue-type.service';
import { TaskPriorityService } from '../priorities/priority.service';
import { TaskRelatedIssueTypeService } from '../related-issue-type/related-issue-type.service';
import { TaskSizeService } from '../sizes/size.service';
import { TaskStatusService } from '../statuses/status.service';
import { TaskVersionService } from '../versions/version.service';
export declare class TaskMetadataBootstrapService {
    private readonly taskStatusService;
    private readonly taskPriorityService;
    private readonly taskSizeService;
    private readonly tagService;
    private readonly taskVersionService;
    private readonly issueTypeService;
    private readonly taskRelatedIssueTypeService;
    private readonly configService;
    constructor(taskStatusService: TaskStatusService, taskPriorityService: TaskPriorityService, taskSizeService: TaskSizeService, tagService: TagService, taskVersionService: TaskVersionService, issueTypeService: IssueTypeService, taskRelatedIssueTypeService: TaskRelatedIssueTypeService, configService: ConfigService);
    bootstrap(query: ITaskMetadataBootstrapQuery): Promise<ITaskMetadataBootstrapResponse>;
    private loadSection;
    private loadSynchronousSqliteSections;
}
