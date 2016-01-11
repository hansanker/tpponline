'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp.config', ['ngMaterial'])

  
  
//general controller for dialog forms
.controller('DialogController', ['$scope', '$mdDialog', function DialogController($scope, $mdDialog) {

  $scope.hide = function () {
    $mdDialog.hide();
  };
  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  $scope.answer = function (answer) {
    $mdDialog.hide(answer);
  };
}])
 
  

  
  // version of this seed app is compatible with angularFire 1.0.0
  // see tags for other versions: https://github.com/firebase/angularFire-seed/tags
  .constant('version', '1.0.0')

  // where to redirect users if they need to authenticate (see security.js)
  .constant('loginRedirectPath', '/login')

  // your Firebase data URL goes here, no trailing slash
  .constant('FBURL', 'https://HC01.firebaseio.com')

  // double check that the app has been configured before running it and blowing up space and time
  .run(['FBURL', '$timeout', function(FBURL, $timeout) {
    if( FBURL.match('//INSTANCE.firebaseio.com') ) {
      angular.element(document.body).html('<h1>Please configure app/config.js before running!</h1>');
      $timeout(function() {
        angular.element(document.body).removeClass('hide');
      }, 250);
    }
      
  }])
  
  
  
  .config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .warnPalette('red')
    .accentPalette('red');
})


.controller('MainNavigationCtrl', ['$scope', '$mdSidenav',  function ($scope, $mdSidenav ) {
  $scope.toggleSidenav = function (menuId, item) {
    $mdSidenav(menuId).toggle();
    $scope.selected = item;
    console.log($scope.selected);
  };

}]);
