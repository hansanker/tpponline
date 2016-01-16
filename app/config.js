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
// tool to make color theme  http://mcg.mbitson.com/#/

  $mdThemingProvider.definePalette('HumanRed', {
  '50': '#f9e9e9',
  '100': '#fde2e4',
  '200': '#f9aeb3',
  '300': '#f36c75',
  '400': '#f14f5b',
  '500': '#ef3340',
  '600': '#ed1725',
  '700': '#d4111e',
  '800': '#b80e1a',
  '900': '#9b0c16',
  'A100': '#ffe7e7',
  'A200': '#fde2e4',
  'A400': '#f14f5b',
  'A700': '#d4111e',
  'contrastDefaultColor': 'light',
  'contrastDarkColors': '50 100 200 300 400 A100 A200 A400'
});    
      
$mdThemingProvider.definePalette('HumanLightBlue', {
  '50': '#ffffff',
  '100': '#ffffff',
  '200': '#ffffff',
  '300': '#e9f2f7',
  '400': '#d3e4ee',
  '500': '#bdd6e6',
  '600': '#a7c8de',
  '700': '#91bad5',
  '800': '#7aadcd',
  '900': '#649fc4',
  'A100': '#ffffff',
  'A200': '#ffffff',
  'A400': '#d3e4ee',
  'A700': '#91bad5',
  'contrastDefaultColor': 'light',
  'contrastDarkColors': '50 100 200 300 400 500 600 700 800 900 A100 A200 A400 A700'
});
      
      
$mdThemingProvider.definePalette('HumanBlue', {
  '50': '#c8d7f3',
  '100': '#c8d7f3',
  '200': '#c8d7f3',
  '300': '#8eace5',
  '400': '#759ae0',
  '500': '#5c88da',
  '600': '#4376d4',
  '700': '#2e65cb',
  '800': '#2858b2',
  '900': '#234c99',
  'A100': '#c8d7f3',
  'A200': '#c8d7f3',
  'A400': '#759ae0',
  'A700': '#2e65cb',
  'contrastDefaultColor': 'light',
  'contrastDarkColors': '50 100 200 300 400 A100 A200 A400'
}); 
  $mdThemingProvider.theme('default')
    .primaryPalette('HumanBlue',{
        'default': '500'
    })
    .warnPalette('red')
    .accentPalette('HumanRed',{
      'default': '500'  
    });
})




.controller('MainNavigationCtrl', ['$scope', '$mdSidenav',  function ($scope, $mdSidenav ) {
  $scope.toggleSidenav = function (menuId, item) {
    $mdSidenav(menuId).toggle();
    $scope.selected = item;
    console.log($scope.selected);
  };

}]);
