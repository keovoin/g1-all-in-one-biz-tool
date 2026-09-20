"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCollection = void 0;
/**
 *	Base class for collections
 */
class BaseCollection {
    constructor(data) {
        this.data = data;
    }
    // Method to convert plain object data to class instance
    static toClass(plainData) {
        return new this(plainData);
    }
    // Method to convert class instance to plain object data
    toPlain() {
        return { ...this.data };
    }
    // Method to convert class instance to JSON string
    toJSON() {
        return JSON.stringify(this.toPlain());
    }
    // Getter to return the data directly
    get entity() {
        return this.data;
    }
}
exports.BaseCollection = BaseCollection;
//# sourceMappingURL=base.collection.js.map