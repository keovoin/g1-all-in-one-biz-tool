"use strict";
/**
 * Terms-of-service acceptance.
 *
 * A checkbox is not consent — it is a *claim* that consent happened. Until the
 * registration payload actually carries which document, at which version, of
 * which exact text the person agreed to, the tick is unprovable: the user saw a
 * checkbox and the database has nothing.
 *
 * These two shapes are the two halves of making it provable:
 *
 * - {@link ITermsAcceptanceDocument} is what the *server* publishes — derived
 *   from the legal corpus (`@ever-co/legal`), so the client never has to guess a
 *   version or a digest.
 * - {@link ITermsAcceptanceClaim} is what the *client* posts back — the exact
 *   identity of the text it rendered next to the checkbox. The server re-checks
 *   every claim against the corpus before it becomes a record, because a value
 *   that arrived from a browser is a claim, not evidence.
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=terms-acceptance.model.js.map