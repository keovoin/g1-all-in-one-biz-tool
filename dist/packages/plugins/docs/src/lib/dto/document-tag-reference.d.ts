import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ID, ITag } from '@gauzy/contracts';
/**
 * The two interchangeable ways a caller may express "these are the document's tags".
 *
 * `IDocumentCreateInput` (`@gauzy/contracts`) publishes `tags?: ITag[]`, while the request DTOs
 * grew `tagIds?: ID[]` — and the document routes validate with `forbidNonWhitelisted: true`, so a
 * caller typed against the published interface got a 400 it had no way to diagnose. Both shapes
 * are accepted and folded together by {@link resolveTagIds}; neither is removed.
 */
export interface IDocumentTagInput {
    /** Tag ids to assign. */
    tagIds?: ID[];
    /** Tag references — only `id` is read; see {@link IsTagReferenceArray}. */
    tags?: ITag[];
}
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
export declare class IsTagReferenceArrayConstraint implements ValidatorConstraintInterface {
    /**
     * @param value The candidate `tags` value.
     * @returns True when every element is an object carrying a UUID `id`.
     */
    validate(value: unknown): boolean;
    /**
     * @param args The validation arguments.
     * @returns The message a caller sending the wrong shape needs to act on.
     */
    defaultMessage(args: ValidationArguments): string;
}
/**
 * Property decorator applying {@link IsTagReferenceArrayConstraint}.
 *
 * @param validationOptions Options forwarded to class-validator.
 * @returns The property decorator.
 */
export declare const IsTagReferenceArray: (validationOptions?: ValidationOptions) => PropertyDecorator;
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
export declare function resolveTagIds(input: IDocumentTagInput | undefined): ID[] | undefined;
