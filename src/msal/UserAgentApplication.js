"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var AccessTokenKey_1 = require("./AccessTokenKey");
var AccessTokenValue_1 = require("./AccessTokenValue");
var AuthenticationRequestParameters_1 = require("./AuthenticationRequestParameters");
var Authority_1 = require("./Authority");
var ClientInfo_1 = require("./ClientInfo");
var Constants_1 = require("./Constants");
var IdToken_1 = require("./IdToken");
var RequestContext_1 = require("./RequestContext");
var Storage_1 = require("./Storage");
var RequestInfo_1 = require("./RequestInfo");
var User_1 = require("./User");
var Utils_1 = require("./Utils");
require("./AadAuthority");
require("./B2cAuthority");
var ResponseTypes = {
    id_token: "id_token",
    token: "token",
    id_token_token: "id_token token"
};
var resolveTokenOnlyIfOutOfIframe = function (target, propertyKey, descriptor) {
    var tokenAcquisitionMethod = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.isInIframe()
            ? new Promise(function () { })
            : tokenAcquisitionMethod.apply(this, args);
    };
    return descriptor;
};
var UserAgentApplication = (function () {
    function UserAgentApplication(clientId, authority, tokenReceivedCallback, options) {
        if (options === void 0) { options = {}; }
        this._cacheLocations = {
            localStorage: "localStorage",
            sessionStorage: "sessionStorage"
        };
        this._interactionModes = {
            popUp: "popUp",
            redirect: "redirect"
        };
        this._interactionMode = "redirect";
        this._clockSkew = 300;
        this._tokenReceivedCallback = null;
        this._navigateToLoginRequestUrl = true;
        var _a = options.validateAuthority, validateAuthority = _a === void 0 ? true : _a, _b = options.cacheLocation, cacheLocation = _b === void 0 ? 'sessionStorage' : _b, _c = options.redirectUri, redirectUri = _c === void 0 ? window.location.href.split("?")[0].split("#")[0] : _c, _d = options.postLogoutRedirectUri, postLogoutRedirectUri = _d === void 0 ? redirectUri : _d, _e = options.navigateToLoginRequestUrl, navigateToLoginRequestUrl = _e === void 0 ? true : _e;
        this.clientId = clientId;
        this.validateAuthority = validateAuthority;
        this.authority = authority || "https://login.microsoftonline.com/common";
        this._tokenReceivedCallback = tokenReceivedCallback;
        this._redirectUri = redirectUri;
        this._postLogoutredirectUri = postLogoutRedirectUri;
        this._navigateToLoginRequestUrl = navigateToLoginRequestUrl;
        this._loginInProgress = false;
        this._acquireTokenInProgress = false;
        this._renewStates = [];
        this._activeRenewals = {};
        this._cacheLocation = cacheLocation;
        if (!this._cacheLocations[cacheLocation]) {
            throw new Error('Cache Location is not valid. Provided value:' + this._cacheLocation + '.Possible values are: ' + this._cacheLocations.localStorage + ', ' + this._cacheLocations.sessionStorage);
        }
        this._cacheStorage = new Storage_1.Storage(this._cacheLocation);
        this._requestContext = new RequestContext_1.RequestContext("");
        this._openedWindows = [];
        window.msal = this;
        window.callBackMappedToRenewStates = {};
        window.callBacksMappedToRenewStates = {};
        var isCallback = this.isCallback(window.location.hash);
        if (isCallback) {
            var self = this;
            setTimeout(function () { self.handleAuthenticationResponse(window.location.hash); }, 0);
        }
    }
    Object.defineProperty(UserAgentApplication.prototype, "cacheLocation", {
        get: function () {
            return this._cacheLocation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserAgentApplication.prototype, "authority", {
        get: function () {
            return this.authorityInstance.CanonicalAuthority;
        },
        set: function (val) {
            this.authorityInstance = Authority_1.Authority.CreateInstance(val, this.validateAuthority);
        },
        enumerable: true,
        configurable: true
    });
    UserAgentApplication.prototype.loginRedirect = function (scopes, extraQueryParameters) {
        var _this = this;
        if (this._loginInProgress) {
            if (this._tokenReceivedCallback) {
                this._tokenReceivedCallback("Login is in progress", null, null, Constants_1.Constants.idToken);
                return;
            }
        }
        if (scopes) {
            var isValidScope = this.validateInputScope(scopes);
            if (isValidScope && !Utils_1.Utils.isEmpty(isValidScope)) {
                if (this._tokenReceivedCallback) {
                    this._tokenReceivedCallback(isValidScope, null, null, Constants_1.Constants.idToken);
                    return;
                }
            }
            scopes = this.filterScopes(scopes);
        }
        this.authorityInstance.ResolveEndpointsAsync()
            .then(function () {
            var authenticationRequest = new AuthenticationRequestParameters_1.AuthenticationRequestParameters(_this.authorityInstance, _this.clientId, scopes, ResponseTypes.id_token, _this._redirectUri);
            if (extraQueryParameters) {
                authenticationRequest.extraQueryParameters = extraQueryParameters;
            }
            _this._cacheStorage.setItem(Constants_1.Constants.loginRequest, window.location.href);
            _this._cacheStorage.setItem(Constants_1.Constants.loginError, "");
            _this._cacheStorage.setItem(Constants_1.Constants.stateLogin, authenticationRequest.state);
            _this._cacheStorage.setItem(Constants_1.Constants.nonceIdToken, authenticationRequest.nonce);
            _this._cacheStorage.setItem(Constants_1.Constants.msalError, "");
            _this._cacheStorage.setItem(Constants_1.Constants.msalErrorDescription, "");
            var authorityKey = Constants_1.Constants.authority + Constants_1.Constants.resourceDelimeter + authenticationRequest.state;
            if (Utils_1.Utils.isEmpty(_this._cacheStorage.getItem(authorityKey))) {
                _this._cacheStorage.setItem(authorityKey, _this.authority);
            }
            var urlNavigate = authenticationRequest.createNavigateUrl(scopes) + "&prompt=select_account" + "&response_mode=fragment";
            _this._loginInProgress = true;
            _this._requestType = Constants_1.Constants.login;
            _this.promptUser(urlNavigate);
        });
    };
    UserAgentApplication.prototype.loginPopup = function (scopes, extraQueryParameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._interactionMode = _this._interactionModes.popUp;
            if (_this._loginInProgress) {
                reject(Constants_1.ErrorCodes.loginProgressError + ':' + Constants_1.ErrorDescription.loginProgressError);
                return;
            }
            if (scopes) {
                var isValidScope = _this.validateInputScope(scopes);
                if (isValidScope && !Utils_1.Utils.isEmpty(isValidScope)) {
                    reject(Constants_1.ErrorCodes.inputScopesError + ':' + Constants_1.ErrorDescription.inputScopesError);
                    return;
                }
                scopes = _this.filterScopes(scopes);
            }
            else {
                scopes = [_this.clientId];
            }
            var scope = scopes.join(" ").toLowerCase();
            var popUpWindow = _this.openWindow('about:blank', '_blank', 1, _this, resolve, reject);
            if (!popUpWindow) {
                return;
            }
            _this.authorityInstance.ResolveEndpointsAsync().then(function () {
                var authenticationRequest = new AuthenticationRequestParameters_1.AuthenticationRequestParameters(_this.authorityInstance, _this.clientId, scopes, ResponseTypes.id_token, _this._redirectUri);
                if (extraQueryParameters) {
                    authenticationRequest.extraQueryParameters = extraQueryParameters;
                }
                _this._cacheStorage.setItem(Constants_1.Constants.loginRequest, window.location.href);
                _this._cacheStorage.setItem(Constants_1.Constants.loginError, "");
                _this._cacheStorage.setItem(Constants_1.Constants.nonceIdToken, authenticationRequest.nonce);
                _this._cacheStorage.setItem(Constants_1.Constants.msalError, "");
                _this._cacheStorage.setItem(Constants_1.Constants.msalErrorDescription, "");
                var authorityKey = Constants_1.Constants.authority + Constants_1.Constants.resourceDelimeter + authenticationRequest.state;
                if (Utils_1.Utils.isEmpty(_this._cacheStorage.getItem(authorityKey))) {
                    _this._cacheStorage.setItem(authorityKey, _this.authority);
                }
                var urlNavigate = authenticationRequest.createNavigateUrl(scopes) + "&prompt=select_account" + "&response_mode=fragment";
                _this._renewStates.push(authenticationRequest.state);
                _this.registerCallback(authenticationRequest.state, scope, resolve, reject);
                _this._requestType = Constants_1.Constants.login;
                _this._loginInProgress = true;
                if (popUpWindow) {
                    popUpWindow.location.href = urlNavigate;
                }
            }, function () {
                _this._requestContext.logger.info(Constants_1.ErrorCodes.endpointResolutionError + ':' + Constants_1.ErrorDescription.endpointResolutionError);
                _this._cacheStorage.setItem(Constants_1.Constants.msalError, Constants_1.ErrorCodes.endpointResolutionError);
                _this._cacheStorage.setItem(Constants_1.Constants.msalErrorDescription, Constants_1.ErrorDescription.endpointResolutionError);
                if (reject) {
                    reject(Constants_1.ErrorCodes.endpointResolutionError + ':' + Constants_1.ErrorDescription.endpointResolutionError);
                }
                if (popUpWindow) {
                    popUpWindow.close();
                }
            });
        });
    };
    UserAgentApplication.prototype.promptUser = function (urlNavigate) {
        if (urlNavigate && !Utils_1.Utils.isEmpty(urlNavigate)) {
            this._requestContext.logger.info('Navigate to:' + urlNavigate);
            window.location.replace(urlNavigate);
        }
        else {
            this._requestContext.logger.info('Navigate url is empty');
        }
    };
    ;
    UserAgentApplication.prototype.openWindow = function (urlNavigate, title, interval, instance, resolve, reject) {
        var _this = this;
        var popupWindow = this.openPopup(urlNavigate, title, Constants_1.Constants.popUpWidth, Constants_1.Constants.popUpHeight);
        if (popupWindow == null) {
            instance._loginInProgress = false;
            instance._acquireTokenInProgress = false;
            this._requestContext.logger.info(Constants_1.ErrorCodes.popUpWindowError + ':' + Constants_1.ErrorDescription.popUpWindowError);
            this._cacheStorage.setItem(Constants_1.Constants.msalError, Constants_1.ErrorCodes.popUpWindowError);
            this._cacheStorage.setItem(Constants_1.Constants.msalErrorDescription, Constants_1.ErrorDescription.popUpWindowError);
            if (reject) {
                reject(Constants_1.ErrorCodes.popUpWindowError + ':' + Constants_1.ErrorDescription.popUpWindowError);
            }
            return null;
        }
        this._openedWindows.push(popupWindow);
        var pollTimer = window.setInterval(function () {
            if (popupWindow && popupWindow.closed && instance._loginInProgress) {
                instance._loginInProgress = false;
                instance._acquireTokenInProgress = false;
                if (reject) {
                    reject(Constants_1.ErrorCodes.userCancelledError + ':' + Constants_1.ErrorDescription.userCancelledError);
                }
                window.clearInterval(pollTimer);
            }
            try {
                var popUpWindowLocation = popupWindow.location;
                if (popUpWindowLocation.href.indexOf(_this._redirectUri) !== -1) {
                    window.clearInterval(pollTimer);
                    instance._loginInProgress = false;
                    instance._acquireTokenInProgress = false;
                    _this._requestContext.logger.info("Closing popup window");
                }
            }
            catch (e) {
            }
        }, interval);
        return popupWindow;
    };
    UserAgentApplication.prototype.logout = function () {
        this.clearCache();
        this._user = null;
        var logout = "";
        if (this._postLogoutredirectUri) {
            logout = 'post_logout_redirect_uri=' + encodeURIComponent(this._postLogoutredirectUri);
        }
        var urlNavigate = this.authority + "/oauth2/v2.0/logout?" + logout;
        this.promptUser(urlNavigate);
    };
    UserAgentApplication.prototype.clearCache = function () {
        this._renewStates = [];
        var accessTokenItems = this._cacheStorage.getAllAccessTokens(Constants_1.Constants.clientId, Constants_1.Constants.authority);
        for (var i = 0; i < accessTokenItems.length; i++) {
            this._cacheStorage.removeItem(JSON.stringify(accessTokenItems[i].key));
        }
        this._cacheStorage.removeAcquireTokenEntries(Constants_1.Constants.acquireTokenUser, Constants_1.Constants.renewStatus);
        this._cacheStorage.removeAcquireTokenEntries(Constants_1.Constants.authority + Constants_1.Constants.resourceDelimeter, Constants_1.Constants.renewStatus);
        this._cacheStorage.resetCacheItems();
    };
    UserAgentApplication.prototype.openPopup = function (urlNavigate, title, popUpWidth, popUpHeight) {
        try {
            var winLeft = window.screenLeft ? window.screenLeft : window.screenX;
            var winTop = window.screenTop ? window.screenTop : window.screenY;
            var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var left = ((width / 2) - (popUpWidth / 2)) + winLeft;
            var top_1 = ((height / 2) - (popUpHeight / 2)) + winTop;
            var popupWindow = window.open(urlNavigate, title, 'width=' + popUpWidth + ', height=' + popUpHeight + ', top=' + top_1 + ', left=' + left);
            if (popupWindow.focus) {
                popupWindow.focus();
            }
            return popupWindow;
        }
        catch (e) {
            this._requestContext.logger.error('error opening popup ' + e.message);
            this._loginInProgress = false;
            this._acquireTokenInProgress = false;
            return null;
        }
    };
    UserAgentApplication.prototype.validateInputScope = function (scopes) {
        if (!scopes || scopes.length < 1) {
            return "Scopes cannot be passed as an empty array";
        }
        if (!Array.isArray(scopes)) {
            throw new Error("API does not accept non-array scopes");
        }
        if (scopes.indexOf(this.clientId) > -1) {
            if (scopes.length > 1) {
                return "ClientId can only be provided as a single scope";
            }
        }
        return "";
    };
    UserAgentApplication.prototype.filterScopes = function (scopes) {
        scopes = scopes.filter(function (element) {
            return element !== "openid";
        });
        scopes = scopes.filter(function (element) {
            return element !== "profile";
        });
        return scopes;
    };
    UserAgentApplication.prototype.registerCallback = function (expectedState, scope, resolve, reject) {
        var _this = this;
        this._activeRenewals[scope] = expectedState;
        if (!window.callBacksMappedToRenewStates[expectedState]) {
            window.callBacksMappedToRenewStates[expectedState] = [];
        }
        window.callBacksMappedToRenewStates[expectedState].push({ resolve: resolve, reject: reject });
        if (!window.callBackMappedToRenewStates[expectedState]) {
            window.callBackMappedToRenewStates[expectedState] =
                function (errorDesc, token, error, tokenType) {
                    _this._activeRenewals[scope] = null;
                    for (var i = 0; i < window.callBacksMappedToRenewStates[expectedState].length; ++i) {
                        try {
                            if (errorDesc || error) {
                                window.callBacksMappedToRenewStates[expectedState][i].reject(errorDesc + ": " + error);
                                ;
                            }
                            else if (token) {
                                window.callBacksMappedToRenewStates[expectedState][i].resolve(token);
                            }
                        }
                        catch (e) {
                            _this._requestContext.logger.warning(e);
                        }
                    }
                    window.callBacksMappedToRenewStates[expectedState] = null;
                    window.callBackMappedToRenewStates[expectedState] = null;
                };
        }
    };
    UserAgentApplication.prototype.getCachedToken = function (authenticationRequest, user) {
        var accessTokenCacheItem = null;
        var scopes = authenticationRequest.scopes;
        var tokenCacheItems = this._cacheStorage.getAllAccessTokens(this.clientId, user.userIdentifier);
        if (tokenCacheItems.length === 0) {
            return null;
        }
        var filteredItems = [];
        if (!authenticationRequest.authority) {
            for (var i = 0; i < tokenCacheItems.length; i++) {
                var cacheItem = tokenCacheItems[i];
                var cachedScopes = cacheItem.key.scopes.split(" ");
                if (Utils_1.Utils.containsScope(cachedScopes, scopes)) {
                    filteredItems.push(cacheItem);
                }
            }
            if (filteredItems.length === 1) {
                accessTokenCacheItem = filteredItems[0];
                authenticationRequest.authorityInstance = Authority_1.Authority.CreateInstance(accessTokenCacheItem.key.authority, this.validateAuthority);
            }
            else if (filteredItems.length > 1) {
                return {
                    errorDesc: "The cache contains multiple tokens satisfying the requirements. Call AcquireToken again providing more requirements like authority",
                    token: null,
                    error: "multiple_matching_tokens_detected"
                };
            }
            else {
                var authorityList = this.getUniqueAuthority(tokenCacheItems, 'authority');
                if (authorityList.length > 1) {
                    return {
                        errorDesc: "Multiple authorities found in the cache. Pass authority in the API overload.",
                        token: null,
                        error: "multiple_matching_tokens_detected"
                    };
                }
                authenticationRequest.authorityInstance = Authority_1.Authority.CreateInstance(authorityList[0], this.validateAuthority);
            }
        }
        else {
            for (var i = 0; i < tokenCacheItems.length; i++) {
                var cacheItem = tokenCacheItems[i];
                var cachedScopes = cacheItem.key.scopes.split(" ");
                if (Utils_1.Utils.containsScope(cachedScopes, scopes) && cacheItem.key.authority === authenticationRequest.authority) {
                    filteredItems.push(cacheItem);
                }
            }
            if (filteredItems.length === 0) {
                return null;
            }
            else if (filteredItems.length === 1) {
                accessTokenCacheItem = filteredItems[0];
            }
            else {
                return {
                    errorDesc: "The cache contains multiple tokens satisfying the requirements.Call AcquireToken again providing more requirements like authority",
                    token: null,
                    error: "multiple_matching_tokens_detected"
                };
            }
        }
        if (accessTokenCacheItem != null) {
            var expired = Number(accessTokenCacheItem.value.expiresIn);
            var offset = this._clockSkew || 300;
            if (expired && (expired > Utils_1.Utils.now() + offset)) {
                return {
                    errorDesc: null,
                    token: accessTokenCacheItem.value.accessToken,
                    error: null
                };
            }
            else {
                this._cacheStorage.removeItem(JSON.stringify(filteredItems[0].key));
                return null;
            }
        }
        else {
            return null;
        }
    };
    UserAgentApplication.prototype.getAllUsers = function () {
        var users = [];
        var accessTokenCacheItems = this._cacheStorage.getAllAccessTokens(Constants_1.Constants.clientId, Constants_1.Constants.authority);
        for (var i = 0; i < accessTokenCacheItems.length; i++) {
            var idToken = new IdToken_1.IdToken(accessTokenCacheItems[i].value.idToken);
            var clientInfo = new ClientInfo_1.ClientInfo(accessTokenCacheItems[i].value.clientInfo);
            var user = User_1.User.createUser(idToken, clientInfo, this.authority);
            users.push(user);
        }
        return this.getUniqueUsers(users);
    };
    UserAgentApplication.prototype.getUniqueUsers = function (users) {
        if (!users || users.length <= 1) {
            return users;
        }
        var flags = [];
        var uniqueUsers = [];
        for (var index = 0; index < users.length; ++index) {
            if (users[index].userIdentifier && flags.indexOf(users[index].userIdentifier) === -1) {
                flags.push(users[index].userIdentifier);
                uniqueUsers.push(users[index]);
            }
        }
        return uniqueUsers;
    };
    UserAgentApplication.prototype.getUniqueAuthority = function (accessTokenCacheItems, property) {
        var authorityList = [];
        var flags = [];
        accessTokenCacheItems.forEach(function (element) {
            if (element.key.hasOwnProperty(property) && (flags.indexOf(element.key[property]) === -1)) {
                flags.push(element.key[property]);
                authorityList.push(element.key[property]);
            }
        });
        return authorityList;
    };
    UserAgentApplication.prototype.addHintParameters = function (urlNavigate, user) {
        var userObject = user ? user : this._user;
        var decodedClientInfo = userObject.userIdentifier.split('.');
        var uid = Utils_1.Utils.base64DecodeStringUrlSafe(decodedClientInfo[0]);
        var utid = Utils_1.Utils.base64DecodeStringUrlSafe(decodedClientInfo[1]);
        if (userObject.displayableId && !Utils_1.Utils.isEmpty(userObject.displayableId)) {
            urlNavigate += '&login_hint=' + encodeURIComponent(user.displayableId);
        }
        if (!Utils_1.Utils.isEmpty(uid) && !Utils_1.Utils.isEmpty(utid)) {
            if (!this.urlContainsQueryStringParameter("domain_req", urlNavigate) && !Utils_1.Utils.isEmpty(utid)) {
                urlNavigate += '&domain_req=' + encodeURIComponent(utid);
            }
            if (!this.urlContainsQueryStringParameter("login_req", urlNavigate) && !Utils_1.Utils.isEmpty(uid)) {
                urlNavigate += '&login_req=' + encodeURIComponent(uid);
            }
            if (!this.urlContainsQueryStringParameter("domain_hint", urlNavigate) && !Utils_1.Utils.isEmpty(utid)) {
                if (utid === "9188040d-6c67-4c5b-b112-36a304b66dad") {
                    urlNavigate += '&domain_hint=' + encodeURIComponent("consumers");
                }
                else {
                    urlNavigate += '&domain_hint=' + encodeURIComponent("organizations");
                }
            }
        }
        return urlNavigate;
    };
    UserAgentApplication.prototype.urlContainsQueryStringParameter = function (name, url) {
        var regex = new RegExp("[\\?&]" + name + "=");
        return regex.test(url);
    };
    UserAgentApplication.prototype.acquireTokenRedirect = function (scopes, authority, user, extraQueryParameters) {
        var _this = this;
        var isValidScope = this.validateInputScope(scopes);
        if (isValidScope && !Utils_1.Utils.isEmpty(isValidScope)) {
            if (this._tokenReceivedCallback) {
                this._tokenReceivedCallback(isValidScope, null, null, Constants_1.Constants.accessToken);
                return;
            }
        }
        if (scopes) {
            scopes = this.filterScopes(scopes);
        }
        var userObject = user ? user : this._user;
        if (this._acquireTokenInProgress) {
            return;
        }
        var scope = scopes.join(" ").toLowerCase();
        if (!userObject) {
            if (this._tokenReceivedCallback) {
                this._tokenReceivedCallback(Constants_1.ErrorDescription.userLoginError, null, Constants_1.ErrorCodes.userLoginError, Constants_1.Constants.accessToken);
                return;
            }
        }
        this._acquireTokenInProgress = true;
        var authenticationRequest;
        var acquireTokenAuthority = authority ? Authority_1.Authority.CreateInstance(authority, this.validateAuthority) : this.authorityInstance;
        acquireTokenAuthority.ResolveEndpointsAsync().then(function () {
            if (Utils_1.Utils.compareObjects(userObject, _this._user)) {
                authenticationRequest = new AuthenticationRequestParameters_1.AuthenticationRequestParameters(acquireTokenAuthority, _this.clientId, scopes, ResponseTypes.token, _this._redirectUri);
            }
            else {
                authenticationRequest = new AuthenticationRequestParameters_1.AuthenticationRequestParameters(acquireTokenAuthority, _this.clientId, scopes, ResponseTypes.id_token_token, _this._redirectUri);
            }
            _this._cacheStorage.setItem(Constants_1.Constants.nonceIdToken, authenticationRequest.nonce);
            var acquireTokenUserKey = Constants_1.Constants.acquireTokenUser + Constants_1.Constants.resourceDelimeter + userObject.userIdentifier + Constants_1.Constants.resourceDelimeter + authenticationRequest.state;
            if (Utils_1.Utils.isEmpty(_this._cacheStorage.getItem(acquireTokenUserKey))) {
                _this._cacheStorage.setItem(acquireTokenUserKey, JSON.stringify(userObject));
            }
            var authorityKey = Constants_1.Constants.authority + Constants_1.Constants.resourceDelimeter + authenticationRequest.state;
            if (Utils_1.Utils.isEmpty(_this._cacheStorage.getItem(authorityKey))) {
                _this._cacheStorage.setItem(authorityKey, acquireTokenAuthority.CanonicalAuthority);
            }
            if (extraQueryParameters) {
                authenticationRequest.extraQueryParameters = extraQueryParameters;
            }
            var urlNavigate = authenticationRequest.createNavigateUrl(scopes) + "&prompt=select_account" + "&response_mode=fragment";
            urlNavigate = _this.addHintParameters(urlNavigate, userObject);
            if (urlNavigate) {
                _this._cacheStorage.setItem(Constants_1.Constants.stateAcquireToken, authenticationRequest.state);
                _this._requestType = Constants_1.Constants.renewToken;
                window.location.replace(urlNavigate);
            }
        });
    };
    UserAgentApplication.prototype.acquireTokenPopup = function (scopes, authority, user, extraQueryParameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._interactionMode = _this._interactionModes.popUp;
            var isValidScope = _this.validateInputScope(scopes);
            if (isValidScope && !Utils_1.Utils.isEmpty(isValidScope)) {
                reject(Constants_1.ErrorCodes.inputScopesError + ':' + isValidScope);
            }
            if (scopes) {
                scopes = _this.filterScopes(scopes);
            }
            var userObject = user ? user : _this._user;
            if (_this._acquireTokenInProgress) {
                reject(Constants_1.ErrorCodes.acquireTokenProgressError + ':' + Constants_1.ErrorDescription.acquireTokenProgressError);
                return;
            }
            var scope = scopes.join(" ").toLowerCase();
            if (!userObject) {
                reject(Constants_1.ErrorCodes.userLoginError + ':' + Constants_1.ErrorDescription.userLoginError);
                return;
            }
            _this._acquireTokenInProgress = true;
            var authenticationRequest;
            var acquireTokenAuthority = authority ? Authority_1.Authority.CreateInstance(authority, _this.validateAuthority) : _this.authorityInstance;
            var popUpWindow = _this.openWindow('about:blank', '_blank', 1, _this, resolve, reject);
            if (!popUpWindow) {
                return;
            }
            acquireTokenAuthority.ResolveEndpointsAsync().then(function () {
                if (Utils_1.Utils.compareObjects(userObject, _this._user)) {
                    if (scopes.indexOf(_this.clientId) > -1) {
                        authenticationRequest = new AuthenticationRequestParameters_1.AuthenticationRequestParameters(acquireTokenAuthority, _this.clientId, scopes, ResponseTypes.id_token, _this._redirectUri);
                    }
                    else {
                        authenticationRequest = new AuthenticationRequestParameters_1.AuthenticationRequestParameters(acquireTokenAuthority, _this.clientId, scopes, ResponseTypes.token, _this._redirectUri);
                    }
                }
                else {
                    authenticationRequest = new AuthenticationRequestParameters_1.AuthenticationRequestParameters(acquireTokenAuthority, _this.clientId, scopes, ResponseTypes.id_token_token, _this._redirectUri);
                }
                _this._cacheStorage.setItem(Constants_1.Constants.nonceIdToken, authenticationRequest.nonce);
                authenticationRequest.state = authenticationRequest.state;
                var acquireTokenUserKey = Constants_1.Constants.acquireTokenUser + Constants_1.Constants.resourceDelimeter + userObject.userIdentifier + Constants_1.Constants.resourceDelimeter + authenticationRequest.state;
                if (Utils_1.Utils.isEmpty(_this._cacheStorage.getItem(acquireTokenUserKey))) {
                    _this._cacheStorage.setItem(acquireTokenUserKey, JSON.stringify(userObject));
                }
                var authorityKey = Constants_1.Constants.authority + Constants_1.Constants.resourceDelimeter + authenticationRequest.state;
                if (Utils_1.Utils.isEmpty(_this._cacheStorage.getItem(authorityKey))) {
                    _this._cacheStorage.setItem(authorityKey, acquireTokenAuthority.CanonicalAuthority);
                }
                if (extraQueryParameters) {
                    authenticationRequest.extraQueryParameters = extraQueryParameters;
                }
                var urlNavigate = authenticationRequest.createNavigateUrl(scopes) + "&prompt=select_account" + "&response_mode=fragment";
                urlNavigate = _this.addHintParameters(urlNavigate, userObject);
                _this._renewStates.push(authenticationRequest.state);
                _this.registerCallback(authenticationRequest.state, scope, resolve, reject);
                _this._requestType = Constants_1.Constants.renewToken;
                if (popUpWindow) {
                    popUpWindow.location.href = urlNavigate;
                }
            }, function () {
                _this._requestContext.logger.info(Constants_1.ErrorCodes.endpointResolutionError + ':' + Constants_1.ErrorDescription.endpointResolutionError);
                _this._cacheStorage.setItem(Constants_1.Constants.msalError, Constants_1.ErrorCodes.endpointResolutionError);
                _this._cacheStorage.setItem(Constants_1.Constants.msalErrorDescription, Constants_1.ErrorDescription.endpointResolutionError);
                if (reject) {
                    reject(Constants_1.ErrorCodes.endpointResolutionError + ':' + Constants_1.ErrorDescription.endpointResolutionError);
                }
                if (popUpWindow)
                    popUpWindow.close();
            });
        });
    };
    UserAgentApplication.prototype.acquireTokenSilent = function (scopes, authority, user, extraQueryParameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var isValidScope = _this.validateInputScope(scopes);
            if (isValidScope && !Utils_1.Utils.isEmpty(isValidScope)) {
                reject(Constants_1.ErrorCodes.inputScopesError + ':' + isValidScope);
            }
            else {
                if (scopes) {
                    scopes = _this.filterScopes(scopes);
                }
                var scope_1 = scopes.join(" ").toLowerCase();
                var userObject_1 = user ? user : _this._user;
                if (!userObject_1) {
                    reject(Constants_1.ErrorCodes.userLoginError + ':' + Constants_1.ErrorDescription.userLoginError);
                    return;
                }
                var authenticationRequest_1;
                var newAuthority = authority ? Authority_1.Authority.CreateInstance(authority, _this.validateAuthority) : _this.authorityInstance;
                if (Utils_1.Utils.compareObjects(userObject_1, _this._user)) {
                    if (scopes.indexOf(_this.clientId) > -1) {
                        authenticationRequest_1 = new AuthenticationRequestParameters_1.AuthenticationRequestParameters(newAuthority, _this.clientId, scopes, ResponseTypes.id_token, _this._redirectUri);
                    }
                    else {
                        authenticationRequest_1 = new AuthenticationRequestParameters_1.AuthenticationRequestParameters(newAuthority, _this.clientId, scopes, ResponseTypes.token, _this._redirectUri);
                    }
                }
                else {
                    authenticationRequest_1 = new AuthenticationRequestParameters_1.AuthenticationRequestParameters(newAuthority, _this.clientId, scopes, ResponseTypes.id_token_token, _this._redirectUri);
                }
                var cacheResult = _this.getCachedToken(authenticationRequest_1, userObject_1);
                if (cacheResult) {
                    if (cacheResult.token) {
                        _this._requestContext.logger.info('Token is already in cache for scope:' + scope_1);
                        resolve(cacheResult.token);
                        return;
                    }
                    else if (cacheResult.errorDesc || cacheResult.error) {
                        _this._requestContext.logger.info(cacheResult.errorDesc + ":" + cacheResult.error);
                        reject(cacheResult.errorDesc + ": " + cacheResult.error);
                        return;
                    }
                }
                _this._requestType = Constants_1.Constants.renewToken;
                return _this.authorityInstance.ResolveEndpointsAsync()
                    .then(function () {
                    if (_this._activeRenewals[scope_1]) {
                        _this.registerCallback(_this._activeRenewals[scope_1], scope_1, resolve, reject);
                    }
                    else {
                        if (scopes && scopes.indexOf(_this.clientId) > -1 && scopes.length === 1) {
                            _this._requestContext.logger.verbose("renewing idToken");
                            _this.renewIdToken(scopes, resolve, reject, userObject_1, authenticationRequest_1, extraQueryParameters);
                        }
                        else {
                            _this._requestContext.logger.verbose("renewing accesstoken");
                            _this.renewToken(scopes, resolve, reject, userObject_1, authenticationRequest_1, extraQueryParameters);
                        }
                    }
                });
            }
        });
    };
    UserAgentApplication.prototype.loadFrameTimeout = function (urlNavigate, frameName, scope) {
        var _this = this;
        this._requestContext.logger.verbose('Set loading state to pending for: ' + scope);
        this._cacheStorage.setItem(Constants_1.Constants.renewStatus + scope, Constants_1.Constants.tokenRenewStatusInProgress);
        this.loadFrame(urlNavigate, frameName);
        setTimeout(function () {
            if (_this._cacheStorage.getItem(Constants_1.Constants.renewStatus + scope) === Constants_1.Constants.tokenRenewStatusInProgress) {
                _this._requestContext.logger.verbose('Loading frame has timed out after: ' + (Constants_1.Constants.loadFrameTimeout / 1000) + ' seconds for scope ' + scope);
                var expectedState = _this._activeRenewals[scope];
                if (expectedState && window.callBackMappedToRenewStates[expectedState])
                    window.callBackMappedToRenewStates[expectedState]("Token renewal operation failed due to timeout", null, null, Constants_1.Constants.accessToken);
                _this._cacheStorage.setItem(Constants_1.Constants.renewStatus + scope, Constants_1.Constants.tokenRenewStatusCancelled);
            }
        }, Constants_1.Constants.loadFrameTimeout);
    };
    UserAgentApplication.prototype.loadFrame = function (urlNavigate, frameName) {
        var _this = this;
        this._requestContext.logger.info('LoadFrame: ' + frameName);
        var frameCheck = frameName;
        setTimeout(function () {
            var frameHandle = _this.addAdalFrame(frameCheck);
            if (frameHandle.src === "" || frameHandle.src === "about:blank") {
                frameHandle.src = urlNavigate;
            }
        }, 500);
    };
    UserAgentApplication.prototype.addAdalFrame = function (iframeId) {
        if (typeof iframeId === "undefined") {
            return null;
        }
        this._requestContext.logger.info('Add msal frame to document:' + iframeId);
        var adalFrame = document.getElementById(iframeId);
        if (!adalFrame) {
            if (document.createElement &&
                document.documentElement &&
                (window.navigator.userAgent.indexOf("MSIE 5.0") === -1)) {
                var ifr = document.createElement("iframe");
                ifr.setAttribute("id", iframeId);
                ifr.style.visibility = "hidden";
                ifr.style.position = "absolute";
                ifr.style.width = ifr.style.height = "0";
                adalFrame = document.getElementsByTagName("body")[0].appendChild(ifr);
            }
            else if (document.body && document.body.insertAdjacentHTML) {
                document.body.insertAdjacentHTML('beforeend', '<iframe name="' + iframeId + '" id="' + iframeId + '" style="display:none"></iframe>');
            }
            if (window.frames && window.frames[iframeId]) {
                adalFrame = window.frames[iframeId];
            }
        }
        return adalFrame;
    };
    UserAgentApplication.prototype.renewToken = function (scopes, resolve, reject, user, authenticationRequest, extraQueryParameters) {
        var scope = scopes.join(" ").toLowerCase();
        this._requestContext.logger.verbose('renewToken is called for scope:' + scope);
        var frameHandle = this.addAdalFrame('msalRenewFrame' + scope);
        if (extraQueryParameters) {
            authenticationRequest.extraQueryParameters = extraQueryParameters;
        }
        var acquireTokenUserKey = Constants_1.Constants.acquireTokenUser + Constants_1.Constants.resourceDelimeter + user.userIdentifier + Constants_1.Constants.resourceDelimeter + authenticationRequest.state;
        if (Utils_1.Utils.isEmpty(this._cacheStorage.getItem(acquireTokenUserKey))) {
            this._cacheStorage.setItem(acquireTokenUserKey, JSON.stringify(user));
        }
        var authorityKey = Constants_1.Constants.authority + Constants_1.Constants.resourceDelimeter + authenticationRequest.state;
        if (Utils_1.Utils.isEmpty(this._cacheStorage.getItem(authorityKey))) {
            this._cacheStorage.setItem(authorityKey, authenticationRequest.authority);
        }
        this._cacheStorage.setItem(Constants_1.Constants.nonceIdToken, authenticationRequest.nonce);
        this._requestContext.logger.verbose('Renew token Expected state: ' + authenticationRequest.state);
        var urlNavigate = authenticationRequest.createNavigateUrl(scopes) + "&prompt=none";
        urlNavigate = this.addHintParameters(urlNavigate, user);
        this._renewStates.push(authenticationRequest.state);
        this.registerCallback(authenticationRequest.state, scope, resolve, reject);
        this._requestContext.logger.infoPii('Navigate to:' + urlNavigate);
        frameHandle.src = "about:blank";
        this.loadFrameTimeout(urlNavigate, 'msalRenewFrame' + scope, scope);
    };
    UserAgentApplication.prototype.renewIdToken = function (scopes, resolve, reject, user, authenticationRequest, extraQueryParameters) {
        var scope = scopes.join(" ").toLowerCase();
        this._requestContext.logger.info('renewidToken is called');
        var frameHandle = this.addAdalFrame("msalIdTokenFrame");
        if (extraQueryParameters) {
            authenticationRequest.extraQueryParameters = extraQueryParameters;
        }
        var acquireTokenUserKey = Constants_1.Constants.acquireTokenUser + Constants_1.Constants.resourceDelimeter + user.userIdentifier + Constants_1.Constants.resourceDelimeter + authenticationRequest.state;
        if (Utils_1.Utils.isEmpty(this._cacheStorage.getItem(acquireTokenUserKey))) {
            this._cacheStorage.setItem(acquireTokenUserKey, JSON.stringify(user));
        }
        var authorityKey = Constants_1.Constants.authority + Constants_1.Constants.resourceDelimeter + authenticationRequest.state;
        if (Utils_1.Utils.isEmpty(this._cacheStorage.getItem(authorityKey))) {
            this._cacheStorage.setItem(authorityKey, authenticationRequest.authority);
        }
        this._cacheStorage.setItem(Constants_1.Constants.nonceIdToken, authenticationRequest.nonce);
        this._requestContext.logger.verbose('Renew Idtoken Expected state: ' + authenticationRequest.state);
        var urlNavigate = authenticationRequest.createNavigateUrl(scopes) + "&prompt=none";
        urlNavigate = this.addHintParameters(urlNavigate, user);
        this._renewStates.push(authenticationRequest.state);
        this.registerCallback(authenticationRequest.state, this.clientId, resolve, reject);
        this._requestContext.logger.infoPii('Navigate to:' + urlNavigate);
        frameHandle.src = "about:blank";
        this.loadFrameTimeout(urlNavigate, "msalIdTokenFrame", this.clientId);
    };
    UserAgentApplication.prototype.getUser = function () {
        if (this._user) {
            return this._user;
        }
        var rawIdToken = this._cacheStorage.getItem(Constants_1.Constants.idTokenKey);
        var rawClientInfo = this._cacheStorage.getItem(Constants_1.Constants.msalClientInfo);
        if (!Utils_1.Utils.isEmpty(rawIdToken) && !Utils_1.Utils.isEmpty(rawClientInfo)) {
            var idToken = new IdToken_1.IdToken(rawIdToken);
            var clientInfo = new ClientInfo_1.ClientInfo(rawClientInfo);
            this._user = User_1.User.createUser(idToken, clientInfo, this.authority);
            return this._user;
        }
        return null;
    };
    ;
    UserAgentApplication.prototype.handleAuthenticationResponse = function (hash) {
        if (hash == null) {
            hash = window.location.hash;
        }
        var self = null;
        if (window.opener && window.opener.msal) {
            self = window.opener.msal;
        }
        else if (window.parent && window.parent.msal) {
            self = window.parent.msal;
        }
        if (self.isCallback(hash)) {
            var requestInfo = self.getRequestInfo(hash);
            self._requestContext.logger.info("Returned from redirect url");
            self.saveTokenFromHash(requestInfo);
            var token = null, tokenReceivedCallback = null, tokenType = void 0;
            if (window.parent !== window && window.parent.callBackMappedToRenewStates[requestInfo.stateResponse])
                tokenReceivedCallback = window.parent.callBackMappedToRenewStates[requestInfo.stateResponse];
            else if (window.opener && window.opener.msal && window.opener.callBackMappedToRenewStates[requestInfo.stateResponse])
                tokenReceivedCallback = window.opener.callBackMappedToRenewStates[requestInfo.stateResponse];
            else
                tokenReceivedCallback = self._tokenReceivedCallback;
            if ((requestInfo.requestType === Constants_1.Constants.renewToken) && window.parent) {
                if (self.isInIframe())
                    self._requestContext.logger.verbose("Window is in iframe, acquiring token silently");
                else
                    self._requestContext.logger.verbose("acquiring token interactive in progress");
                token = requestInfo.parameters[Constants_1.Constants.accessToken] || requestInfo.parameters[Constants_1.Constants.idToken];
                tokenType = Constants_1.Constants.accessToken;
            }
            else if (requestInfo.requestType === Constants_1.Constants.login) {
                token = requestInfo.parameters[Constants_1.Constants.idToken];
                tokenType = Constants_1.Constants.idToken;
            }
            var errorDesc = requestInfo.parameters[Constants_1.Constants.errorDescription];
            var error = requestInfo.parameters[Constants_1.Constants.error];
            try {
                if (tokenReceivedCallback) {
                    tokenReceivedCallback(errorDesc, token, error, tokenType);
                }
            }
            catch (err) {
                self._requestContext.logger.error('Error occurred in token received callback function: ' + err);
            }
            for (var i = 0; i < self._openedWindows.length; i++) {
                self._openedWindows[i].close();
            }
            if (self._interactionMode !== self._interactionModes.popUp) {
                window.location.hash = "";
                if (self._navigateToLoginRequestUrl && window.location.href.replace("#", "") !== self._cacheStorage.getItem(Constants_1.Constants.loginRequest))
                    window.location.href = self._cacheStorage.getItem(Constants_1.Constants.loginRequest);
            }
        }
    };
    UserAgentApplication.prototype.saveAccessToken = function (authority, tokenResponse, user, clientInfo, idToken) {
        var scope;
        var clientObj = new ClientInfo_1.ClientInfo(clientInfo);
        if (tokenResponse.parameters.hasOwnProperty("scope")) {
            scope = tokenResponse.parameters["scope"];
            var consentedScopes = scope.split(" ");
            var accessTokenCacheItems = this._cacheStorage.getAllAccessTokens(this.clientId, authority);
            for (var i = 0; i < accessTokenCacheItems.length; i++) {
                var accessTokenCacheItem = accessTokenCacheItems[i];
                if (accessTokenCacheItem.key.userIdentifier === user.userIdentifier) {
                    var cachedScopes = accessTokenCacheItem.key.scopes.split(" ");
                    if (Utils_1.Utils.isIntersectingScopes(cachedScopes, consentedScopes))
                        this._cacheStorage.removeItem(JSON.stringify(accessTokenCacheItem.key));
                }
            }
            var accessTokenKey = new AccessTokenKey_1.AccessTokenKey(authority, this.clientId, scope, clientObj.uid, clientObj.utid);
            var accessTokenValue = new AccessTokenValue_1.AccessTokenValue(tokenResponse.parameters[Constants_1.Constants.accessToken], idToken.rawIdToken, Utils_1.Utils.expiresIn(tokenResponse.parameters[Constants_1.Constants.expiresIn]).toString(), clientInfo);
            this._cacheStorage.setItem(JSON.stringify(accessTokenKey), JSON.stringify(accessTokenValue));
        }
        else {
            scope = this.clientId;
            var accessTokenKey = new AccessTokenKey_1.AccessTokenKey(authority, this.clientId, scope, clientObj.uid, clientObj.utid);
            var accessTokenValue = new AccessTokenValue_1.AccessTokenValue(tokenResponse.parameters[Constants_1.Constants.idToken], tokenResponse.parameters[Constants_1.Constants.idToken], idToken.expiration, clientInfo);
            this._cacheStorage.setItem(JSON.stringify(accessTokenKey), JSON.stringify(accessTokenValue));
        }
    };
    UserAgentApplication.prototype.saveTokenFromHash = function (tokenResponse) {
        this._requestContext.logger.info('State status:' + tokenResponse.stateMatch + '; Request type:' + tokenResponse.requestType);
        this._cacheStorage.setItem(Constants_1.Constants.msalError, "");
        this._cacheStorage.setItem(Constants_1.Constants.msalErrorDescription, "");
        var scope = '';
        if (tokenResponse.parameters.hasOwnProperty("scope")) {
            scope = tokenResponse.parameters["scope"];
        }
        else {
            scope = this.clientId;
        }
        if (tokenResponse.parameters.hasOwnProperty(Constants_1.Constants.errorDescription) || tokenResponse.parameters.hasOwnProperty(Constants_1.Constants.error)) {
            this._requestContext.logger.info('Error :' + tokenResponse.parameters[Constants_1.Constants.error] + '; Error description:' + tokenResponse.parameters[Constants_1.Constants.errorDescription]);
            this._cacheStorage.setItem(Constants_1.Constants.msalError, tokenResponse.parameters["error"]);
            this._cacheStorage.setItem(Constants_1.Constants.msalErrorDescription, tokenResponse.parameters[Constants_1.Constants.errorDescription]);
            if (tokenResponse.requestType === Constants_1.Constants.login) {
                this._loginInProgress = false;
                this._cacheStorage.setItem(Constants_1.Constants.loginError, tokenResponse.parameters[Constants_1.Constants.errorDescription] + ':' + tokenResponse.parameters[Constants_1.Constants.error]);
            }
            if (tokenResponse.requestType === Constants_1.Constants.renewToken) {
                this._acquireTokenInProgress = false;
            }
        }
        else {
            if (tokenResponse.stateMatch) {
                this._requestContext.logger.info("State is right");
                if (tokenResponse.parameters.hasOwnProperty(Constants_1.Constants.sessionState))
                    this._cacheStorage.setItem(Constants_1.Constants.msalSessionState, tokenResponse.parameters[Constants_1.Constants.sessionState]);
                var idToken;
                var clientInfo = '';
                if (tokenResponse.parameters.hasOwnProperty(Constants_1.Constants.accessToken)) {
                    this._requestContext.logger.info("Fragment has access token");
                    this._acquireTokenInProgress = false;
                    var user = void 0;
                    if (tokenResponse.parameters.hasOwnProperty(Constants_1.Constants.idToken)) {
                        idToken = new IdToken_1.IdToken(tokenResponse.parameters[Constants_1.Constants.idToken]);
                    }
                    else {
                        idToken = new IdToken_1.IdToken(this._cacheStorage.getItem(Constants_1.Constants.idTokenKey));
                    }
                    var authorityKey = Constants_1.Constants.authority + Constants_1.Constants.resourceDelimeter + tokenResponse.stateResponse;
                    var authority = void 0;
                    if (!Utils_1.Utils.isEmpty(this._cacheStorage.getItem(authorityKey))) {
                        authority = this._cacheStorage.getItem(authorityKey);
                        authority = Utils_1.Utils.replaceFirstPath(authority, idToken.tenantId);
                    }
                    if (tokenResponse.parameters.hasOwnProperty(Constants_1.Constants.clientInfo)) {
                        clientInfo = tokenResponse.parameters[Constants_1.Constants.clientInfo];
                        user = User_1.User.createUser(idToken, new ClientInfo_1.ClientInfo(clientInfo), authority);
                    }
                    else {
                        this._requestContext.logger.warning("ClientInfo not received in the response from AAD");
                        user = User_1.User.createUser(idToken, new ClientInfo_1.ClientInfo(clientInfo), authority);
                    }
                    var acquireTokenUserKey = Constants_1.Constants.acquireTokenUser + Constants_1.Constants.resourceDelimeter + user.userIdentifier + Constants_1.Constants.resourceDelimeter + tokenResponse.stateResponse;
                    var acquireTokenUser = void 0;
                    if (!Utils_1.Utils.isEmpty(this._cacheStorage.getItem(acquireTokenUserKey))) {
                        acquireTokenUser = JSON.parse(this._cacheStorage.getItem(acquireTokenUserKey));
                        if (user && acquireTokenUser && Utils_1.Utils.compareObjects(user, acquireTokenUser)) {
                            this.saveAccessToken(authority, tokenResponse, user, clientInfo, idToken);
                            this._requestContext.logger.info("The user object received in the response is the same as the one passed in the acquireToken request");
                        }
                        else {
                            this._requestContext.logger.warning("The user object created from the response is not the same as the one passed in the acquireToken request");
                        }
                    }
                }
                if (tokenResponse.parameters.hasOwnProperty(Constants_1.Constants.idToken)) {
                    if (scope.indexOf(this.clientId) > -1) {
                        this._requestContext.logger.info("Fragment has id token");
                        this._loginInProgress = false;
                        idToken = new IdToken_1.IdToken(tokenResponse.parameters[Constants_1.Constants.idToken]);
                        if (tokenResponse.parameters.hasOwnProperty(Constants_1.Constants.clientInfo)) {
                            clientInfo = tokenResponse.parameters[Constants_1.Constants.clientInfo];
                        }
                        else {
                            this._requestContext.logger.warning("ClientInfo not received in the response from AAD");
                        }
                        var authorityKey = Constants_1.Constants.authority + Constants_1.Constants.resourceDelimeter + tokenResponse.stateResponse;
                        var authority = void 0;
                        if (!Utils_1.Utils.isEmpty(this._cacheStorage.getItem(authorityKey))) {
                            authority = this._cacheStorage.getItem(authorityKey);
                            authority = Utils_1.Utils.replaceFirstPath(authority, idToken.tenantId);
                        }
                        this._user = User_1.User.createUser(idToken, new ClientInfo_1.ClientInfo(clientInfo), authority);
                        if (idToken && idToken.nonce) {
                            if (idToken.nonce !== this._cacheStorage.getItem(Constants_1.Constants.nonceIdToken)) {
                                this._user = null;
                                this._cacheStorage.setItem(Constants_1.Constants.loginError, 'Nonce Mismatch.Expected: ' + this._cacheStorage.getItem(Constants_1.Constants.nonceIdToken) + ',' + 'Actual: ' + idToken.nonce);
                            }
                            else {
                                this._cacheStorage.setItem(Constants_1.Constants.idTokenKey, tokenResponse.parameters[Constants_1.Constants.idToken]);
                                this._cacheStorage.setItem(Constants_1.Constants.msalClientInfo, clientInfo);
                                this.saveAccessToken(authority, tokenResponse, this._user, clientInfo, idToken);
                            }
                        }
                        else {
                            this._cacheStorage.setItem(Constants_1.Constants.msalError, 'invalid idToken');
                            this._cacheStorage.setItem(Constants_1.Constants.msalErrorDescription, 'Invalid idToken. idToken: ' + tokenResponse.parameters[Constants_1.Constants.idToken]);
                        }
                    }
                }
            }
            else {
                this._cacheStorage.setItem(Constants_1.Constants.msalError, 'Invalid_state');
                this._cacheStorage.setItem(Constants_1.Constants.msalErrorDescription, 'Invalid_state. state: ' + tokenResponse.stateResponse);
            }
        }
        this._cacheStorage.setItem(Constants_1.Constants.renewStatus + scope, Constants_1.Constants.tokenRenewStatusCompleted);
        this._cacheStorage.removeAcquireTokenEntries(Constants_1.Constants.acquireTokenUser, Constants_1.Constants.renewStatus);
        this._cacheStorage.removeAcquireTokenEntries(Constants_1.Constants.authority + Constants_1.Constants.resourceDelimeter, Constants_1.Constants.renewStatus);
    };
    ;
    UserAgentApplication.prototype.isCallback = function (hash) {
        hash = this.getHash(hash);
        var parameters = Utils_1.Utils.deserialize(hash);
        return (parameters.hasOwnProperty(Constants_1.Constants.errorDescription) ||
            parameters.hasOwnProperty(Constants_1.Constants.error) ||
            parameters.hasOwnProperty(Constants_1.Constants.accessToken) ||
            parameters.hasOwnProperty(Constants_1.Constants.idToken));
    };
    UserAgentApplication.prototype.getHash = function (hash) {
        if (hash.indexOf("#/") > -1) {
            hash = hash.substring(hash.indexOf("#/") + 2);
        }
        else if (hash.indexOf("#") > -1) {
            hash = hash.substring(1);
        }
        return hash;
    };
    ;
    UserAgentApplication.prototype.getRequestInfo = function (hash) {
        hash = this.getHash(hash);
        var parameters = Utils_1.Utils.deserialize(hash);
        var tokenResponse = new RequestInfo_1.TokenResponse();
        if (parameters) {
            tokenResponse.parameters = parameters;
            if (parameters.hasOwnProperty(Constants_1.Constants.errorDescription) ||
                parameters.hasOwnProperty(Constants_1.Constants.error) ||
                parameters.hasOwnProperty(Constants_1.Constants.accessToken) ||
                parameters.hasOwnProperty(Constants_1.Constants.idToken)) {
                tokenResponse.valid = true;
                var stateResponse = void 0;
                if (parameters.hasOwnProperty("state"))
                    stateResponse = parameters.state;
                else
                    return tokenResponse;
                tokenResponse.stateResponse = stateResponse;
                if (stateResponse === this._cacheStorage.getItem(Constants_1.Constants.stateLogin)) {
                    tokenResponse.requestType = Constants_1.Constants.login;
                    tokenResponse.stateMatch = true;
                    return tokenResponse;
                }
                else if (stateResponse === this._cacheStorage.getItem(Constants_1.Constants.stateAcquireToken)) {
                    tokenResponse.requestType = Constants_1.Constants.renewToken;
                    tokenResponse.stateMatch = true;
                    return tokenResponse;
                }
                if (!tokenResponse.stateMatch) {
                    if (window.parent && window.parent !== window) {
                        tokenResponse.requestType = Constants_1.Constants.renewToken;
                    }
                    else {
                        tokenResponse.requestType = this._requestType;
                    }
                    var statesInParentContext = this._renewStates;
                    for (var i = 0; i < statesInParentContext.length; i++) {
                        if (statesInParentContext[i] === tokenResponse.stateResponse) {
                            tokenResponse.stateMatch = true;
                            break;
                        }
                    }
                }
            }
        }
        return tokenResponse;
    };
    ;
    UserAgentApplication.prototype.getScopeFromState = function (state) {
        if (state) {
            var splitIndex = state.indexOf("|");
            if (splitIndex > -1 && splitIndex + 1 < state.length) {
                return state.substring(splitIndex + 1);
            }
        }
        return "";
    };
    ;
    UserAgentApplication.prototype.isInIframe = function () {
        return window.parent !== window;
    };
    tslib_1.__decorate([
        resolveTokenOnlyIfOutOfIframe
    ], UserAgentApplication.prototype, "acquireTokenSilent", null);
    return UserAgentApplication;
}());
exports.UserAgentApplication = UserAgentApplication;
//# sourceMappingURL=UserAgentApplication.js.map