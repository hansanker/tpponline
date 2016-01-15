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
  

  $mdThemingProvider.definePalette('HumanRed', {
  '50': '#fffdfd',
  '100': '#f4bbbd',
  '200': '#eb8b8f',
  '300': '#e14e53',
  '400': '#dd343a',
  '500': '#cf2329',
  '600': '#b51f24',
  '700': '#9b1a1f',
  '800': '#801619',
  '900': '#661114',
  'A100': '#fffdfd',
  'A200': '#f4bbbd',
  'A400': '#dd343a',
  'A700': '#9b1a1f',
  'contrastDefaultColor': 'light',
  'contrastDarkColors': '50 100 200 A100 A200'
});    
      
$mdThemingProvider.definePalette('HumanBlue', {
  '50': '#b3bcea',
  '100': '#b3bcea',
  '200': '#b3bcea',
  '300': '#e3e6f7',
  '400': '#cbd1f1',
  '500': '#b3bcea',
  '600': '#9ba7e3',
  '700': '#8392dd',
  '800': '#6b7dd6',
  '900': '#5367cf',
  'A100': '#b3bcea',
  'A200': '#b3bcea',
  'A400': '#cbd1f1',
  'A700': '#8392dd',
  'contrastDefaultColor': 'light',
  'contrastDarkColors': '50 100 200 300 400 500 600 700 800 A100 A200 A400 A700'
}); 
  $mdThemingProvider.theme('default')
    .primaryPalette('teal')
    .warnPalette('red')
    .accentPalette('orange');
})


.controller('MainNavigationCtrl', ['$scope', '$mdSidenav',  function ($scope, $mdSidenav ) {
  $scope.toggleSidenav = function (menuId, item) {
    $mdSidenav(menuId).toggle();
    $scope.selected = item;
    console.log($scope.selected);
  };

}]);
