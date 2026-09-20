"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuards = exports.Controllers = exports.Strategies = void 0;
const auth0_1 = require("./auth0");
const facebook_1 = require("./facebook");
const fiverr_1 = require("./fiverr");
const github_1 = require("./github");
const google_1 = require("./google");
const keycloak_1 = require("./keycloak");
const linkedin_1 = require("./linkedin");
const microsoft_1 = require("./microsoft");
const twitter_1 = require("./twitter");
const oauth_app_1 = require("./oauth-app");
exports.Strategies = [
    auth0_1.Auth0Strategy,
    facebook_1.FacebookStrategy,
    fiverr_1.FiverrStrategy,
    github_1.GithubStrategy,
    google_1.GoogleStrategy,
    keycloak_1.KeycloakStrategy,
    linkedin_1.LinkedinStrategy,
    microsoft_1.MicrosoftStrategy,
    twitter_1.TwitterStrategy
];
exports.Controllers = [
    auth0_1.Auth0Controller,
    facebook_1.FacebookController,
    github_1.GithubController,
    google_1.GoogleController,
    linkedin_1.LinkedinController,
    twitter_1.TwitterController,
    microsoft_1.MicrosoftController,
    oauth_app_1.OAuthAppController
];
exports.AuthGuards = [microsoft_1.MicrosoftAuthGuard, keycloak_1.KeycloakAuthGuard];
//# sourceMappingURL=internal.js.map