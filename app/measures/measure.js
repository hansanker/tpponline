(function(angular) {
  "use strict";

  var app = angular.module('myApp.measure', ['firebase.auth', 'firebase', 'firebase.utils', 'ngRoute']);

  app.controller('MeasureCtrl', ['$scope', 'fbutil',  '$firebaseArray', 'FBURL', "$mdDialog", function ($scope, fbutil, $firebaseArray, FBURL, $mdDialog) {

   // ref = new $firebaseArray (FBURL + '/measures');
    
    //$scope.measures = ref
    
    $scope.showAdvancedDialog = function (ev, url) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'app/measures/' + url + '.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false
    })
      .then(function (answer) {
        if (answer=== 'saveMeasure'){
          console.log("ola")
        };
        $scope.status = 'You said the information was "' + answer + '".';
      }, function () {
        $scope.status = 'You cancelled the dialog.';
        console.log("cancelled")
      });
  };
 
    
  }]);
  

  app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/measure', {
      templateUrl: 'app/measures/measure.html',
      controller: 'MeasureCtrl',
      resolve: {
        // forces the page to wait for this promise to resolve before controller is loaded
        // the controller can then inject `user` as a dependency. This could also be done
        // in the controller, but this makes things cleaner (controller doesn't need to worry
        // about auth status or timing of accessing data or displaying elements)
        user: ['Auth', function (Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  }]);
  
})(angular);

