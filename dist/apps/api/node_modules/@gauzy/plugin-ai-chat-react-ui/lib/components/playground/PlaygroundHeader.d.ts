export interface PlaygroundHeaderProps {
    title?: string;
    onNewChat?: () => void;
    /** Whether the settings sidebar is expanded. */
    sidebarExpanded?: boolean;
    /** Toggle the settings sidebar. */
    onToggleSidebar?: () => void;
}
/**
 * PlaygroundHeader — top bar with title and "New Chat" action button.
 */
export declare function PlaygroundHeader({ title, onNewChat, sidebarExpanded, onToggleSidebar }: PlaygroundHeaderProps): import("react/jsx-runtime").JSX.Element;
