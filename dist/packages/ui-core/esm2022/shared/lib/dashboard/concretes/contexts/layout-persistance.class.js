import { Persistance } from './persistance.class';
export class LayoutPersistance {
    save() {
        return new Persistance(this._state);
    }
    restore(persistance) {
        this._state = persistance.state;
    }
    get state() {
        return this._state;
    }
    set state(value) {
        this._state = value;
    }
}
//# sourceMappingURL=layout-persistance.class.js.map