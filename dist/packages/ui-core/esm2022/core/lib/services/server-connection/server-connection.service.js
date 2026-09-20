import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '../store/store.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../store/store.service";
export class ServerConnectionService {
    constructor(httpClient, store) {
        this.httpClient = httpClient;
        this.store = store;
    }
    async checkServerConnection(endPoint) {
        const url = `${endPoint}/api`;
        return new Promise((resolve, reject) => {
            console.log(`Checking server connection on URL in ServerConnectionService in @core/services: ${url}`);
            try {
                if (endPoint !== 'http://localhost:3000') {
                    const requestObservable = this.httpClient.get(url);
                    if (!requestObservable) {
                        console.error('Failed to create an Observable from the HTTP request.');
                        reject('Failed to create an Observable from the HTTP request.');
                        return;
                    }
                    requestObservable.subscribe({
                        next: (resp) => {
                            console.log(`Server connection status in ServerConnectionService for URL ${url} is: ${resp.status}`);
                            this.store.serverConnection = resp.status;
                            resolve(true);
                        },
                        error: (err) => {
                            console.error(`Error checking server connection in ServerConnectionService for URL ${url}`, err);
                            this.store.serverConnection = err.status;
                            reject(err);
                        }
                    });
                }
                else {
                    console.log(`Skip checking server connection for URL ${url}`);
                    this.store.serverConnection = 200;
                    resolve(true);
                }
            }
            catch (error) {
                console.error(`Error checking server connection in ServerConnectionService for URL ${url}`, error);
                this.store.serverConnection = 500;
                reject(error);
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ServerConnectionService, deps: [{ token: i1.HttpClient }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ServerConnectionService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ServerConnectionService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.Store }] });
//# sourceMappingURL=server-connection.service.js.map