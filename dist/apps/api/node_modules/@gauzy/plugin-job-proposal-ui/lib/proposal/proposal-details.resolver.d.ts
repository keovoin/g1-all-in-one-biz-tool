import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { IProposal } from '@gauzy/contracts';
/**
 * Resolver function to fetch a proposal by its ID.
 * If an error occurs, the user is redirected to the employees page.
 *
 * @param route The activated route snapshot containing the route parameters.
 * @returns An observable that emits the resolved proposal or `null` in case of an error.
 */
export declare const ProposalDetailsResolver: ResolveFn<Observable<IProposal>>;
