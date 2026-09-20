"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IUpworkProposalStatusEnum = exports.IUpworkOfferStatusEnum = void 0;
exports.isUpworkExistingAuthorization = isUpworkExistingAuthorization;
/**
 * Whether a handshake result names an integration that is already authorized.
 *
 * @param result - The `token-secret-pair` response.
 * @returns True when the result carries an integration id and no authorization URL.
 */
function isUpworkExistingAuthorization(result) {
    return (!!result &&
        !!result.integrationId &&
        !result.url);
}
var IUpworkOfferStatusEnum;
(function (IUpworkOfferStatusEnum) {
    IUpworkOfferStatusEnum["ACCEPTED"] = "accepted";
    IUpworkOfferStatusEnum["NEW"] = "new";
    IUpworkOfferStatusEnum["DECLINED"] = "declined";
    IUpworkOfferStatusEnum["EXPIRED"] = "expired";
    IUpworkOfferStatusEnum["WITHDRAWN"] = "withdrawn";
    IUpworkOfferStatusEnum["CANCELLED"] = "cancelled";
    IUpworkOfferStatusEnum["CHANGED"] = "changed";
})(IUpworkOfferStatusEnum || (exports.IUpworkOfferStatusEnum = IUpworkOfferStatusEnum = {}));
var IUpworkProposalStatusEnum;
(function (IUpworkProposalStatusEnum) {
    IUpworkProposalStatusEnum["ACTIVE"] = "active";
    IUpworkProposalStatusEnum["SUBMITTED"] = "submitted";
    IUpworkProposalStatusEnum["ARCHIVED"] = "archived";
})(IUpworkProposalStatusEnum || (exports.IUpworkProposalStatusEnum = IUpworkProposalStatusEnum = {}));
//# sourceMappingURL=upwork.model.js.map