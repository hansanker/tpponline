(function (angular) {
    "use strict";

    var app = angular.module('myApp.mySurveys', ['ngRoute', 'firebase.utils', 'firebase']);

    app.controller('mySurveysCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
        //var surveyHeaderID = $routeParams.surveyHeaderID;

        /* TODO 1: Check if user already has this survey in their profile */

        /* TODO 2: If user does not yet have survey in their profile, add it */

        /* TODO 3: Fetch /SurveyHeader/<surveyHeaderID> and check its type (template.nameSurvey) */

        /* TODO 4: Redirect to corresponding Survey controller (TPP, etc) */

      
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