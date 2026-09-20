"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMetadataBootstrapService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("../../core/context");
const tag_service_1 = require("../../tags/tag.service");
const issue_type_service_1 = require("../issue-type/issue-type.service");
const priority_service_1 = require("../priorities/priority.service");
const related_issue_type_service_1 = require("../related-issue-type/related-issue-type.service");
const size_service_1 = require("../sizes/size.service");
const status_service_1 = require("../statuses/status.service");
const version_service_1 = require("../versions/version.service");
function assertUnreachableSection(_section) {
    throw new common_1.BadRequestException();
}
let TaskMetadataBootstrapService = class TaskMetadataBootstrapService {
    constructor(taskStatusService, taskPriorityService, taskSizeService, tagService, taskVersionService, issueTypeService, taskRelatedIssueTypeService, configService) {
        this.taskStatusService = taskStatusService;
        this.taskPriorityService = taskPriorityService;
        this.taskSizeService = taskSizeService;
        this.tagService = tagService;
        this.taskVersionService = taskVersionService;
        this.issueTypeService = issueTypeService;
        this.taskRelatedIssueTypeService = taskRelatedIssueTypeService;
        this.configService = configService;
    }
    async bootstrap(query) {
        const tenantId = context_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.ForbiddenException();
        }
        const include = query.include ?? contracts_1.TASK_METADATA_SECTIONS;
        const canonicalSections = contracts_1.TASK_METADATA_SECTIONS;
        if (include.some((section) => !canonicalSections.includes(section))) {
            throw new common_1.BadRequestException();
        }
        const { organizationId, organizationTeamId, projectId } = query;
        const scope = { tenantId, organizationId, organizationTeamId, projectId };
        const loaders = {
            taskStatuses: () => this.taskStatusService.fetchAll(scope),
            taskPriorities: () => this.taskPriorityService.fetchAll(scope),
            taskSizes: () => this.taskSizeService.fetchAll(scope),
            taskLabels: () => this.tagService.findTagsByLevel({ organizationId, organizationTeamId }),
            taskVersions: () => this.taskVersionService.fetchAll(scope),
            issueTypes: () => this.issueTypeService.fetchAll(scope),
            relatedIssueTypes: () => this.taskRelatedIssueTypeService.fetchAll(scope)
        };
        const entries = this.configService.dbConnectionOptions.type === config_1.DatabaseTypeEnum.betterSqlite3
            ? await this.loadSynchronousSqliteSections(include, loaders)
            : await Promise.all(include.map(async (section) => [section, await this.loadSection(section, loaders)]));
        return Object.fromEntries(entries);
    }
    loadSection(section, loaders) {
        switch (section) {
            case 'taskStatuses':
                return loaders.taskStatuses();
            case 'taskPriorities':
                return loaders.taskPriorities();
            case 'taskSizes':
                return loaders.taskSizes();
            case 'taskLabels':
                return loaders.taskLabels();
            case 'taskVersions':
                return loaders.taskVersions();
            case 'issueTypes':
                return loaders.issueTypes();
            case 'relatedIssueTypes':
                return loaders.relatedIssueTypes();
            default:
                return assertUnreachableSection(section);
        }
    }
    async loadSynchronousSqliteSections(include, loaders) {
        const entries = [];
        for (const [index, section] of include.entries()) {
            entries.push([section, await this.loadSection(section, loaders)]);
            if (index < include.length - 1) {
                await new Promise((resolve) => setImmediate(resolve));
            }
        }
        return entries;
    }
};
exports.TaskMetadataBootstrapService = TaskMetadataBootstrapService;
exports.TaskMetadataBootstrapService = TaskMetadataBootstrapService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [status_service_1.TaskStatusService,
        priority_service_1.TaskPriorityService,
        size_service_1.TaskSizeService,
        tag_service_1.TagService,
        version_service_1.TaskVersionService,
        issue_type_service_1.IssueTypeService,
        related_issue_type_service_1.TaskRelatedIssueTypeService,
        config_1.ConfigService])
], TaskMetadataBootstrapService);
//# sourceMappingURL=task-metadata-bootstrap.service.js.map