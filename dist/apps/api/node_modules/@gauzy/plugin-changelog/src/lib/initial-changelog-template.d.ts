import { IChangelog } from '@gauzy/contracts';
/**
 * Platform-level changelog content used both by the fresh-DB seed
 * (`changelog.seed.ts`) and mirrored by the `RefreshChangelogContent`
 * migration for already-seeded deployments — keep the two in sync.
 *
 * `isFeature: false` entries feed the "What's New" sidebar and the login
 * page panel; `isFeature: true` entries feed the register page feature
 * cards (the only consumer that renders `imageUrl`). Dates are explicit:
 * `new Date()` here stamped every deployment's "news" with its seed time.
 */
export declare const INITIAL_CHANGELOG_TEMPLATE: IChangelog[];
