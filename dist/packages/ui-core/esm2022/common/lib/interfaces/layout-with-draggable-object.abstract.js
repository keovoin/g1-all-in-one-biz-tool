import { Subject } from 'rxjs';
export class LayoutWithDraggableObject {
    constructor() {
        this.draggableObject = [];
        this._event = new Subject();
    }
    drop(event) { }
    onDragEnded(event) {
        this._event.next(event);
    }
    get event() {
        return this._event.asObservable();
    }
}
//# sourceMappingURL=layout-with-draggable-object.abstract.js.map