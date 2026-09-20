"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const scheduler_1 = require("@gauzy/scheduler");
const redis_1 = require("@keyv/redis");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const serve_static_1 = require("@nestjs/serve-static");
const throttler_1 = require("@nestjs/throttler");
const cacheable_1 = require("cacheable");
const chalk = require("chalk");
const redis_module_1 = require("../redis/redis.module");
const keyv_1 = require("keyv");
const moment = require("moment");
const nestjs_cls_1 = require("nestjs-cls");
const nestjs_i18n_1 = require("nestjs-i18n");
const path = require("path");
const unleash_client_1 = require("unleash-client");
const access_token_module_1 = require("../access-token/access-token.module");
const accounting_template_module_1 = require("../accounting-template/accounting-template.module");
const activity_log_module_1 = require("../activity-log/activity-log.module");
const api_call_log_module_1 = require("../api-call-log/api-call-log.module"); // Global Api Call Log Module
const appointment_employees_module_1 = require("../appointment-employees/appointment-employees.module");
const approval_policy_module_1 = require("../approval-policy/approval-policy.module");
const auth_module_1 = require("../auth/auth.module");
const social_account_module_1 = require("../auth/social-account/social-account.module");
const availability_slots_module_1 = require("../availability-slots/availability-slots.module");
const broadcast_module_1 = require("../broadcast/broadcast.module");
const candidate_criterion_rating_module_1 = require("../candidate-criterions-rating/candidate-criterion-rating.module");
const candidate_documents_module_1 = require("../candidate-documents/candidate-documents.module");
const candidate_education_module_1 = require("../candidate-education/candidate-education.module");
const candidate_experience_module_1 = require("../candidate-experience/candidate-experience.module");
const candidate_feedbacks_module_1 = require("../candidate-feedbacks/candidate-feedbacks.module");
const candidate_interview_module_1 = require("../candidate-interview/candidate-interview.module");
const candidate_interviewers_module_1 = require("../candidate-interviewers/candidate-interviewers.module");
const candidate_personal_qualities_module_1 = require("../candidate-personal-qualities/candidate-personal-qualities.module");
const candidate_skill_module_1 = require("../candidate-skill/candidate-skill.module");
const candidate_source_module_1 = require("../candidate-source/candidate-source.module");
const candidate_technologies_module_1 = require("../candidate-technologies/candidate-technologies.module");
const candidate_module_1 = require("../candidate/candidate.module");
const comment_module_1 = require("../comment/comment.module");
const contact_module_1 = require("../contact/contact.module");
const request_context_1 = require("../core/context/request-context");
const core_module_1 = require("../core/core.module");
const interceptors_1 = require("../core/interceptors");
const seeder_module_1 = require("../core/seeds/seeder.module");
const country_module_1 = require("../country/country.module");
const currency_module_1 = require("../currency/currency.module");
const custom_smtp_module_1 = require("../custom-smtp/custom-smtp.module");
const dashboard_widget_module_1 = require("../dashboard/dashboard-widget/dashboard-widget.module");
const dashboard_module_1 = require("../dashboard/dashboard.module");
const deal_module_1 = require("../deal/deal.module");
const email_check_module_1 = require("../email-check/email-check.module");
const email_history_module_1 = require("../email-history/email-history.module");
const email_reset_module_1 = require("../email-reset/email-reset.module");
const email_template_module_1 = require("../email-template/email-template.module");
const employee_appointment_module_1 = require("../employee-appointment/employee-appointment.module");
const employee_award_module_1 = require("../employee-award/employee-award.module");
const employee_level_module_1 = require("../employee-level/employee-level.module");
const employee_notification_setting_module_1 = require("../employee-notification-setting/employee-notification-setting.module");
const employee_notification_module_1 = require("../employee-notification/employee-notification.module");
const employee_recent_visit_module_1 = require("../employee-recent-visit/employee-recent-visit.module");
const employee_recurring_expense_module_1 = require("../employee-recurring-expense/employee-recurring-expense.module");
const employee_setting_module_1 = require("../employee-setting/employee-setting.module");
const employee_statistics_module_1 = require("../employee-statistics/employee-statistics.module");
const employee_module_1 = require("../employee/employee.module");
const entity_subscription_module_1 = require("../entity-subscription/entity-subscription.module");
const equipment_sharing_policy_module_1 = require("../equipment-sharing-policy/equipment-sharing-policy.module");
const equipment_sharing_module_1 = require("../equipment-sharing/equipment-sharing.module");
const equipment_module_1 = require("../equipment/equipment.module");
const estimate_email_module_1 = require("../estimate-email/estimate-email.module");
const event_type_module_1 = require("../event-types/event-type.module");
const expense_categories_module_1 = require("../expense-categories/expense-categories.module");
const expense_module_1 = require("../expense/expense.module");
const export_module_1 = require("../export-import/export/export.module");
const import_module_1 = require("../export-import/import/import.module");
const favorite_module_1 = require("../favorite/favorite.module");
const global_favorite_service_module_1 = require("../favorite/global-favorite-service.module");
const feature_module_1 = require("../feature/feature.module");
const gauzy_cloud_module_1 = require("../gauzy-cloud/gauzy-cloud.module");
const goal_general_setting_module_1 = require("../goal-general-setting/goal-general-setting.module");
const goal_kpi_template_module_1 = require("../goal-kpi-template/goal-kpi-template.module");
const goal_kpi_module_1 = require("../goal-kpi/goal-kpi.module");
const goal_template_module_1 = require("../goal-template/goal-template.module");
const goal_time_frame_module_1 = require("../goal-time-frame/goal-time-frame.module");
const goal_module_1 = require("../goal/goal.module");
const health_module_1 = require("../health/health.module");
const helper_1 = require("../helper");
const image_asset_module_1 = require("../image-asset/image-asset.module");
const income_module_1 = require("../income/income.module");
const integration_entity_setting_tied_module_1 = require("../integration-entity-setting-tied/integration-entity-setting-tied.module");
const integration_entity_setting_module_1 = require("../integration-entity-setting/integration-entity-setting.module");
const integration_map_module_1 = require("../integration-map/integration-map.module");
const integration_setting_module_1 = require("../integration-setting/integration-setting.module");
const integration_tenant_module_1 = require("../integration-tenant/integration-tenant.module");
const integration_module_1 = require("../integration/integration.module");
const invite_module_1 = require("../invite/invite.module");
const invoice_estimate_history_module_1 = require("../invoice-estimate-history/invoice-estimate-history.module");
const invoice_item_module_1 = require("../invoice-item/invoice-item.module");
const invoice_module_1 = require("../invoice/invoice.module");
const keyresult_template_module_1 = require("../keyresult-template/keyresult-template.module");
const keyresult_update_module_1 = require("../keyresult-update/keyresult-update.module");
const keyresult_module_1 = require("../keyresult/keyresult.module");
const language_module_1 = require("../language/language.module");
const mention_module_1 = require("../mention/mention.module");
const merchant_module_1 = require("../merchant/merchant.module");
const organization_award_module_1 = require("../organization-award/organization-award.module");
const organization_contact_module_1 = require("../organization-contact/organization-contact.module");
const organization_department_module_1 = require("../organization-department/organization-department.module");
const organization_document_module_1 = require("../organization-document/organization-document.module");
const organization_employment_type_module_1 = require("../organization-employment-type/organization-employment-type.module");
const organization_language_module_1 = require("../organization-language/organization-language.module");
const organization_position_module_1 = require("../organization-position/organization-position.module");
const organization_project_module_module_1 = require("../organization-project-module/organization-project-module.module");
const organization_project_module_1 = require("../organization-project/organization-project.module");
const organization_recurring_expense_module_1 = require("../organization-recurring-expense/organization-recurring-expense.module");
const organization_sprint_module_1 = require("../organization-sprint/organization-sprint.module");
const organization_strategic_initiative_module_1 = require("../organization-strategic-initiative/organization-strategic-initiative.module");
const organization_task_setting_module_1 = require("../organization-task-setting/organization-task-setting.module");
const organization_team_employee_module_1 = require("../organization-team-employee/organization-team-employee.module");
const organization_team_join_request_module_1 = require("../organization-team-join-request/organization-team-join-request.module");
const organization_team_module_1 = require("../organization-team/organization-team.module");
const organization_vendor_module_1 = require("../organization-vendor/organization-vendor.module");
const organization_module_1 = require("../organization/organization.module");
const password_hash_module_1 = require("../password-hash/password-hash.module");
const payment_module_1 = require("../payment/payment.module");
const payroll_run_module_1 = require("../payroll-run/payroll-run.module");
const pipeline_stage_module_1 = require("../pipeline-stage/pipeline-stage.module");
const pipeline_module_1 = require("../pipeline/pipeline.module");
const product_category_module_1 = require("../product-category/product-category.module");
const product_setting_module_1 = require("../product-setting/product-setting.module");
const product_type_module_1 = require("../product-type/product-type.module");
const product_variant_price_module_1 = require("../product-variant-price/product-variant-price-module");
const product_variant_module_1 = require("../product-variant/product-variant.module");
const product_module_1 = require("../product/product.module");
const public_share_module_1 = require("../public-share/public-share.module");
const reaction_module_1 = require("../reaction/reaction.module");
const refresh_token_module_1 = require("../refresh-token/refresh-token.module");
const report_module_1 = require("../reports/report.module");
const request_approval_employee_module_1 = require("../request-approval-employee/request-approval-employee.module");
const request_approval_team_module_1 = require("../request-approval-team/request-approval-team.module");
const request_approval_module_1 = require("../request-approval/request-approval.module");
const resource_link_module_1 = require("../resource-link/resource-link.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const role_module_1 = require("../role/role.module");
const shared_entity_module_1 = require("../shared-entity/shared-entity.module");
const api_key_auth_guard_1 = require("../shared/guards/api-key-auth.guard");
const validator_module_1 = require("../shared/validators/validator.module");
const skill_module_1 = require("../skills/skill.module");
const stats_module_1 = require("../stats/stats.module"); // Global Stats Module
const tag_type_module_1 = require("../tag-type/tag-type.module");
const tag_module_1 = require("../tags/tag.module");
const daily_plan_module_1 = require("../tasks/daily-plan/daily-plan.module");
const task_estimation_module_1 = require("../tasks/estimation/task-estimation.module");
const issue_type_module_1 = require("../tasks/issue-type/issue-type.module");
const task_metadata_bootstrap_1 = require("../tasks/task-metadata-bootstrap");
const task_linked_issue_module_1 = require("../tasks/linked-issue/task-linked-issue.module");
const priority_module_1 = require("../tasks/priorities/priority.module");
const related_issue_type_module_1 = require("../tasks/related-issue-type/related-issue-type.module");
const screening_tasks_module_1 = require("../tasks/screening-tasks/screening-tasks.module");
const size_module_1 = require("../tasks/sizes/size.module");
const status_module_1 = require("../tasks/statuses/status.module");
const task_module_1 = require("../tasks/task.module");
const version_module_1 = require("../tasks/versions/version.module");
const view_module_1 = require("../tasks/views/view.module");
const oauth_client_module_1 = require("../auth/oauth-client/oauth-client.module");
const tenant_api_key_module_1 = require("../tenant-api-key/tenant-api-key.module");
const tenant_setting_module_1 = require("../tenant/tenant-setting/tenant-setting.module");
const tenant_module_1 = require("../tenant/tenant.module");
const billing_1 = require("../shared/billing");
const redis_throttler_storage_1 = require("../throttler/redis-throttler.storage");
const throttler_behind_proxy_guard_1 = require("../throttler/throttler-behind-proxy.guard");
const official_holiday_module_1 = require("../official-holiday/official-holiday.module");
const time_off_balance_module_1 = require("../time-off-balance/time-off-balance.module");
const time_off_policy_module_1 = require("../time-off-policy/time-off-policy.module");
const time_off_request_module_1 = require("../time-off-request/time-off-request.module");
const time_tracking_module_1 = require("../time-tracking/time-tracking.module");
const token_module_1 = require("../token/token.module");
const user_organization_module_1 = require("../user-organization/user-organization.module");
const user_module_1 = require("../user/user.module");
const warehouse_module_1 = require("../warehouse/warehouse.module");
const app_bootstrap_logger_1 = require("./app-bootstrap-logger");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const { unleashConfig } = config_1.environment;
if (unleashConfig.url) {
    const unleashInstanceConfig = {
        appName: unleashConfig.appName,
        url: unleashConfig.url,
        instanceId: unleashConfig.instanceId,
        refreshInterval: unleashConfig.refreshInterval,
        metricsInterval: unleashConfig.metricsInterval,
        // we may disable Metrics completely in production or in demo env
        disableMetrics: false,
        // we may use Redis storage provider instead of in memory
        storageProvider: new unleash_client_1.InMemStorageProvider()
    };
    if (unleashConfig.apiKey) {
        unleashInstanceConfig.customHeaders = {
            Authorization: unleashConfig.apiKey
        };
    }
    console.log(`Using Unleash Config: ${JSON.stringify(unleashInstanceConfig)}`);
    const instance = (0, unleash_client_1.initialize)(unleashInstanceConfig);
    // metrics hooks
    instance.on('registered', () => {
        console.log('Unleash Client Registered');
    });
    instance.on('error', console.error);
    instance.on('warn', console.log);
}
else {
    console.log('Unleash Client Not Registered. UNLEASH_API_URL configuration is not provided.');
}
if (config_1.environment.THROTTLE_ENABLED) {
    console.log('Throttle Enabled');
    const ttlValue = config_1.environment.THROTTLE_TTL;
    console.log('Throttle TTL: ', ttlValue);
    const limit = config_1.environment.THROTTLE_LIMIT;
    console.log('Throttle Limit: ', limit);
}
let AppModule = class AppModule {
    constructor(clsService) {
        this.clsService = clsService;
        // Set Monday as start of the week
        moment.updateLocale(contracts_1.LanguagesEnum.ENGLISH, {
            week: { dow: 1 }
        });
    }
    onModuleInit() {
        // Set the ClsService in RequestContext one time on app start before any request
        request_context_1.RequestContext.setClsService(this.clsService);
        console.log('AppModule initialized, ClsService set in RequestContext.');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_cls_1.ClsModule.forRoot({
                global: true,
                middleware: { mount: false }
            }),
            // Cache Module Configuration with 2-layer caching (in-memory L1 + Redis L2)
            ...(process.env.REDIS_ENABLED === 'true'
                ? [
                    cache_manager_1.CacheModule.registerAsync({
                        isGlobal: true,
                        useFactory: async () => {
                            // Build Redis URL from environment variables
                            const { REDIS_URL, REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASSWORD, REDIS_TLS } = process.env;
                            // Validate Redis configuration
                            if (!REDIS_URL && (!REDIS_HOST || !REDIS_PORT)) {
                                console.warn('Redis is enabled but neither REDIS_URL nor REDIS_HOST/REDIS_PORT are configured. Falling back to in-memory cache.');
                                // Return in-memory cache configuration (no store specified = default in-memory)
                                return {};
                            }
                            // Construct Redis URL
                            const url = REDIS_URL ||
                                (() => {
                                    const redisProtocol = REDIS_TLS === 'true' ? 'rediss' : 'redis';
                                    const auth = REDIS_USER && REDIS_PASSWORD ? `${REDIS_USER}:${REDIS_PASSWORD}@` : '';
                                    return `${redisProtocol}://${auth}${REDIS_HOST}:${REDIS_PORT}`;
                                })();
                            try {
                                // Parse Redis URL
                                const parsedUrl = new URL(url);
                                const isTls = parsedUrl.protocol === 'rediss:';
                                const username = parsedUrl.username || REDIS_USER;
                                const password = parsedUrl.password || REDIS_PASSWORD || undefined;
                                const host = parsedUrl.hostname || REDIS_HOST;
                                const port = parseInt(parsedUrl.port || REDIS_PORT || '6379', 10);
                                const primary = new keyv_1.Keyv({
                                    store: new cacheable_1.CacheableMemory({ ttl: '1h', lruSize: 10000 })
                                });
                                // Create non-blocking Redis secondary store using helper function
                                // This automatically configures:
                                // - disableOfflineQueue: true
                                // - socket.reconnectStrategy: false (overrides any custom strategy)
                                // - throwOnConnectError: false
                                const secondary = (0, redis_1.createKeyvNonBlocking)({
                                    url,
                                    username,
                                    password,
                                    socket: isTls
                                        ? {
                                            // TLS socket options (RedisTlsOptions)
                                            host,
                                            port,
                                            tls: true,
                                            rejectUnauthorized: process.env.NODE_ENV === 'production',
                                            // Connection timeout
                                            connectTimeout: 10_000
                                        }
                                        : {
                                            // TCP socket options (RedisTcpOptions)
                                            host,
                                            port,
                                            // TCP keepalive (value in milliseconds for initial delay)
                                            keepAlive: true,
                                            keepAliveInitialDelay: 10_000,
                                            // Connection timeout
                                            connectTimeout: 10_000
                                        },
                                    // Send PING every 30s to keep connection alive
                                    pingInterval: 30_000
                                });
                                // Create Cacheable instance with 2-layer caching
                                // Note: The Cacheable instance is prepared for future use but cache-manager currently
                                // uses the raw Keyv stores directly, bypassing Cacheable's coordination features.
                                // For full non-blocking semantics, a dedicated CacheService could use cacheable directly
                                const cacheable = new cacheable_1.Cacheable({
                                    primary,
                                    // Layer 2: Redis secondary store (non-blocking)
                                    secondary,
                                    // Enable non-blocking mode (critical!)
                                    // Writes to Redis happen in background, reads check primary first
                                    nonBlocking: true,
                                    // Default TTL: 1 week
                                    ttl: '7d'
                                });
                                console.log('✓ Redis cache configured successfully (2-layer: in-memory + Redis)');
                                // Wrap cacheable to ensure type compatibility with cache-manager
                                // This provides proper type safety without 'as any' cast
                                return {
                                    stores: cacheable
                                };
                            }
                            catch (error) {
                                console.error('Failed to configure Redis cache, falling back to in-memory cache:', error.message);
                                // Return in-memory cache configuration as fallback
                                // This ensures cache operations continue to work even if Redis fails
                                return {};
                            }
                        }
                    })
                ]
                : [cache_manager_1.CacheModule.register({ isGlobal: true })]),
            // Redis client for atomic operations (e.g. GETDEL for single-use OAuth codes)
            redis_module_1.RedisModule,
            // Serve Static Module Configuration
            serve_static_1.ServeStaticModule.forRootAsync({
                useFactory: async (config) => {
                    console.log(chalk.green(`✔ Serve Static Config -> process.cwd: ${process.cwd()}`));
                    return await (0, helper_1.resolveServeStaticPath)(config);
                },
                inject: [config_1.ConfigService]
            }),
            platform_express_1.MulterModule.register(),
            nestjs_i18n_1.I18nModule.forRoot({
                fallbackLanguage: contracts_1.LanguagesEnum.ENGLISH,
                loaderOptions: {
                    path: config_1.environment.isElectron && config_1.environment.electronResourcesPath
                        ? path.resolve(config_1.environment.electronResourcesPath, 'app.asar.unpacked/node_modules/@gauzy/core/src/lib/i18n')
                        : path.resolve(__dirname, '../i18n/'),
                    watch: !config_1.environment.production
                },
                resolvers: [new nestjs_i18n_1.HeaderResolver(['language'])]
            }),
            ...(config_1.environment.THROTTLE_ENABLED
                ? [
                    throttler_1.ThrottlerModule.forRootAsync({
                        imports: [redis_module_1.RedisModule],
                        inject: [redis_module_1.EVER_REDIS_CLIENT],
                        // Buckets live in Redis when one is configured, so the configured limit holds
                        // across every API replica instead of being multiplied by the replica count and
                        // reset by every rollout. Without Redis this resolves to `undefined` and the
                        // module keeps its own per-process store.
                        useFactory: (redisClient) => {
                            const storage = (0, redis_throttler_storage_1.createThrottlerStorage)(redisClient);
                            return {
                                throttlers: [
                                    {
                                        ttl: config_1.environment.THROTTLE_TTL,
                                        limit: config_1.environment.THROTTLE_LIMIT
                                    }
                                ],
                                ...(storage ? { storage } : {})
                            };
                        }
                    })
                ]
                : []),
            health_module_1.HealthModule,
            core_module_1.CoreModule,
            validator_module_1.ValidatorModule,
            auth_module_1.AuthModule,
            email_check_module_1.EmailCheckModule,
            user_module_1.UserModule,
            social_account_module_1.SocialAccountModule,
            employee_module_1.EmployeeModule,
            employee_recurring_expense_module_1.EmployeeRecurringExpenseModule,
            employee_award_module_1.EmployeeAwardModule,
            candidate_module_1.CandidateModule,
            candidate_documents_module_1.CandidateDocumentsModule,
            candidate_source_module_1.CandidateSourceModule,
            candidate_education_module_1.CandidateEducationModule,
            candidate_experience_module_1.CandidateExperienceModule,
            candidate_skill_module_1.CandidateSkillModule,
            candidate_feedbacks_module_1.CandidateFeedbacksModule,
            candidate_interview_module_1.CandidateInterviewModule,
            candidate_interviewers_module_1.CandidateInterviewersModule,
            candidate_personal_qualities_module_1.CandidatePersonalQualitiesModule,
            candidate_technologies_module_1.CandidateTechnologiesModule,
            candidate_criterion_rating_module_1.CandidateCriterionsRatingModule,
            custom_smtp_module_1.CustomSmtpModule,
            export_module_1.ExportModule,
            import_module_1.ImportModule,
            employee_setting_module_1.EmployeeSettingModule,
            employee_statistics_module_1.EmployeeStatisticsModule,
            employee_appointment_module_1.EmployeeAppointmentModule,
            appointment_employees_module_1.AppointmentEmployeesModule,
            role_module_1.RoleModule,
            organization_module_1.OrganizationModule,
            income_module_1.IncomeModule,
            expense_module_1.ExpenseModule,
            user_organization_module_1.UserOrganizationModule,
            organization_department_module_1.OrganizationDepartmentModule,
            organization_recurring_expense_module_1.OrganizationRecurringExpenseModule,
            organization_contact_module_1.OrganizationContactModule,
            organization_position_module_1.OrganizationPositionModule,
            organization_project_module_1.OrganizationProjectModule,
            organization_project_module_module_1.OrganizationProjectModuleModule,
            organization_vendor_module_1.OrganizationVendorModule,
            organization_award_module_1.OrganizationAwardModule,
            organization_language_module_1.OrganizationLanguageModule,
            organization_sprint_module_1.OrganizationSprintModule,
            organization_team_module_1.OrganizationTeamModule,
            organization_team_employee_module_1.OrganizationTeamEmployeeModule,
            organization_team_join_request_module_1.OrganizationTeamJoinRequestModule,
            organization_document_module_1.OrganizationDocumentModule,
            request_approval_employee_module_1.RequestApprovalEmployeeModule,
            request_approval_team_module_1.RequestApprovalTeamModule,
            email_history_module_1.EmailHistoryModule,
            email_template_module_1.EmailTemplateModule,
            country_module_1.CountryModule,
            currency_module_1.CurrencyModule,
            invite_module_1.InviteModule,
            official_holiday_module_1.OfficialHolidayModule,
            time_off_balance_module_1.TimeOffBalanceModule,
            time_off_policy_module_1.TimeOffPolicyModule,
            time_off_request_module_1.TimeOffRequestModule,
            approval_policy_module_1.ApprovalPolicyModule,
            equipment_sharing_policy_module_1.EquipmentSharingPolicyModule,
            request_approval_module_1.RequestApprovalModule,
            role_permission_module_1.RolePermissionModule,
            tenant_module_1.TenantModule,
            tenant_setting_module_1.TenantSettingModule,
            // In-product billing pages. Every route inside 404s unless STRIPE_SECRET_KEY is set, so a
            // self-hosted install carries the module but exposes no billing surface.
            billing_1.BillingModule,
            tag_module_1.TagModule,
            tag_type_module_1.TagTypeModule,
            skill_module_1.SkillModule,
            language_module_1.LanguageModule,
            invoice_module_1.InvoiceModule,
            invoice_item_module_1.InvoiceItemModule,
            payment_module_1.PaymentModule,
            payroll_run_module_1.PayrollRunModule,
            estimate_email_module_1.EstimateEmailModule,
            goal_module_1.GoalModule,
            goal_time_frame_module_1.GoalTimeFrameModule,
            goal_general_setting_module_1.GoalGeneralSettingModule,
            keyresult_module_1.KeyResultModule,
            keyresult_update_module_1.KeyResultUpdateModule,
            employee_level_module_1.EmployeeLevelModule,
            event_type_module_1.EventTypeModule,
            availability_slots_module_1.AvailabilitySlotsModule,
            pipeline_module_1.PipelineModule,
            pipeline_stage_module_1.StageModule,
            deal_module_1.DealModule,
            invoice_estimate_history_module_1.InvoiceEstimateHistoryModule,
            equipment_module_1.EquipmentModule,
            equipment_sharing_module_1.EquipmentSharingModule,
            task_module_1.TaskModule,
            priority_module_1.TaskPriorityModule,
            related_issue_type_module_1.TaskRelatedIssueTypeModule,
            size_module_1.TaskSizeModule,
            status_module_1.TaskStatusModule,
            version_module_1.TaskVersionModule,
            daily_plan_module_1.DailyPlanModule,
            screening_tasks_module_1.ScreeningTasksModule,
            organization_employment_type_module_1.OrganizationEmploymentTypeModule,
            time_tracking_module_1.TimeTrackingModule,
            feature_module_1.FeatureModule,
            report_module_1.ReportModule,
            expense_categories_module_1.ExpenseCategoriesModule,
            product_category_module_1.ProductCategoryModule,
            product_type_module_1.ProductTypeModule,
            product_module_1.ProductModule,
            image_asset_module_1.ImageAssetModule,
            integration_module_1.IntegrationModule,
            integration_setting_module_1.IntegrationSettingModule,
            integration_tenant_module_1.IntegrationTenantModule,
            integration_map_module_1.IntegrationMapModule,
            product_variant_price_module_1.ProductVariantPriceModule,
            product_variant_module_1.ProductVariantModule,
            product_setting_module_1.ProductVariantSettingModule,
            integration_entity_setting_module_1.IntegrationEntitySettingModule,
            integration_entity_setting_tied_module_1.IntegrationEntitySettingTiedModule,
            goal_kpi_module_1.GoalKpiModule,
            goal_template_module_1.GoalTemplateModule,
            keyresult_template_module_1.KeyresultTemplateModule,
            goal_kpi_template_module_1.GoalKpiTemplateModule,
            accounting_template_module_1.AccountingTemplateModule,
            seeder_module_1.SeederModule,
            warehouse_module_1.WarehouseModule,
            merchant_module_1.MerchantModule,
            gauzy_cloud_module_1.GauzyCloudModule,
            contact_module_1.ContactModule,
            public_share_module_1.PublicShareModule,
            email_reset_module_1.EmailResetModule,
            issue_type_module_1.IssueTypeModule,
            task_metadata_bootstrap_1.TaskMetadataBootstrapModule,
            task_linked_issue_module_1.TaskLinkedIssueModule,
            organization_task_setting_module_1.OrganizationTaskSettingModule,
            task_estimation_module_1.TaskEstimationModule,
            favorite_module_1.FavoriteModule,
            global_favorite_service_module_1.GlobalFavoriteModule,
            stats_module_1.StatsModule,
            reaction_module_1.ReactionModule,
            comment_module_1.CommentModule,
            activity_log_module_1.ActivityLogModule,
            api_call_log_module_1.ApiCallLogModule,
            view_module_1.TaskViewModule,
            resource_link_module_1.ResourceLinkModule,
            mention_module_1.MentionModule,
            entity_subscription_module_1.EntitySubscriptionModule,
            dashboard_module_1.DashboardModule,
            dashboard_widget_module_1.DashboardWidgetModule,
            employee_notification_module_1.EmployeeNotificationModule,
            employee_notification_setting_module_1.EmployeeNotificationSettingModule,
            tenant_api_key_module_1.TenantApiKeyModule,
            oauth_client_module_1.OAuthClientModule,
            employee_recent_visit_module_1.EmployeeRecentVisitModule,
            shared_entity_module_1.SharedEntityModule,
            broadcast_module_1.BroadcastModule,
            organization_strategic_initiative_module_1.OrganizationStrategicInitiativeModule,
            password_hash_module_1.PasswordHashModule,
            /**
             * PRODUCER-ONLY BullMQ root for the API process.
             *
             * Why it exists: plugins that offload work (today the Documents pipeline) can only reach
             * BullMQ through `SchedulerQueueService`, and that provider only exists where a
             * `SchedulerModule.forRoot()` was imported. Until this line the API had none, so every
             * `extract → classify → chunk → embed → index` stage — plus OCR and thumbnails — ran
             * INLINE in the API process while `apps/worker` sat idle.
             *
             * The two halves are deliberately split:
             * - `enableQueueing: true`  → registers `BullModule.forRoot()`, i.e. the connection that
             *   makes `SchedulerQueueService` resolvable and lets this process ENQUEUE.
             * - 🛑 `enabled: false`     → the job-runner half stays OFF. `SchedulerDiscoveryService`
             *   still discovers `@ScheduledJob` methods but `registerSchedules()` skips every one of
             *   them (`if (!job.options.enabled || !this.moduleOptions.enabled) continue`), and
             *   `SchedulerJobRunnerService.execute()` returns immediately, which also neuters the
             *   `runOnStart` path. `apps/worker` owns scheduled jobs; if the API ran them too, every
             *   scheduled job would execute twice.
             * - `logRegisteredJobs: false` → discovery would otherwise log "Registered scheduled job"
             *   for jobs this process will never fire.
             *
             * 🛑 Conditional by design — with `REDIS_ENABLED` unset there is NO root at all and every
             * consumer keeps its in-process fallback (the Documents plugin dispatches stages inline).
             * That is the path single-container and dev setups run on and it must keep working.
             * `SCHEDULER_QUEUE_ENABLED=false` forces it off even where Redis is configured.
             */
            ...((0, scheduler_1.isSchedulerQueueRootEnabled)()
                ? [
                    scheduler_1.SchedulerModule.forRoot({
                        enabled: false,
                        enableQueueing: true,
                        logRegisteredJobs: false
                    })
                ]
                : []),
            //Token cleanup scheduler is disabled by default; enable when ready
            token_module_1.TokenModule.forRoot({ enableScheduler: false }),
            access_token_module_1.AccessTokenModule,
            refresh_token_module_1.RefreshTokenModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            app_bootstrap_logger_1.AppBootstrapLogger,
            api_key_auth_guard_1.ApiKeyAuthGuard,
            ...(config_1.environment.THROTTLE_ENABLED
                ? [
                    {
                        provide: core_1.APP_GUARD,
                        useClass: throttler_behind_proxy_guard_1.ThrottlerBehindProxyGuard
                    }
                ]
                : []),
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: interceptors_1.TransformInterceptor
            }
        ]
    }),
    tslib_1.__metadata("design:paramtypes", [nestjs_cls_1.ClsService])
], AppModule);
//# sourceMappingURL=app.module.js.map