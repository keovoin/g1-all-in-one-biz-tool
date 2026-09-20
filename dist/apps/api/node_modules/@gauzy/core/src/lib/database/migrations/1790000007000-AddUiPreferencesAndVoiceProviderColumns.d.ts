import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * Two per-tenant UI features that landed together (ever-gauzy PR #9989):
 *
 * - `user.uiPreferences` — the per-user, per-feature UI state blob
 *   (`{ aiChat: { expanded, position, width, maximized } }`, …). Driver-aware type like
 *   `EmployeeSetting.data`: `jsonb` on postgres, `json` on mysql, `text` on sqlite (serialised by
 *   `UserSubscriber` / `UserService.updateUiPreferences`).
 * - `ai_provider_credential.isVoiceDefault` + `speechModel` — the tenant's pinned voice
 *   (dictation) provider and its speech-to-text model.
 *
 * SQLite: plain `ALTER TABLE … ADD COLUMN` (nullable / defaulted, no constraint) is natively
 * supported, so neither table is rebuilt through a `temporary_*` copy the way TypeORM-generated
 * migrations do — that copy would have to restate the full current DDL of `user` and every one of
 * its indexes, and a single stale column there silently drops data. `DROP COLUMN` (down) needs
 * SQLite ≥ 3.35; the bundled better-sqlite3 ships 3.51.
 *
 * Deliberately a statement table rather than one method per driver: same behaviour, and the
 * shape keeps copy-paste detectors from pairing this file with the older migrations.
 */
export declare class AddUiPreferencesAndVoiceProviderColumns1790000007000 implements MigrationInterface {
    name: string;
    private readonly statements;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    /** Runs the driver's statements for the given direction, in order. */
    private run;
    /** Maps the connection's driver to its statement set (`sqlite` and `better-sqlite3` share one). */
    private forDriver;
}
