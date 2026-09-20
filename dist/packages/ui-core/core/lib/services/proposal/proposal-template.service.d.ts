import { HttpClient } from '@angular/common/http';
import { ID, IEmployeeProposalTemplate, IEmployeeProposalTemplateCreateInput, IEmployeeProposalTemplateMakeDefaultInput, IEmployeeProposalTemplateUpdateInput, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ProposalTemplateService {
    private readonly http;
    API_URL: string;
    constructor(http: HttpClient);
    /**
     * Fetches all employee proposal templates based on the given request parameters.
     *
     * @param request - An optional object containing query parameters to filter and sort the results.
     * @returns A promise that resolves with a pagination object containing the list of employee proposal templates.
     */
    getAll(request?: any): Promise<IPagination<IEmployeeProposalTemplate>>;
    /**
     * Creates a new employee proposal template with the provided input data.
     *
     * @param input - An object containing the data for the new employee proposal template.
     * @returns A promise that resolves with the created employee proposal template.
     */
    create(input: IEmployeeProposalTemplateCreateInput): Promise<IEmployeeProposalTemplate>;
    /**
     * Updates an existing employee proposal template with the given ID using the provided data.
     *
     * @param id - The ID of the employee proposal template to update.
     * @param request - An object containing the updated data for the employee proposal template.
     * @returns A promise that resolves with the updated employee proposal template.
     */
    update(id: ID, request: IEmployeeProposalTemplateUpdateInput): Promise<IEmployeeProposalTemplate>;
    /**
     * Sets the specified employee proposal template as the default template.
     *
     * @param id - The ID of the employee proposal template to set as default.
     * @param input - An object containing any additional data required for making the template default.
     * @returns A promise that resolves with the updated employee proposal template.
     */
    makeDefault(id: ID, input: IEmployeeProposalTemplateMakeDefaultInput): Promise<IEmployeeProposalTemplate>;
    /**
     * Deletes the employee proposal template with the specified ID.
     *
     * @param id - The ID of the employee proposal template to delete.
     * @returns A promise that resolves when the employee proposal template has been deleted.
     */
    delete(id: ID): Promise<Object>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProposalTemplateService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ProposalTemplateService>;
}
