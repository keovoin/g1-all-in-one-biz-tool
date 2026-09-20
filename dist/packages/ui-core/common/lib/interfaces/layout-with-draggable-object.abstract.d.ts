import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
export declare abstract class LayoutWithDraggableObject {
    protected draggableObject: any[];
    private _event;
    protected drop(event: CdkDragDrop<number>): void;
    protected onDragEnded(event: Object): void;
    protected get event(): Observable<any>;
}
