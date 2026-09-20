"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDuration = formatDuration;
/** Pads a number with leading zeros to ensure it's at least 2 digits */
function pad(n) {
    return String(n).padStart(2, '0');
}
/** Converts total seconds to HH:mm:ss */
function formatDuration(totalSeconds) {
    const s = Math.max(0, Math.round(totalSeconds));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}
//# sourceMappingURL=format-duration.js.map