(function (angular) {
  "use strict";

  var app = angular.module('myApp.survey', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('SurveyCtrl', ['$scope', 'messageList', function($scope, messageList) {
      

    }]);

  app.factory('messageList', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray) {
    var ref = fbutil.ref('messages').limitToLast(10);
    return $firebaseArray(ref);
  }]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.whenAuthenticated('/survey', {
      templateUrl: 'app/survey/survey.html',
      controller: 'SurveyCtrl'
    });
  }]);


})(angular);