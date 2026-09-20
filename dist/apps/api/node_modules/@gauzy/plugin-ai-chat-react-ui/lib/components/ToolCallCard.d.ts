export interface ToolCallCardProps {
    /** Tool name (e.g. 'open_page', 'get_my_tasks'). */
    toolName: string;
    /** Part state from the AI SDK ('input-streaming' | 'input-available' | 'output-available' | 'output-error' | 'approval-requested' | …). */
    state: string;
    input?: unknown;
    output?: unknown;
    errorText?: string;
    /** Approve / reject callbacks — present only while approval is pending. */
    onApprove?: () => void;
    onReject?: () => void;
}
/**
 * ToolCallCard
 *
 * One agent tool invocation inside the message stream: spinner while running,
 * check/cross when done, an expandable detail area (input/output JSON), and
 * Approve / Reject buttons when the tool requires the user's explicit approval.
 *
 * Deliberately chrome-less. As a bordered, filled card each step read as its own
 * separate object stacked above the answer; the steps belong TO the answer, so
 * they now sit on the panel with no box of their own, indented to the same left
 * edge as the bubble text so the whole turn reads as one block. The only state
 * that still draws itself is `approval-requested` — it is a decision the user has
 * to notice, and a row that looks like all the others would not be noticed.
 */
export declare function ToolCallCard({ toolName, state, input, output, errorText, onApprove, onReject }: ToolCallCardProps): import("react/jsx-runtime").JSX.Element;
