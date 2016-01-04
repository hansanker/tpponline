(function (angular) {
    "use strict";

    var app = angular.module('myApp.TPPsurvey', ['ngRoute', 'firebase.utils', 'firebase']);

    app.controller('TppSurveyCtrl', ['$scope', 'user', '$routeParams', function($scope, user, $routeParams) {
        var surveyHeaderID = $routeParams.surveyHeaderID;


        debugger;
    }]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.whenAuthenticated('/survey/tpp/:surveyHeaderID', {
            templateUrl: 'app/survey/tpp/tpp.html',
            controller: 'TppSurveyCtrl'
        });
    }]);


})(angular);