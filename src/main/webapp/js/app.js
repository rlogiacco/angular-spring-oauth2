angular.module('oauth2-provider', ['http-auth-interceptor', 'oauth2-service'])


.config(function(authServiceProvider) {
  authServiceProvider.clientId = "the_client";
  authServiceProvider.secret = "";
  authServiceProvider.providerUrl = "/oauth2-provider/oauth";
})

.run(function($rootScope, authService, authInterceptor) {
  $rootScope.$on('event:auth-login-required', function() {
    authService.refresh().then(null, function() { console.log("failed"); });
  });
})

.controller('LoginCtrl', function($scope, authService) {
  $scope.user = {
    login: function() {
      authService.login($scope.user.username, $scope.user.password);
    },
    isLogged: authService.isLogged
  }
})

.controller('ResourceCtrl', function($scope, $http) {
  $scope.update = function(index) {
    $http.get("rest/resource")
      .success(function(data) {
        $scope['resources' + index] = data;
      }).error(function(data) {
        console.log(data);
      });
  }
  $scope.updateAll = function() {
  	for (var i = 1; i < 4; i++) {
  	  $scope.update(i);
  	}
  }
})