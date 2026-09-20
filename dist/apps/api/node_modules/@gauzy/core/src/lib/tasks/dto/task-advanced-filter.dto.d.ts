import { ID, ITaskAdvancedFilter } from '@gauzy/contracts';
export declare class TaskAdvancedFilterDTO implements ITaskAdvancedFilter {
    ids?: ID[];
    projects?: ID[];
    teams?: ID[];
    modules?: ID[];
    sprints?: ID[];
    members?: ID[];
    tags?: ID[];
    statusIds?: ID[];
    priorityIds?: ID[];
    sizeIds?: ID[];
    parentIds?: ID[];
    createdByUserIds?: ID[];
}
