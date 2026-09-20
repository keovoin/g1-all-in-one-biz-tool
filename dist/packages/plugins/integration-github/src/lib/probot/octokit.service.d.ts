import { OnModuleInit } from '@nestjs/common';
import type { App } from 'octokit';
import type { ResponseHeaders } from '@octokit/types';
import { ProbotConfig } from './probot.types';
export interface OctokitResponse<T> {
    data: T;
    status: number;
    headers: ResponseHeaders;
    [key: string]: any;
}
export declare class OctokitService implements OnModuleInit {
    private readonly config;
    private readonly logger;
    private app?;
    constructor(config: ProbotConfig);
    /**
     * Called automatically when the module has been initialized.
     * Initialize the Octokit App asynchronously.
     */
    onModuleInit(): Promise<void>;
    /**
     *
     * @returns
     */
    getApp(): InstanceType<typeof App> | undefined;
    /**
     * Get GitHub metadata for a specific installation.
     *
     * @param installationId The installation ID for the GitHub App.
     * @returns {Promise<OctokitResponse<any>>} A promise that resolves with the GitHub metadata.
     * @throws {Error} If the request to fetch metadata fails.
     */
    getInstallationMetadata(installationId: number): Promise<OctokitResponse<any>>;
    /**
     * Delete a GitHub installation using the provided installationId.
     *
     * @param {number} installationId - The ID of the GitHub installation to be deleted.
     * @returns {Promise<OctokitResponse<any>>} A Promise that resolves with the OctokitResponse representing the result of the deletion.
     * @throws {Error} If there is an issue with the Octokit instance or if an error occurs during the deletion process.
     */
    deleteInstallation(installationId: number): Promise<OctokitResponse<any>>;
    /**
     * Get GitHub repositories for a specific installation.
     *
     * @param installationId The installation ID for the GitHub App.
     * @returns {Promise<OctokitResponse<any>>} A promise that resolves with the GitHub repositories.
     * @throws {Error} If the request to fetch repositories fails.
     */
    getRepositories(installationId: number): Promise<OctokitResponse<any>>;
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
    getRepositoryIssues(installationId: number, { owner, repo, page, per_page }: {
        owner: any;
        repo: any;
        page?: number;
        per_page?: number;
    }): Promise<OctokitResponse<any>>;
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
    getLabelsByIssueNumber(installationId: number, { owner, repo, issue_number }: {
        owner: string;
        repo: string;
        issue_number: number;
    }): Promise<OctokitResponse<any>>;
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
    addLabelsForIssue(installationId: number, { owner, repo, issue_number, labels }: {
        owner: string;
        repo: string;
        issue_number: number;
        labels: string[];
    }): Promise<OctokitResponse<any>>;
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
    getIssueByIssueNumber(installationId: number, { owner, repo, issue_number }: {
        owner: string;
        repo: string;
        issue_number: number;
    }): Promise<OctokitResponse<any>>;
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
    openIssue(installationId: number, { repo, owner, title, body, labels }: {
        repo: any;
        owner: any;
        title: any;
        body: any;
        labels: any;
    }): Promise<OctokitResponse<any>>;
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
    updateIssue(installationId: number, issue_number: number, { repo, owner, title, body, labels }: {
        repo: any;
        owner: any;
        title: any;
        body: any;
        labels: any;
    }): Promise<OctokitResponse<any>>;
}
