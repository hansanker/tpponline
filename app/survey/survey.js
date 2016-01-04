(function (angular) {
    "use strict";

    var app = angular.module('myApp.survey', ['ngRoute', 'firebase.utils', 'firebase']);

    app.controller('SurveyCtrl', ['$scope', '$routeParams', 'user', 'fbutil', function ($scope, $routeParams, user, fbutil) {
        var surveyHeaderID = $routeParams.surveyHeaderID;

        /* TODO 1: Check if user already has this survey in their profile */
        console.log(user.uid);
        var ref = fbutil.ref();
        ref.once("value", function (snapshot) {
            //if (snapshot.child("users/2f75583e-4199-4424-83ad-f6486e4b45e9/surveys/-K-t52g5-osgYHQ_xJir").exists()) {
            if (snapshot.child("users/" + user.uid + "/surveys/" + surveyHeaderID).exists()) {
                console.log("OK")
            } else {
                /* TODO 2: If user does not yet have survey in their profile, add it */
                ref.child("/users/" + user.uid + "/surveys/" + surveyHeaderID).set(true);
            };
        });
        
        /* TODO 3: Fetch /SurveyHeader/<surveyHeaderID> and check its type (template.nameSurvey) */
        ref.child("SurveyHeader/" + surveyHeaderID + "/template/nameSurvey").once("value", function (data) {
            console.log(data.val())
            var surveyType = data.val();
        });

        

        /* TODO 4: Redirect to corresponding Survey controller (TPP, etc) */


    }]);



    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.whenAuthenticated('/survey/:surveyHeaderID', {
            
            //$routeProvider.when('/survey/:surveyHeaderID', {
            
            templateUrl: 'app/survey/survey.html',
            controller: 'SurveyCtrl',
            resolve: {
                user: ['Auth', function (Auth) {
                    return Auth.$waitForAuth();
                }]
            }
        });
    }]);


})(angular);