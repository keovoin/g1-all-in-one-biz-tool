"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const constants_1 = require("@gauzy/constants");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_organization_repository_1 = require("./repository/mikro-orm-organization.repository");
let Organization = class Organization extends internal_1.TenantBaseEntity {
};
exports.Organization = Organization;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, required: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "name", void 0);
tslib_1.__decorate([
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)('boolean', { default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "isDefault", void 0);
tslib_1.__decorate([
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "profile_link", void 0);
tslib_1.__decorate([
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "banner", void 0);
tslib_1.__decorate([
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Organization.prototype, "totalEmployees", void 0);
tslib_1.__decorate([
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "short_description", void 0);
tslib_1.__decorate([
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "client_focus", void 0);
tslib_1.__decorate([
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "overview", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ length: 500, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "imageUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        enum: contracts_1.CurrenciesEnum,
        example: contracts_1.CurrenciesEnum.USD,
        required: true,
        description: 'The currency used by the organization, must be one of the CurrenciesEnum values.'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.CurrenciesEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Organization.prototype, "valueDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: contracts_1.DefaultValueDateTypeEnum,
        example: contracts_1.DefaultValueDateTypeEnum.TODAY,
        description: 'The default value date type, can be one of the values from DefaultValueDateTypeEnum.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.DefaultValueDateTypeEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({
        type: 'simple-enum',
        nullable: true,
        enum: contracts_1.DefaultValueDateTypeEnum,
        default: contracts_1.DefaultValueDateTypeEnum.TODAY
    }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "defaultValueDateType", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "defaultAlignmentType", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "timeZone", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => String,
        description: 'The code representing a specific region (e.g., country or geographical area).'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "regionCode", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "brandColor", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "dateFormat", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "officialName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: contracts_1.WeekDaysEnum,
        example: contracts_1.WeekDaysEnum.MONDAY,
        description: 'Specifies which day the week starts on. Must be one of the WeekDaysEnum values.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.WeekDaysEnum),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "startWeekOn", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "taxId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "numberFormat", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "minimumProjectSize", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: contracts_1.BonusTypeEnum,
        example: contracts_1.BonusTypeEnum.PROFIT_BASED_BONUS,
        description: 'The type of bonus, can be one of the defined BonusTypeEnum values.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.BonusTypeEnum),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "bonusType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Number,
        example: constants_1.DEFAULT_PROFIT_BASED_BONUS,
        description: 'The percentage of profit-based bonus, must be between 0 and 100.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Organization.prototype, "bonusPercentage", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true, default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "invitesAllowed", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "show_income", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "show_profits", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "show_bonuses_paid", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "show_total_hours", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "show_minimum_project_size", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "show_projects_count", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "show_clients_count", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "show_clients", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "show_employees_count", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Number,
        example: constants_1.DEFAULT_INVITE_EXPIRY_PERIOD,
        description: 'The default invite expiry period in days.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10), { toClassOnly: true }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Organization.prototype, "inviteExpiryPeriod", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Organization.prototype, "fiscalStartDate", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Organization.prototype, "fiscalEndDate", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Organization.prototype, "registrationDate", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "futureDateAllowed", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "allowManualTime", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "allowModifyTime", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "allowDeleteTime", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "allowTrackInactivity", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: 10 }),
    tslib_1.__metadata("design:type", Number)
], Organization.prototype, "inactivityTimeLimit", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: 1 }),
    tslib_1.__metadata("design:type", Number)
], Organization.prototype, "activityProofDuration", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "requireReason", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "requireDescription", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "requireProject", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "requireTask", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "requireClient", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: 12 }),
    tslib_1.__metadata("design:type", Number)
], Organization.prototype, "timeFormat", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "separateInvoiceItemTaxAndDiscount", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "website", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "fiscalInformation", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: contracts_1.CurrencyPosition.LEFT }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "currencyPosition", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "discountAfterTax", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "defaultStartTime", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "defaultEndTime", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "defaultInvoiceEstimateTerms", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "convertAcceptedEstimates", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Organization.prototype, "daysUntilDue", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "isRemoveIdleTime", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "allowScreenshotCapture", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "upworkOrganizationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "upworkOrganizationName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "randomScreenshot", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "trackOnSleep", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ type: 'numeric', default: 10 }),
    tslib_1.__metadata("design:type", Number)
], Organization.prototype, "screenshotFrequency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "enforced", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Number,
        description: 'Standard work hours per day for the organization',
        minimum: 1,
        maximum: 24
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Max)(24, { message: 'Standard work hours per day cannot exceed 24 hours' }),
    (0, class_validator_1.Min)(1, { message: 'Standard work hours per day must be at least 1 hour' }),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: constants_1.DEFAULT_STANDARD_WORK_HOURS_PER_DAY }),
    tslib_1.__metadata("design:type", Number)
], Organization.prototype, "standardWorkHoursPerDay", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Boolean,
        description: 'Allow employees to exit the Agent app. When disabled, the exit option will be blocked in the Agent app.',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "allowAgentAppExit", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Boolean,
        description: 'Allow employees to logout from the Agent app. When disabled, the logout option will be blocked in the Agent app.',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "allowLogoutFromAgentApp", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Boolean,
        description: 'Enable comprehensive keyboard and mouse activity tracking for detailed productivity insights.',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "trackKeyboardMouseActivity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Boolean,
        description: 'Track all displays instead of just the primary display. Useful for multi-monitor setups.',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Organization.prototype, "trackAllDisplays", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Contact, (it) => it.organization, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'SET NULL'
    }),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "contact", void 0);
tslib_1.__decorate([
    (0, typeorm_1.RelationId)((it) => it.contact),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "contactId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.ImageAsset, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'SET NULL',
        /** Eager relations are always loaded automatically when relation's owner entity is loaded using find* methods. */
        eager: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Organization.prototype, "image", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.image),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "imageId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Invoice, (invoice) => invoice.fromOrganization),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "invoices", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Employee, (employee) => employee.organization),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "employees", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Deal, (deal) => deal.organization),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "deals", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationAward, (award) => award.organization),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "awards", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationLanguage, (language) => language.organization),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "languages", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.FeatureOrganization, (featureOrganization) => featureOrganization.organization),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "featureOrganizations", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Payment, (payment) => payment.organization, {
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "payments", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationSprint, (sprint) => sprint.organization),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "organizationSprints", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.InvoiceEstimateHistory, (invoiceEstimateHistory) => invoiceEstimateHistory.organization, {
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "invoiceEstimateHistories", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.AccountingTemplate, (accountingTemplate) => accountingTemplate.organization, {
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "accountingTemplates", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.ReportOrganization, (reportOrganization) => reportOrganization.organization),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "reportOrganizations", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Tag, (it) => it.organizations, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'tag_organization',
        joinColumn: 'organizationId',
        inverseJoinColumn: 'tagId'
    }),
    (0, typeorm_1.JoinTable)({
        name: 'tag_organization'
    }),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Skill, (skill) => skill.organizations, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "skills", void 0);
exports.Organization = Organization = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization', { mikroOrmRepository: () => mikro_orm_organization_repository_1.MikroOrmOrganizationRepository })
], Organization);
//# sourceMappingURL=organization.entity.js.map