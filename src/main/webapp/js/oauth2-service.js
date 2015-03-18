/*global angular:true, browser:true */

(function () {
  'use strict';

  angular.module('oauth2-service', ['base64'])
  .run(function($rootScope, $injector, authService) {
    $injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
      if (authService.isValid()) {
        headersGetter()['Authorization'] = "Bearer " + authService.token();
      }
      if (data) {
        return angular.toJson(data);
      }
    };
  })
  .provider('authService', function () {
    return {
      clientId: null,
      secret: null,
      providerUrl: null,
      
      $get: function($http, $q, $log, base64, authInterceptor) {
        var providerUrl = this.providerUrl;
        var token, refreshToken = undefined;
        var clientCredentials = base64.encode(this.clientId + ':' + this.secret);
        
        return {
          isLogged: function() { return token !== undefined },
          isValid: function() { return token !== undefined && token !== false },
          token: function() { return token; },
          login: function(username, password) {
            token = undefined;
            var deferred = $q.defer();
            $http.post(providerUrl + "/token", null , {
              params: { 'username': username, 'password': password, 'grant_type': "password" },
              headers: { 'Authorization': "Basic " + clientCredentials }, 
              ignoreAuthModule: true
            }).success(function(data) {
              token = data.access_token;
              refreshToken = data.refresh_token;
              deferred.resolve();
            }).error(deferred.reject);
            return deferred.promise;
          },
          refresh: function() {
            var deferred = $q.defer();
            if (!refreshToken) {
              $log.debug("token refresh unavailable");
              deferred.reject();
            } else if (token === false) {
              $log.debug("token refresh already in progress");
              deferred.resolve();
            } else { 
              $log.debug("refreshing token");
              token = false;
              $http.post(providerUrl + "/token", null , {
                params: { 'grant_type': "refresh_token", 'refresh_token': refreshToken},
                headers: { 'Authorization': "Basic " + clientCredentials }, 
                ignoreAuthModule: true
              }).success(function(data) {
                token = data.access_token;
                $log.debug("new token:" + token);
                authInterceptor.loginConfirmed();
                deferred.resolve();
              }).error(function() {
                token = undefined;
                deferred.reject();
              });
            }
            return deferred.promise;
          }
        }
      }
    }
  })
})();