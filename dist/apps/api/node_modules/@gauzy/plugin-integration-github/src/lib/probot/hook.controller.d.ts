import { Type } from '@nestjs/common';
/**
 * Factory function to create a NestJS controller class for handling webhook hooks.
 * @param path The path at which the controller should listen for webhook requests.
 */
export declare function getControllerClass({ path }: {
    path: any;
}): Type<any>;
