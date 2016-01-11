(function (angular) {
    "use strict";

    var app = angular.module('myApp.mySurveys', ['ngRoute', 'firebase.utils', 'firebase']);

    app.controller('mySurveysCtrl', ['$scope', '$routeParams', 'user', 'fbutil', '$location', function ($scope, $routeParams, user, fbutil, $location) {


        $scope.redirectToSurvey = function (surveyID) {
            $location.path('/survey/' + surveyID);
        }


        var ref = fbutil.ref();
        $scope.mySurveys = [];

        ref.child("/users/" + user.uid + "/surveys").on('child_added', function (snapshot) {
            var headerKey = snapshot.key();
            var team = snapshot.child('team').val();
            var startSurvey = snapshot.child('start').val();

            ref.child("/SurveyHeaders/" + headerKey).once('value', function (snapshot) {
                var company = snapshot.child('company').val();

                $scope.mySurveys.push({ 'company': company, 'team': team, 'key': headerKey });
                $scope.$apply();
            });
        });
    }]);

    app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/mySurveys', {

            templateUrl: 'app/mySurveys/mySurveys.html',
            controller: 'mySurveysCtrl',
            resolve: {
                user: ['Auth', function (Auth) {
                    return Auth.$waitForAuth();
                }]
            }
        });
    }]);

})(angular);