describe("Authority", function () {
    var validOpenIdConfigurationResponse = '{"authorization_endpoint":"https://authorization_endpoint","token_endpoint":"https://token_endpoint","issuer":"https://fakeIssuer", "end_session_endpoint":"https://end_session_endpoint"}';
    beforeEach(function () {
        jasmine.Ajax.install();
    });
    afterEach(function () {
        jasmine.Ajax.uninstall();
    });
    describe("AadAuthority", function () {
        it("can be created", function () {
            var url = "https://login.microsoftonline.in/MYTENANT.com";
            var validate = false;
            var authority = Msal.Authority.CreateInstance(url, validate);
            expect(authority.CanonicalAuthority).toEqual("https://login.microsoftonline.in/mytenant.com/");
            expect(authority.AuthorityType).toEqual(Msal.AuthorityType.Aad);
        });
        it("can be resolved", function (done) {
            var url = "https://login.microsoftonline.com/6babcaad-604b-40ac-a9d7-9fd97c0b779f";
            var validate = true;
            jasmine.Ajax.stubRequest(/.*openid-configuration/i).andReturn({
                responseText: validOpenIdConfigurationResponse
            });
            var authority = Msal.Authority.CreateInstance(url, validate);
            var promise = authority.ResolveEndpointsAsync();
            verifyAuthority(promise, authority, done);
        });
        it("can be resolved for untrusted hosts", function (done) {
            var url = "https://login.microsoftonline.in/6babcaad-604b-40ac-a9d7-9fd97c0b779f";
            var validate = true;
            jasmine.Ajax.stubRequest(/.*tenant_discovery_endpoint.*openid-configuration/i).andReturn({
                responseText: validOpenIdConfigurationResponse
            });
            jasmine.Ajax.stubRequest(/.*discovery\/instance/i).andReturn({
                responseText: '{"tenant_discovery_endpoint":"https://tenant_discovery_endpoint/openid-configuration"}'
            });
            var authority = Msal.Authority.CreateInstance(url, validate);
            var promise = authority.ResolveEndpointsAsync();
            verifyAuthority(promise, authority, done);
        });
    });
    function verifyAuthority(promise, authority, done) {
        promise.then(function (authority) {
            expect(authority.AuthorityType).toEqual(Msal.AuthorityType.Aad);
            expect(authority.AuthorizationEndpoint).toEqual("https://authorization_endpoint");
            expect(authority.EndSessionEndpoint).toEqual("https://end_session_endpoint");
            expect(authority.SelfSignedJwtAudience).toEqual("https://fakeIssuer");
            done();
        });
    }
    describe("B2cAuthority", function () {
        it("can be created", function () {
            var url = "https://login.microsoftonline.in:444/tfp/tenant/policy";
            var validate = false;
            var authority = Msal.Authority.CreateInstance(url, validate);
            expect(authority.CanonicalAuthority).toEqual(url + "/");
            expect(authority.AuthorityType).toEqual(Msal.AuthorityType.B2C);
        });
        it("should fail when path doesnt have enough segments", function () {
            var url = "https://login.microsoftonline.com/tfp/";
            var validate = false;
            var call = function () { return Msal.Authority.CreateInstance(url, validate); };
            expect(call).toThrow(Msal.ErrorMessage.b2cAuthorityUriInvalidPath);
        });
        it("should fail when validation is not supported", function (done) {
            var url = "https://login.microsoftonline.in/tfp/tenant/policy";
            var validate = true;
            var authority = Msal.Authority.CreateInstance(url, validate);
            var promise = authority.ResolveEndpointsAsync();
            promise.catch(function (error) {
                expect(error).toEqual(Msal.ErrorMessage.unsupportedAuthorityValidation);
                done();
            });
        });
    });
    describe("AdfsAuthority", function () {
        it("cannot be created", function () {
            var url = "https://fs.contoso.com/adfs/";
            var validate = false;
            var call = function () { return Msal.Authority.CreateInstance(url, validate); };
            expect(call).toThrow(Msal.ErrorMessage.invalidAuthorityType);
        });
    });
    describe("Error", function () {
        function verifyError(done, response, expectedError) {
            var url = "https://login.microsoftonline.in/6babcaad-604b-40ac-a9d7-9fd97c0b779f";
            var validate = true;
            jasmine.Ajax.stubRequest(/.*/i).andReturn(response);
            var authority = Msal.Authority.CreateInstance(url, validate);
            var promise = authority.ResolveEndpointsAsync();
            promise.catch(function (error) {
                expect(error).toEqual(expectedError);
                done();
            });
        }
        it("is thrown when tenant discovery endpoint fails with invalid data", function (done) {
            verifyError(done, {
                status: 500,
                responseText: 'fatalError'
            }, "fatalError");
        });
        it("is thrown when tenant discovery endpoint fails with error details", function (done) {
            verifyError(done, {
                status: 400,
                responseText: '{"error": "OMG_EPIC_FAIL"}'
            }, "OMG_EPIC_FAIL");
        });
        it("is thrown when authority is not https", function () {
            var url = "http://login.microsoftonline.in/6babcaad-604b-40ac-a9d7-9fd97c0b779f";
            var validate = true;
            var call = function () { return Msal.Authority.CreateInstance(url, validate); };
            expect(call).toThrow(Msal.ErrorMessage.authorityUriInsecure);
        });
    });
});
//# sourceMappingURL=Authority.spec.js.map