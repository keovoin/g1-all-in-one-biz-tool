import { PlainObject } from '@gauzy/contracts';
/**
 *	Base class for collections
 */
export declare class BaseCollection<T extends PlainObject> {
    private data;
    constructor(data: T);
    static toClass<T extends PlainObject, U extends BaseCollection<T>>(this: new (data: T) => U, plainData: T): U;
    toPlain(): T;
    toJSON(): string;
    get entity(): T;
}
