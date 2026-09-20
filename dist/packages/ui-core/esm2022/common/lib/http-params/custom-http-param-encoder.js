/**
 * Custom HttpParamCodec to correctly encode nested query params
 */
export class CustomHttpParamEncoder {
    encodeKey(key) {
        return encodeURIComponent(key);
    }
    encodeValue(value) {
        return encodeURIComponent(value);
    }
    decodeKey(key) {
        return decodeURIComponent(key);
    }
    decodeValue(value) {
        return decodeURIComponent(value);
    }
}
//# sourceMappingURL=custom-http-param-encoder.js.map