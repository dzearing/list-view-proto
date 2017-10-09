import { IUri } from './IUri';
import { User } from './User';
export declare class Utils {
    static compareObjects(u1: User, u2: User): boolean;
    static expiresIn(expires: string): number;
    static now(): number;
    static isEmpty(str: string): boolean;
    static extractIdToken(encodedIdToken: string): any;
    static base64EncodeStringUrlSafe(input: string): string;
    static base64DecodeStringUrlSafe(base64IdToken: string): string;
    static encode(input: string): string;
    static utf8Encode(input: string): string;
    static decode(base64IdToken: string): string;
    static decodeJwt(jwtToken: string): any;
    static deserialize(query: string): any;
    static isIntersectingScopes(cachedScopes: Array<string>, scopes: Array<string>): boolean;
    static containsScope(cachedScopes: Array<string>, scopes: Array<string>): boolean;
    static convertToLowerCase(scopes: Array<string>): Array<string>;
    static removeElement(scopes: Array<string>, scope: string): Array<string>;
    static decimalToHex(num: number): string;
    static getLibraryVersion(): string;
    static replaceFirstPath(href: string, tenantId: string): string;
    static createNewGuid(): string;
    static GetUrlComponents(url: string): IUri;
    static CanonicalizeUri(url: string): string;
    static endsWith(url: string, suffix: string): boolean;
}
