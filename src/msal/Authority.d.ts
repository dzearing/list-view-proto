import { IUri } from './IUri';
export declare enum AuthorityType {
    Aad = 0,
    Adfs = 1,
    B2C = 2,
}
export declare abstract class Authority {
    constructor(authority: string, validateAuthority: boolean);
    readonly abstract AuthorityType: AuthorityType;
    IsValidationEnabled: boolean;
    readonly Tenant: string;
    private tenantDiscoveryResponse;
    readonly AuthorizationEndpoint: string;
    readonly EndSessionEndpoint: string;
    readonly SelfSignedJwtAudience: string;
    private validateResolved();
    CanonicalAuthority: string;
    private canonicalAuthority;
    private canonicalAuthorityUrlComponents;
    readonly CanonicalAuthorityUrlComponents: IUri;
    protected readonly DefaultOpenIdConfigurationEndpoint: string;
    private validateAsUri();
    private static DetectAuthorityFromUrl(authorityUrl);
    static InstanceTypes: {
        [type: number]: new (authorityUrl: string, validateAuthority: boolean) => Authority;
    };
    static CreateInstance(authorityUrl: string, validateAuthority: boolean): Authority;
    private DiscoverEndpoints(openIdConfigurationEndpoint);
    ResolveEndpointsAsync(): Promise<Authority>;
    abstract GetOpenIdConfigurationEndpointAsync(): Promise<string>;
}
