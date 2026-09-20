"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoriesService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const StringUtils_1 = require("typeorm/util/StringUtils");
const config_1 = require("@gauzy/config");
const plugin_1 = require("@gauzy/plugin");
const utils_1 = require("@gauzy/utils");
const connection_entity_manager_1 = require("../../database/connection-entity-manager");
const skip_export_decorator_1 = require("../skip-export.decorator");
const internal_1 = require("../../core/entities/internal");
const import_record_1 = require("../import-record");
const mikro_orm_accounting_template_repository_1 = require("../../accounting-template/repository/mikro-orm-accounting-template.repository");
const type_orm_accounting_template_repository_1 = require("../../accounting-template/repository/type-orm-accounting-template.repository");
const mikro_orm_appointment_employee_repository_1 = require("../../appointment-employees/repository/mikro-orm-appointment-employee.repository");
const type_orm_appointment_employee_repository_1 = require("../../appointment-employees/repository/type-orm-appointment-employee.repository");
const mikro_orm_approval_policy_repository_1 = require("../../approval-policy/repository/mikro-orm-approval-policy.repository");
const type_orm_approval_policy_repository_1 = require("../../approval-policy/repository/type-orm-approval-policy.repository");
const mikro_orm_availability_slot_repository_1 = require("../../availability-slots/repository/mikro-orm-availability-slot.repository");
const type_orm_availability_slot_repository_1 = require("../../availability-slots/repository/type-orm-availability-slot.repository");
const mikro_orm_candidate_criterions_rating_repository_1 = require("../../candidate-criterions-rating/repository/mikro-orm-candidate-criterions-rating.repository");
const type_orm_candidate_criterions_rating_repository_1 = require("../../candidate-criterions-rating/repository/type-orm-candidate-criterions-rating.repository");
const mikro_orm_candidate_document_repository_1 = require("../../candidate-documents/repository/mikro-orm-candidate-document.repository");
const type_orm_candidate_document_repository_1 = require("../../candidate-documents/repository/type-orm-candidate-document.repository");
const mikro_orm_candidate_education_repository_1 = require("../../candidate-education/repository/mikro-orm-candidate-education.repository");
const type_orm_candidate_education_repository_1 = require("../../candidate-education/repository/type-orm-candidate-education.repository");
const mikro_orm_candidate_experience_repository_1 = require("../../candidate-experience/repository/mikro-orm-candidate-experience.repository");
const type_orm_candidate_experience_repository_1 = require("../../candidate-experience/repository/type-orm-candidate-experience.repository");
const mikro_orm_candidate_feedback_repository_1 = require("../../candidate-feedbacks/repository/mikro-orm-candidate-feedback.repository");
const type_orm_candidate_feedback_repository_1 = require("../../candidate-feedbacks/repository/type-orm-candidate-feedback.repository");
const mikro_orm_candidate_interview_repository_1 = require("../../candidate-interview/repository/mikro-orm-candidate-interview.repository");
const type_orm_candidate_interview_repository_1 = require("../../candidate-interview/repository/type-orm-candidate-interview.repository");
const mikro_orm_candidate_interviewers_repository_1 = require("../../candidate-interviewers/repository/mikro-orm-candidate-interviewers.repository");
const type_orm_candidate_interviewers_repository_1 = require("../../candidate-interviewers/repository/type-orm-candidate-interviewers.repository");
const mikro_orm_candidate_personal_qualities_repository_1 = require("../../candidate-personal-qualities/repository/mikro-orm-candidate-personal-qualities.repository");
const type_orm_candidate_personal_qualities_repository_1 = require("../../candidate-personal-qualities/repository/type-orm-candidate-personal-qualities.repository");
const mikro_orm_candidate_skill_repository_1 = require("../../candidate-skill/repository/mikro-orm-candidate-skill.repository");
const type_orm_candidate_skill_repository_1 = require("../../candidate-skill/repository/type-orm-candidate-skill.repository");
const mikro_orm_candidate_source_repository_1 = require("../../candidate-source/repository/mikro-orm-candidate-source.repository");
const type_orm_candidate_source_repository_1 = require("../../candidate-source/repository/type-orm-candidate-source.repository");
const mikro_orm_candidate_technologies_repository_1 = require("../../candidate-technologies/repository/mikro-orm-candidate-technologies.repository");
const type_orm_candidate_technologies_repository_1 = require("../../candidate-technologies/repository/type-orm-candidate-technologies.repository");
const mikro_orm_candidate_repository_1 = require("../../candidate/repository/mikro-orm-candidate.repository");
const type_orm_candidate_repository_1 = require("../../candidate/repository/type-orm-candidate.repository");
const mikro_orm_contact_repository_1 = require("../../contact/repository/mikro-orm-contact.repository");
const type_orm_contact_repository_1 = require("../../contact/repository/type-orm-contact.repository");
const mikro_orm_custom_smtp_repository_1 = require("../../custom-smtp/repository/mikro-orm-custom-smtp.repository");
const type_orm_custom_smtp_repository_1 = require("../../custom-smtp/repository/type-orm-custom-smtp.repository");
const mikro_orm_deal_repository_1 = require("../../deal/repository/mikro-orm-deal.repository");
const type_orm_deal_repository_1 = require("../../deal/repository/type-orm-deal.repository");
const mikro_orm_email_history_repository_1 = require("../../email-history/repository/mikro-orm-email-history.repository");
const type_orm_email_history_repository_1 = require("../../email-history/repository/type-orm-email-history.repository");
const mikro_orm_email_template_repository_1 = require("../../email-template/repository/mikro-orm-email-template.repository");
const type_orm_email_template_repository_1 = require("../../email-template/repository/type-orm-email-template.repository");
const mikro_orm_employee_appointment_repository_1 = require("../../employee-appointment/repository/mikro-orm-employee-appointment.repository");
const type_orm_employee_appointment_repository_1 = require("../../employee-appointment/repository/type-orm-employee-appointment.repository");
const mikro_orm_employee_award_repository_1 = require("../../employee-award/repository/mikro-orm-employee-award.repository");
const type_orm_employee_award_repository_1 = require("../../employee-award/repository/type-orm-employee-award.repository");
const mikro_orm_employee_level_repository_1 = require("../../employee-level/repository/mikro-orm-employee-level.repository");
const type_orm_employee_level_repository_1 = require("../../employee-level/repository/type-orm-employee-level.repository");
const mikro_orm_employee_recurring_expense_repository_1 = require("../../employee-recurring-expense/repository/mikro-orm-employee-recurring-expense.repository");
const type_orm_employee_recurring_expense_repository_1 = require("../../employee-recurring-expense/repository/type-orm-employee-recurring-expense.repository");
const mikro_orm_employee_setting_repository_1 = require("../../employee-setting/repository/mikro-orm-employee-setting.repository");
const type_orm_employee_setting_repository_1 = require("../../employee-setting/repository/type-orm-employee-setting.repository");
const mikro_orm_employee_repository_1 = require("../../employee/repository/mikro-orm-employee.repository");
const type_orm_employee_repository_1 = require("../../employee/repository/type-orm-employee.repository");
const mikro_orm_equipment_sharing_policy_repository_1 = require("../../equipment-sharing-policy/repository/mikro-orm-equipment-sharing-policy.repository");
const type_orm_equipment_sharing_policy_repository_1 = require("../../equipment-sharing-policy/repository/type-orm-equipment-sharing-policy.repository");
const mikro_orm_equipment_sharing_repository_1 = require("../../equipment-sharing/repository/mikro-orm-equipment-sharing.repository");
const type_orm_equipment_sharing_repository_1 = require("../../equipment-sharing/repository/type-orm-equipment-sharing.repository");
const mikro_orm_equipment_repository_1 = require("../../equipment/repository/mikro-orm-equipment.repository");
const type_orm_equipment_repository_1 = require("../../equipment/repository/type-orm-equipment.repository");
const mikro_orm_estimate_email_repository_1 = require("../../estimate-email/repository/mikro-orm-estimate-email.repository");
const type_orm_estimate_email_repository_1 = require("../../estimate-email/repository/type-orm-estimate-email.repository");
const mikro_orm_event_type_repository_1 = require("../../event-types/repository/mikro-orm-event-type.repository");
const type_orm_event_types_repository_1 = require("../../event-types/repository/type-orm-event-types.repository");
const mikro_orm_expense_category_repository_1 = require("../../expense-categories/repository/mikro-orm-expense-category.repository");
const type_orm_expense_category_repository_1 = require("../../expense-categories/repository/type-orm-expense-category.repository");
const mikro_orm_expense_repository_1 = require("../../expense/repository/mikro-orm-expense.repository");
const type_orm_expense_repository_1 = require("../../expense/repository/type-orm-expense.repository");
const mikro_orm_feature_organization_repository_1 = require("../../feature/repository/mikro-orm-feature-organization.repository");
const mikro_orm_feature_repository_1 = require("../../feature/repository/mikro-orm-feature.repository");
const type_orm_feature_repository_1 = require("../../feature/repository/type-orm-feature.repository");
const type_orm_feature_organization_repository_1 = require("../../feature/repository/type-orm-feature-organization.repository");
const mikro_orm_goal_general_setting_repository_1 = require("../../goal-general-setting/repository/mikro-orm-goal-general-setting.repository");
const type_orm_goal_general_setting_repository_1 = require("../../goal-general-setting/repository/type-orm-goal-general-setting.repository");
const mikro_orm_goal_kpi_template_repository_1 = require("../../goal-kpi-template/repository/mikro-orm-goal-kpi-template.repository");
const type_orm_goal_kpi_template_repository_1 = require("../../goal-kpi-template/repository/type-orm-goal-kpi-template.repository");
const mikro_orm_goal_kpi_repository_1 = require("../../goal-kpi/repository/mikro-orm-goal-kpi.repository");
const type_orm_goal_kpi_repository_1 = require("../../goal-kpi/repository/type-orm-goal-kpi.repository");
const mikro_orm_goal_template_repository_1 = require("../../goal-template/repository/mikro-orm-goal-template.repository");
const type_orm_goal_template_repository_1 = require("../../goal-template/repository/type-orm-goal-template.repository");
const mikro_orm_goal_time_frame_repository_1 = require("../../goal-time-frame/repository/mikro-orm-goal-time-frame.repository");
const type_orm_goal_time_frame_repository_1 = require("../../goal-time-frame/repository/type-orm-goal-time-frame.repository");
const mikro_orm_goal_repository_1 = require("../../goal/repository/mikro-orm-goal.repository");
const type_orm_goal_repository_1 = require("../../goal/repository/type-orm-goal.repository");
const mikro_orm_image_asset_repository_1 = require("../../image-asset/repository/mikro-orm-image-asset.repository");
const type_orm_image_asset_repository_1 = require("../../image-asset/repository/type-orm-image-asset.repository");
const mikro_orm_income_repository_1 = require("../../income/repository/mikro-orm-income.repository");
const type_orm_income_repository_1 = require("../../income/repository/type-orm-income.repository");
const mikro_orm_integration_entity_setting_tied_repository_1 = require("../../integration-entity-setting-tied/repository/mikro-orm-integration-entity-setting-tied.repository");
const type_orm_integration_entity_setting_tied_repository_1 = require("../../integration-entity-setting-tied/repository/type-orm-integration-entity-setting-tied.repository");
const mikro_orm_integration_entity_setting_repository_1 = require("../../integration-entity-setting/repository/mikro-orm-integration-entity-setting.repository");
const type_orm_integration_entity_setting_repository_1 = require("../../integration-entity-setting/repository/type-orm-integration-entity-setting.repository");
const mikro_orm_integration_map_repository_1 = require("../../integration-map/repository/mikro-orm-integration-map.repository");
const type_orm_integration_map_repository_1 = require("../../integration-map/repository/type-orm-integration-map.repository");
const mikro_orm_integration_setting_repository_1 = require("../../integration-setting/repository/mikro-orm-integration-setting.repository");
const type_orm_integration_setting_repository_1 = require("../../integration-setting/repository/type-orm-integration-setting.repository");
const mikro_orm_integration_tenant_repository_1 = require("../../integration-tenant/repository/mikro-orm-integration-tenant.repository");
const type_orm_integration_tenant_repository_1 = require("../../integration-tenant/repository/type-orm-integration-tenant.repository");
const mikro_orm_integration_type_repository_1 = require("../../integration/repository/mikro-orm-integration-type.repository");
const mikro_orm_integration_repository_1 = require("../../integration/repository/mikro-orm-integration.repository");
const type_orm_integration_type_repository_1 = require("../../integration/repository/type-orm-integration-type.repository");
const type_orm_integration_repository_1 = require("../../integration/repository/type-orm-integration.repository");
const mikro_orm_invite_repository_1 = require("../../invite/repository/mikro-orm-invite.repository");
const type_orm_invite_repository_1 = require("../../invite/repository/type-orm-invite.repository");
const mikro_orm_invoice_estimate_history_repository_1 = require("../../invoice-estimate-history/repository/mikro-orm-invoice-estimate-history.repository");
const type_orm_invoice_estimate_history_repository_1 = require("../../invoice-estimate-history/repository/type-orm-invoice-estimate-history.repository");
const mikro_orm_invoice_item_repository_1 = require("../../invoice-item/repository/mikro-orm-invoice-item.repository");
const type_orm_invoice_item_repository_1 = require("../../invoice-item/repository/type-orm-invoice-item.repository");
const mikro_orm_invoice_repository_1 = require("../../invoice/repository/mikro-orm-invoice.repository");
const type_orm_invoice_repository_1 = require("../../invoice/repository/type-orm-invoice.repository");
const mikro_orm_keyresult_template_repository_1 = require("../../keyresult-template/repository/mikro-orm-keyresult-template.repository");
const type_orm_keyresult_template_repository_1 = require("../../keyresult-template/repository/type-orm-keyresult-template.repository");
const mikro_orm_keyresult_update_repository_1 = require("../../keyresult-update/repository/mikro-orm-keyresult-update.repository");
const type_orm_keyresult_update_repository_1 = require("../../keyresult-update/repository/type-orm-keyresult-update.repository");
const mikro_orm_keyresult_repository_1 = require("../../keyresult/repository/mikro-orm-keyresult.repository");
const type_orm_keyresult_repository_1 = require("../../keyresult/repository/type-orm-keyresult.repository");
const mikro_orm_language_repository_1 = require("../../language/repository/mikro-orm-language.repository");
const type_orm_language_repository_1 = require("../../language/repository/type-orm-language.repository");
const mikro_orm_merchant_repository_1 = require("../../merchant/repository/mikro-orm-merchant.repository");
const type_orm_merchant_repository_1 = require("../../merchant/repository/type-orm-merchant.repository");
const mikro_orm_organization_award_repository_1 = require("../../organization-award/repository/mikro-orm-organization-award.repository");
const type_orm_organization_award_repository_1 = require("../../organization-award/repository/type-orm-organization-award.repository");
const mikro_orm_organization_contact_repository_1 = require("../../organization-contact/repository/mikro-orm-organization-contact.repository");
const type_orm_organization_contact_repository_1 = require("../../organization-contact/repository/type-orm-organization-contact.repository");
const mikro_orm_organization_department_repository_1 = require("../../organization-department/repository/mikro-orm-organization-department.repository");
const type_orm_organization_department_repository_1 = require("../../organization-department/repository/type-orm-organization-department.repository");
const mikro_orm_organization_document_repository_1 = require("../../organization-document/repository/mikro-orm-organization-document.repository");
const type_orm_organization_document_repository_1 = require("../../organization-document/repository/type-orm-organization-document.repository");
const mikro_orm_organization_employment_type_repository_1 = require("../../organization-employment-type/repository/mikro-orm-organization-employment-type.repository");
const type_orm_organization_employment_type_repository_1 = require("../../organization-employment-type/repository/type-orm-organization-employment-type.repository");
const mikro_orm_organization_language_repository_1 = require("../../organization-language/repository/mikro-orm-organization-language.repository");
const type_orm_organization_language_repository_1 = require("../../organization-language/repository/type-orm-organization-language.repository");
const mikro_orm_organization_position_repository_1 = require("../../organization-position/repository/mikro-orm-organization-position.repository");
const type_orm_organization_position_repository_1 = require("../../organization-position/repository/type-orm-organization-position.repository");
const mikro_orm_organization_project_repository_1 = require("../../organization-project/repository/mikro-orm-organization-project.repository");
const type_orm_organization_project_repository_1 = require("../../organization-project/repository/type-orm-organization-project.repository");
const mikro_orm_organization_recurring_expense_repository_1 = require("../../organization-recurring-expense/repository/mikro-orm-organization-recurring-expense.repository");
const type_orm_organization_recurring_expense_repository_1 = require("../../organization-recurring-expense/repository/type-orm-organization-recurring-expense.repository");
const mikro_orm_organization_sprint_repository_1 = require("../../organization-sprint/repository/mikro-orm-organization-sprint.repository");
const type_orm_organization_sprint_repository_1 = require("../../organization-sprint/repository/type-orm-organization-sprint.repository");
const mikro_orm_organization_team_employee_repository_1 = require("../../organization-team-employee/repository/mikro-orm-organization-team-employee.repository");
const type_orm_organization_team_employee_repository_1 = require("../../organization-team-employee/repository/type-orm-organization-team-employee.repository");
const mikro_orm_organization_team_repository_1 = require("../../organization-team/repository/mikro-orm-organization-team.repository");
const type_orm_organization_team_repository_1 = require("../../organization-team/repository/type-orm-organization-team.repository");
const mikro_orm_organization_vendor_repository_1 = require("../../organization-vendor/repository/mikro-orm-organization-vendor.repository");
const type_orm_organization_vendor_repository_1 = require("../../organization-vendor/repository/type-orm-organization-vendor.repository");
const mikro_orm_organization_repository_1 = require("../../organization/repository/mikro-orm-organization.repository");
const type_orm_organization_repository_1 = require("../../organization/repository/type-orm-organization.repository");
const mikro_orm_payment_repository_1 = require("../../payment/repository/mikro-orm-payment.repository");
const type_orm_payment_repository_1 = require("../../payment/repository/type-orm-payment.repository");
const mikro_orm_pipeline_stage_repository_1 = require("../../pipeline-stage/repository/mikro-orm-pipeline-stage.repository");
const type_orm_pipeline_stage_repository_1 = require("../../pipeline-stage/repository/type-orm-pipeline-stage.repository");
const mikro_orm_pipeline_repository_1 = require("../../pipeline/repository/mikro-orm-pipeline.repository");
const type_orm_pipeline_repository_1 = require("../../pipeline/repository/type-orm-pipeline.repository");
const mikro_orm_product_category_translation_repository_1 = require("../../product-category/repository/mikro-orm-product-category-translation.repository");
const mikro_orm_product_category_repository_1 = require("../../product-category/repository/mikro-orm-product-category.repository");
const type_orm_product_category_translation_repository_1 = require("../../product-category/repository/type-orm-product-category-translation.repository");
const type_orm_product_category_repository_1 = require("../../product-category/repository/type-orm-product-category.repository");
const mikro_orm_product_option_group_translation_repository_1 = require("../../product-option/repository/mikro-orm-product-option-group-translation.repository");
const mikro_orm_product_option_group_repository_1 = require("../../product-option/repository/mikro-orm-product-option-group.repository");
const mikro_orm_product_option_translation_repository_1 = require("../../product-option/repository/mikro-orm-product-option-translation.repository");
const mikro_orm_product_option_repository_1 = require("../../product-option/repository/mikro-orm-product-option.repository");
const type_orm_product_option_group_translation_repository_1 = require("../../product-option/repository/type-orm-product-option-group-translation.repository");
const type_orm_product_option_group_repository_1 = require("../../product-option/repository/type-orm-product-option-group.repository");
const type_orm_product_option_translation_repository_1 = require("../../product-option/repository/type-orm-product-option-translation.repository");
const type_orm_product_option_repository_1 = require("../../product-option/repository/type-orm-product-option.repository");
const mikro_orm_product_setting_repository_1 = require("../../product-setting/repository/mikro-orm-product-setting.repository");
const type_orm_product_setting_repository_1 = require("../../product-setting/repository/type-orm-product-setting.repository");
const mikro_orm_product_type_translation_repository_1 = require("../../product-type/repository/mikro-orm-product-type-translation.repository");
const mikro_orm_product_type_repository_1 = require("../../product-type/repository/mikro-orm-product-type.repository");
const type_orm_product_type_translation_repository_1 = require("../../product-type/repository/type-orm-product-type-translation.repository");
const type_orm_product_type_repository_1 = require("../../product-type/repository/type-orm-product-type.repository");
const mikro_orm_product_variant_price_repository_1 = require("../../product-variant-price/repository/mikro-orm-product-variant-price.repository");
const type_orm_product_variant_price_repository_1 = require("../../product-variant-price/repository/type-orm-product-variant-price.repository");
const mikro_orm_product_variant_repository_1 = require("../../product-variant/repository/mikro-orm-product-variant.repository");
const type_orm_product_variant_repository_1 = require("../../product-variant/repository/type-orm-product-variant.repository");
const mikro_orm_product_translation_repository_1 = require("../../product/repository/mikro-orm-product-translation.repository");
const mikro_orm_product_repository_1 = require("../../product/repository/mikro-orm-product.repository");
const type_orm_product_translation_repository_1 = require("../../product/repository/type-orm-product-translation.repository");
const type_orm_product_repository_1 = require("../../product/repository/type-orm-product.repository");
const mikro_orm_report_category_repository_1 = require("../../reports/repository/mikro-orm-report-category.repository");
const mikro_orm_report_organization_repository_1 = require("../../reports/repository/mikro-orm-report-organization.repository");
const mikro_orm_report_repository_1 = require("../../reports/repository/mikro-orm-report.repository");
const type_orm_report_category_repository_1 = require("../../reports/repository/type-orm-report-category.repository");
const type_orm_report_organization_repository_1 = require("../../reports/repository/type-orm-report-organization.repository");
const type_orm_report_repository_1 = require("../../reports/repository/type-orm-report.repository");
const mikro_orm_request_approval_employee_repository_1 = require("../../request-approval-employee/repository/mikro-orm-request-approval-employee.repository");
const type_orm_request_approval_employee_repository_1 = require("../../request-approval-employee/repository/type-orm-request-approval-employee.repository");
const mikro_orm_request_approval_team_repository_1 = require("../../request-approval-team/repository/mikro-orm-request-approval-team.repository");
const type_orm_request_approval_team_repository_1 = require("../../request-approval-team/repository/type-orm-request-approval-team.repository");
const mikro_orm_request_approval_repository_1 = require("../../request-approval/repository/mikro-orm-request-approval.repository");
const type_orm_request_approval_repository_1 = require("../../request-approval/repository/type-orm-request-approval.repository");
const mikro_orm_role_permission_repository_1 = require("../../role-permission/repository/mikro-orm-role-permission.repository");
const type_orm_role_permission_repository_1 = require("../../role-permission/repository/type-orm-role-permission.repository");
const mikro_orm_role_repository_1 = require("../../role/repository/mikro-orm-role.repository");
const type_orm_role_repository_1 = require("../../role/repository/type-orm-role.repository");
const mikro_orm_skill_repository_1 = require("../../skills/repository/mikro-orm-skill.repository");
const type_orm_skill_repository_1 = require("../../skills/repository/type-orm-skill.repository");
const mikro_orm_tag_repository_1 = require("../../tags/repository/mikro-orm-tag.repository");
const type_orm_tag_repository_1 = require("../../tags/repository/type-orm-tag.repository");
const mikro_orm_task_repository_1 = require("../../tasks/repository/mikro-orm-task.repository");
const type_orm_task_repository_1 = require("../../tasks/repository/type-orm-task.repository");
const mikro_orm_tenant_setting_repository_1 = require("../../tenant/tenant-setting/repository/mikro-orm-tenant-setting.repository");
const type_orm_tenant_setting_repository_1 = require("../../tenant/tenant-setting/repository/type-orm-tenant-setting.repository");
const mikro_orm_time_off_policy_repository_1 = require("../../time-off-policy/repository/mikro-orm-time-off-policy.repository");
const type_orm_time_off_policy_repository_1 = require("../../time-off-policy/repository/type-orm-time-off-policy.repository");
const mikro_orm_time_off_request_repository_1 = require("../../time-off-request/repository/mikro-orm-time-off-request.repository");
const type_orm_time_off_request_repository_1 = require("../../time-off-request/repository/type-orm-time-off-request.repository");
const mikro_orm_activity_repository_1 = require("../../time-tracking/activity/repository/mikro-orm-activity.repository");
const type_orm_activity_repository_1 = require("../../time-tracking/activity/repository/type-orm-activity.repository");
const mikro_orm_screenshot_repository_1 = require("../../time-tracking/screenshot/repository/mikro-orm-screenshot.repository");
const type_orm_screenshot_repository_1 = require("../../time-tracking/screenshot/repository/type-orm-screenshot.repository");
const mikro_orm_time_log_repository_1 = require("../../time-tracking/time-log/repository/mikro-orm-time-log.repository");
const type_orm_time_log_repository_1 = require("../../time-tracking/time-log/repository/type-orm-time-log.repository");
const mikro_orm_time_slot_repository_1 = require("../../time-tracking/time-slot/repository/mikro-orm-time-slot.repository");
const type_orm_time_slot_repository_1 = require("../../time-tracking/time-slot/repository/type-orm-time-slot.repository");
const mikro_orm_time_slot_minute_repository_1 = require("../../time-tracking/time-slot/time-slot-minute/repositories/mikro-orm-time-slot-minute.repository");
const type_orm_time_slot_minute_repository_1 = require("../../time-tracking/time-slot/time-slot-minute/repositories/type-orm-time-slot-minute.repository");
const mikro_orm_timesheet_repository_1 = require("../../time-tracking/timesheet/repository/mikro-orm-timesheet.repository");
const type_orm_timesheet_repository_1 = require("../../time-tracking/timesheet/repository/type-orm-timesheet.repository");
const mikro_orm_user_organization_repository_1 = require("../../user-organization/repository/mikro-orm-user-organization.repository");
const type_orm_user_organization_repository_1 = require("../../user-organization/repository/type-orm-user-organization.repository");
const mikro_orm_user_repository_1 = require("../../user/repository/mikro-orm-user.repository");
const type_orm_user_repository_1 = require("../../user/repository/type-orm-user.repository");
const mikro_orm_warehouse_product_variant_repository_1 = require("../../warehouse/repository/mikro-orm-warehouse-product-variant.repository");
const mikro_orm_warehouse_product_repository_1 = require("../../warehouse/repository/mikro-orm-warehouse-product.repository");
const mikro_orm_warehouse_repository_1 = require("../../warehouse/repository/mikro-orm-warehouse.repository");
const type_orm_warehouse_product_variant_repository_1 = require("../../warehouse/repository/type-orm-warehouse-product-variant.repository");
const type_orm_warehouse_product_repository_1 = require("../../warehouse/repository/type-orm-warehouse-product.repository");
const type_orm_warehouse_repository_1 = require("../../warehouse/repository/type-orm-warehouse.repository");
const type_orm_tag_type_repository_1 = require("../../tag-type/repository/type-orm-tag-type.repository");
const type_orm_tenant_repository_1 = require("../../tenant/repository/type-orm-tenant.repository");
const type_orm_activity_log_repository_1 = require("../../activity-log/repository/type-orm-activity-log.repository");
const type_orm_social_account_repository_1 = require("../../auth/social-account/repository/type-orm-social-account.repository");
const type_orm_comment_repository_1 = require("../../comment/repository/type-orm-comment.repository");
const type_orm_email_reset_repository_1 = require("../../email-reset/repository/type-orm-email-reset.repository");
const type_orm_employee_availability_repository_1 = require("../../employee-availability/repository/type-orm-employee-availability.repository");
const type_orm_employee_notification_setting_repository_1 = require("../../employee-notification-setting/repository/type-orm-employee-notification-setting.repository");
const type_orm_employee_notification_repository_1 = require("../../employee-notification/repository/type-orm-employee-notification.repository");
const type_orm_employee_phone_repository_1 = require("../../employee-phone/repository/type-orm-employee-phone.repository");
const type_orm_entity_subscription_repository_1 = require("../../entity-subscription/repository/type-orm-entity-subscription.repository");
const type_orm_favorite_repository_1 = require("../../favorite/repository/type-orm-favorite.repository");
const type_orm_mention_repository_1 = require("../../mention/repository/type-orm-mention.repository");
const type_orm_organization_project_module_employee_repository_1 = require("../../organization-project-module/repository/type-orm-organization-project-module-employee.repository");
const type_orm_organization_project_module_repository_1 = require("../../organization-project-module/repository/type-orm-organization-project-module.repository");
const type_orm_organization_project_employee_repository_1 = require("../../organization-project/repository/type-orm-organization-project-employee.repository");
const type_orm_organization_sprint_employee_repository_1 = require("../../organization-sprint/repository/type-orm-organization-sprint-employee.repository");
const type_orm_organization_sprint_task_history_repository_1 = require("../../organization-sprint/repository/type-orm-organization-sprint-task-history.repository");
const type_orm_organization_sprint_task_repository_1 = require("../../organization-sprint/repository/type-orm-organization-sprint-task.repository");
const type_orm_organization_task_setting_repository_1 = require("../../organization-task-setting/repository/type-orm-organization-task-setting.repository");
const type_orm_organization_team_join_request_repository_1 = require("../../organization-team-join-request/repository/type-orm-organization-team-join-request.repository");
const type_orm_reaction_repository_1 = require("../../reaction/repository/type-orm-reaction.repository");
const type_orm_resource_link_repository_1 = require("../../resource-link/repository/type-orm-resource-link.repository");
const type_orm_daily_plan_repository_1 = require("../../tasks/daily-plan/repository/type-orm-daily-plan.repository");
const type_orm_estimation_repository_1 = require("../../tasks/estimation/repository/type-orm-estimation.repository");
const type_orm_issue_type_repository_1 = require("../../tasks/issue-type/repository/type-orm-issue-type.repository");
const type_orm_linked_issue_repository_1 = require("../../tasks/linked-issue/repository/type-orm-linked-issue.repository");
const type_orm_task_priority_repository_1 = require("../../tasks/priorities/repository/type-orm-task-priority.repository");
const type_orm_related_issue_type_repository_1 = require("../../tasks/related-issue-type/repository/type-orm-related-issue-type.repository");
const type_orm_screening_task_repository_1 = require("../../tasks/screening-tasks/repository/type-orm-screening-task.repository");
const type_orm_task_size_repository_1 = require("../../tasks/sizes/repository/type-orm-task-size.repository");
const type_orm_task_status_repository_1 = require("../../tasks/statuses/repository/type-orm-task-status.repository");
const type_orm_task_version_repository_1 = require("../../tasks/versions/repository/type-orm-task-version.repository");
const type_orm_task_view_repository_1 = require("../../tasks/views/repository/type-orm-task-view.repository");
const type_orm_import_history_repository_1 = require("../import-history/repository/type-orm-import-history.repository");
const type_orm_import_record_repository_1 = require("../import-record/repository/type-orm-import-record.repository");
const type_orm_country_repository_1 = require("../../country/repository/type-orm-country.repository");
const type_orm_currency_repository_1 = require("../../currency/repository/type-orm-currency.repository");
const type_orm_dashboard_repository_1 = require("../../dashboard/repository/type-orm-dashboard.repository");
const type_orm_dashboard_widget_repository_1 = require("../../dashboard/dashboard-widget/repository/type-orm-dashboard-widget.repository");
let RepositoriesService = class RepositoriesService {
    constructor(typeOrmAccountingTemplateRepository, mikroOrmAccountingTemplateRepository, typeOrmActivityRepository, mikroOrmActivityRepository, typeOrmAppointmentEmployeeRepository, mikroOrmAppointmentEmployeeRepository, typeOrmApprovalPolicyRepository, mikroOrmApprovalPolicyRepository, typeOrmAvailabilitySlotRepository, mikroOrmAvailabilitySlotRepository, typeOrmCandidateRepository, mikroOrmCandidateRepository, typeOrmCandidateCriterionsRatingRepository, mikroOrmCandidateCriterionsRatingRepository, typeOrmCandidateDocumentRepository, mikroOrmCandidateDocumentRepository, typeOrmCandidateEducationRepository, mikroOrmCandidateEducationRepository, typeOrmCandidateExperienceRepository, mikroOrmCandidateExperienceRepository, typeOrmCandidateFeedbackRepository, mikroOrmCandidateFeedbackRepository, typeOrmCandidateInterviewRepository, mikroOrmCandidateInterviewRepository, typeOrmCandidateInterviewersRepository, mikroOrmCandidateInterviewersRepository, typeOrmCandidatePersonalQualitiesRepository, mikroOrmCandidatePersonalQualitiesRepository, typeOrmCandidateSkillRepository, mikroOrmCandidateSkillRepository, typeOrmCandidateSourceRepository, mikroOrmCandidateSourceRepository, typeOrmCandidateTechnologiesRepository, mikroOrmCandidateTechnologiesRepository, typeOrmContactRepository, mikroOrmContactRepository, typeOrmCustomSmtpRepository, mikroOrmCustomSmtpRepository, typeOrmDealRepository, mikroOrmDealRepository, typeOrmEmailHistoryRepository, mikroOrmEmailHistoryRepository, typeOrmEmailTemplateRepository, mikroOrmEmailTemplateRepository, typeOrmEmployeeRepository, mikroOrmEmployeeRepository, typeOrmEmployeeAppointmentRepository, mikroOrmEmployeeAppointmentRepository, typeOrmEmployeeAwardRepository, mikroOrmEmployeeAwardRepository, typeOrmEmployeeRecurringExpenseRepository, mikroOrmEmployeeRecurringExpenseRepository, typeOrmEmployeeSettingRepository, mikroOrmEmployeeSettingRepository, typeOrmEquipmentRepository, mikroOrmEquipmentRepository, typeOrmEquipmentSharingRepository, mikroOrmEquipmentSharingRepository, typeOrmEquipmentSharingPolicyRepository, mikroOrmEquipmentSharingPolicyRepository, typeOrmEstimateEmailRepository, mikroOrmEstimateEmailRepository, typeOrmEventTypeRepository, mikroOrmEventTypeRepository, typeOrmExpenseRepository, mikroOrmExpenseRepository, typeOrmExpenseCategoryRepository, mikroOrmExpenseCategoryRepository, typeOrmFeatureRepository, mikroOrmFeatureRepository, typeOrmFeatureOrganizationRepository, mikroOrmFeatureOrganizationRepository, typeOrmGoalRepository, mikroOrmGoalRepository, typeOrmGoalTemplateRepository, mikroOrmGoalTemplateRepository, typeOrmGoalKPIRepository, mikroOrmGoalKPIRepository, typeOrmGoalKPITemplateRepository, mikroOrmGoalKPITemplateRepository, typeOrmGoalTimeFrameRepository, mikroOrmGoalTimeFrameRepository, typeOrmGoalGeneralSettingRepository, mikroOrmGoalGeneralSettingRepository, typeOrmIncomeRepository, mikroOrmIncomeRepository, typeOrmIntegrationRepository, mikroOrmIntegrationRepository, typeOrmIntegrationTypeRepository, mikroOrmIntegrationTypeRepository, typeOrmIntegrationEntitySettingRepository, mikroOrmIntegrationEntitySettingRepository, typeOrmIntegrationEntitySettingTiedRepository, mikroOrmIntegrationEntitySettingTiedRepository, typeOrmIntegrationMapRepository, mikroOrmIntegrationMapRepository, typeOrmIntegrationSettingRepository, mikroOrmIntegrationSettingRepository, typeOrmIntegrationTenantRepository, mikroOrmIntegrationTenantRepository, typeOrmInviteRepository, mikroOrmInviteRepository, typeOrmInvoiceRepository, mikroOrmInvoiceRepository, typeOrmInvoiceEstimateHistoryRepository, mikroOrmInvoiceEstimateHistoryRepository, typeOrmInvoiceItemRepository, mikroOrmInvoiceItemRepository, typeOrmKeyResultRepository, mikroOrmKeyResultRepository, typeOrmKeyResultTemplateRepository, mikroOrmKeyResultTemplateRepository, typeOrmKeyResultUpdateRepository, mikroOrmKeyResultUpdateRepository, typeOrmLanguageRepository, mikroOrmLanguageRepository, typeOrmOrganizationRepository, mikroOrmOrganizationRepository, typeOrmEmployeeLevelRepository, mikroOrmEmployeeLevelRepository, typeOrmOrganizationAwardRepository, mikroOrmOrganizationAwardRepository, typeOrmOrganizationContactRepository, mikroOrmOrganizationContactRepository, typeOrmOrganizationDepartmentRepository, mikroOrmOrganizationDepartmentRepository, typeOrmOrganizationDocumentRepository, mikroOrmOrganizationDocumentRepository, typeOrmOrganizationEmploymentTypeRepository, mikroOrmOrganizationEmploymentTypeRepository, typeOrmOrganizationLanguageRepository, mikroOrmOrganizationLanguageRepository, typeOrmOrganizationPositionRepository, mikroOrmOrganizationPositionRepository, typeOrmOrganizationProjectRepository, mikroOrmOrganizationProjectRepository, typeOrmOrganizationRecurringExpenseRepository, mikroOrmOrganizationRecurringExpenseRepository, typeOrmOrganizationSprintRepository, mikroOrmOrganizationSprintRepository, typeOrmOrganizationTeamRepository, mikroOrmOrganizationTeamRepository, typeOrmOrganizationTeamEmployeeRepository, mikroOrmOrganizationTeamEmployeeRepository, typeOrmOrganizationVendorRepository, mikroOrmOrganizationVendorRepository, typeOrmPaymentRepository, mikroOrmPaymentRepository, typeOrmPipelineRepository, mikroOrmPipelineRepository, typeOrmPipelineStageRepository, mikroOrmPipelineStageRepository, typeOrmProductRepository, mikroOrmProductRepository, typeOrmProductTranslationRepository, mikroOrmProductTranslationRepository, typeOrmProductCategoryRepository, mikroOrmProductCategoryRepository, typeOrmProductCategoryTranslationRepository, mikroOrmProductCategoryTranslationRepository, typeOrmProductOptionRepository, mikroOrmProductOptionRepository, typeOrmProductOptionTranslationRepository, mikroOrmProductOptionTranslationRepository, typeOrmProductOptionGroupRepository, mikroOrmProductOptionGroupRepository, typeOrmProductOptionGroupTranslationRepository, mikroOrmProductOptionGroupTranslationRepository, typeOrmProductVariantSettingRepository, mikroOrmProductVariantSettingRepository, typeOrmProductTypeRepository, mikroOrmProductTypeRepository, typeOrmProductTypeTranslationRepository, mikroOrmProductTypeTranslationRepository, typeOrmProductVariantRepository, mikroOrmProductVariantRepository, typeOrmProductVariantPriceRepository, mikroOrmProductVariantPriceRepository, typeOrmImageAssetRepository, mikroOrmImageAssetRepository, typeOrmWarehouseRepository, mikroOrmWarehouseRepository, typeOrmMerchantRepository, mikroOrmMerchantRepository, typeOrmWarehouseProductRepository, mikroOrmWarehouseProductRepository, typeOrmWarehouseProductVariantRepository, mikroOrmWarehouseProductVariantRepository, typeOrmSkillRepository, mikroOrmSkillRepository, typeOrmScreenshotRepository, mikroOrmScreenshotRepository, typeOrmRequestApprovalRepository, mikroOrmRequestApprovalRepository, typeOrmRequestApprovalEmployeeRepository, mikroOrmRequestApprovalEmployeeRepository, typeOrmRequestApprovalTeamRepository, mikroOrmRequestApprovalTeamRepository, typeOrmRoleRepository, mikroOrmRoleRepository, typeOrmRolePermissionRepository, mikroOrmRolePermissionRepository, typeOrmReportRepository, mikroOrmReportRepository, typeOrmReportCategoryRepository, mikroOrmReportCategoryRepository, typeOrmReportOrganizationRepository, mikroOrmReportOrganizationRepository, typeOrmTagRepository, mikroOrmTagRepository, typeOrmTaskRepository, mikroOrmTaskRepository, typeOrmTenantSettingRepository, mikroOrmTenantSettingRepository, typeOrmTimesheetRepository, mikroOrmTimesheetRepository, typeOrmTimeLogRepository, mikroOrmTimeLogRepository, typeOrmTimeSlotRepository, mikroOrmTimeSlotRepository, typeOrmTimeSlotMinuteRepository, mikroOrmTimeSlotMinuteRepository, typeOrmTimeOffRequestRepository, mikroOrmTimeOffRequestRepository, typeOrmTimeOffPolicyRepository, mikroOrmTimeOffPolicyRepository, typeOrmUserRepository, mikroOrmUserRepository, typeOrmUserOrganizationRepository, mikroOrmUserOrganizationRepository, typeOrmTagTypeRepository, typeOrmTenantRepository, typeOrmActivityLogRepository, typeOrmEmployeeAvailabilityRepository, typeOrmCommentRepository, typeOrmDailyPlanRepository, typeOrmEmailResetRepository, typeOrmEmployeeNotificationRepository, typeOrmEmployeeNotificationSettingRepository, typeOrmEmployeePhoneRepository, typeOrmEntitySubscriptionRepository, typeOrmFavoriteRepository, typeOrmImportHistoryRepository, typeOrmImportRecordRepository, typeOrmIssueTypeRepository, typeOrmMentionRepository, typeOrmOrganizationProjectEmployeeRepository, typeOrmOrganizationProjectModuleRepository, typeOrmOrganizationProjectModuleEmployeeRepository, typeOrmOrganizationSprintEmployeeRepository, typeOrmOrganizationSprintTaskRepository, typeOrmOrganizationSprintTaskHistoryRepository, typeOrmOrganizationTaskSettingRepository, typeOrmOrganizationTeamJoinRequestRepository, typeOrmReactionRepository, typeOrmResourceLinkRepository, typeOrmScreeningTaskRepository, typeOrmSocialAccountRepository, typeOrmTaskEstimationRepository, typeOrmTaskLinkedIssueRepository, typeOrmTaskPriorityRepository, typeOrmTaskRelatedIssueTypeRepository, typeOrmTaskSizeRepository, typeOrmTaskStatusRepository, typeOrmTaskVersionRepository, typeOrmTaskViewRepository, typeOrmCountryRepository, typeOrmCurrencyRepository, typeOrmDashboardRepository, typeOrmDashboardWidgetRepository, configService, _connectionEntityManager) {
        this.typeOrmAccountingTemplateRepository = typeOrmAccountingTemplateRepository;
        this.typeOrmActivityRepository = typeOrmActivityRepository;
        this.typeOrmAppointmentEmployeeRepository = typeOrmAppointmentEmployeeRepository;
        this.typeOrmApprovalPolicyRepository = typeOrmApprovalPolicyRepository;
        this.typeOrmAvailabilitySlotRepository = typeOrmAvailabilitySlotRepository;
        this.typeOrmCandidateRepository = typeOrmCandidateRepository;
        this.typeOrmCandidateCriterionsRatingRepository = typeOrmCandidateCriterionsRatingRepository;
        this.typeOrmCandidateDocumentRepository = typeOrmCandidateDocumentRepository;
        this.typeOrmCandidateEducationRepository = typeOrmCandidateEducationRepository;
        this.typeOrmCandidateExperienceRepository = typeOrmCandidateExperienceRepository;
        this.typeOrmCandidateFeedbackRepository = typeOrmCandidateFeedbackRepository;
        this.typeOrmCandidateInterviewRepository = typeOrmCandidateInterviewRepository;
        this.typeOrmCandidateInterviewersRepository = typeOrmCandidateInterviewersRepository;
        this.typeOrmCandidatePersonalQualitiesRepository = typeOrmCandidatePersonalQualitiesRepository;
        this.typeOrmCandidateSkillRepository = typeOrmCandidateSkillRepository;
        this.typeOrmCandidateSourceRepository = typeOrmCandidateSourceRepository;
        this.typeOrmCandidateTechnologiesRepository = typeOrmCandidateTechnologiesRepository;
        this.typeOrmContactRepository = typeOrmContactRepository;
        this.typeOrmCustomSmtpRepository = typeOrmCustomSmtpRepository;
        this.typeOrmDealRepository = typeOrmDealRepository;
        this.typeOrmEmailHistoryRepository = typeOrmEmailHistoryRepository;
        this.typeOrmEmailTemplateRepository = typeOrmEmailTemplateRepository;
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this.typeOrmEmployeeAppointmentRepository = typeOrmEmployeeAppointmentRepository;
        this.typeOrmEmployeeAwardRepository = typeOrmEmployeeAwardRepository;
        this.typeOrmEmployeeRecurringExpenseRepository = typeOrmEmployeeRecurringExpenseRepository;
        this.typeOrmEmployeeSettingRepository = typeOrmEmployeeSettingRepository;
        this.typeOrmEquipmentRepository = typeOrmEquipmentRepository;
        this.typeOrmEquipmentSharingRepository = typeOrmEquipmentSharingRepository;
        this.typeOrmEquipmentSharingPolicyRepository = typeOrmEquipmentSharingPolicyRepository;
        this.typeOrmEstimateEmailRepository = typeOrmEstimateEmailRepository;
        this.typeOrmEventTypeRepository = typeOrmEventTypeRepository;
        this.typeOrmExpenseRepository = typeOrmExpenseRepository;
        this.typeOrmExpenseCategoryRepository = typeOrmExpenseCategoryRepository;
        this.typeOrmFeatureRepository = typeOrmFeatureRepository;
        this.typeOrmFeatureOrganizationRepository = typeOrmFeatureOrganizationRepository;
        this.typeOrmGoalRepository = typeOrmGoalRepository;
        this.typeOrmGoalTemplateRepository = typeOrmGoalTemplateRepository;
        this.typeOrmGoalKPIRepository = typeOrmGoalKPIRepository;
        this.typeOrmGoalKPITemplateRepository = typeOrmGoalKPITemplateRepository;
        this.typeOrmGoalTimeFrameRepository = typeOrmGoalTimeFrameRepository;
        this.typeOrmGoalGeneralSettingRepository = typeOrmGoalGeneralSettingRepository;
        this.typeOrmIncomeRepository = typeOrmIncomeRepository;
        this.typeOrmIntegrationRepository = typeOrmIntegrationRepository;
        this.typeOrmIntegrationTypeRepository = typeOrmIntegrationTypeRepository;
        this.typeOrmIntegrationEntitySettingRepository = typeOrmIntegrationEntitySettingRepository;
        this.typeOrmIntegrationEntitySettingTiedRepository = typeOrmIntegrationEntitySettingTiedRepository;
        this.typeOrmIntegrationMapRepository = typeOrmIntegrationMapRepository;
        this.typeOrmIntegrationSettingRepository = typeOrmIntegrationSettingRepository;
        this.typeOrmIntegrationTenantRepository = typeOrmIntegrationTenantRepository;
        this.typeOrmInviteRepository = typeOrmInviteRepository;
        this.typeOrmInvoiceRepository = typeOrmInvoiceRepository;
        this.typeOrmInvoiceEstimateHistoryRepository = typeOrmInvoiceEstimateHistoryRepository;
        this.typeOrmInvoiceItemRepository = typeOrmInvoiceItemRepository;
        this.typeOrmKeyResultRepository = typeOrmKeyResultRepository;
        this.typeOrmKeyResultTemplateRepository = typeOrmKeyResultTemplateRepository;
        this.typeOrmKeyResultUpdateRepository = typeOrmKeyResultUpdateRepository;
        this.typeOrmLanguageRepository = typeOrmLanguageRepository;
        this.typeOrmOrganizationRepository = typeOrmOrganizationRepository;
        this.typeOrmEmployeeLevelRepository = typeOrmEmployeeLevelRepository;
        this.typeOrmOrganizationAwardRepository = typeOrmOrganizationAwardRepository;
        this.typeOrmOrganizationContactRepository = typeOrmOrganizationContactRepository;
        this.typeOrmOrganizationDepartmentRepository = typeOrmOrganizationDepartmentRepository;
        this.typeOrmOrganizationDocumentRepository = typeOrmOrganizationDocumentRepository;
        this.typeOrmOrganizationEmploymentTypeRepository = typeOrmOrganizationEmploymentTypeRepository;
        this.typeOrmOrganizationLanguageRepository = typeOrmOrganizationLanguageRepository;
        this.typeOrmOrganizationPositionRepository = typeOrmOrganizationPositionRepository;
        this.typeOrmOrganizationProjectRepository = typeOrmOrganizationProjectRepository;
        this.typeOrmOrganizationRecurringExpenseRepository = typeOrmOrganizationRecurringExpenseRepository;
        this.typeOrmOrganizationSprintRepository = typeOrmOrganizationSprintRepository;
        this.typeOrmOrganizationTeamRepository = typeOrmOrganizationTeamRepository;
        this.typeOrmOrganizationTeamEmployeeRepository = typeOrmOrganizationTeamEmployeeRepository;
        this.typeOrmOrganizationVendorRepository = typeOrmOrganizationVendorRepository;
        this.typeOrmPaymentRepository = typeOrmPaymentRepository;
        this.typeOrmPipelineRepository = typeOrmPipelineRepository;
        this.typeOrmPipelineStageRepository = typeOrmPipelineStageRepository;
        this.typeOrmProductRepository = typeOrmProductRepository;
        this.typeOrmProductTranslationRepository = typeOrmProductTranslationRepository;
        this.typeOrmProductCategoryRepository = typeOrmProductCategoryRepository;
        this.typeOrmProductCategoryTranslationRepository = typeOrmProductCategoryTranslationRepository;
        this.typeOrmProductOptionRepository = typeOrmProductOptionRepository;
        this.typeOrmProductOptionTranslationRepository = typeOrmProductOptionTranslationRepository;
        this.typeOrmProductOptionGroupRepository = typeOrmProductOptionGroupRepository;
        this.typeOrmProductOptionGroupTranslationRepository = typeOrmProductOptionGroupTranslationRepository;
        this.typeOrmProductVariantSettingRepository = typeOrmProductVariantSettingRepository;
        this.typeOrmProductTypeRepository = typeOrmProductTypeRepository;
        this.typeOrmProductTypeTranslationRepository = typeOrmProductTypeTranslationRepository;
        this.typeOrmProductVariantRepository = typeOrmProductVariantRepository;
        this.typeOrmProductVariantPriceRepository = typeOrmProductVariantPriceRepository;
        this.typeOrmImageAssetRepository = typeOrmImageAssetRepository;
        this.typeOrmWarehouseRepository = typeOrmWarehouseRepository;
        this.typeOrmMerchantRepository = typeOrmMerchantRepository;
        this.typeOrmWarehouseProductRepository = typeOrmWarehouseProductRepository;
        this.typeOrmWarehouseProductVariantRepository = typeOrmWarehouseProductVariantRepository;
        this.typeOrmSkillRepository = typeOrmSkillRepository;
        this.typeOrmScreenshotRepository = typeOrmScreenshotRepository;
        this.typeOrmRequestApprovalRepository = typeOrmRequestApprovalRepository;
        this.typeOrmRequestApprovalEmployeeRepository = typeOrmRequestApprovalEmployeeRepository;
        this.typeOrmRequestApprovalTeamRepository = typeOrmRequestApprovalTeamRepository;
        this.typeOrmRoleRepository = typeOrmRoleRepository;
        this.typeOrmRolePermissionRepository = typeOrmRolePermissionRepository;
        this.typeOrmReportRepository = typeOrmReportRepository;
        this.typeOrmReportCategoryRepository = typeOrmReportCategoryRepository;
        this.typeOrmReportOrganizationRepository = typeOrmReportOrganizationRepository;
        this.typeOrmTagRepository = typeOrmTagRepository;
        this.typeOrmTaskRepository = typeOrmTaskRepository;
        this.typeOrmTenantSettingRepository = typeOrmTenantSettingRepository;
        this.typeOrmTimesheetRepository = typeOrmTimesheetRepository;
        this.typeOrmTimeLogRepository = typeOrmTimeLogRepository;
        this.typeOrmTimeSlotRepository = typeOrmTimeSlotRepository;
        this.typeOrmTimeSlotMinuteRepository = typeOrmTimeSlotMinuteRepository;
        this.typeOrmTimeOffRequestRepository = typeOrmTimeOffRequestRepository;
        this.typeOrmTimeOffPolicyRepository = typeOrmTimeOffPolicyRepository;
        this.typeOrmUserRepository = typeOrmUserRepository;
        this.typeOrmUserOrganizationRepository = typeOrmUserOrganizationRepository;
        this.typeOrmTagTypeRepository = typeOrmTagTypeRepository;
        this.typeOrmTenantRepository = typeOrmTenantRepository;
        this.typeOrmActivityLogRepository = typeOrmActivityLogRepository;
        this.typeOrmEmployeeAvailabilityRepository = typeOrmEmployeeAvailabilityRepository;
        this.typeOrmCommentRepository = typeOrmCommentRepository;
        this.typeOrmDailyPlanRepository = typeOrmDailyPlanRepository;
        this.typeOrmEmailResetRepository = typeOrmEmailResetRepository;
        this.typeOrmEmployeeNotificationRepository = typeOrmEmployeeNotificationRepository;
        this.typeOrmEmployeeNotificationSettingRepository = typeOrmEmployeeNotificationSettingRepository;
        this.typeOrmEmployeePhoneRepository = typeOrmEmployeePhoneRepository;
        this.typeOrmEntitySubscriptionRepository = typeOrmEntitySubscriptionRepository;
        this.typeOrmFavoriteRepository = typeOrmFavoriteRepository;
        this.typeOrmImportHistoryRepository = typeOrmImportHistoryRepository;
        this.typeOrmImportRecordRepository = typeOrmImportRecordRepository;
        this.typeOrmIssueTypeRepository = typeOrmIssueTypeRepository;
        this.typeOrmMentionRepository = typeOrmMentionRepository;
        this.typeOrmOrganizationProjectEmployeeRepository = typeOrmOrganizationProjectEmployeeRepository;
        this.typeOrmOrganizationProjectModuleRepository = typeOrmOrganizationProjectModuleRepository;
        this.typeOrmOrganizationProjectModuleEmployeeRepository = typeOrmOrganizationProjectModuleEmployeeRepository;
        this.typeOrmOrganizationSprintEmployeeRepository = typeOrmOrganizationSprintEmployeeRepository;
        this.typeOrmOrganizationSprintTaskRepository = typeOrmOrganizationSprintTaskRepository;
        this.typeOrmOrganizationSprintTaskHistoryRepository = typeOrmOrganizationSprintTaskHistoryRepository;
        this.typeOrmOrganizationTaskSettingRepository = typeOrmOrganizationTaskSettingRepository;
        this.typeOrmOrganizationTeamJoinRequestRepository = typeOrmOrganizationTeamJoinRequestRepository;
        this.typeOrmReactionRepository = typeOrmReactionRepository;
        this.typeOrmResourceLinkRepository = typeOrmResourceLinkRepository;
        this.typeOrmScreeningTaskRepository = typeOrmScreeningTaskRepository;
        this.typeOrmSocialAccountRepository = typeOrmSocialAccountRepository;
        this.typeOrmTaskEstimationRepository = typeOrmTaskEstimationRepository;
        this.typeOrmTaskLinkedIssueRepository = typeOrmTaskLinkedIssueRepository;
        this.typeOrmTaskPriorityRepository = typeOrmTaskPriorityRepository;
        this.typeOrmTaskRelatedIssueTypeRepository = typeOrmTaskRelatedIssueTypeRepository;
        this.typeOrmTaskSizeRepository = typeOrmTaskSizeRepository;
        this.typeOrmTaskStatusRepository = typeOrmTaskStatusRepository;
        this.typeOrmTaskVersionRepository = typeOrmTaskVersionRepository;
        this.typeOrmTaskViewRepository = typeOrmTaskViewRepository;
        this.typeOrmCountryRepository = typeOrmCountryRepository;
        this.typeOrmCurrencyRepository = typeOrmCurrencyRepository;
        this.typeOrmDashboardRepository = typeOrmDashboardRepository;
        this.typeOrmDashboardWidgetRepository = typeOrmDashboardWidgetRepository;
        this.configService = configService;
        this._connectionEntityManager = _connectionEntityManager;
        this.dynamicEntitiesClassMap = [];
        this.repositories = [];
        this.baseEntityRelationFields = [
            { column: 'createdByUserId', repository: this.typeOrmUserRepository },
            { column: 'updatedByUserId', repository: this.typeOrmUserRepository },
            { column: 'deletedByUserId', repository: this.typeOrmUserRepository }
        ];
    }
    async onModuleInit() {
        await this.createDynamicInstanceForPluginEntities();
        await this.registerCoreRepositories();
    }
    /**
     * A helper function to get the repository relations graph
     * @param repository the repository to work on
     */
    async getRepositoryRelationsGraph(repository) {
        const entityMetadata = repository.metadata;
        // Get unique identifiers (assuming they are part of unique constraints)
        const uniqueIdentifiers = entityMetadata.uniques.map((unique) => {
            return {
                column: unique.columns
                    .map((col) => col.propertyName)
                    .filter((propertyName) => {
                    return !repository.metadata.relations.some((relation) => relation.propertyName === propertyName);
                })[0]
            };
        }) || [];
        // Get foreign keys and relations
        const foreignKeys = entityMetadata.relations
            .filter((relation) => relation.propertyName && (relation.isManyToOne || relation.isOneToOne))
            .filter((relation) => ![
            ...this.baseEntityRelationFields.map((el) => el.column),
            'organizationId',
            'tenantId'
        ].includes(relation.joinColumns[0]?.databaseName || `${relation.propertyName}Id`))
            .map((relation) => {
            return {
                column: relation.joinColumns[0]?.databaseName || `${relation.propertyName}Id`,
                repository: this._connectionEntityManager.getRepository(relation.type)
            };
        }) || [];
        const relations = entityMetadata.relations
            .filter((relation) => relation.isManyToMany && relation.joinTableName)
            .map((relation) => {
            const foreignKeys = relation.foreignKeys.map((fk) => ({
                column: fk.columns[0]?.propertyName,
                repository: this._connectionEntityManager.getRepository(fk.referencedEntityMetadata.target)
            })) || [];
            return {
                joinTableName: relation.joinTableName,
                foreignKeys,
                isCheckRelation: foreignKeys.length > 0
            };
        }) || [];
        const isTenantBased = entityMetadata.foreignKeys.flatMap((el) => el.columnNames)?.includes('tenantId');
        return {
            repository,
            isCheckRelation: foreignKeys.length > 0,
            uniqueIdentifiers,
            foreignKeys,
            relations,
            isTenantBased
        };
    }
    /**
     *
     * A helper function that builds dynamically a dependencies / relations
     * graph for each repository registered
     *
     */
    async buildRepositoriesRelationsGraph() {
        const result = [];
        for await (const item of this.repositories) {
            const { repository, isStatic, substitute } = item;
            const repositoryRelationsGraph = await this.getRepositoryRelationsGraph(repository);
            result.push({
                ...repositoryRelationsGraph,
                isStatic,
                substitute
            });
        }
        return result;
    }
    /**
     * Registers a repository for every entity contributed by a plugin, and adds it to the
     * export/import graph unless the entity is marked with {@link SkipExport}.
     *
     * 🛑 The skip only removes the entity from `dynamicEntitiesClassMap` — the repository is still
     * registered on `this[className]`, because the rest of the platform resolves plugin repositories
     * through it. Excluding an entity from the archive must not make it unreachable.
     */
    async createDynamicInstanceForPluginEntities() {
        for await (const entity of (0, plugin_1.getEntitiesFromPlugins)(this.configService.plugins)) {
            if (!(0, utils_1.isFunction)(entity)) {
                continue;
            }
            const className = (0, StringUtils_1.camelCase)(entity.name);
            const repository = this._connectionEntityManager.getRepository(entity);
            this[className] = repository;
            // Derived data (extracted text, embeddings, caches): rebuilt after an import rather than
            // carried in the archive. See `skip-export.decorator.ts` for the full rationale.
            if ((0, skip_export_decorator_1.isExportSkipped)(entity)) {
                continue;
            }
            const repositoryRelationsGraph = await this.getRepositoryRelationsGraph(repository);
            this.dynamicEntitiesClassMap.push(repositoryRelationsGraph);
        }
    }
    /*
     * Core repositories
     * Warning: Changing position here can be FATAL
     */
    async registerCoreRepositories() {
        this.repositories = [
            {
                repository: this.typeOrmTenantRepository,
                substitute: { substituteField: 'id', originalField: 'tenantId' }
            },
            /**
             * These entities do not have any other dependency so need to be mapped first
             */
            {
                repository: this.typeOrmReportCategoryRepository,
                isStatic: true
            },
            {
                repository: this.typeOrmReportRepository,
                isStatic: true
            },
            {
                repository: this.typeOrmFeatureRepository,
                isStatic: true
            },
            {
                repository: this.typeOrmLanguageRepository,
                isStatic: true
            },
            {
                repository: this.typeOrmCountryRepository,
                isStatic: true
            },
            {
                repository: this.typeOrmCurrencyRepository,
                isStatic: true
            },
            {
                repository: this.typeOrmIntegrationRepository,
                isStatic: true
            },
            {
                repository: this.typeOrmIntegrationTypeRepository,
                isStatic: true
            },
            /**
             * These entities need TENANT
             */
            {
                repository: this.typeOrmTenantSettingRepository
            },
            {
                repository: this.typeOrmRoleRepository
            },
            {
                repository: this.typeOrmRolePermissionRepository
            },
            {
                repository: this.typeOrmOrganizationRepository
            },
            /**
             * These entities need TENANT and ORGANIZATION
             */
            {
                repository: this.typeOrmUserRepository,
                isStatic: true
            },
            {
                repository: this.typeOrmUserOrganizationRepository
            },
            //Organization & Related Entities
            {
                repository: this.typeOrmOrganizationPositionRepository
            },
            {
                repository: this.typeOrmOrganizationTeamRepository
            },
            {
                repository: this.typeOrmOrganizationAwardRepository
            },
            {
                repository: this.typeOrmOrganizationVendorRepository
            },
            {
                repository: this.typeOrmOrganizationDepartmentRepository
            },
            {
                repository: this.typeOrmOrganizationDocumentRepository
            },
            {
                repository: this.typeOrmOrganizationLanguageRepository
            },
            {
                repository: this.typeOrmOrganizationEmploymentTypeRepository
            },
            {
                repository: this.typeOrmContactRepository
            },
            {
                repository: this.typeOrmOrganizationContactRepository
            },
            {
                repository: this.typeOrmOrganizationProjectRepository
            },
            {
                repository: this.typeOrmOrganizationSprintRepository
            },
            {
                repository: this.typeOrmOrganizationRecurringExpenseRepository
            },
            {
                repository: this.typeOrmCustomSmtpRepository
            },
            {
                repository: this.typeOrmReportOrganizationRepository
            },
            /**
             * These entities need TENANT, ORGANIZATION & USER
             */
            {
                repository: this.typeOrmEmployeeRepository
            },
            {
                repository: this.typeOrmActivityLogRepository
            },
            {
                repository: this.typeOrmDashboardRepository
            },
            {
                repository: this.typeOrmDashboardWidgetRepository
            },
            {
                repository: this.typeOrmEmailResetRepository
            },
            {
                repository: this.typeOrmTagTypeRepository
            },
            /**
             * These entities need TENANT, ORGANIZATION & CANDIDATE
             */
            {
                repository: this.typeOrmCandidateRepository
            },
            {
                repository: this.typeOrmCandidateDocumentRepository
            },
            {
                repository: this.typeOrmCandidateEducationRepository
            },
            {
                repository: this.typeOrmCandidateSkillRepository
            },
            {
                repository: this.typeOrmCandidateSourceRepository
            },
            {
                repository: this.typeOrmCandidateInterviewRepository
            },
            {
                repository: this.typeOrmCandidateInterviewersRepository
            },
            {
                repository: this.typeOrmCandidateExperienceRepository
            },
            {
                repository: this.typeOrmCandidateFeedbackRepository
            },
            {
                repository: this.typeOrmCandidatePersonalQualitiesRepository
            },
            {
                repository: this.typeOrmCandidateTechnologiesRepository
            },
            {
                repository: this.typeOrmCandidateCriterionsRatingRepository
            },
            /**
             * These entities need TENANT and ORGANIZATION
             */
            {
                repository: this.typeOrmSkillRepository
            },
            {
                repository: this.typeOrmAccountingTemplateRepository
            },
            {
                repository: this.typeOrmApprovalPolicyRepository
            },
            {
                repository: this.typeOrmAvailabilitySlotRepository
            },
            {
                repository: this.typeOrmEmployeeAppointmentRepository
            },
            {
                repository: this.typeOrmAppointmentEmployeeRepository
            },
            /*
             * Email & Template
             */
            {
                repository: this.typeOrmEmailTemplateRepository
            },
            {
                repository: this.typeOrmEmailHistoryRepository
            },
            {
                repository: this.typeOrmEstimateEmailRepository
            },
            /*
             * Employee & Related Entities
             */
            {
                repository: this.typeOrmEmployeeAwardRepository
            },
            {
                repository: this.typeOrmEmployeeRecurringExpenseRepository
            },
            {
                repository: this.typeOrmEmployeeSettingRepository
            },
            {
                repository: this.typeOrmEmployeeLevelRepository
            },
            /*
             * Equipment & Related Entities
             */
            {
                repository: this.typeOrmEquipmentSharingPolicyRepository
            },
            {
                repository: this.typeOrmEquipmentRepository
            },
            {
                repository: this.typeOrmEquipmentSharingRepository
            },
            /*
             * Event Type & Related Entities
             */
            {
                repository: this.typeOrmEventTypeRepository
            },
            /*
             * Invoice & Related Entities
             */
            {
                repository: this.typeOrmInvoiceRepository
            },
            {
                repository: this.typeOrmInvoiceItemRepository
            },
            {
                repository: this.typeOrmInvoiceEstimateHistoryRepository
            },
            /*
             * Expense & Related Entities
             */
            {
                repository: this.typeOrmExpenseCategoryRepository
            },
            {
                repository: this.typeOrmExpenseRepository
            },
            /*
             * Income
             */
            {
                repository: this.typeOrmIncomeRepository
            },
            /*
             * Feature & Related Entities
             */
            {
                repository: this.typeOrmFeatureOrganizationRepository
            },
            {
                repository: this.typeOrmGoalRepository
            },
            {
                repository: this.typeOrmGoalKPIRepository
            },
            /*
             * Key Result & Related Entities
             */
            {
                repository: this.typeOrmKeyResultRepository
            },
            {
                repository: this.typeOrmKeyResultTemplateRepository
            },
            {
                repository: this.typeOrmKeyResultUpdateRepository
            },
            /*
             * Goal KPI & Related Entities
             */
            {
                repository: this.typeOrmGoalKPITemplateRepository
            },
            {
                repository: this.typeOrmGoalTemplateRepository
            },
            {
                repository: this.typeOrmGoalTimeFrameRepository
            },
            {
                repository: this.typeOrmGoalGeneralSettingRepository
            },
            /*
             * Integration & Related Entities
             */
            {
                repository: this.typeOrmIntegrationTenantRepository
            },
            {
                repository: this.typeOrmIntegrationSettingRepository
            },
            {
                repository: this.typeOrmIntegrationMapRepository
            },
            {
                repository: this.typeOrmIntegrationEntitySettingRepository
            },
            {
                repository: this.typeOrmIntegrationEntitySettingTiedRepository
            },
            /*
             * Invite & Related Entities
             */
            {
                repository: this.typeOrmInviteRepository
            },
            {
                repository: this.typeOrmOrganizationTeamEmployeeRepository
            },
            /*
             * Pipeline & Stage Entities
             */
            {
                repository: this.typeOrmPipelineRepository
            },
            {
                repository: this.typeOrmPipelineStageRepository
            },
            {
                repository: this.typeOrmDealRepository
            },
            /*
             * Product & Related Entities
             */
            {
                repository: this.typeOrmImageAssetRepository
            },
            {
                repository: this.typeOrmProductCategoryRepository
            },
            {
                repository: this.typeOrmProductCategoryTranslationRepository
            },
            {
                repository: this.typeOrmProductTypeRepository
            },
            {
                repository: this.typeOrmProductTypeTranslationRepository
            },
            {
                repository: this.typeOrmProductOptionGroupRepository
            },
            {
                repository: this.typeOrmProductOptionRepository
            },
            {
                repository: this.typeOrmProductOptionTranslationRepository
            },
            {
                repository: this.typeOrmProductOptionGroupTranslationRepository
            },
            {
                repository: this.typeOrmProductRepository
            },
            {
                repository: this.typeOrmProductTranslationRepository
            },
            {
                repository: this.typeOrmProductVariantPriceRepository
            },
            {
                repository: this.typeOrmProductVariantSettingRepository
            },
            {
                repository: this.typeOrmProductVariantRepository
            },
            {
                repository: this.typeOrmWarehouseRepository
            },
            {
                repository: this.typeOrmMerchantRepository
            },
            {
                repository: this.typeOrmWarehouseProductRepository
            },
            {
                repository: this.typeOrmWarehouseProductVariantRepository
            },
            /*
             * Payment & Related Entities
             */
            {
                repository: this.typeOrmPaymentRepository
            },
            /*
             * Request Approval & Related Entities
             */
            {
                repository: this.typeOrmRequestApprovalRepository
            },
            {
                repository: this.typeOrmRequestApprovalEmployeeRepository
            },
            {
                repository: this.typeOrmRequestApprovalTeamRepository
            },
            /*
             * Tasks & Related Entities
             */
            {
                repository: this.typeOrmTaskRepository
            },
            /*
             * Timeoff & Related Entities
             */
            {
                repository: this.typeOrmTimeOffPolicyRepository
            },
            {
                repository: this.typeOrmTimeOffRequestRepository
            },
            /*
             * Timesheet & Related Entities
             */
            {
                repository: this.typeOrmTimesheetRepository
            },
            {
                repository: this.typeOrmTimeLogRepository
            },
            {
                repository: this.typeOrmTimeSlotRepository
            },
            {
                repository: this.typeOrmTimeSlotMinuteRepository
            },
            {
                repository: this.typeOrmScreenshotRepository
            },
            {
                repository: this.typeOrmActivityRepository
            },
            /*
             * Tag & Related Entities
             */
            {
                repository: this.typeOrmTagRepository
            },
            {
                repository: this.typeOrmCommentRepository
            },
            {
                repository: this.typeOrmDailyPlanRepository
            },
            {
                repository: this.typeOrmEmployeeNotificationRepository
            },
            {
                repository: this.typeOrmEmployeeNotificationSettingRepository
            },
            {
                repository: this.typeOrmEmployeePhoneRepository
            },
            {
                repository: this.typeOrmEntitySubscriptionRepository
            },
            {
                repository: this.typeOrmFavoriteRepository
            },
            {
                repository: this.typeOrmIssueTypeRepository
            },
            {
                repository: this.typeOrmMentionRepository
            },
            {
                repository: this.typeOrmOrganizationProjectEmployeeRepository
            },
            {
                repository: this.typeOrmOrganizationProjectModuleRepository
            },
            {
                repository: this.typeOrmOrganizationProjectModuleEmployeeRepository
            },
            {
                repository: this.typeOrmOrganizationSprintEmployeeRepository
            },
            {
                repository: this.typeOrmOrganizationSprintTaskRepository
            },
            {
                repository: this.typeOrmOrganizationSprintTaskHistoryRepository
            },
            {
                repository: this.typeOrmOrganizationTaskSettingRepository
            },
            {
                repository: this.typeOrmOrganizationTeamJoinRequestRepository
            },
            {
                repository: this.typeOrmReactionRepository
            },
            {
                repository: this.typeOrmResourceLinkRepository
            },
            {
                repository: this.typeOrmScreeningTaskRepository
            },
            {
                repository: this.typeOrmSocialAccountRepository
            },
            {
                repository: this.typeOrmTaskEstimationRepository
            },
            {
                repository: this.typeOrmTaskLinkedIssueRepository
            },
            {
                repository: this.typeOrmTaskPriorityRepository
            },
            {
                repository: this.typeOrmTaskRelatedIssueTypeRepository
            },
            {
                repository: this.typeOrmTaskSizeRepository
            },
            {
                repository: this.typeOrmTaskStatusRepository
            },
            {
                repository: this.typeOrmTaskVersionRepository
            },
            {
                repository: this.typeOrmTaskViewRepository
            },
            ...this.dynamicEntitiesClassMap
        ];
    }
};
exports.RepositoriesService = RepositoriesService;
exports.RepositoriesService = RepositoriesService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(internal_1.AccountingTemplate)),
    tslib_1.__param(2, (0, typeorm_1.InjectRepository)(internal_1.Activity)),
    tslib_1.__param(4, (0, typeorm_1.InjectRepository)(internal_1.AppointmentEmployee)),
    tslib_1.__param(6, (0, typeorm_1.InjectRepository)(internal_1.ApprovalPolicy)),
    tslib_1.__param(8, (0, typeorm_1.InjectRepository)(internal_1.AvailabilitySlot)),
    tslib_1.__param(10, (0, typeorm_1.InjectRepository)(internal_1.Candidate)),
    tslib_1.__param(12, (0, typeorm_1.InjectRepository)(internal_1.CandidateCriterionsRating)),
    tslib_1.__param(14, (0, typeorm_1.InjectRepository)(internal_1.CandidateDocument)),
    tslib_1.__param(16, (0, typeorm_1.InjectRepository)(internal_1.CandidateEducation)),
    tslib_1.__param(18, (0, typeorm_1.InjectRepository)(internal_1.CandidateExperience)),
    tslib_1.__param(20, (0, typeorm_1.InjectRepository)(internal_1.CandidateFeedback)),
    tslib_1.__param(22, (0, typeorm_1.InjectRepository)(internal_1.CandidateInterview)),
    tslib_1.__param(24, (0, typeorm_1.InjectRepository)(internal_1.CandidateInterviewers)),
    tslib_1.__param(26, (0, typeorm_1.InjectRepository)(internal_1.CandidatePersonalQualities)),
    tslib_1.__param(28, (0, typeorm_1.InjectRepository)(internal_1.CandidateSkill)),
    tslib_1.__param(30, (0, typeorm_1.InjectRepository)(internal_1.CandidateSource)),
    tslib_1.__param(32, (0, typeorm_1.InjectRepository)(internal_1.CandidateTechnologies)),
    tslib_1.__param(34, (0, typeorm_1.InjectRepository)(internal_1.Contact)),
    tslib_1.__param(36, (0, typeorm_1.InjectRepository)(internal_1.CustomSmtp)),
    tslib_1.__param(38, (0, typeorm_1.InjectRepository)(internal_1.Deal)),
    tslib_1.__param(40, (0, typeorm_1.InjectRepository)(internal_1.EmailHistory)),
    tslib_1.__param(42, (0, typeorm_1.InjectRepository)(internal_1.EmailTemplate)),
    tslib_1.__param(44, (0, typeorm_1.InjectRepository)(internal_1.Employee)),
    tslib_1.__param(46, (0, typeorm_1.InjectRepository)(internal_1.EmployeeAppointment)),
    tslib_1.__param(48, (0, typeorm_1.InjectRepository)(internal_1.EmployeeAward)),
    tslib_1.__param(50, (0, typeorm_1.InjectRepository)(internal_1.EmployeeRecurringExpense)),
    tslib_1.__param(52, (0, typeorm_1.InjectRepository)(internal_1.EmployeeSetting)),
    tslib_1.__param(54, (0, typeorm_1.InjectRepository)(internal_1.Equipment)),
    tslib_1.__param(56, (0, typeorm_1.InjectRepository)(internal_1.EquipmentSharing)),
    tslib_1.__param(58, (0, typeorm_1.InjectRepository)(internal_1.EquipmentSharingPolicy)),
    tslib_1.__param(60, (0, typeorm_1.InjectRepository)(internal_1.EstimateEmail)),
    tslib_1.__param(62, (0, typeorm_1.InjectRepository)(internal_1.EventType)),
    tslib_1.__param(64, (0, typeorm_1.InjectRepository)(internal_1.Expense)),
    tslib_1.__param(66, (0, typeorm_1.InjectRepository)(internal_1.ExpenseCategory)),
    tslib_1.__param(68, (0, typeorm_1.InjectRepository)(internal_1.Feature)),
    tslib_1.__param(70, (0, typeorm_1.InjectRepository)(internal_1.FeatureOrganization)),
    tslib_1.__param(72, (0, typeorm_1.InjectRepository)(internal_1.Goal)),
    tslib_1.__param(74, (0, typeorm_1.InjectRepository)(internal_1.GoalTemplate)),
    tslib_1.__param(76, (0, typeorm_1.InjectRepository)(internal_1.GoalKPI)),
    tslib_1.__param(78, (0, typeorm_1.InjectRepository)(internal_1.GoalKPITemplate)),
    tslib_1.__param(80, (0, typeorm_1.InjectRepository)(internal_1.GoalTimeFrame)),
    tslib_1.__param(82, (0, typeorm_1.InjectRepository)(internal_1.GoalGeneralSetting)),
    tslib_1.__param(84, (0, typeorm_1.InjectRepository)(internal_1.Income)),
    tslib_1.__param(86, (0, typeorm_1.InjectRepository)(internal_1.Integration)),
    tslib_1.__param(88, (0, typeorm_1.InjectRepository)(internal_1.IntegrationType)),
    tslib_1.__param(90, (0, typeorm_1.InjectRepository)(internal_1.IntegrationEntitySetting)),
    tslib_1.__param(92, (0, typeorm_1.InjectRepository)(internal_1.IntegrationEntitySettingTied)),
    tslib_1.__param(94, (0, typeorm_1.InjectRepository)(internal_1.IntegrationMap)),
    tslib_1.__param(96, (0, typeorm_1.InjectRepository)(internal_1.IntegrationSetting)),
    tslib_1.__param(98, (0, typeorm_1.InjectRepository)(internal_1.IntegrationTenant)),
    tslib_1.__param(100, (0, typeorm_1.InjectRepository)(internal_1.Invite)),
    tslib_1.__param(102, (0, typeorm_1.InjectRepository)(internal_1.Invoice)),
    tslib_1.__param(104, (0, typeorm_1.InjectRepository)(internal_1.InvoiceEstimateHistory)),
    tslib_1.__param(106, (0, typeorm_1.InjectRepository)(internal_1.InvoiceItem)),
    tslib_1.__param(108, (0, typeorm_1.InjectRepository)(internal_1.KeyResult)),
    tslib_1.__param(110, (0, typeorm_1.InjectRepository)(internal_1.KeyResultTemplate)),
    tslib_1.__param(112, (0, typeorm_1.InjectRepository)(internal_1.KeyResultUpdate)),
    tslib_1.__param(114, (0, typeorm_1.InjectRepository)(internal_1.Language)),
    tslib_1.__param(116, (0, typeorm_1.InjectRepository)(internal_1.Organization)),
    tslib_1.__param(118, (0, typeorm_1.InjectRepository)(internal_1.EmployeeLevel)),
    tslib_1.__param(120, (0, typeorm_1.InjectRepository)(internal_1.OrganizationAward)),
    tslib_1.__param(122, (0, typeorm_1.InjectRepository)(internal_1.OrganizationContact)),
    tslib_1.__param(124, (0, typeorm_1.InjectRepository)(internal_1.OrganizationDepartment)),
    tslib_1.__param(126, (0, typeorm_1.InjectRepository)(internal_1.OrganizationDocument)),
    tslib_1.__param(128, (0, typeorm_1.InjectRepository)(internal_1.OrganizationEmploymentType)),
    tslib_1.__param(130, (0, typeorm_1.InjectRepository)(internal_1.OrganizationLanguage)),
    tslib_1.__param(132, (0, typeorm_1.InjectRepository)(internal_1.OrganizationPosition)),
    tslib_1.__param(134, (0, typeorm_1.InjectRepository)(internal_1.OrganizationProject)),
    tslib_1.__param(136, (0, typeorm_1.InjectRepository)(internal_1.OrganizationRecurringExpense)),
    tslib_1.__param(138, (0, typeorm_1.InjectRepository)(internal_1.OrganizationSprint)),
    tslib_1.__param(140, (0, typeorm_1.InjectRepository)(internal_1.OrganizationTeam)),
    tslib_1.__param(142, (0, typeorm_1.InjectRepository)(internal_1.OrganizationTeamEmployee)),
    tslib_1.__param(144, (0, typeorm_1.InjectRepository)(internal_1.OrganizationVendor)),
    tslib_1.__param(146, (0, typeorm_1.InjectRepository)(internal_1.Payment)),
    tslib_1.__param(148, (0, typeorm_1.InjectRepository)(internal_1.Pipeline)),
    tslib_1.__param(150, (0, typeorm_1.InjectRepository)(internal_1.PipelineStage)),
    tslib_1.__param(152, (0, typeorm_1.InjectRepository)(internal_1.Product)),
    tslib_1.__param(154, (0, typeorm_1.InjectRepository)(internal_1.ProductTranslation)),
    tslib_1.__param(156, (0, typeorm_1.InjectRepository)(internal_1.ProductCategory)),
    tslib_1.__param(158, (0, typeorm_1.InjectRepository)(internal_1.ProductCategoryTranslation)),
    tslib_1.__param(160, (0, typeorm_1.InjectRepository)(internal_1.ProductOption)),
    tslib_1.__param(162, (0, typeorm_1.InjectRepository)(internal_1.ProductOptionTranslation)),
    tslib_1.__param(164, (0, typeorm_1.InjectRepository)(internal_1.ProductOptionGroup)),
    tslib_1.__param(166, (0, typeorm_1.InjectRepository)(internal_1.ProductOptionGroupTranslation)),
    tslib_1.__param(168, (0, typeorm_1.InjectRepository)(internal_1.ProductVariantSetting)),
    tslib_1.__param(170, (0, typeorm_1.InjectRepository)(internal_1.ProductType)),
    tslib_1.__param(172, (0, typeorm_1.InjectRepository)(internal_1.ProductTypeTranslation)),
    tslib_1.__param(174, (0, typeorm_1.InjectRepository)(internal_1.ProductVariant)),
    tslib_1.__param(176, (0, typeorm_1.InjectRepository)(internal_1.ProductVariantPrice)),
    tslib_1.__param(178, (0, typeorm_1.InjectRepository)(internal_1.ImageAsset)),
    tslib_1.__param(180, (0, typeorm_1.InjectRepository)(internal_1.Warehouse)),
    tslib_1.__param(182, (0, typeorm_1.InjectRepository)(internal_1.Merchant)),
    tslib_1.__param(184, (0, typeorm_1.InjectRepository)(internal_1.WarehouseProduct)),
    tslib_1.__param(186, (0, typeorm_1.InjectRepository)(internal_1.WarehouseProductVariant)),
    tslib_1.__param(188, (0, typeorm_1.InjectRepository)(internal_1.Skill)),
    tslib_1.__param(190, (0, typeorm_1.InjectRepository)(internal_1.Screenshot)),
    tslib_1.__param(192, (0, typeorm_1.InjectRepository)(internal_1.RequestApproval)),
    tslib_1.__param(194, (0, typeorm_1.InjectRepository)(internal_1.RequestApprovalEmployee)),
    tslib_1.__param(196, (0, typeorm_1.InjectRepository)(internal_1.RequestApprovalTeam)),
    tslib_1.__param(198, (0, typeorm_1.InjectRepository)(internal_1.Role)),
    tslib_1.__param(200, (0, typeorm_1.InjectRepository)(internal_1.RolePermission)),
    tslib_1.__param(202, (0, typeorm_1.InjectRepository)(internal_1.Report)),
    tslib_1.__param(204, (0, typeorm_1.InjectRepository)(internal_1.ReportCategory)),
    tslib_1.__param(206, (0, typeorm_1.InjectRepository)(internal_1.ReportOrganization)),
    tslib_1.__param(208, (0, typeorm_1.InjectRepository)(internal_1.Tag)),
    tslib_1.__param(210, (0, typeorm_1.InjectRepository)(internal_1.Task)),
    tslib_1.__param(212, (0, typeorm_1.InjectRepository)(internal_1.TenantSetting)),
    tslib_1.__param(214, (0, typeorm_1.InjectRepository)(internal_1.Timesheet)),
    tslib_1.__param(216, (0, typeorm_1.InjectRepository)(internal_1.TimeLog)),
    tslib_1.__param(218, (0, typeorm_1.InjectRepository)(internal_1.TimeSlot)),
    tslib_1.__param(220, (0, typeorm_1.InjectRepository)(internal_1.TimeSlotMinute)),
    tslib_1.__param(222, (0, typeorm_1.InjectRepository)(internal_1.TimeOffRequest)),
    tslib_1.__param(224, (0, typeorm_1.InjectRepository)(internal_1.TimeOffPolicy)),
    tslib_1.__param(226, (0, typeorm_1.InjectRepository)(internal_1.User)),
    tslib_1.__param(228, (0, typeorm_1.InjectRepository)(internal_1.UserOrganization)),
    tslib_1.__param(230, (0, typeorm_1.InjectRepository)(internal_1.TagType)),
    tslib_1.__param(231, (0, typeorm_1.InjectRepository)(internal_1.Tenant)),
    tslib_1.__param(232, (0, typeorm_1.InjectRepository)(internal_1.ActivityLog)),
    tslib_1.__param(233, (0, typeorm_1.InjectRepository)(internal_1.EmployeeAvailability)),
    tslib_1.__param(234, (0, typeorm_1.InjectRepository)(internal_1.Comment)),
    tslib_1.__param(235, (0, typeorm_1.InjectRepository)(internal_1.DailyPlan)),
    tslib_1.__param(236, (0, typeorm_1.InjectRepository)(internal_1.EmailReset)),
    tslib_1.__param(237, (0, typeorm_1.InjectRepository)(internal_1.EmployeeNotification)),
    tslib_1.__param(238, (0, typeorm_1.InjectRepository)(internal_1.EmployeeNotificationSetting)),
    tslib_1.__param(239, (0, typeorm_1.InjectRepository)(internal_1.EmployeePhone)),
    tslib_1.__param(240, (0, typeorm_1.InjectRepository)(internal_1.EntitySubscription)),
    tslib_1.__param(241, (0, typeorm_1.InjectRepository)(internal_1.Favorite)),
    tslib_1.__param(242, (0, typeorm_1.InjectRepository)(internal_1.ImportHistory)),
    tslib_1.__param(243, (0, typeorm_1.InjectRepository)(import_record_1.ImportRecord)),
    tslib_1.__param(244, (0, typeorm_1.InjectRepository)(internal_1.IssueType)),
    tslib_1.__param(245, (0, typeorm_1.InjectRepository)(internal_1.Mention)),
    tslib_1.__param(246, (0, typeorm_1.InjectRepository)(internal_1.OrganizationProjectEmployee)),
    tslib_1.__param(247, (0, typeorm_1.InjectRepository)(internal_1.OrganizationProjectModule)),
    tslib_1.__param(248, (0, typeorm_1.InjectRepository)(internal_1.OrganizationProjectModuleEmployee)),
    tslib_1.__param(249, (0, typeorm_1.InjectRepository)(internal_1.OrganizationSprintEmployee)),
    tslib_1.__param(250, (0, typeorm_1.InjectRepository)(internal_1.OrganizationSprintTask)),
    tslib_1.__param(251, (0, typeorm_1.InjectRepository)(internal_1.OrganizationSprintTaskHistory)),
    tslib_1.__param(252, (0, typeorm_1.InjectRepository)(internal_1.OrganizationTaskSetting)),
    tslib_1.__param(253, (0, typeorm_1.InjectRepository)(internal_1.OrganizationTeamJoinRequest)),
    tslib_1.__param(254, (0, typeorm_1.InjectRepository)(internal_1.Reaction)),
    tslib_1.__param(255, (0, typeorm_1.InjectRepository)(internal_1.ResourceLink)),
    tslib_1.__param(256, (0, typeorm_1.InjectRepository)(internal_1.ScreeningTask)),
    tslib_1.__param(257, (0, typeorm_1.InjectRepository)(internal_1.SocialAccount)),
    tslib_1.__param(258, (0, typeorm_1.InjectRepository)(internal_1.TaskEstimation)),
    tslib_1.__param(259, (0, typeorm_1.InjectRepository)(internal_1.TaskLinkedIssue)),
    tslib_1.__param(260, (0, typeorm_1.InjectRepository)(internal_1.TaskPriority)),
    tslib_1.__param(261, (0, typeorm_1.InjectRepository)(internal_1.TaskRelatedIssueType)),
    tslib_1.__param(262, (0, typeorm_1.InjectRepository)(internal_1.TaskSize)),
    tslib_1.__param(263, (0, typeorm_1.InjectRepository)(internal_1.TaskStatus)),
    tslib_1.__param(264, (0, typeorm_1.InjectRepository)(internal_1.TaskVersion)),
    tslib_1.__param(265, (0, typeorm_1.InjectRepository)(internal_1.TaskView)),
    tslib_1.__param(266, (0, typeorm_1.InjectRepository)(internal_1.Country)),
    tslib_1.__param(267, (0, typeorm_1.InjectRepository)(internal_1.Currency)),
    tslib_1.__param(268, (0, typeorm_1.InjectRepository)(internal_1.Dashboard)),
    tslib_1.__param(269, (0, typeorm_1.InjectRepository)(internal_1.DashboardWidget)),
    tslib_1.__metadata("design:paramtypes", [type_orm_accounting_template_repository_1.TypeOrmAccountingTemplateRepository,
        mikro_orm_accounting_template_repository_1.MikroOrmAccountingTemplateRepository,
        type_orm_activity_repository_1.TypeOrmActivityRepository,
        mikro_orm_activity_repository_1.MikroOrmActivityRepository,
        type_orm_appointment_employee_repository_1.TypeOrmAppointmentEmployeeRepository,
        mikro_orm_appointment_employee_repository_1.MikroOrmAppointmentEmployeeRepository,
        type_orm_approval_policy_repository_1.TypeOrmApprovalPolicyRepository,
        mikro_orm_approval_policy_repository_1.MikroOrmApprovalPolicyRepository,
        type_orm_availability_slot_repository_1.TypeOrmAvailabilitySlotRepository,
        mikro_orm_availability_slot_repository_1.MikroOrmAvailabilitySlotRepository,
        type_orm_candidate_repository_1.TypeOrmCandidateRepository,
        mikro_orm_candidate_repository_1.MikroOrmCandidateRepository,
        type_orm_candidate_criterions_rating_repository_1.TypeOrmCandidateCriterionsRatingRepository,
        mikro_orm_candidate_criterions_rating_repository_1.MikroOrmCandidateCriterionsRatingRepository,
        type_orm_candidate_document_repository_1.TypeOrmCandidateDocumentRepository,
        mikro_orm_candidate_document_repository_1.MikroOrmCandidateDocumentRepository,
        type_orm_candidate_education_repository_1.TypeOrmCandidateEducationRepository,
        mikro_orm_candidate_education_repository_1.MikroOrmCandidateEducationRepository,
        type_orm_candidate_experience_repository_1.TypeOrmCandidateExperienceRepository,
        mikro_orm_candidate_experience_repository_1.MikroOrmCandidateExperienceRepository,
        type_orm_candidate_feedback_repository_1.TypeOrmCandidateFeedbackRepository,
        mikro_orm_candidate_feedback_repository_1.MikroOrmCandidateFeedbackRepository,
        type_orm_candidate_interview_repository_1.TypeOrmCandidateInterviewRepository,
        mikro_orm_candidate_interview_repository_1.MikroOrmCandidateInterviewRepository,
        type_orm_candidate_interviewers_repository_1.TypeOrmCandidateInterviewersRepository,
        mikro_orm_candidate_interviewers_repository_1.MikroOrmCandidateInterviewersRepository,
        type_orm_candidate_personal_qualities_repository_1.TypeOrmCandidatePersonalQualitiesRepository,
        mikro_orm_candidate_personal_qualities_repository_1.MikroOrmCandidatePersonalQualitiesRepository,
        type_orm_candidate_skill_repository_1.TypeOrmCandidateSkillRepository,
        mikro_orm_candidate_skill_repository_1.MikroOrmCandidateSkillRepository,
        type_orm_candidate_source_repository_1.TypeOrmCandidateSourceRepository,
        mikro_orm_candidate_source_repository_1.MikroOrmCandidateSourceRepository,
        type_orm_candidate_technologies_repository_1.TypeOrmCandidateTechnologiesRepository,
        mikro_orm_candidate_technologies_repository_1.MikroOrmCandidateTechnologiesRepository,
        type_orm_contact_repository_1.TypeOrmContactRepository,
        mikro_orm_contact_repository_1.MikroOrmContactRepository,
        type_orm_custom_smtp_repository_1.TypeOrmCustomSmtpRepository,
        mikro_orm_custom_smtp_repository_1.MikroOrmCustomSmtpRepository,
        type_orm_deal_repository_1.TypeOrmDealRepository,
        mikro_orm_deal_repository_1.MikroOrmDealRepository,
        type_orm_email_history_repository_1.TypeOrmEmailHistoryRepository,
        mikro_orm_email_history_repository_1.MikroOrmEmailHistoryRepository,
        type_orm_email_template_repository_1.TypeOrmEmailTemplateRepository,
        mikro_orm_email_template_repository_1.MikroOrmEmailTemplateRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        mikro_orm_employee_repository_1.MikroOrmEmployeeRepository,
        type_orm_employee_appointment_repository_1.TypeOrmEmployeeAppointmentRepository,
        mikro_orm_employee_appointment_repository_1.MikroOrmEmployeeAppointmentRepository,
        type_orm_employee_award_repository_1.TypeOrmEmployeeAwardRepository,
        mikro_orm_employee_award_repository_1.MikroOrmEmployeeAwardRepository,
        type_orm_employee_recurring_expense_repository_1.TypeOrmEmployeeRecurringExpenseRepository,
        mikro_orm_employee_recurring_expense_repository_1.MikroOrmEmployeeRecurringExpenseRepository,
        type_orm_employee_setting_repository_1.TypeOrmEmployeeSettingRepository,
        mikro_orm_employee_setting_repository_1.MikroOrmEmployeeSettingRepository,
        type_orm_equipment_repository_1.TypeOrmEquipmentRepository,
        mikro_orm_equipment_repository_1.MikroOrmEquipmentRepository,
        type_orm_equipment_sharing_repository_1.TypeOrmEquipmentSharingRepository,
        mikro_orm_equipment_sharing_repository_1.MikroOrmEquipmentSharingRepository,
        type_orm_equipment_sharing_policy_repository_1.TypeOrmEquipmentSharingPolicyRepository,
        mikro_orm_equipment_sharing_policy_repository_1.MikroOrmEquipmentSharingPolicyRepository,
        type_orm_estimate_email_repository_1.TypeOrmEstimateEmailRepository,
        mikro_orm_estimate_email_repository_1.MikroOrmEstimateEmailRepository,
        type_orm_event_types_repository_1.TypeOrmEventTypeRepository,
        mikro_orm_event_type_repository_1.MikroOrmEventTypeRepository,
        type_orm_expense_repository_1.TypeOrmExpenseRepository,
        mikro_orm_expense_repository_1.MikroOrmExpenseRepository,
        type_orm_expense_category_repository_1.TypeOrmExpenseCategoryRepository,
        mikro_orm_expense_category_repository_1.MikroOrmExpenseCategoryRepository,
        type_orm_feature_repository_1.TypeOrmFeatureRepository,
        mikro_orm_feature_repository_1.MikroOrmFeatureRepository,
        type_orm_feature_organization_repository_1.TypeOrmFeatureOrganizationRepository,
        mikro_orm_feature_organization_repository_1.MikroOrmFeatureOrganizationRepository,
        type_orm_goal_repository_1.TypeOrmGoalRepository,
        mikro_orm_goal_repository_1.MikroOrmGoalRepository,
        type_orm_goal_template_repository_1.TypeOrmGoalTemplateRepository,
        mikro_orm_goal_template_repository_1.MikroOrmGoalTemplateRepository,
        type_orm_goal_kpi_repository_1.TypeOrmGoalKPIRepository,
        mikro_orm_goal_kpi_repository_1.MikroOrmGoalKPIRepository,
        type_orm_goal_kpi_template_repository_1.TypeOrmGoalKPITemplateRepository,
        mikro_orm_goal_kpi_template_repository_1.MikroOrmGoalKPITemplateRepository,
        type_orm_goal_time_frame_repository_1.TypeOrmGoalTimeFrameRepository,
        mikro_orm_goal_time_frame_repository_1.MikroOrmGoalTimeFrameRepository,
        type_orm_goal_general_setting_repository_1.TypeOrmGoalGeneralSettingRepository,
        mikro_orm_goal_general_setting_repository_1.MikroOrmGoalGeneralSettingRepository,
        type_orm_income_repository_1.TypeOrmIncomeRepository,
        mikro_orm_income_repository_1.MikroOrmIncomeRepository,
        type_orm_integration_repository_1.TypeOrmIntegrationRepository,
        mikro_orm_integration_repository_1.MikroOrmIntegrationRepository,
        type_orm_integration_type_repository_1.TypeOrmIntegrationTypeRepository,
        mikro_orm_integration_type_repository_1.MikroOrmIntegrationTypeRepository,
        type_orm_integration_entity_setting_repository_1.TypeOrmIntegrationEntitySettingRepository,
        mikro_orm_integration_entity_setting_repository_1.MikroOrmIntegrationEntitySettingRepository,
        type_orm_integration_entity_setting_tied_repository_1.TypeOrmIntegrationEntitySettingTiedRepository,
        mikro_orm_integration_entity_setting_tied_repository_1.MikroOrmIntegrationEntitySettingTiedRepository,
        type_orm_integration_map_repository_1.TypeOrmIntegrationMapRepository,
        mikro_orm_integration_map_repository_1.MikroOrmIntegrationMapRepository,
        type_orm_integration_setting_repository_1.TypeOrmIntegrationSettingRepository,
        mikro_orm_integration_setting_repository_1.MikroOrmIntegrationSettingRepository,
        type_orm_integration_tenant_repository_1.TypeOrmIntegrationTenantRepository,
        mikro_orm_integration_tenant_repository_1.MikroOrmIntegrationTenantRepository,
        type_orm_invite_repository_1.TypeOrmInviteRepository,
        mikro_orm_invite_repository_1.MikroOrmInviteRepository,
        type_orm_invoice_repository_1.TypeOrmInvoiceRepository,
        mikro_orm_invoice_repository_1.MikroOrmInvoiceRepository,
        type_orm_invoice_estimate_history_repository_1.TypeOrmInvoiceEstimateHistoryRepository,
        mikro_orm_invoice_estimate_history_repository_1.MikroOrmInvoiceEstimateHistoryRepository,
        type_orm_invoice_item_repository_1.TypeOrmInvoiceItemRepository,
        mikro_orm_invoice_item_repository_1.MikroOrmInvoiceItemRepository,
        type_orm_keyresult_repository_1.TypeOrmKeyResultRepository,
        mikro_orm_keyresult_repository_1.MikroOrmKeyResultRepository,
        type_orm_keyresult_template_repository_1.TypeOrmKeyResultTemplateRepository,
        mikro_orm_keyresult_template_repository_1.MikroOrmKeyResultTemplateRepository,
        type_orm_keyresult_update_repository_1.TypeOrmKeyResultUpdateRepository,
        mikro_orm_keyresult_update_repository_1.MikroOrmKeyResultUpdateRepository,
        type_orm_language_repository_1.TypeOrmLanguageRepository,
        mikro_orm_language_repository_1.MikroOrmLanguageRepository,
        type_orm_organization_repository_1.TypeOrmOrganizationRepository,
        mikro_orm_organization_repository_1.MikroOrmOrganizationRepository,
        type_orm_employee_level_repository_1.TypeOrmEmployeeLevelRepository,
        mikro_orm_employee_level_repository_1.MikroOrmEmployeeLevelRepository,
        type_orm_organization_award_repository_1.TypeOrmOrganizationAwardRepository,
        mikro_orm_organization_award_repository_1.MikroOrmOrganizationAwardRepository,
        type_orm_organization_contact_repository_1.TypeOrmOrganizationContactRepository,
        mikro_orm_organization_contact_repository_1.MikroOrmOrganizationContactRepository,
        type_orm_organization_department_repository_1.TypeOrmOrganizationDepartmentRepository,
        mikro_orm_organization_department_repository_1.MikroOrmOrganizationDepartmentRepository,
        type_orm_organization_document_repository_1.TypeOrmOrganizationDocumentRepository,
        mikro_orm_organization_document_repository_1.MikroOrmOrganizationDocumentRepository,
        type_orm_organization_employment_type_repository_1.TypeOrmOrganizationEmploymentTypeRepository,
        mikro_orm_organization_employment_type_repository_1.MikroOrmOrganizationEmploymentTypeRepository,
        type_orm_organization_language_repository_1.TypeOrmOrganizationLanguageRepository,
        mikro_orm_organization_language_repository_1.MikroOrmOrganizationLanguageRepository,
        type_orm_organization_position_repository_1.TypeOrmOrganizationPositionRepository,
        mikro_orm_organization_position_repository_1.MikroOrmOrganizationPositionRepository,
        type_orm_organization_project_repository_1.TypeOrmOrganizationProjectRepository,
        mikro_orm_organization_project_repository_1.MikroOrmOrganizationProjectRepository,
        type_orm_organization_recurring_expense_repository_1.TypeOrmOrganizationRecurringExpenseRepository,
        mikro_orm_organization_recurring_expense_repository_1.MikroOrmOrganizationRecurringExpenseRepository,
        type_orm_organization_sprint_repository_1.TypeOrmOrganizationSprintRepository,
        mikro_orm_organization_sprint_repository_1.MikroOrmOrganizationSprintRepository,
        type_orm_organization_team_repository_1.TypeOrmOrganizationTeamRepository,
        mikro_orm_organization_team_repository_1.MikroOrmOrganizationTeamRepository,
        type_orm_organization_team_employee_repository_1.TypeOrmOrganizationTeamEmployeeRepository,
        mikro_orm_organization_team_employee_repository_1.MikroOrmOrganizationTeamEmployeeRepository,
        type_orm_organization_vendor_repository_1.TypeOrmOrganizationVendorRepository,
        mikro_orm_organization_vendor_repository_1.MikroOrmOrganizationVendorRepository,
        type_orm_payment_repository_1.TypeOrmPaymentRepository,
        mikro_orm_payment_repository_1.MikroOrmPaymentRepository,
        type_orm_pipeline_repository_1.TypeOrmPipelineRepository,
        mikro_orm_pipeline_repository_1.MikroOrmPipelineRepository,
        type_orm_pipeline_stage_repository_1.TypeOrmPipelineStageRepository,
        mikro_orm_pipeline_stage_repository_1.MikroOrmPipelineStageRepository,
        type_orm_product_repository_1.TypeOrmProductRepository,
        mikro_orm_product_repository_1.MikroOrmProductRepository,
        type_orm_product_translation_repository_1.TypeOrmProductTranslationRepository,
        mikro_orm_product_translation_repository_1.MikroOrmProductTranslationRepository,
        type_orm_product_category_repository_1.TypeOrmProductCategoryRepository,
        mikro_orm_product_category_repository_1.MikroOrmProductCategoryRepository,
        type_orm_product_category_translation_repository_1.TypeOrmProductCategoryTranslationRepository,
        mikro_orm_product_category_translation_repository_1.MikroOrmProductCategoryTranslationRepository,
        type_orm_product_option_repository_1.TypeOrmProductOptionRepository,
        mikro_orm_product_option_repository_1.MikroOrmProductOptionRepository,
        type_orm_product_option_translation_repository_1.TypeOrmProductOptionTranslationRepository,
        mikro_orm_product_option_translation_repository_1.MikroOrmProductOptionTranslationRepository,
        type_orm_product_option_group_repository_1.TypeOrmProductOptionGroupRepository,
        mikro_orm_product_option_group_repository_1.MikroOrmProductOptionGroupRepository,
        type_orm_product_option_group_translation_repository_1.TypeOrmProductOptionGroupTranslationRepository,
        mikro_orm_product_option_group_translation_repository_1.MikroOrmProductOptionGroupTranslationRepository,
        type_orm_product_setting_repository_1.TypeOrmProductVariantSettingRepository,
        mikro_orm_product_setting_repository_1.MikroOrmProductVariantSettingRepository,
        type_orm_product_type_repository_1.TypeOrmProductTypeRepository,
        mikro_orm_product_type_repository_1.MikroOrmProductTypeRepository,
        type_orm_product_type_translation_repository_1.TypeOrmProductTypeTranslationRepository,
        mikro_orm_product_type_translation_repository_1.MikroOrmProductTypeTranslationRepository,
        type_orm_product_variant_repository_1.TypeOrmProductVariantRepository,
        mikro_orm_product_variant_repository_1.MikroOrmProductVariantRepository,
        type_orm_product_variant_price_repository_1.TypeOrmProductVariantPriceRepository,
        mikro_orm_product_variant_price_repository_1.MikroOrmProductVariantPriceRepository,
        type_orm_image_asset_repository_1.TypeOrmImageAssetRepository,
        mikro_orm_image_asset_repository_1.MikroOrmImageAssetRepository,
        type_orm_warehouse_repository_1.TypeOrmWarehouseRepository,
        mikro_orm_warehouse_repository_1.MikroOrmWarehouseRepository,
        type_orm_merchant_repository_1.TypeOrmMerchantRepository,
        mikro_orm_merchant_repository_1.MikroOrmMerchantRepository,
        type_orm_warehouse_product_repository_1.TypeOrmWarehouseProductRepository,
        mikro_orm_warehouse_product_repository_1.MikroOrmWarehouseProductRepository,
        type_orm_warehouse_product_variant_repository_1.TypeOrmWarehouseProductVariantRepository,
        mikro_orm_warehouse_product_variant_repository_1.MikroOrmWarehouseProductVariantRepository,
        type_orm_skill_repository_1.TypeOrmSkillRepository,
        mikro_orm_skill_repository_1.MikroOrmSkillRepository,
        type_orm_screenshot_repository_1.TypeOrmScreenshotRepository,
        mikro_orm_screenshot_repository_1.MikroOrmScreenshotRepository,
        type_orm_request_approval_repository_1.TypeOrmRequestApprovalRepository,
        mikro_orm_request_approval_repository_1.MikroOrmRequestApprovalRepository,
        type_orm_request_approval_employee_repository_1.TypeOrmRequestApprovalEmployeeRepository,
        mikro_orm_request_approval_employee_repository_1.MikroOrmRequestApprovalEmployeeRepository,
        type_orm_request_approval_team_repository_1.TypeOrmRequestApprovalTeamRepository,
        mikro_orm_request_approval_team_repository_1.MikroOrmRequestApprovalTeamRepository,
        type_orm_role_repository_1.TypeOrmRoleRepository,
        mikro_orm_role_repository_1.MikroOrmRoleRepository,
        type_orm_role_permission_repository_1.TypeOrmRolePermissionRepository,
        mikro_orm_role_permission_repository_1.MikroOrmRolePermissionRepository,
        type_orm_report_repository_1.TypeOrmReportRepository,
        mikro_orm_report_repository_1.MikroOrmReportRepository,
        type_orm_report_category_repository_1.TypeOrmReportCategoryRepository,
        mikro_orm_report_category_repository_1.MikroOrmReportCategoryRepository,
        type_orm_report_organization_repository_1.TypeOrmReportOrganizationRepository,
        mikro_orm_report_organization_repository_1.MikroOrmReportOrganizationRepository,
        type_orm_tag_repository_1.TypeOrmTagRepository,
        mikro_orm_tag_repository_1.MikroOrmTagRepository,
        type_orm_task_repository_1.TypeOrmTaskRepository,
        mikro_orm_task_repository_1.MikroOrmTaskRepository,
        type_orm_tenant_setting_repository_1.TypeOrmTenantSettingRepository,
        mikro_orm_tenant_setting_repository_1.MikroOrmTenantSettingRepository,
        type_orm_timesheet_repository_1.TypeOrmTimesheetRepository,
        mikro_orm_timesheet_repository_1.MikroOrmTimesheetRepository,
        type_orm_time_log_repository_1.TypeOrmTimeLogRepository,
        mikro_orm_time_log_repository_1.MikroOrmTimeLogRepository,
        type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
        mikro_orm_time_slot_repository_1.MikroOrmTimeSlotRepository,
        type_orm_time_slot_minute_repository_1.TypeOrmTimeSlotMinuteRepository,
        mikro_orm_time_slot_minute_repository_1.MikroOrmTimeSlotMinuteRepository,
        type_orm_time_off_request_repository_1.TypeOrmTimeOffRequestRepository,
        mikro_orm_time_off_request_repository_1.MikroOrmTimeOffRequestRepository,
        type_orm_time_off_policy_repository_1.TypeOrmTimeOffPolicyRepository,
        mikro_orm_time_off_policy_repository_1.MikroOrmTimeOffPolicyRepository,
        type_orm_user_repository_1.TypeOrmUserRepository,
        mikro_orm_user_repository_1.MikroOrmUserRepository,
        type_orm_user_organization_repository_1.TypeOrmUserOrganizationRepository,
        mikro_orm_user_organization_repository_1.MikroOrmUserOrganizationRepository,
        type_orm_tag_type_repository_1.TypeOrmTagTypeRepository,
        type_orm_tenant_repository_1.TypeOrmTenantRepository,
        type_orm_activity_log_repository_1.TypeOrmActivityLogRepository,
        type_orm_employee_availability_repository_1.TypeOrmEmployeeAvailabilityRepository,
        type_orm_comment_repository_1.TypeOrmCommentRepository,
        type_orm_daily_plan_repository_1.TypeOrmDailyPlanRepository,
        type_orm_email_reset_repository_1.TypeOrmEmailResetRepository,
        type_orm_employee_notification_repository_1.TypeOrmEmployeeNotificationRepository,
        type_orm_employee_notification_setting_repository_1.TypeOrmEmployeeNotificationSettingRepository,
        type_orm_employee_phone_repository_1.TypeOrmEmployeePhoneRepository,
        type_orm_entity_subscription_repository_1.TypeOrmEntitySubscriptionRepository,
        type_orm_favorite_repository_1.TypeOrmFavoriteRepository,
        type_orm_import_history_repository_1.TypeOrmImportHistoryRepository,
        type_orm_import_record_repository_1.TypeOrmImportRecordRepository,
        type_orm_issue_type_repository_1.TypeOrmIssueTypeRepository,
        type_orm_mention_repository_1.TypeOrmMentionRepository,
        type_orm_organization_project_employee_repository_1.TypeOrmOrganizationProjectEmployeeRepository,
        type_orm_organization_project_module_repository_1.TypeOrmOrganizationProjectModuleRepository,
        type_orm_organization_project_module_employee_repository_1.TypeOrmOrganizationProjectModuleEmployeeRepository,
        type_orm_organization_sprint_employee_repository_1.TypeOrmOrganizationSprintEmployeeRepository,
        type_orm_organization_sprint_task_repository_1.TypeOrmOrganizationSprintTaskRepository,
        type_orm_organization_sprint_task_history_repository_1.TypeOrmOrganizationSprintTaskHistoryRepository,
        type_orm_organization_task_setting_repository_1.TypeOrmOrganizationTaskSettingRepository,
        type_orm_organization_team_join_request_repository_1.TypeOrmOrganizationTeamJoinRequestRepository,
        type_orm_reaction_repository_1.TypeOrmReactionRepository,
        type_orm_resource_link_repository_1.TypeOrmResourceLinkRepository,
        type_orm_screening_task_repository_1.TypeOrmScreeningTaskRepository,
        type_orm_social_account_repository_1.TypeOrmSocialAccountRepository,
        type_orm_estimation_repository_1.TypeOrmTaskEstimationRepository,
        type_orm_linked_issue_repository_1.TypeOrmTaskLinkedIssueRepository,
        type_orm_task_priority_repository_1.TypeOrmTaskPriorityRepository,
        type_orm_related_issue_type_repository_1.TypeOrmTaskRelatedIssueTypeRepository,
        type_orm_task_size_repository_1.TypeOrmTaskSizeRepository,
        type_orm_task_status_repository_1.TypeOrmTaskStatusRepository,
        type_orm_task_version_repository_1.TypeOrmTaskVersionRepository,
        type_orm_task_view_repository_1.TypeOrmTaskViewRepository,
        type_orm_country_repository_1.TypeOrmCountryRepository,
        type_orm_currency_repository_1.TypeOrmCurrencyRepository,
        type_orm_dashboard_repository_1.TypeOrmDashboardRepository,
        type_orm_dashboard_widget_repository_1.TypeOrmDashboardWidgetRepository,
        config_1.ConfigService,
        connection_entity_manager_1.ConnectionEntityManager])
], RepositoriesService);
//# sourceMappingURL=repositories.service.js.map