/**
 * Body of `POST /api/plugins/docs/documents/:id/review/request` (§4.9).
 */
export declare class RequestReviewDTO {
    readonly reason?: string;
}
/**
 * Body of `POST /api/plugins/docs/documents/:id/review/approve`.
 */
export declare class ApproveReviewDTO {
    readonly note?: string;
}
/**
 * Body of `POST /api/plugins/docs/documents/:id/review/reject` — same `reason` field name
 * as the bulk `REVIEW_REJECT` payload.
 */
export declare class RejectReviewDTO {
    readonly reason?: string;
}
