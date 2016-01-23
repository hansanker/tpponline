(function (angular) {
    "use strict";

    var app = angular.module('myApp.surveyStart', ['ngRoute', 'firebase.utils', 'firebase']);

    app.controller('SurveyStart', ['$scope', '$routeParams', '$location', 'fbutil', '$rootScope', function ($scope, $routeParams, $location, fbutil, $rootScope) {


        var surveyHeaderID = $routeParams.surveyHeaderID;
        $rootScope.FUCK = surveyHeaderID
        $location.path('/survey/' + surveyHeaderID);

    }]);

    app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/survey/surveyStart/:surveyHeaderID', {
            templateUrl: 'app/survey/surveyStart/surveyStart.html',
            controller: 'SurveyStart'
        });
    }]);


})(angular);