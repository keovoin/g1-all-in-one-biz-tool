import { TransformFnParams } from 'class-transformer';
import { IBaseRelationsEntityModel } from '@gauzy/contracts';
/**
 * Parses a comma-separated relations string (or string array) into a
 * trimmed, non-empty string array.  Re-exported so that DTOs with
 * stricter enum constraints can reuse the same transform logic.
 */
export declare function parseRelationsString({ value }: TransformFnParams): string[];
/**
 * Validates and transforms 'relations' query parameter.
 */
export declare class RelationsQueryDTO implements IBaseRelationsEntityModel {
    readonly relations: string[];
}
