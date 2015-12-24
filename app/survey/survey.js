(function (angular) {
  "use strict";

  var app = angular.module('myApp.survey', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('SurveyCtrl', ['$scope', 'messageList', function($scope, messageList) {
      $scope.messages = messageList;
      $scope.addMessage = function(newMessage) {
        if( newMessage ) {
          $scope.messages.$add({text: newMessage});
        }
      };
    }]);

  app.factory('messageList', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray) {
    var ref = fbutil.ref('messages').limitToLast(10);
    return $firebaseArray(ref);
  }]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/survey', {
      templateUrl: 'app/survey/survey.html',
      controller: 'SurveyCtrl',
      authRequired: true,
      resolve: {
                   factory: checkRouting
      }
    });
  }]);


var checkRouting= function ($q, $rootScope, $location) {
    if ($rootScope.userProfile) {
        return true;
    } else {
        var deferred = $q.defer();
        
                deferred.reject();
                $location.path("/login");
             
        return deferred.promise;
   
    }
};



})(angular);