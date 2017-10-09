import { ClientInfo } from './ClientInfo';
import { IdToken } from './IdToken';
export declare class User {
    displayableId: string;
    name: string;
    identityProvider: string;
    userIdentifier: string;
    constructor(displayableId: string, name: string, identityProvider: string, userIdentifier: string);
    static createUser(idToken: IdToken, clientInfo: ClientInfo, authority: string): User;
}
