"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_DEFAULT_ROLES = exports.RolesEnum = void 0;
var RolesEnum;
(function (RolesEnum) {
    RolesEnum["SUPER_ADMIN"] = "SUPER_ADMIN";
    RolesEnum["ADMIN"] = "ADMIN";
    RolesEnum["DATA_ENTRY"] = "DATA_ENTRY";
    RolesEnum["EMPLOYEE"] = "EMPLOYEE";
    RolesEnum["CANDIDATE"] = "CANDIDATE";
    RolesEnum["MANAGER"] = "MANAGER";
    RolesEnum["VIEWER"] = "VIEWER";
    RolesEnum["INTERVIEWER"] = "INTERVIEWER";
})(RolesEnum || (exports.RolesEnum = RolesEnum = {}));
/** Default system role */
exports.SYSTEM_DEFAULT_ROLES = [
    RolesEnum.SUPER_ADMIN,
    RolesEnum.ADMIN,
    RolesEnum.EMPLOYEE,
    RolesEnum.CANDIDATE,
    RolesEnum.VIEWER
];
//# sourceMappingURL=role.model.js.map