"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSearchTabsEnum = exports.JobPostTypeEnum = exports.JobPostStatusEnum = exports.JobPostSourceEnum = void 0;
var JobPostSourceEnum;
(function (JobPostSourceEnum) {
    JobPostSourceEnum["UPWORK"] = "upwork";
    JobPostSourceEnum["WEB"] = "web";
    JobPostSourceEnum["LINKEDIN"] = "linkedin";
})(JobPostSourceEnum || (exports.JobPostSourceEnum = JobPostSourceEnum = {}));
var JobPostStatusEnum;
(function (JobPostStatusEnum) {
    JobPostStatusEnum["OPEN"] = "open";
    JobPostStatusEnum["APPLIED"] = "applied";
    JobPostStatusEnum["COMPLETED"] = "completed";
    JobPostStatusEnum["CLOSED"] = "closed";
})(JobPostStatusEnum || (exports.JobPostStatusEnum = JobPostStatusEnum = {}));
var JobPostTypeEnum;
(function (JobPostTypeEnum) {
    JobPostTypeEnum["HOURLY"] = "hourly";
    JobPostTypeEnum["FIXED"] = "fixed";
})(JobPostTypeEnum || (exports.JobPostTypeEnum = JobPostTypeEnum = {}));
var JobSearchTabsEnum;
(function (JobSearchTabsEnum) {
    JobSearchTabsEnum["ACTIONS"] = "ACTIONS";
    JobSearchTabsEnum["SEARCH"] = "SEARCH";
})(JobSearchTabsEnum || (exports.JobSearchTabsEnum = JobSearchTabsEnum = {}));
//# sourceMappingURL=employee-job.model.js.map