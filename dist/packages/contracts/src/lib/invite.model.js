"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationExpirationEnum = exports.InvitationTypeEnum = exports.InviteActionEnum = exports.InviteStatusEnum = void 0;
var InviteStatusEnum;
(function (InviteStatusEnum) {
    InviteStatusEnum["INVITED"] = "INVITED";
    InviteStatusEnum["ACCEPTED"] = "ACCEPTED";
    InviteStatusEnum["EXPIRED"] = "EXPIRED";
    InviteStatusEnum["REJECTED"] = "REJECTED";
})(InviteStatusEnum || (exports.InviteStatusEnum = InviteStatusEnum = {}));
var InviteActionEnum;
(function (InviteActionEnum) {
    InviteActionEnum["ACCEPTED"] = "ACCEPTED";
    InviteActionEnum["REJECTED"] = "REJECTED";
})(InviteActionEnum || (exports.InviteActionEnum = InviteActionEnum = {}));
var InvitationTypeEnum;
(function (InvitationTypeEnum) {
    InvitationTypeEnum["USER"] = "USER";
    InvitationTypeEnum["EMPLOYEE"] = "EMPLOYEE";
    InvitationTypeEnum["CANDIDATE"] = "CANDIDATE";
    InvitationTypeEnum["TEAM"] = "TEAM";
})(InvitationTypeEnum || (exports.InvitationTypeEnum = InvitationTypeEnum = {}));
var InvitationExpirationEnum;
(function (InvitationExpirationEnum) {
    InvitationExpirationEnum[InvitationExpirationEnum["DAY"] = 1] = "DAY";
    InvitationExpirationEnum[InvitationExpirationEnum["WEEK"] = 7] = "WEEK";
    InvitationExpirationEnum[InvitationExpirationEnum["TWO_WEEK"] = 14] = "TWO_WEEK";
    InvitationExpirationEnum[InvitationExpirationEnum["MONTH"] = 30] = "MONTH";
    InvitationExpirationEnum["NEVER"] = "Never";
})(InvitationExpirationEnum || (exports.InvitationExpirationEnum = InvitationExpirationEnum = {}));
//# sourceMappingURL=invite.model.js.map