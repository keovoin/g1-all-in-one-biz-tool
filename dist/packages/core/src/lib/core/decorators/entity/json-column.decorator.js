"use strict";
/**
 * json-column.decorator.ts
 *
 * Unified JSON column decorator for TypeORM AND MikroORM.
 * ORM-native column options are spread directly into JsonColumnOptions<T>
 * so callers get full autocomplete and type-safety — no `Record<string, unknown>` escape hatch.
 *
 * Environment variables:
 *   ORM_TYPE = 'typeorm' | 'mikro-orm'                           (default: 'typeorm')
 *   DB_TYPE  = 'postgres' | 'mysql' | 'mariadb' | 'sqlite' | …  (default: 'sqlite')
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonColumn = JsonColumn;
exports.JsonbColumn = JsonbColumn;
exports.JsonArrayColumn = JsonArrayColumn;
// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────
function getDbDriver() {
    return process.env.DB_TYPE ?? 'default';
}
function getOrmKind() {
    return process.env.ORM_TYPE ?? 'typeorm';
}
function resolveStorageType(db) {
    switch (db) {
        case 'postgres':
            return 'jsonb';
        case 'mysql':
        case 'mariadb':
            return 'json';
        case 'mssql':
            return 'text';
        case 'sqlite':
        case 'better-sqlite3':
        default:
            return 'simple-json';
    }
}
function safeParse(raw, fallback) {
    if (raw === null || raw === undefined)
        return fallback;
    if (typeof raw === 'object')
        return raw;
    if (typeof raw === 'string') {
        try {
            return JSON.parse(raw);
        }
        catch {
            return fallback;
        }
    }
    return fallback;
}
// ─────────────────────────────────────────────────────────────────────────────
// TypeORM path
// ─────────────────────────────────────────────────────────────────────────────
function buildTypeOrmDecorator(opts) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Column } = require('typeorm');
    // Pull out our custom keys; everything else is a native ColumnOption
    const { defaultValue = null, forceType, ...columnOptions } = opts;
    const storageType = forceType ?? resolveStorageType(getDbDriver());
    return Column({
        // Native ColumnOptions spread first so our keys take precedence
        ...columnOptions,
        type: storageType,
        transformer: {
            to(value) {
                if (value === null || value === undefined)
                    return null;
                if (storageType === 'text') {
                    try {
                        return JSON.stringify(value);
                    }
                    catch {
                        return null;
                    }
                }
                return value;
            },
            from(value) {
                return safeParse(value, defaultValue);
            }
        }
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// MikroORM path
// ─────────────────────────────────────────────────────────────────────────────
function buildMikroOrmDecorator(opts) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Property, Type } = require('@mikro-orm/core');
    const { defaultValue = null, forceType, ...propertyOptions } = opts;
    const storageType = forceType ?? resolveStorageType(getDbDriver());
    const sqlType = (t) => (t === 'jsonb' ? 'jsonb' : t === 'json' ? 'json' : 'text');
    class JsonType extends Type {
        convertToDatabaseValue(value) {
            if (value === null || value === undefined)
                return null;
            try {
                return JSON.stringify(value);
            }
            catch {
                return null;
            }
        }
        convertToJSValue(value) {
            return safeParse(value, defaultValue);
        }
        getColumnType() {
            return sqlType(storageType);
        }
        // Serialize both sides to JSON string before comparing — prevents
        // every flush from marking every JSON column as dirty.
        compareAsType() {
            return 'string';
        }
        toJSON(value) {
            return value;
        }
    }
    return Property({
        // Native PropertyOptions spread first
        ...propertyOptions,
        type: new JsonType() // instance so JsonType closes over defaultValue
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// Public decorators
// ─────────────────────────────────────────────────────────────────────────────
/**
 * `@JsonColumn<T>(options?)`
 *
 * Unified JSON column for TypeORM and MikroORM
 * All native ORM column options are accepted directly — no wrapper object needed.
 *
 * TypeORM example:
 * ```ts
 * @JsonColumn<Meta>({ defaultValue: { tags: [] }, nullable: true, comment: 'User meta' })
 * meta: Meta;
 * ```
 *
 * MikroORM example:
 * ```ts
 * @JsonColumn<Meta>({ defaultValue: { tags: [] }, nullable: true, comment: 'User meta' })
 * meta: Meta;
 * ```
 */
function JsonColumn(options = {}) {
    return getOrmKind() === 'mikro-orm'
        ? buildMikroOrmDecorator(options)
        : buildTypeOrmDecorator(options);
}
/**
 * `@JsonbColumn<T>(options?)`
 *
 * Forces `jsonb` storage (PostgreSQL).
 * Accepts all native ORM column options directly.
 *
 * ```ts
 * @JsonbColumn<Payload>({ nullable: true })
 * payload: Payload | null;
 * ```
 */
function JsonbColumn(options = {}) {
    return JsonColumn({ ...options, forceType: 'jsonb' });
}
/**
 * `@JsonArrayColumn<T>(options?)`
 *
 * JSON column for arrays. Defaults to `[]` — never reads `null`.
 * Accepts all native ORM column options directly.
 *
 * ```ts
 * @JsonArrayColumn<string>({ comment: 'Tag list' })
 * tags: string[];
 * ```
 */
function JsonArrayColumn(options = {}) {
    return JsonColumn({ defaultValue: [], ...options });
}
// ─────────────────────────────────────────────────────────────────────────────
// Usage examples (not executed)
// ─────────────────────────────────────────────────────────────────────────────
/*
interface Address { street: string; city: string; zip: string }
interface Meta    { weight: number; featured: boolean }

// ── TypeORM ──────────────────────────────────────────────────────────────────
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class ProductTypeOrm {
  @PrimaryGeneratedColumn() id: number;

  // All ColumnOptions available directly — nullable, comment, name, select …
  @JsonColumn<Address>({
    defaultValue: { street: '', city: '', zip: '' },
    nullable: true,
    comment: 'Shipping address',
  })
  address: Address | null;

  @JsonbColumn<Meta>({ defaultValue: { weight: 0, featured: false }, select: false })
  meta: Meta;

  @JsonArrayColumn<string>({ comment: 'Tags', name: 'tag_list' })
  tags: string[];
}

// ── MikroORM─────────────────────────────────────────────────────────
import { Entity, PrimaryKey } from '@mikro-orm/core';

@Entity()
class ProductMikroOrm {
  @PrimaryKey() id: number;

  // All PropertyOptions available directly — nullable, comment, lazy, hidden …
  @JsonColumn<Address>({
    defaultValue: { street: '', city: '', zip: '' },
    nullable: true,
    comment: 'Shipping address',
  })
  address: Address | null;

  @JsonbColumn<Meta>({ defaultValue: { weight: 0, featured: false }, lazy: true })
  meta: Meta;

  @JsonArrayColumn<string>({ comment: 'Tags', fieldName: 'tag_list' })
  tags: string[];
}
*/
//# sourceMappingURL=json-column.decorator.js.map