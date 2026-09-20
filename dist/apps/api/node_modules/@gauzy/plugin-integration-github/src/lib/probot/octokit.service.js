"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OctokitService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const chalk = require("chalk");
const probot_helpers_1 = require("./probot.helpers");
const probot_types_1 = require("./probot.types");
const GITHUB_API_VERSION = process.env.GAUZY_GITHUB_API_VERSION || '2022-11-28'; // Define a default version
let OctokitService = class OctokitService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger('OctokitService');
        // Note: App initialization moved to onModuleInit to handle async operations
    }
    /**
     * Called automatically when the module has been initialized.
     * Initialize the Octokit App asynchronously.
     */
    async onModuleInit() {
        try {
            if (this.config.appId && this.config.privateKey) {
                // Dynamic import for ESM module
                const { App } = await import('octokit');
                const config = await (0, probot_helpers_1.parseConfig)(this.config);
                this.app = new App({
                    appId: config.appId,
                    privateKey: config.privateKey,
                    clientId: config.clientId,
                    clientSecret: config.clientSecret
                });
                // console.log(chalk.magenta(`Octokit App Configuration ${JSON.stringify(config)}`));
                console.log(chalk.green(`Octokit App successfully initialized.`));
            }
            else {
                console.warn(chalk.yellow(`Octokit App initialization skipped: Missing appId or privateKey.`));
            }
        }
        catch (error) {
            console.error(chalk.red(`Octokit App initialization failed: ${error.message}`));
        }
    }
    /**
     *
     * @returns
     */
    getApp() {
        return this.app;
    }
    /**
     * Get GitHub metadata for a specific installation.
     *
     * @param installationId The installation ID for the GitHub App.
     * @returns {Promise<OctokitResponse<any>>} A promise that resolves with the GitHub metadata.
     * @throws {Error} If the request to fetch metadata fails.
     */
    async getInstallationMetadata(installationId) {
        if (!this.app) {
            throw new Error('Octokit instance is not available.');
        }
        try {
            // Get an Octokit instance for the installation
            const octokit = await this.app.getInstallationOctokit(installationId);
            // Make the request to fetch installation metadata
            const endpoint = `GET /app/installations/{installationId}`;
            // Send a request to the GitHub API to get installation metadata
            return await octokit.request(endpoint, {
                installationId,
                headers: {
                    'X-GitHub-Api-Version': GITHUB_API_VERSION
                }
            });
        }
        catch (error) {
            this.logger.error('Failed to fetch GitHub installation metadata', error.message);
            throw new Error('Failed to fetch GitHub installation metadata');
        }
    }
    /**
     * Delete a GitHub installation using the provided installationId.
     *
     * @param {number} installationId - The ID of the GitHub installation to be deleted.
     * @returns {Promise<OctokitResponse<any>>} A Promise that resolves with the OctokitResponse representing the result of the deletion.
     * @throws {Error} If there is an issue with the Octokit instance or if an error occurs during the deletion process.
     */
    async deleteInstallation(installationId) {
        try {
            // Check if the Octokit instance is available
            if (!this.app) {
                throw new Error('Octokit instance is not available.');
            }
            // Get an Octokit instance for the installation
            const octokit = await this.app.getInstallationOctokit(installationId);
            // Define the endpoint for deleting the installation
            const endpoint = `DELETE /app/installations/{installationId}`;
            // Send a request to the GitHub API to delete the installation
            return await octokit.request(endpoint, {
                installationId,
                headers: {
                    'X-GitHub-Api-Version': GITHUB_API_VERSION
                }
            });
        }
        catch (error) {
            // Handle errors, log the error message, and throw a new error
            this.logger.error('Failed to delete GitHub installation', error.message);
            throw new Error('Failed to delete GitHub installation');
        }
    }
    /**
     * Get GitHub repositories for a specific installation.
     *
     * @param installationId The installation ID for the GitHub App.
     * @returns {Promise<OctokitResponse<any>>} A promise that resolves with the GitHub repositories.
     * @throws {Error} If the request to fetch repositories fails.
     */
    async getRepositories(installationId) {
        if (!this.app) {
            throw new Error('Octokit instance is not available.');
        }
        try {
            // Get an Octokit instance for the installation
            const octokit = await this.app.getInstallationOctokit(installationId);
            // Define the endpoint for fetching installation repositories
            const endpoint = `GET /installation/repositories`;
            // Send a request to the GitHub API to get repositories
            return await octokit.request(endpoint, {
                installationId,
                headers: {
                    'X-GitHub-Api-Version': GITHUB_API_VERSION
                }
            });
        }
        catch (error) {
            this.logger.error('Failed to fetch GitHub installation repositories', error.message);
            throw new Error('Failed to fetch GitHub installation repositories');
        }
    }
    /**
     * Fetch GitHub repository issues for a given installation, owner, and repository.
     *
     * @param {number} installationId - The installation ID for the GitHub app.
     * @param {Object} options - Options object with 'owner' and 'repo' properties.
     * @param {string} options.owner - The owner (username or organization) of the repository.
     * @param {string} options.repo - The name of the repository.
     * @returns {Promise<OctokitResponse<any>>} A promise that resolves to the response from the GitHub API.
     * @throws {Error} If the request to the GitHub API fails.
     */
    async getRepositoryIssues(installationId, { owner, repo, page = 1, per_page = 100 }) {
        if (!this.app) {
            throw new Error('Octokit instance is not available.');
        }
        try {
            // Get an Octokit instance for the installation
            const octokit = await this.app.getInstallationOctokit(installationId);
            // Define the endpoint for fetching repository issues
            const endpoint = `GET /repos/{owner}/{repo}/issues`;
            // Send a request to the GitHub API to get repository issues
            return await octokit.request(endpoint, {
                owner,
                repo,
                page,
                per_page,
                headers: {
                    'X-GitHub-Api-Version': GITHUB_API_VERSION
                }
            });
        }
        catch (error) {
            this.logger.error('Failed to fetch GitHub installation repository issues', error.message);
            throw new Error('Failed to fetch GitHub installation repository issues');
        }
    }
    /**
     * Fetch labels associated with a GitHub issue using its issue number.
     *
     * This function retrieves the labels assigned to a GitHub issue based on its unique issue number. It sends a request
     * to the GitHub API to fetch label information related to the specified issue in a GitHub repository.
     *
     * @param installationId - The installation ID for the GitHub app.
     * @param owner - The owner (username or organization) of the GitHub repository.
     * @param repo - The name of the GitHub repository.
     * @param issue_number - The unique issue number identifying the GitHub issue.
     * @returns A promise that resolves to the response from the GitHub API containing labels associated with the issue.
     * @throws {Error} If the request to the GitHub API fails or if the Octokit instance is unavailable.
     */
    async getLabelsByIssueNumber(installationId, { owner, repo, issue_number }) {
        if (!this.app) {
            throw new Error('Octokit instance is not available.');
        }
        try {
            // Get an Octokit instance for the installation
            const octokit = await this.app.getInstallationOctokit(installationId);
            // Define the endpoint for fetching issue labels
            const endpoint = `GET /repos/{owner}/{repo}/issues/{issue_number}/labels`;
            return await octokit.request(endpoint, {
                owner,
                repo,
                issue_number,
                headers: {
                    'X-GitHub-Api-Version': GITHUB_API_VERSION
                }
            });
        }
        catch (error) {
            this.logger.error('Failed to fetch GitHub issue labels', error.message);
            throw new Error('Failed to fetch GitHub installation issue labels');
        }
    }
    /**
     * Add labels for a GitHub issue using an Octokit instance tied to a specific installation.
     *
     * @param installationId - The installation ID of the GitHub App.
     * @param options - Options object with 'owner,' 'repo,', 'issue_number' and 'labels' properties.
     * @param options.owner - The owner (username or organization) of the repository.
     * @param options.repo - The name of the repository.
     * @param options.issue_number - The issue number to fetch.
     * @param options.labels - The Labels to create.
     * @returns A promise that resolves to an OctokitResponse.
     * @throws An error if Octokit instance is not available or if the request fails.
     */
    async addLabelsForIssue(installationId, { owner, repo, issue_number, labels }) {
        if (!this.app) {
            throw new Error('Octokit instance is not available.');
        }
        try {
            // Get an Octokit instance for the installation
            const octokit = await this.app.getInstallationOctokit(installationId);
            // Define the endpoint for adding labels to the issue
            const endpoint = `POST /repos/{owner}/{repo}/issues/{issue_number}/labels`;
            // Use Octokit to make the request to add labels to the issue
            return await octokit.request(endpoint, {
                owner,
                repo,
                issue_number,
                labels,
                headers: {
                    'X-GitHub-Api-Version': GITHUB_API_VERSION
                }
            });
        }
        catch (error) {
            // Handle any errors that occur during the process
            this.logger.error('Failed to create GitHub issue labels', error.message);
            throw new Error('Failed to create GitHub issue labels');
        }
    }
    /**
     * Fetch a GitHub repository issue by issue number for a given installation, owner, and repository.
     *
     * @param installationId - The installation ID for the GitHub app.
     * @param options - Options object with 'owner,' 'repo,' and 'issue_number' properties.
     * @param options.owner - The owner (username or organization) of the repository.
     * @param options.repo - The name of the repository.
     * @param options.issue_number - The issue number to fetch.
     * @returns A promise that resolves to the response from the GitHub API.
     * @throws If the request to the GitHub API fails.
     */
    async getIssueByIssueNumber(installationId, { owner, repo, issue_number }) {
        if (!this.app) {
            throw new Error('Octokit instance is not available.');
        }
        try {
            // Get an Octokit instance for the installation
            const octokit = await this.app.getInstallationOctokit(installationId);
            // Define the endpoint for fetching the issue by its number
            const endpoint = `GET /repos/{owner}/{repo}/issues/{issue_number}`;
            return await octokit.request(endpoint, {
                owner,
                repo,
                issue_number,
                headers: {
                    'X-GitHub-Api-Version': GITHUB_API_VERSION
                }
            });
        }
        catch (error) {
            this.logger.error('Failed to fetch GitHub repository issue', error.message);
            throw new Error('Failed to fetch GitHub installation repository issues');
        }
    }
    /**
     * Open a new issue on a GitHub repository.
     *
     * @param installationId - The GitHub installation ID.
     * @param owner - The owner of the repository.
     * @param repo - The repository name.
     * @param title - The title of the issue.
     * @param body - The body of the issue.
     * @param labels - An array of labels for the issue.
     * @returns A promise that resolves to the response from GitHub.
     */
    async openIssue(installationId, { repo, owner, title, body, labels }) {
        if (!this.app) {
            throw new Error('Octokit instance is not available.');
        }
        try {
            // Get an Octokit instance for the installation
            const octokit = await this.app.getInstallationOctokit(installationId);
            // Define the endpoint for creating an issue
            const endpoint = `POST /repos/{owner}/{repo}/issues`;
            // Prepare the request payload
            const payload = {
                owner,
                repo,
                title,
                body,
                labels,
                headers: {
                    'X-GitHub-Api-Version': GITHUB_API_VERSION
                }
            };
            // Send the request to create the issue
            return await octokit.request(endpoint, payload);
        }
        catch (error) {
            this.logger.error('Failed to Open GitHub issue', error.message);
            throw new Error('Failed to Open GitHub issue');
        }
    }
    /**
     * Update an existing issue on a GitHub repository.
     *
     * @param installationId - The GitHub installation ID.
     * @param issue_number - The issue number to be updated.
     * @param repo - The repository name.
     * @param owner - The owner of the repository.
     * @param title - The updated title of the issue.
     * @param body - The updated body of the issue.
     * @param labels - An array of updated labels for the issue.
     * @returns A promise that resolves to the response from GitHub.
     */
    async updateIssue(installationId, issue_number, { repo, owner, title, body, labels }) {
        try {
            // Ensure that the Octokit instance is available
            if (!this.app) {
                throw new Error('Octokit instance is not available.');
            }
            // Get an Octokit instance for the installation
            const octokit = await this.app.getInstallationOctokit(installationId);
            // Define the endpoint for updating an issue
            const endpoint = `PATCH /repos/{owner}/{repo}/issues/{issue_number}`;
            // Prepare the request payload
            const payload = {
                owner,
                repo,
                issue_number,
                title,
                body,
                labels,
                headers: {
                    'X-GitHub-Api-Version': GITHUB_API_VERSION
                }
            };
            // Send the request to update the issue
            return await octokit.request(endpoint, payload);
        }
        catch (error) {
            // Handle errors and log the details
            this.logger.error('Failed to update a GitHub issue', error.message);
            throw new Error('Failed to update GitHub issue');
        }
    }
};
exports.OctokitService = OctokitService;
exports.OctokitService = OctokitService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(probot_types_1.ModuleProviders.ProbotConfig)),
    tslib_1.__metadata("design:paramtypes", [Object])
], OctokitService);
//# sourceMappingURL=octokit.service.js.map