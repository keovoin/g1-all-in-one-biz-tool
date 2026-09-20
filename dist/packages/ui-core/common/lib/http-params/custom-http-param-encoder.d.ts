import { HttpParameterCodec } from '@angular/common/http';
/**
 * Custom HttpParamCodec to correctly encode nested query params
 */
export declare class CustomHttpParamEncoder implements HttpParameterCodec {
    encodeKey(key: string): string;
    encodeValue(value: string): string;
    decodeKey(key: string): string;
    decodeValue(value: string): string;
}
