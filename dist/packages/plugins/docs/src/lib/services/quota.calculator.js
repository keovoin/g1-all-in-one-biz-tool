"use strict";
/**
 * Pure organization storage-quota arithmetic (`08-permissions-security.md` §5.7).
 *
 * No ORM, no Nest — the usage number and the incoming byte count come from the caller, so
 * the whole decision surface is unit-testable and shared by the upload path, the settings
 * endpoint, and (P1+) the capture channels.
 *
 * Convention throughout: **`0` (and any unset/invalid value) means UNLIMITED.**
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeQuotaBytes = normalizeQuotaBytes;
exports.resolveQuotaBytes = resolveQuotaBytes;
exports.remainingQuotaBytes = remainingQuotaBytes;
exports.isQuotaExceeded = isQuotaExceeded;
exports.buildQuotaState = buildQuotaState;
/**
 * Normalizes a raw quota value (env string, org-setting string, or number) into bytes.
 * Anything non-numeric, negative, or absent resolves to `0` (unlimited).
 *
 * @param raw The raw configured value.
 * @returns The quota in bytes (>= 0).
 */
function normalizeQuotaBytes(raw) {
    if (raw === null || raw === undefined || raw === '') {
        return 0;
    }
    const parsed = typeof raw === 'number' ? raw : Number.parseInt(String(raw), 10);
    return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : 0;
}
/**
 * Resolves the effective quota: the per-organization setting override
 * (`docs.<organizationId>.quotaBytes`) wins when set to a usable value, otherwise the
 * deployment default from `GAUZY_DOCS_ORG_QUOTA_BYTES`.
 *
 * An explicit `"0"` override means "unlimited for this organization" and therefore
 * deliberately overrides a non-zero deployment default.
 *
 * @param orgSetting The raw org-setting value (may be absent).
 * @param envDefault The deployment default in bytes.
 * @returns The effective quota in bytes; `0` = unlimited.
 */
function resolveQuotaBytes(orgSetting, envDefault) {
    // An explicitly stored override always wins, including an explicit "0" (unlimited).
    if (orgSetting !== null && orgSetting !== undefined && orgSetting !== '') {
        return normalizeQuotaBytes(orgSetting);
    }
    return normalizeQuotaBytes(envDefault);
}
/**
 * Bytes remaining under the quota, or `null` when unlimited. Never negative — an
 * already-over-quota organization reports `0` remaining, not a negative number.
 *
 * @param usedBytes Current usage in bytes.
 * @param quotaBytes Effective quota in bytes (`0` = unlimited).
 * @returns Remaining bytes, or null when unlimited.
 */
function remainingQuotaBytes(usedBytes, quotaBytes) {
    if (!quotaBytes || quotaBytes <= 0) {
        return null;
    }
    return Math.max(0, quotaBytes - Math.max(0, usedBytes));
}
/**
 * Whether accepting `incomingBytes` more would push the organization past its quota.
 * Unlimited quotas never exceed; a zero-byte addition never exceeds (so a re-check on an
 * already-over-quota organization does not block metadata-only work).
 *
 * @param usedBytes Current usage in bytes.
 * @param incomingBytes Bytes about to be stored.
 * @param quotaBytes Effective quota in bytes (`0` = unlimited).
 * @returns True when the write must be rejected.
 */
function isQuotaExceeded(usedBytes, incomingBytes, quotaBytes) {
    if (!quotaBytes || quotaBytes <= 0) {
        return false;
    }
    if (!incomingBytes || incomingBytes <= 0) {
        return false;
    }
    return Math.max(0, usedBytes) + incomingBytes > quotaBytes;
}
/**
 * Builds the quota state block reported by `GET /plugins/docs/settings`.
 *
 * @param usedBytes Current usage in bytes.
 * @param quotaBytes Effective quota in bytes (`0` = unlimited).
 * @returns The quota state.
 */
function buildQuotaState(usedBytes, quotaBytes) {
    const normalizedQuota = normalizeQuotaBytes(quotaBytes);
    const normalizedUsed = Math.max(0, Math.trunc(usedBytes || 0));
    return {
        quotaBytes: normalizedQuota,
        usedBytes: normalizedUsed,
        remainingBytes: remainingQuotaBytes(normalizedUsed, normalizedQuota),
        unlimited: normalizedQuota === 0
    };
}
//# sourceMappingURL=quota.calculator.js.map