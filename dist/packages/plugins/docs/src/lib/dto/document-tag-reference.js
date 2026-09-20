"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTagReferenceArray = exports.IsTagReferenceArrayConstraint = void 0;
exports.resolveTagIds = resolveTagIds;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
/**
 * Validates a `tags` payload as an array of references to **existing** tags.
 *
 * Assigning a tag by id is the real operation, so every element must carry a UUID `id`. A tag
 * object without one would mean "create this tag as a side effect of writing a document" — a
 * write to a different aggregate, under a different permission, that no document route grants.
 * It is rejected loudly rather than silently ignored.
 *
 * Deliberately NOT `@ValidateNested()`: the routes run `whitelist: true` +
 * `forbidNonWhitelisted: true`, which would recurse into each element and 400 on a caller that
 * simply sent back a full `ITag` it had fetched from the API. Only `id` is read; the rest of the
 * object is ignored, exactly as `tagIds` ignores everything but the id.
 */
let IsTagReferenceArrayConstraint = class IsTagReferenceArrayConstraint {
    /**
     * @param value The candidate `tags` value.
     * @returns True when every element is an object carrying a UUID `id`.
     */
    validate(value) {
        if (value === undefined || value === null) {
            return true; // absence is `@IsOptional()`'s business, not this constraint's
        }
        if (!Array.isArray(value)) {
            return false;
        }
        return value.every((tag) => !!tag &&
            typeof tag === 'object' &&
            !Array.isArray(tag) &&
            (0, class_validator_1.isUUID)(tag.id, 'all'));
    }
    /**
     * @param args The validation arguments.
     * @returns The message a caller sending the wrong shape needs to act on.
     */
    defaultMessage(args) {
        return `each value in ${args.property} must reference an existing tag by its UUID "id" — tags are assigned here, never created`;
    }
};
exports.IsTagReferenceArrayConstraint = IsTagReferenceArrayConstraint;
exports.IsTagReferenceArrayConstraint = IsTagReferenceArrayConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsTagReferenceArray', async: false })
], IsTagReferenceArrayConstraint);
/**
 * Property decorator applying {@link IsTagReferenceArrayConstraint}.
 *
 * @param validationOptions Options forwarded to class-validator.
 * @returns The property decorator.
 */
const IsTagReferenceArray = (validationOptions) => {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsTagReferenceArrayConstraint
        });
    };
};
exports.IsTagReferenceArray = IsTagReferenceArray;
/**
 * Folds the two accepted tag shapes into the single id list the entity relation is built from.
 *
 * Semantics match `tagIds` exactly, because both are the same operation:
 * - neither field present ⇒ `undefined`, i.e. "leave the document's tags alone";
 * - either field present ⇒ the **union** of both, de-duplicated and order-stable, so a caller
 *   that mixes the shapes (or sends the same tag twice) gets the tag once;
 * - an explicitly empty array ⇒ `[]`, i.e. "clear the tags".
 *
 * @param input The create/update payload.
 * @returns The tag ids to assign, or `undefined` to leave the relation untouched.
 */
function resolveTagIds(input) {
    if (!input || (input.tagIds === undefined && input.tags === undefined)) {
        return undefined;
    }
    const fromReferences = (input.tags ?? []).map((tag) => tag?.id).filter((id) => Boolean(id));
    return [...new Set([...(input.tagIds ?? []), ...fromReferences])];
}
//# sourceMappingURL=document-tag-reference.js.map