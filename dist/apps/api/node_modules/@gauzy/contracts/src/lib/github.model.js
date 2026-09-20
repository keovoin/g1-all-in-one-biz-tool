"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubRepositoryStatusEnum = exports.GithubPropertyMapEnum = void 0;
// Enum for GitHub property mapping
var GithubPropertyMapEnum;
(function (GithubPropertyMapEnum) {
    GithubPropertyMapEnum["INSTALLATION_ID"] = "installation_id";
    GithubPropertyMapEnum["SETUP_ACTION"] = "setup_action";
    GithubPropertyMapEnum["ACCESS_TOKEN"] = "access_token";
    GithubPropertyMapEnum["EXPIRES_IN"] = "expires_in";
    GithubPropertyMapEnum["REFRESH_TOKEN"] = "refresh_token";
    GithubPropertyMapEnum["REFRESH_TOKEN_EXPIRES_IN"] = "refresh_token_expires_in";
    GithubPropertyMapEnum["TOKEN_TYPE"] = "token_type";
    GithubPropertyMapEnum["SYNC_TAG"] = "sync_tag";
})(GithubPropertyMapEnum || (exports.GithubPropertyMapEnum = GithubPropertyMapEnum = {}));
var GithubRepositoryStatusEnum;
(function (GithubRepositoryStatusEnum) {
    GithubRepositoryStatusEnum["SYNCING"] = "Syncing";
    GithubRepositoryStatusEnum["SUCCESSFULLY"] = "Successfully";
    GithubRepositoryStatusEnum["ERROR"] = "Error";
    GithubRepositoryStatusEnum["DISABLED"] = "Disabled";
})(GithubRepositoryStatusEnum || (exports.GithubRepositoryStatusEnum = GithubRepositoryStatusEnum = {}));
//# sourceMappingURL=github.model.js.map