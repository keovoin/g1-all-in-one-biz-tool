"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeZoneEnum = exports.TimeFormatEnum = exports.CrudActionEnum = exports.MinimumProjectSizeEnum = exports.ProjectOwnerEnum = exports.ClientFocusEnum = exports.BonusTypeEnum = exports.WeekDaysEnum = exports.CurrencyPosition = exports.AlignmentOptions = exports.ProjectBillingEnum = exports.DefaultValueDateTypeEnum = exports.RegionsEnum = exports.RegionCodeEnum = exports.OrganizationSelectInput = exports.ListsInputTypeEnum = exports.OrganizationPermissionsEnum = void 0;
var OrganizationPermissionsEnum;
(function (OrganizationPermissionsEnum) {
    OrganizationPermissionsEnum["ALLOW_MANUAL_TIME"] = "ALLOW_MANUAL_TIME";
    OrganizationPermissionsEnum["ALLOW_MODIFY_TIME"] = "ALLOW_MODIFY_TIME";
    OrganizationPermissionsEnum["ALLOW_DELETE_TIME"] = "ALLOW_DELETE_TIME";
    OrganizationPermissionsEnum["ALLOW_FUTURE_DATE"] = "FUTURE_DATE_ALLOWED";
})(OrganizationPermissionsEnum || (exports.OrganizationPermissionsEnum = OrganizationPermissionsEnum = {}));
var ListsInputTypeEnum;
(function (ListsInputTypeEnum) {
    ListsInputTypeEnum["DEPARTMENTS"] = "DEPARTMENTS";
    ListsInputTypeEnum["POSITIONS"] = "POSITIONS";
    ListsInputTypeEnum["VENDORS"] = "VENDORS";
})(ListsInputTypeEnum || (exports.ListsInputTypeEnum = ListsInputTypeEnum = {}));
var OrganizationSelectInput;
(function (OrganizationSelectInput) {
    OrganizationSelectInput["id"] = "id";
    OrganizationSelectInput["name"] = "name";
    OrganizationSelectInput["profile_link"] = "profile_link";
    OrganizationSelectInput["valueDate"] = "valueDate";
    OrganizationSelectInput["imageUrl"] = "imageUrl";
    OrganizationSelectInput["currency"] = "currency";
    OrganizationSelectInput["createdAt"] = "createdAt";
    OrganizationSelectInput["updatedAt"] = "updatedAt";
    OrganizationSelectInput["isActive"] = "isActive";
    OrganizationSelectInput["tags"] = "tags";
})(OrganizationSelectInput || (exports.OrganizationSelectInput = OrganizationSelectInput = {}));
/**
 * Enumeration for region codes.
 */
var RegionCodeEnum;
(function (RegionCodeEnum) {
    RegionCodeEnum["ENGLISH"] = "en";
    RegionCodeEnum["BULGARIAN"] = "bg";
    RegionCodeEnum["HEBREW"] = "he";
    RegionCodeEnum["RUSSIAN"] = "ru";
    RegionCodeEnum["FRENCH"] = "fr";
    RegionCodeEnum["SPANISH"] = "es";
    RegionCodeEnum["CHINESE"] = "zh";
    RegionCodeEnum["GERMAN"] = "de";
    RegionCodeEnum["PORTUGUESE"] = "pt";
    RegionCodeEnum["ITALIAN"] = "it";
    RegionCodeEnum["DUTCH"] = "nl";
    RegionCodeEnum["POLISH"] = "pl";
    RegionCodeEnum["ARABIC"] = "ar";
})(RegionCodeEnum || (exports.RegionCodeEnum = RegionCodeEnum = {}));
var RegionsEnum;
(function (RegionsEnum) {
    RegionsEnum["EN"] = "English (United States)";
    RegionsEnum["BG"] = "Bulgarian (Bulgaria)";
    RegionsEnum["HE"] = "Hebrew (Israel)";
    RegionsEnum["RU"] = "Russian (Russia)";
})(RegionsEnum || (exports.RegionsEnum = RegionsEnum = {}));
var DefaultValueDateTypeEnum;
(function (DefaultValueDateTypeEnum) {
    DefaultValueDateTypeEnum["TODAY"] = "TODAY";
    DefaultValueDateTypeEnum["END_OF_MONTH"] = "END_OF_MONTH";
    DefaultValueDateTypeEnum["START_OF_MONTH"] = "START_OF_MONTH";
})(DefaultValueDateTypeEnum || (exports.DefaultValueDateTypeEnum = DefaultValueDateTypeEnum = {}));
var ProjectBillingEnum;
(function (ProjectBillingEnum) {
    ProjectBillingEnum["RATE"] = "RATE";
    ProjectBillingEnum["FLAT_FEE"] = "FLAT_FEE";
    ProjectBillingEnum["MILESTONES"] = "MILESTONES";
})(ProjectBillingEnum || (exports.ProjectBillingEnum = ProjectBillingEnum = {}));
var AlignmentOptions;
(function (AlignmentOptions) {
    AlignmentOptions["LEFT"] = "LEFT";
    AlignmentOptions["RIGHT"] = "RIGHT";
    AlignmentOptions["CENTER"] = "CENTER";
})(AlignmentOptions || (exports.AlignmentOptions = AlignmentOptions = {}));
var CurrencyPosition;
(function (CurrencyPosition) {
    CurrencyPosition["LEFT"] = "LEFT";
    CurrencyPosition["RIGHT"] = "RIGHT";
})(CurrencyPosition || (exports.CurrencyPosition = CurrencyPosition = {}));
var WeekDaysEnum;
(function (WeekDaysEnum) {
    WeekDaysEnum["MONDAY"] = "MONDAY";
    WeekDaysEnum["TUESDAY"] = "TUESDAY";
    WeekDaysEnum["WEDNESDAY"] = "WEDNESDAY";
    WeekDaysEnum["THURSDAY"] = "THURSDAY";
    WeekDaysEnum["FRIDAY"] = "FRIDAY";
    WeekDaysEnum["SATURDAY"] = "SATURDAY";
    WeekDaysEnum["SUNDAY"] = "SUNDAY";
})(WeekDaysEnum || (exports.WeekDaysEnum = WeekDaysEnum = {}));
var BonusTypeEnum;
(function (BonusTypeEnum) {
    BonusTypeEnum["PROFIT_BASED_BONUS"] = "PROFIT_BASED_BONUS";
    BonusTypeEnum["REVENUE_BASED_BONUS"] = "REVENUE_BASED_BONUS";
})(BonusTypeEnum || (exports.BonusTypeEnum = BonusTypeEnum = {}));
var ClientFocusEnum;
(function (ClientFocusEnum) {
    ClientFocusEnum["VERY_SMALL_BUSINESSES"] = "Very Small Businesses";
    ClientFocusEnum["SMALL_BUSINESSES"] = "Small Businesses";
    ClientFocusEnum["MEDIUM_BUSINESSES"] = "Medium Businesses";
    ClientFocusEnum["LARGE_BUSINESSES"] = "Large Businesses";
})(ClientFocusEnum || (exports.ClientFocusEnum = ClientFocusEnum = {}));
var ProjectOwnerEnum;
(function (ProjectOwnerEnum) {
    ProjectOwnerEnum["CLIENT"] = "CLIENT";
    ProjectOwnerEnum["INTERNAL"] = "INTERNAL";
})(ProjectOwnerEnum || (exports.ProjectOwnerEnum = ProjectOwnerEnum = {}));
var MinimumProjectSizeEnum;
(function (MinimumProjectSizeEnum) {
    MinimumProjectSizeEnum["ONE_THOUSAND"] = "1000+";
    MinimumProjectSizeEnum["FIVE_THOUSAND"] = "5000+";
    MinimumProjectSizeEnum["TEN_THOUSAND"] = "10000+";
    MinimumProjectSizeEnum["TWENTY_FIVE_THOUSAND"] = "25000+";
    MinimumProjectSizeEnum["FIFTY_THOUSAND"] = "50000+";
    MinimumProjectSizeEnum["ONE_HUNDRED_THOUSAND"] = "100000+";
})(MinimumProjectSizeEnum || (exports.MinimumProjectSizeEnum = MinimumProjectSizeEnum = {}));
var CrudActionEnum;
(function (CrudActionEnum) {
    CrudActionEnum["CREATED"] = "CREATED";
    CrudActionEnum["UPDATED"] = "UPDATED";
    CrudActionEnum["DELETED"] = "DELETED";
})(CrudActionEnum || (exports.CrudActionEnum = CrudActionEnum = {}));
var TimeFormatEnum;
(function (TimeFormatEnum) {
    TimeFormatEnum[TimeFormatEnum["FORMAT_12_HOURS"] = 12] = "FORMAT_12_HOURS";
    TimeFormatEnum[TimeFormatEnum["FORMAT_24_HOURS"] = 24] = "FORMAT_24_HOURS";
})(TimeFormatEnum || (exports.TimeFormatEnum = TimeFormatEnum = {}));
var TimeZoneEnum;
(function (TimeZoneEnum) {
    TimeZoneEnum["UTC_TIMEZONE"] = "utc";
    TimeZoneEnum["ORG_TIMEZONE"] = "org";
    TimeZoneEnum["MINE_TIMEZONE"] = "mine";
})(TimeZoneEnum || (exports.TimeZoneEnum = TimeZoneEnum = {}));
//# sourceMappingURL=organization.model.js.map