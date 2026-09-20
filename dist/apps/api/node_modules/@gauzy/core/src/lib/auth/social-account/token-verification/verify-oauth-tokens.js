"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGithubToken = verifyGithubToken;
exports.verifyGoogleToken = verifyGoogleToken;
exports.verifyTwitterToken = verifyTwitterToken;
exports.verifyFacebookToken = verifyFacebookToken;
const contracts_1 = require("@gauzy/contracts");
const rxjs_1 = require("rxjs");
async function verifyGithubToken(httpService, token) {
    const [userResponse, emailsResponse] = await Promise.all([
        (0, rxjs_1.firstValueFrom)(httpService.get('https://api.github.com/user', {
            headers: {
                Authorization: `token ${token}`
            }
        })),
        (0, rxjs_1.firstValueFrom)(httpService.get('https://api.github.com/user/emails', {
            headers: {
                Authorization: `token ${token}`
            }
        }))
    ]);
    const email = emailsResponse.data.find((email) => email.primary).email;
    return {
        ...userResponse.data,
        email,
        provider: contracts_1.ProviderEnum.GITHUB
    };
}
async function verifyGoogleToken(httpService, token) {
    const response = await (0, rxjs_1.firstValueFrom)(httpService.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`));
    return { ...response.data, provider: contracts_1.ProviderEnum.GOOGLE };
}
async function verifyTwitterToken(httpService, token) {
    const response = await (0, rxjs_1.firstValueFrom)(httpService.get('https://api.twitter.com/2/me', {
        headers: { Authorization: `Bearer ${token}` }
    }));
    return { ...response.data, provider: contracts_1.ProviderEnum.TWITTER };
}
async function verifyFacebookToken(httpService, token) {
    const response = await (0, rxjs_1.firstValueFrom)(httpService.get(`https://graph.facebook.com/me?access_token=${token}`));
    return { ...response.data, provider: contracts_1.ProviderEnum.FACEBOOK };
}
// Add other provider verification signatures
//# sourceMappingURL=verify-oauth-tokens.js.map