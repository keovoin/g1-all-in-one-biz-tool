import { Router } from "@angular/router";
import { Store } from "./services/store";
import { ServerConnectionService } from "./services/server-connection";
/**
 * Creates a factory function that checks the server connection and performs actions based on the result.
 *
 * @param {ServerConnectionService} provider - The server connection service instance.
 * @param {Store} store - The store instance.
 * @param {Router} router - The router instance.
 * @returns {() => Promise<void>} A function that checks the server connection and performs actions based on the result.
 */
export declare function serverConnectionFactory(provider: ServerConnectionService, store: Store, router: Router): () => Promise<void>;
