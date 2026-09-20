"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionModule = exports.RoleService = exports.RoleModule = exports.RoleAuthorizationService = exports.FeatureOrganizationService = exports.FeatureService = exports.FeatureModule = exports.CreateEntitySubscriptionEvent = exports.MentionModule = exports.ActivityLogModule = exports.MentionService = exports.ActivityLogService = exports.PasswordHashService = exports.PasswordHashModule = exports.RedisModule = exports.EVER_REDIS_CLIENT = exports.runDatabaseMigrations = exports.revertLastDatabaseMigration = exports.prepareSQLQuery = exports.generateMigration = exports.createMigration = exports.ConnectionEntityManager = exports.LazyFileInterceptor = exports.toSafeStorageExtension = exports.RENDERABLE_KEY_EXTENSIONS = exports.videoUploadFileFilter = exports.shouldScanForMarkup = exports.isMarkupContent = exports.imageUploadFileFilter = exports.documentUploadFileFilter = exports.createUploadFileFilter = exports.audioUploadFileFilter = exports.assertNotMarkupContent = exports.archiveUploadFileFilter = exports.UploadedFileStorage = exports.MARKUP_SCAN_MAX_BYTES = exports.FileStorageFactory = exports.FileStorage = exports.SCRIPT_CAPABLE_NON_DOCUMENT_EXTENSIONS = exports.BLOCKED_UPLOAD_EXTENSIONS = exports.ALLOWED_VIDEO_MIME_TYPES = exports.ALLOWED_VIDEO_EXTENSIONS = exports.ALLOWED_IMAGE_MIME_TYPES = exports.ALLOWED_IMAGE_EXTENSIONS = exports.ALLOWED_AUDIO_MIME_TYPES = exports.ALLOWED_AUDIO_EXTENSIONS = exports.ALLOWED_ARCHIVE_MIME_TYPES = exports.ALLOWED_ARCHIVE_EXTENSIONS = exports.registerPluginConfig = exports.bootstrap = void 0;
exports.CustomTrackingModule = exports.TenantApiKeyService = exports.TenantApiKeyModule = exports.IntegrationTenantUpdateOrCreateCommand = exports.IntegrationTenantService = exports.IntegrationTenantModule = exports.IntegrationTenantGetCommand = exports.IntegrationSettingService = exports.IntegrationSettingModule = exports.IntegrationSettingGetManyCommand = exports.IntegrationSettingGetCommand = exports.IntegrationSettingCreateCommand = exports.IntegrationMapSyncTimeSlotCommand = exports.IntegrationMapSyncTimeLogCommand = exports.IntegrationMapSyncTaskCommand = exports.IntegrationMapSyncScreenshotCommand = exports.IntegrationMapSyncProjectCommand = exports.IntegrationMapSyncOrganizationCommand = exports.IntegrationMapSyncLabelCommand = exports.IntegrationMapSyncIssueCommand = exports.IntegrationMapSyncEntityCommand = exports.IntegrationMapSyncActivityCommand = exports.IntegrationMapService = exports.IntegrationMapModule = exports.PROJECT_TIED_ENTITIES = exports.IntegrationEntitySettingTiedService = exports.IntegrationEntitySettingTiedModule = exports.IntegrationEntitySettingService = exports.IntegrationEntitySettingModule = exports.DEFAULT_ENTITY_SETTINGS = exports.IntegrationService = exports.IntegrationModule = exports.TaskUpdateCommand = exports.TaskService = exports.TaskModule = exports.TaskCreateCommand = exports.AutomationTaskSyncCommand = exports.OrganizationVendorService = exports.OrganizationVendorModule = exports.OrganizationVendorFirstOrCreateCommand = exports.OrganizationProjectUpdateCommand = exports.OrganizationProjectService = exports.OrganizationProjectModule = exports.OrganizationProjectCreateCommand = exports.OrganizationContactService = exports.OrganizationContactModule = exports.OrganizationContactCreateCommand = exports.UserService = exports.UserModule = exports.RolePermissionService = void 0;
exports.TagService = exports.TagModule = exports.RelationalTagDTO = exports.AutomationLabelSyncCommand = exports.TagTypeService = exports.TagTypeModule = exports.IncomeService = exports.IncomeModule = exports.IncomeCreateCommand = exports.ExpenseCategoryFirstOrCreateCommand = exports.ExpenseCategoriesService = exports.ExpenseCategoriesModule = exports.ExpenseService = exports.ExpenseModule = exports.ExpenseCreateCommand = exports.redactForExport = exports.maskEmbeddedSecret = exports.getExportRedactedProperties = exports.exportRedacted = exports.ExportRedacted = exports.EXPORT_REDACT_METADATA = exports.skipExport = exports.SkipExport = exports.SKIP_EXPORT_METADATA = exports.isExportSkipped = exports.TimerService = exports.TimerModule = exports.QueryHandlers = exports.CommandHandlers = exports.TimerStoppedEvent = exports.TimerStatusUpdatedEvent = exports.TimerStartedEvent = exports.StopTimerCommand = exports.StartTimerCommand = exports.GetTimerStatusQuery = exports.TimeSlotService = exports.TimeSlotModule = exports.TimeSlotCreateCommand = exports.CreateTimeSlotMinutesCommand = exports.TimeLogService = exports.TimeLogModule = exports.TimeLogCreateCommand = exports.ScreenshotService = exports.ScreenshotModule = exports.ScreenshotCreateCommand = exports.CustomTrackingService = void 0;
const tslib_1 = require("tslib");
/**
 * Public API Surface of @gauzy/core
 */
var bootstrap_1 = require("./lib/bootstrap");
Object.defineProperty(exports, "bootstrap", { enumerable: true, get: function () { return bootstrap_1.bootstrap; } });
Object.defineProperty(exports, "registerPluginConfig", { enumerable: true, get: function () { return bootstrap_1.registerPluginConfig; } });
tslib_1.__exportStar(require("./lib/core"), exports);
var file_storage_1 = require("./lib/core/file-storage");
Object.defineProperty(exports, "ALLOWED_ARCHIVE_EXTENSIONS", { enumerable: true, get: function () { return file_storage_1.ALLOWED_ARCHIVE_EXTENSIONS; } });
Object.defineProperty(exports, "ALLOWED_ARCHIVE_MIME_TYPES", { enumerable: true, get: function () { return file_storage_1.ALLOWED_ARCHIVE_MIME_TYPES; } });
Object.defineProperty(exports, "ALLOWED_AUDIO_EXTENSIONS", { enumerable: true, get: function () { return file_storage_1.ALLOWED_AUDIO_EXTENSIONS; } });
Object.defineProperty(exports, "ALLOWED_AUDIO_MIME_TYPES", { enumerable: true, get: function () { return file_storage_1.ALLOWED_AUDIO_MIME_TYPES; } });
Object.defineProperty(exports, "ALLOWED_IMAGE_EXTENSIONS", { enumerable: true, get: function () { return file_storage_1.ALLOWED_IMAGE_EXTENSIONS; } });
Object.defineProperty(exports, "ALLOWED_IMAGE_MIME_TYPES", { enumerable: true, get: function () { return file_storage_1.ALLOWED_IMAGE_MIME_TYPES; } });
Object.defineProperty(exports, "ALLOWED_VIDEO_EXTENSIONS", { enumerable: true, get: function () { return file_storage_1.ALLOWED_VIDEO_EXTENSIONS; } });
Object.defineProperty(exports, "ALLOWED_VIDEO_MIME_TYPES", { enumerable: true, get: function () { return file_storage_1.ALLOWED_VIDEO_MIME_TYPES; } });
Object.defineProperty(exports, "BLOCKED_UPLOAD_EXTENSIONS", { enumerable: true, get: function () { return file_storage_1.BLOCKED_UPLOAD_EXTENSIONS; } });
Object.defineProperty(exports, "SCRIPT_CAPABLE_NON_DOCUMENT_EXTENSIONS", { enumerable: true, get: function () { return file_storage_1.SCRIPT_CAPABLE_NON_DOCUMENT_EXTENSIONS; } });
Object.defineProperty(exports, "FileStorage", { enumerable: true, get: function () { return file_storage_1.FileStorage; } });
Object.defineProperty(exports, "FileStorageFactory", { enumerable: true, get: function () { return file_storage_1.FileStorageFactory; } });
Object.defineProperty(exports, "MARKUP_SCAN_MAX_BYTES", { enumerable: true, get: function () { return file_storage_1.MARKUP_SCAN_MAX_BYTES; } });
Object.defineProperty(exports, "UploadedFileStorage", { enumerable: true, get: function () { return file_storage_1.UploadedFileStorage; } });
Object.defineProperty(exports, "archiveUploadFileFilter", { enumerable: true, get: function () { return file_storage_1.archiveUploadFileFilter; } });
Object.defineProperty(exports, "assertNotMarkupContent", { enumerable: true, get: function () { return file_storage_1.assertNotMarkupContent; } });
Object.defineProperty(exports, "audioUploadFileFilter", { enumerable: true, get: function () { return file_storage_1.audioUploadFileFilter; } });
Object.defineProperty(exports, "createUploadFileFilter", { enumerable: true, get: function () { return file_storage_1.createUploadFileFilter; } });
Object.defineProperty(exports, "documentUploadFileFilter", { enumerable: true, get: function () { return file_storage_1.documentUploadFileFilter; } });
Object.defineProperty(exports, "imageUploadFileFilter", { enumerable: true, get: function () { return file_storage_1.imageUploadFileFilter; } });
Object.defineProperty(exports, "isMarkupContent", { enumerable: true, get: function () { return file_storage_1.isMarkupContent; } });
Object.defineProperty(exports, "shouldScanForMarkup", { enumerable: true, get: function () { return file_storage_1.shouldScanForMarkup; } });
Object.defineProperty(exports, "videoUploadFileFilter", { enumerable: true, get: function () { return file_storage_1.videoUploadFileFilter; } });
Object.defineProperty(exports, "RENDERABLE_KEY_EXTENSIONS", { enumerable: true, get: function () { return file_storage_1.RENDERABLE_KEY_EXTENSIONS; } });
Object.defineProperty(exports, "toSafeStorageExtension", { enumerable: true, get: function () { return file_storage_1.toSafeStorageExtension; } });
var interceptors_1 = require("./lib/core/interceptors");
Object.defineProperty(exports, "LazyFileInterceptor", { enumerable: true, get: function () { return interceptors_1.LazyFileInterceptor; } });
tslib_1.__exportStar(require("./lib/core/seeds"), exports);
var database_1 = require("./lib/database");
Object.defineProperty(exports, "ConnectionEntityManager", { enumerable: true, get: function () { return database_1.ConnectionEntityManager; } });
Object.defineProperty(exports, "createMigration", { enumerable: true, get: function () { return database_1.createMigration; } });
Object.defineProperty(exports, "generateMigration", { enumerable: true, get: function () { return database_1.generateMigration; } });
Object.defineProperty(exports, "prepareSQLQuery", { enumerable: true, get: function () { return database_1.prepareSQLQuery; } });
Object.defineProperty(exports, "revertLastDatabaseMigration", { enumerable: true, get: function () { return database_1.revertLastDatabaseMigration; } });
Object.defineProperty(exports, "runDatabaseMigrations", { enumerable: true, get: function () { return database_1.runDatabaseMigrations; } });
tslib_1.__exportStar(require("./lib/event-bus"), exports);
tslib_1.__exportStar(require("./lib/logger"), exports);
var redis_1 = require("./lib/redis");
Object.defineProperty(exports, "EVER_REDIS_CLIENT", { enumerable: true, get: function () { return redis_1.EVER_REDIS_CLIENT; } });
Object.defineProperty(exports, "RedisModule", { enumerable: true, get: function () { return redis_1.RedisModule; } });
tslib_1.__exportStar(require("./lib/shared"), exports);
var password_hash_1 = require("./lib/password-hash");
Object.defineProperty(exports, "PasswordHashModule", { enumerable: true, get: function () { return password_hash_1.PasswordHashModule; } });
Object.defineProperty(exports, "PasswordHashService", { enumerable: true, get: function () { return password_hash_1.PasswordHashService; } });
// `ActivityLogModule` and `MentionModule` are `@Global()`, so a plugin can inject these services
// without importing either module — but it still needs the classes as DI tokens/types. Exporting
// them is what lets a plugin write its own activity-log timeline and @mention fan-out through the
// platform mechanisms instead of re-implementing them.
var activity_log_service_1 = require("./lib/activity-log/activity-log.service");
Object.defineProperty(exports, "ActivityLogService", { enumerable: true, get: function () { return activity_log_service_1.ActivityLogService; } });
var mention_service_1 = require("./lib/mention/mention.service");
Object.defineProperty(exports, "MentionService", { enumerable: true, get: function () { return mention_service_1.MentionService; } });
// 🛑 `@Global()` means "available everywhere ONCE IMPORTED", not "always present". The API gets
// both modules through core's own `AppModule`; a host that builds its own module graph —
// `apps/worker`, which runs the plugin pipelines without core's HTTP `AppModule` — has to import
// them itself or it fails DI at boot on the first plugin that injects either service.
var activity_log_module_1 = require("./lib/activity-log/activity-log.module");
Object.defineProperty(exports, "ActivityLogModule", { enumerable: true, get: function () { return activity_log_module_1.ActivityLogModule; } });
var mention_module_1 = require("./lib/mention/mention.module");
Object.defineProperty(exports, "MentionModule", { enumerable: true, get: function () { return mention_module_1.MentionModule; } });
// Same rationale as `MentionService` above, for the entity-subscription fan-out: the handler is
// registered by core, but a plugin that wants an author subscribed to the entity they just created
// (the pattern `CommentService` uses) needs the event CLASS to publish — `@nestjs/cqrs` dispatches
// on the constructor, so a structurally identical local copy would never reach the handler.
var entity_subscription_create_event_1 = require("./lib/entity-subscription/events/entity-subscription.create.event");
Object.defineProperty(exports, "CreateEntitySubscriptionEvent", { enumerable: true, get: function () { return entity_subscription_create_event_1.CreateEntitySubscriptionEvent; } });
// `FeatureFlagGuard` is public API (exported from `./lib/shared`), so the module that provides
// its `FeatureService` dependency has to be public too — otherwise any plugin whose controllers
// carry `@UseGuards(..., FeatureFlagGuard)` cannot satisfy it and the whole API fails to
// bootstrap with an `UnknownDependenciesException`.
var feature_module_1 = require("./lib/feature/feature.module");
Object.defineProperty(exports, "FeatureModule", { enumerable: true, get: function () { return feature_module_1.FeatureModule; } });
var feature_service_1 = require("./lib/feature/feature.service");
Object.defineProperty(exports, "FeatureService", { enumerable: true, get: function () { return feature_service_1.FeatureService; } });
var feature_organization_service_1 = require("./lib/feature/feature-organization.service");
Object.defineProperty(exports, "FeatureOrganizationService", { enumerable: true, get: function () { return feature_organization_service_1.FeatureOrganizationService; } });
var role_1 = require("./lib/role");
Object.defineProperty(exports, "RoleAuthorizationService", { enumerable: true, get: function () { return role_1.RoleAuthorizationService; } });
Object.defineProperty(exports, "RoleModule", { enumerable: true, get: function () { return role_1.RoleModule; } });
Object.defineProperty(exports, "RoleService", { enumerable: true, get: function () { return role_1.RoleService; } });
var role_permission_1 = require("./lib/role-permission");
Object.defineProperty(exports, "RolePermissionModule", { enumerable: true, get: function () { return role_permission_1.RolePermissionModule; } });
Object.defineProperty(exports, "RolePermissionService", { enumerable: true, get: function () { return role_permission_1.RolePermissionService; } });
tslib_1.__exportStar(require("./lib/tenant"), exports);
var user_1 = require("./lib/user");
Object.defineProperty(exports, "UserModule", { enumerable: true, get: function () { return user_1.UserModule; } });
Object.defineProperty(exports, "UserService", { enumerable: true, get: function () { return user_1.UserService; } });
tslib_1.__exportStar(require("./lib/organization"), exports);
var organization_contact_1 = require("./lib/organization-contact");
Object.defineProperty(exports, "OrganizationContactCreateCommand", { enumerable: true, get: function () { return organization_contact_1.OrganizationContactCreateCommand; } });
Object.defineProperty(exports, "OrganizationContactModule", { enumerable: true, get: function () { return organization_contact_1.OrganizationContactModule; } });
Object.defineProperty(exports, "OrganizationContactService", { enumerable: true, get: function () { return organization_contact_1.OrganizationContactService; } });
var organization_project_1 = require("./lib/organization-project");
Object.defineProperty(exports, "OrganizationProjectCreateCommand", { enumerable: true, get: function () { return organization_project_1.OrganizationProjectCreateCommand; } });
Object.defineProperty(exports, "OrganizationProjectModule", { enumerable: true, get: function () { return organization_project_1.OrganizationProjectModule; } });
Object.defineProperty(exports, "OrganizationProjectService", { enumerable: true, get: function () { return organization_project_1.OrganizationProjectService; } });
Object.defineProperty(exports, "OrganizationProjectUpdateCommand", { enumerable: true, get: function () { return organization_project_1.OrganizationProjectUpdateCommand; } });
var organization_vendor_1 = require("./lib/organization-vendor");
Object.defineProperty(exports, "OrganizationVendorFirstOrCreateCommand", { enumerable: true, get: function () { return organization_vendor_1.OrganizationVendorFirstOrCreateCommand; } });
Object.defineProperty(exports, "OrganizationVendorModule", { enumerable: true, get: function () { return organization_vendor_1.OrganizationVendorModule; } });
Object.defineProperty(exports, "OrganizationVendorService", { enumerable: true, get: function () { return organization_vendor_1.OrganizationVendorService; } });
tslib_1.__exportStar(require("./lib/employee"), exports);
var tasks_1 = require("./lib/tasks");
Object.defineProperty(exports, "AutomationTaskSyncCommand", { enumerable: true, get: function () { return tasks_1.AutomationTaskSyncCommand; } });
Object.defineProperty(exports, "TaskCreateCommand", { enumerable: true, get: function () { return tasks_1.TaskCreateCommand; } });
Object.defineProperty(exports, "TaskModule", { enumerable: true, get: function () { return tasks_1.TaskModule; } });
Object.defineProperty(exports, "TaskService", { enumerable: true, get: function () { return tasks_1.TaskService; } });
Object.defineProperty(exports, "TaskUpdateCommand", { enumerable: true, get: function () { return tasks_1.TaskUpdateCommand; } });
var integration_1 = require("./lib/integration");
Object.defineProperty(exports, "IntegrationModule", { enumerable: true, get: function () { return integration_1.IntegrationModule; } });
Object.defineProperty(exports, "IntegrationService", { enumerable: true, get: function () { return integration_1.IntegrationService; } });
var integration_entity_setting_1 = require("./lib/integration-entity-setting");
Object.defineProperty(exports, "DEFAULT_ENTITY_SETTINGS", { enumerable: true, get: function () { return integration_entity_setting_1.DEFAULT_ENTITY_SETTINGS; } });
Object.defineProperty(exports, "IntegrationEntitySettingModule", { enumerable: true, get: function () { return integration_entity_setting_1.IntegrationEntitySettingModule; } });
Object.defineProperty(exports, "IntegrationEntitySettingService", { enumerable: true, get: function () { return integration_entity_setting_1.IntegrationEntitySettingService; } });
var integration_entity_setting_tied_1 = require("./lib/integration-entity-setting-tied");
Object.defineProperty(exports, "IntegrationEntitySettingTiedModule", { enumerable: true, get: function () { return integration_entity_setting_tied_1.IntegrationEntitySettingTiedModule; } });
Object.defineProperty(exports, "IntegrationEntitySettingTiedService", { enumerable: true, get: function () { return integration_entity_setting_tied_1.IntegrationEntitySettingTiedService; } });
Object.defineProperty(exports, "PROJECT_TIED_ENTITIES", { enumerable: true, get: function () { return integration_entity_setting_tied_1.PROJECT_TIED_ENTITIES; } });
var integration_map_1 = require("./lib/integration-map");
Object.defineProperty(exports, "IntegrationMapModule", { enumerable: true, get: function () { return integration_map_1.IntegrationMapModule; } });
Object.defineProperty(exports, "IntegrationMapService", { enumerable: true, get: function () { return integration_map_1.IntegrationMapService; } });
Object.defineProperty(exports, "IntegrationMapSyncActivityCommand", { enumerable: true, get: function () { return integration_map_1.IntegrationMapSyncActivityCommand; } });
Object.defineProperty(exports, "IntegrationMapSyncEntityCommand", { enumerable: true, get: function () { return integration_map_1.IntegrationMapSyncEntityCommand; } });
Object.defineProperty(exports, "IntegrationMapSyncIssueCommand", { enumerable: true, get: function () { return integration_map_1.IntegrationMapSyncIssueCommand; } });
Object.defineProperty(exports, "IntegrationMapSyncLabelCommand", { enumerable: true, get: function () { return integration_map_1.IntegrationMapSyncLabelCommand; } });
Object.defineProperty(exports, "IntegrationMapSyncOrganizationCommand", { enumerable: true, get: function () { return integration_map_1.IntegrationMapSyncOrganizationCommand; } });
Object.defineProperty(exports, "IntegrationMapSyncProjectCommand", { enumerable: true, get: function () { return integration_map_1.IntegrationMapSyncProjectCommand; } });
Object.defineProperty(exports, "IntegrationMapSyncScreenshotCommand", { enumerable: true, get: function () { return integration_map_1.IntegrationMapSyncScreenshotCommand; } });
Object.defineProperty(exports, "IntegrationMapSyncTaskCommand", { enumerable: true, get: function () { return integration_map_1.IntegrationMapSyncTaskCommand; } });
Object.defineProperty(exports, "IntegrationMapSyncTimeLogCommand", { enumerable: true, get: function () { return integration_map_1.IntegrationMapSyncTimeLogCommand; } });
Object.defineProperty(exports, "IntegrationMapSyncTimeSlotCommand", { enumerable: true, get: function () { return integration_map_1.IntegrationMapSyncTimeSlotCommand; } });
var integration_setting_1 = require("./lib/integration-setting");
Object.defineProperty(exports, "IntegrationSettingCreateCommand", { enumerable: true, get: function () { return integration_setting_1.IntegrationSettingCreateCommand; } });
Object.defineProperty(exports, "IntegrationSettingGetCommand", { enumerable: true, get: function () { return integration_setting_1.IntegrationSettingGetCommand; } });
Object.defineProperty(exports, "IntegrationSettingGetManyCommand", { enumerable: true, get: function () { return integration_setting_1.IntegrationSettingGetManyCommand; } });
Object.defineProperty(exports, "IntegrationSettingModule", { enumerable: true, get: function () { return integration_setting_1.IntegrationSettingModule; } });
Object.defineProperty(exports, "IntegrationSettingService", { enumerable: true, get: function () { return integration_setting_1.IntegrationSettingService; } });
var integration_tenant_1 = require("./lib/integration-tenant");
Object.defineProperty(exports, "IntegrationTenantGetCommand", { enumerable: true, get: function () { return integration_tenant_1.IntegrationTenantGetCommand; } });
Object.defineProperty(exports, "IntegrationTenantModule", { enumerable: true, get: function () { return integration_tenant_1.IntegrationTenantModule; } });
Object.defineProperty(exports, "IntegrationTenantService", { enumerable: true, get: function () { return integration_tenant_1.IntegrationTenantService; } });
Object.defineProperty(exports, "IntegrationTenantUpdateOrCreateCommand", { enumerable: true, get: function () { return integration_tenant_1.IntegrationTenantUpdateOrCreateCommand; } });
var tenant_api_key_1 = require("./lib/tenant-api-key");
Object.defineProperty(exports, "TenantApiKeyModule", { enumerable: true, get: function () { return tenant_api_key_1.TenantApiKeyModule; } });
Object.defineProperty(exports, "TenantApiKeyService", { enumerable: true, get: function () { return tenant_api_key_1.TenantApiKeyService; } });
var custom_tracking_1 = require("./lib/time-tracking/custom-tracking");
Object.defineProperty(exports, "CustomTrackingModule", { enumerable: true, get: function () { return custom_tracking_1.CustomTrackingModule; } });
Object.defineProperty(exports, "CustomTrackingService", { enumerable: true, get: function () { return custom_tracking_1.CustomTrackingService; } });
var screenshot_1 = require("./lib/time-tracking/screenshot");
Object.defineProperty(exports, "ScreenshotCreateCommand", { enumerable: true, get: function () { return screenshot_1.ScreenshotCreateCommand; } });
Object.defineProperty(exports, "ScreenshotModule", { enumerable: true, get: function () { return screenshot_1.ScreenshotModule; } });
Object.defineProperty(exports, "ScreenshotService", { enumerable: true, get: function () { return screenshot_1.ScreenshotService; } });
var time_log_1 = require("./lib/time-tracking/time-log");
Object.defineProperty(exports, "TimeLogCreateCommand", { enumerable: true, get: function () { return time_log_1.TimeLogCreateCommand; } });
Object.defineProperty(exports, "TimeLogModule", { enumerable: true, get: function () { return time_log_1.TimeLogModule; } });
Object.defineProperty(exports, "TimeLogService", { enumerable: true, get: function () { return time_log_1.TimeLogService; } });
var time_slot_1 = require("./lib/time-tracking/time-slot");
Object.defineProperty(exports, "CreateTimeSlotMinutesCommand", { enumerable: true, get: function () { return time_slot_1.CreateTimeSlotMinutesCommand; } });
Object.defineProperty(exports, "TimeSlotCreateCommand", { enumerable: true, get: function () { return time_slot_1.TimeSlotCreateCommand; } });
Object.defineProperty(exports, "TimeSlotModule", { enumerable: true, get: function () { return time_slot_1.TimeSlotModule; } });
Object.defineProperty(exports, "TimeSlotService", { enumerable: true, get: function () { return time_slot_1.TimeSlotService; } });
var timer_1 = require("./lib/time-tracking/timer");
Object.defineProperty(exports, "GetTimerStatusQuery", { enumerable: true, get: function () { return timer_1.GetTimerStatusQuery; } });
Object.defineProperty(exports, "StartTimerCommand", { enumerable: true, get: function () { return timer_1.StartTimerCommand; } });
Object.defineProperty(exports, "StopTimerCommand", { enumerable: true, get: function () { return timer_1.StopTimerCommand; } });
Object.defineProperty(exports, "TimerStartedEvent", { enumerable: true, get: function () { return timer_1.TimerStartedEvent; } });
Object.defineProperty(exports, "TimerStatusUpdatedEvent", { enumerable: true, get: function () { return timer_1.TimerStatusUpdatedEvent; } });
Object.defineProperty(exports, "TimerStoppedEvent", { enumerable: true, get: function () { return timer_1.TimerStoppedEvent; } });
var handlers_1 = require("./lib/time-tracking/timer/commands/handlers");
Object.defineProperty(exports, "CommandHandlers", { enumerable: true, get: function () { return handlers_1.CommandHandlers; } });
var handlers_2 = require("./lib/time-tracking/timer/queries/handlers");
Object.defineProperty(exports, "QueryHandlers", { enumerable: true, get: function () { return handlers_2.QueryHandlers; } });
var timer_module_1 = require("./lib/time-tracking/timer/timer.module");
Object.defineProperty(exports, "TimerModule", { enumerable: true, get: function () { return timer_module_1.TimerModule; } });
var timer_service_1 = require("./lib/time-tracking/timer/timer.service");
Object.defineProperty(exports, "TimerService", { enumerable: true, get: function () { return timer_service_1.TimerService; } });
tslib_1.__exportStar(require("./lib/database/database.module"), exports);
// Export-archive opt-out for plugin entities holding DERIVED data (extracted text, embeddings,
// caches). Public API because the entities that need it live in plugins — without it every plugin
// entity is registered for export automatically, which is right for authored records and wrong for
// tables the platform rebuilds after an import.
var skip_export_decorator_1 = require("./lib/export-import/skip-export.decorator");
Object.defineProperty(exports, "isExportSkipped", { enumerable: true, get: function () { return skip_export_decorator_1.isExportSkipped; } });
Object.defineProperty(exports, "SKIP_EXPORT_METADATA", { enumerable: true, get: function () { return skip_export_decorator_1.SKIP_EXPORT_METADATA; } });
Object.defineProperty(exports, "SkipExport", { enumerable: true, get: function () { return skip_export_decorator_1.SkipExport; } });
Object.defineProperty(exports, "skipExport", { enumerable: true, get: function () { return skip_export_decorator_1.skipExport; } });
// Column-level counterpart: mark a credential column so the CSV export writes it masked. Public for
// the same reason — plugin entities carry credentials too, and `csv-writer` reads properties
// directly, so class-transformer's `@Exclude` does not reach them (GHSA-j5h5-r956-rxc3).
var export_redact_decorator_1 = require("./lib/export-import/export-redact.decorator");
Object.defineProperty(exports, "EXPORT_REDACT_METADATA", { enumerable: true, get: function () { return export_redact_decorator_1.EXPORT_REDACT_METADATA; } });
Object.defineProperty(exports, "ExportRedacted", { enumerable: true, get: function () { return export_redact_decorator_1.ExportRedacted; } });
Object.defineProperty(exports, "exportRedacted", { enumerable: true, get: function () { return export_redact_decorator_1.exportRedacted; } });
Object.defineProperty(exports, "getExportRedactedProperties", { enumerable: true, get: function () { return export_redact_decorator_1.getExportRedactedProperties; } });
Object.defineProperty(exports, "maskEmbeddedSecret", { enumerable: true, get: function () { return export_redact_decorator_1.maskEmbeddedSecret; } });
Object.defineProperty(exports, "redactForExport", { enumerable: true, get: function () { return export_redact_decorator_1.redactForExport; } });
var expense_1 = require("./lib/expense");
Object.defineProperty(exports, "ExpenseCreateCommand", { enumerable: true, get: function () { return expense_1.ExpenseCreateCommand; } });
Object.defineProperty(exports, "ExpenseModule", { enumerable: true, get: function () { return expense_1.ExpenseModule; } });
Object.defineProperty(exports, "ExpenseService", { enumerable: true, get: function () { return expense_1.ExpenseService; } });
var expense_categories_1 = require("./lib/expense-categories");
Object.defineProperty(exports, "ExpenseCategoriesModule", { enumerable: true, get: function () { return expense_categories_1.ExpenseCategoriesModule; } });
Object.defineProperty(exports, "ExpenseCategoriesService", { enumerable: true, get: function () { return expense_categories_1.ExpenseCategoriesService; } });
Object.defineProperty(exports, "ExpenseCategoryFirstOrCreateCommand", { enumerable: true, get: function () { return expense_categories_1.ExpenseCategoryFirstOrCreateCommand; } });
var income_1 = require("./lib/income");
Object.defineProperty(exports, "IncomeCreateCommand", { enumerable: true, get: function () { return income_1.IncomeCreateCommand; } });
Object.defineProperty(exports, "IncomeModule", { enumerable: true, get: function () { return income_1.IncomeModule; } });
Object.defineProperty(exports, "IncomeService", { enumerable: true, get: function () { return income_1.IncomeService; } });
var tag_type_1 = require("./lib/tag-type");
Object.defineProperty(exports, "TagTypeModule", { enumerable: true, get: function () { return tag_type_1.TagTypeModule; } });
Object.defineProperty(exports, "TagTypeService", { enumerable: true, get: function () { return tag_type_1.TagTypeService; } });
var tags_1 = require("./lib/tags");
Object.defineProperty(exports, "AutomationLabelSyncCommand", { enumerable: true, get: function () { return tags_1.AutomationLabelSyncCommand; } });
Object.defineProperty(exports, "RelationalTagDTO", { enumerable: true, get: function () { return tags_1.RelationalTagDTO; } });
Object.defineProperty(exports, "TagModule", { enumerable: true, get: function () { return tags_1.TagModule; } });
Object.defineProperty(exports, "TagService", { enumerable: true, get: function () { return tags_1.TagService; } });
tslib_1.__exportStar(require("./lib/token"), exports);
//# sourceMappingURL=index.js.map