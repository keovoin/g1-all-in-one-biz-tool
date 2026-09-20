"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREFERRED_UI_SETTING_KEY = exports.PreferredUiEnum = void 0;
/**
 * The UI framework a tenant prefers for the surfaces that ship in BOTH flavours.
 *
 * Gauzy is progressively re-building pages in React next to their Angular originals; this
 * tenant-wide switch decides which flavour every user of the tenant gets. It is a global
 * preference (not per organization / user), persisted as the `preferredUi` tenant setting.
 */
var PreferredUiEnum;
(function (PreferredUiEnum) {
    /** The original Angular pages (default). */
    PreferredUiEnum["ANGULAR"] = "angular";
    /** The React re-implementations, wherever one exists. */
    PreferredUiEnum["REACT"] = "react";
})(PreferredUiEnum || (exports.PreferredUiEnum = PreferredUiEnum = {}));
/** Name of the tenant setting row that stores the {@link PreferredUiEnum} choice. */
exports.PREFERRED_UI_SETTING_KEY = 'preferredUi';
//# sourceMappingURL=tenant.model.js.map