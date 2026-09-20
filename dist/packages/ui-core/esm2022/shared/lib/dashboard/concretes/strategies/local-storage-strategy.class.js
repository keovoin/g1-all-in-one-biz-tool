export class LocalStorageStrategy {
    constructor() { }
    deSerialize(store, values) {
        return store
            ? store
                .flatMap((serialized) => {
                return this.serializables.map((draggableObject) => {
                    if (draggableObject.position === serialized.position) {
                        draggableObject.isCollapse = serialized.isCollapse;
                        draggableObject.isExpand = serialized.isExpand;
                        draggableObject.title = serialized.title;
                        draggableObject.hide = serialized.hide;
                        return draggableObject;
                    }
                });
            })
                .filter((deserialized) => deserialized)
            : [];
    }
    serialize() {
        return this.serializables.map((restored) => restored.toObject());
    }
    /**
     * Get all serializables
     */
    get serializables() {
        return this._serializables;
    }
    /**
     * Set all serializables
     */
    set serializables(value) {
        this._serializables = value;
    }
}
//# sourceMappingURL=local-storage-strategy.class.js.map