"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRelatedIssueRelationMap = taskRelatedIssueRelationMap;
const contracts_1 = require("@gauzy/contracts");
/**
 * Maps a task's related issue relation enum to a corresponding string description.
 *
 * @param {TaskRelatedIssuesRelationEnum} relation - The relation type from the enum `TaskRelatedIssuesRelationEnum`.
 * @returns {string} The corresponding string description for the given relation type.
 * @throws {Error} If the relation type is unsupported.
 */
function taskRelatedIssueRelationMap(relation) {
    const issueRelationMap = {
        [contracts_1.TaskRelatedIssuesRelationEnum.BLOCKS]: 'Blocks',
        [contracts_1.TaskRelatedIssuesRelationEnum.CLONES]: 'Clones',
        [contracts_1.TaskRelatedIssuesRelationEnum.DUPLICATES]: 'Duplicates',
        [contracts_1.TaskRelatedIssuesRelationEnum.IS_BLOCKED_BY]: 'Is Blocked By',
        [contracts_1.TaskRelatedIssuesRelationEnum.IS_CLONED_BY]: 'Is Cloned By',
        [contracts_1.TaskRelatedIssuesRelationEnum.IS_DUPLICATED_BY]: 'Is Duplicated By',
        [contracts_1.TaskRelatedIssuesRelationEnum.RELATES_TO]: 'Relates To'
    };
    return issueRelationMap[relation] ?? (() => {
        throw new Error(`Unsupported relation type: ${relation}`);
    })();
}
//# sourceMappingURL=task-linked-issue.helper.js.map