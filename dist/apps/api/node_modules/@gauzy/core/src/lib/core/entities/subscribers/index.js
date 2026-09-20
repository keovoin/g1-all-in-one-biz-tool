"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreSubscribers = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./base-entity-event.subscriber"), exports);
tslib_1.__exportStar(require("./tenant-organization-base-entity.subscriber"), exports);
const utils_1 = require("../../utils");
const internal_1 = require("../internal");
const base_entity_subscriber_1 = require("./base.entity.subscriber");
const tenant_organization_base_entity_subscriber_1 = require("./tenant-organization-base-entity.subscriber");
// Get the ORM type from the MultiORMEnum
const ormType = (0, utils_1.getORMType)();
/**
 * A map of the core TypeORM / MikroORM Subscribers.
 */
exports.coreSubscribers = [
    // Add the subscriber only if the ORM type is MikroORM
    ...(ormType === utils_1.MultiORMEnum.MikroORM ? [tenant_organization_base_entity_subscriber_1.TenantOrganizationBaseEntityEventSubscriber] : []),
    base_entity_subscriber_1.BaseEntitySubscriber,
    internal_1.ActivitySubscriber,
    internal_1.ActivityLogSubscriber,
    internal_1.ApiCallLogSubscriber,
    internal_1.BroadcastSubscriber,
    internal_1.CandidateSubscriber,
    internal_1.CustomSmtpSubscriber,
    internal_1.DashboardSubscriber,
    internal_1.EmailResetSubscriber,
    internal_1.EmailTemplateSubscriber,
    internal_1.EmployeeRecentVisitSubscriber,
    internal_1.EmployeeSettingSubscriber,
    internal_1.EmployeeSubscriber,
    internal_1.EmployeeNotificationSettingSubscriber,
    internal_1.FeatureSubscriber,
    internal_1.ImageAssetSubscriber,
    internal_1.IntegrationSettingSubscriber,
    internal_1.IntegrationSubscriber,
    internal_1.InviteSubscriber,
    internal_1.InvoiceSubscriber,
    internal_1.IssueTypeSubscriber,
    internal_1.OrganizationContactSubscriber,
    internal_1.OrganizationDocumentSubscriber,
    internal_1.OrganizationProjectSubscriber,
    internal_1.OrganizationStrategicInitiativeSubscriber,
    internal_1.OrganizationSubscriber,
    internal_1.OrganizationTeamEmployeeSubscriber,
    internal_1.OrganizationTeamJoinRequestSubscriber,
    internal_1.OrganizationTeamSubscriber,
    internal_1.PaymentSubscriber,
    internal_1.PipelineSubscriber,
    internal_1.ProductCategorySubscriber,
    internal_1.ReportSubscriber,
    internal_1.ResourceLinkSubscriber,
    internal_1.RoleSubscriber,
    internal_1.ScreeningTaskSubscriber,
    internal_1.ScreenshotSubscriber,
    internal_1.TagSubscriber,
    internal_1.TaskPrioritySubscriber,
    internal_1.TaskRelatedIssueTypeSubscriber,
    internal_1.TaskSizeSubscriber,
    internal_1.TaskStatusSubscriber,
    internal_1.TaskSubscriber,
    internal_1.TaskVersionSubscriber,
    internal_1.TenantSubscriber,
    internal_1.TimeOffRequestSubscriber,
    internal_1.TimesheetSubscriber,
    internal_1.TimeSlotSubscriber,
    internal_1.UserSubscriber
];
//# sourceMappingURL=index.js.map