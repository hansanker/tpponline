(function (angular) {
    "use strict";

    var app = angular.module('myApp.survey', ['ngRoute', 'firebase.utils', 'firebase']);

    app.controller('SurveyCtrl', ['$scope', '$routeParams', function ($scope, messageList, $routeParams) {
        var surveyHeaderID = $routeParams.surveyHeaderID;

        /* TODO 1: Check if user already has this survey in their profile */

        /* TODO 2: If user does not yet have survey in their profile, add it */

        /* TODO 3: Fetch /SurveyHeader/<surveyHeaderID> and check its type (template.nameSurvey) */

        /* TODO 4: Redirect to corresponding Survey controller (TPP, etc) */
    }]);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.whenAuthenticated('/survey/:surveyHeaderID', {
            templateUrl: 'app/survey/survey.html',
            controller: 'SurveyCtrl'
        });
    }]);


})(angular);