import { TaskRelatedIssuesRelationEnum } from '@gauzy/contracts';
/**
 * Maps a task's related issue relation enum to a corresponding string description.
 *
 * @param {TaskRelatedIssuesRelationEnum} relation - The relation type from the enum `TaskRelatedIssuesRelationEnum`.
 * @returns {string} The corresponding string description for the given relation type.
 * @throws {Error} If the relation type is unsupported.
 */
export declare function taskRelatedIssueRelationMap(relation: TaskRelatedIssuesRelationEnum): string;
