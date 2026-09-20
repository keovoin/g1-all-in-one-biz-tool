export interface ILocation {
    type: 'Point';
    coordinates: [number, number];
}
export interface IAddress {
    country: string | null;
    city: string | null;
    postcode?: string | null;
    address: string | null;
    address2: string | null;
}
export declare function getEmptyAddress(): IAddress;
export interface IGeoLocationCreateObject extends IAddress {
    loc?: ILocation;
}
export interface IGeolocationUpdateObject extends IAddress {
    loc?: ILocation;
}
