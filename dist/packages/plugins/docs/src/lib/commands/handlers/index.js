"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlers = void 0;
const archive_document_handler_1 = require("./archive-document.handler");
const bulk_document_action_handler_1 = require("./bulk-document-action.handler");
const create_document_handler_1 = require("./create-document.handler");
const create_document_category_handler_1 = require("./create-document-category.handler");
const create_document_link_handler_1 = require("./create-document-link.handler");
const delete_document_handler_1 = require("./delete-document.handler");
const delete_document_category_handler_1 = require("./delete-document-category.handler");
const delete_document_link_handler_1 = require("./delete-document-link.handler");
const duplicate_document_handler_1 = require("./duplicate-document.handler");
const merge_document_category_handler_1 = require("./merge-document-category.handler");
const move_document_handler_1 = require("./move-document.handler");
const recover_document_handler_1 = require("./recover-document.handler");
const reorder_documents_handler_1 = require("./reorder-documents.handler");
const replace_document_file_handler_1 = require("./replace-document-file.handler");
const reprocess_document_handler_1 = require("./reprocess-document.handler");
const restore_document_version_handler_1 = require("./restore-document-version.handler");
const unarchive_document_handler_1 = require("./unarchive-document.handler");
const update_document_handler_1 = require("./update-document.handler");
const update_document_category_handler_1 = require("./update-document-category.handler");
const update_document_content_handler_1 = require("./update-document-content.handler");
const update_document_settings_handler_1 = require("./update-document-settings.handler");
const update_extracted_text_handler_1 = require("./update-extracted-text.handler");
const upload_documents_handler_1 = require("./upload-documents.handler");
exports.CommandHandlers = [
    archive_document_handler_1.ArchiveDocumentHandler,
    bulk_document_action_handler_1.BulkDocumentActionHandler,
    create_document_handler_1.CreateDocumentHandler,
    create_document_category_handler_1.CreateDocumentCategoryHandler,
    create_document_link_handler_1.CreateDocumentLinkHandler,
    delete_document_handler_1.DeleteDocumentHandler,
    delete_document_category_handler_1.DeleteDocumentCategoryHandler,
    delete_document_link_handler_1.DeleteDocumentLinkHandler,
    duplicate_document_handler_1.DuplicateDocumentHandler,
    merge_document_category_handler_1.MergeDocumentCategoryHandler,
    move_document_handler_1.MoveDocumentHandler,
    recover_document_handler_1.RecoverDocumentHandler,
    reorder_documents_handler_1.ReorderDocumentsHandler,
    replace_document_file_handler_1.ReplaceDocumentFileHandler,
    reprocess_document_handler_1.ReprocessDocumentHandler,
    restore_document_version_handler_1.RestoreDocumentVersionHandler,
    unarchive_document_handler_1.UnarchiveDocumentHandler,
    update_document_handler_1.UpdateDocumentHandler,
    update_document_category_handler_1.UpdateDocumentCategoryHandler,
    update_document_content_handler_1.UpdateDocumentContentHandler,
    update_document_settings_handler_1.UpdateDocumentSettingsHandler,
    update_extracted_text_handler_1.UpdateExtractedTextHandler,
    upload_documents_handler_1.UploadDocumentsHandler
];
//# sourceMappingURL=index.js.map