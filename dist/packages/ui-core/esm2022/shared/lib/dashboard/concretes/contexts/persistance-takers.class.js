export class PersistanceTakers {
    constructor(layout) {
        this._persistances = [];
        this._layout = layout;
    }
    backup() {
        this._persistances.push(this._layout.save());
    }
    undo() {
        if (!this._persistances.length)
            return;
        const persistance = this._persistances.pop();
        this._layout.restore(persistance);
    }
}
//# sourceMappingURL=persistance-takers.class.js.map