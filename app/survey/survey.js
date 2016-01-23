(function (angular) {
    "use strict";

    var app = angular.module('myApp.survey', ['ngRoute', 'firebase.utils', 'firebase']);

    app.controller('SurveyCtrl', ['$scope', '$routeParams', '$location', 'user', 'fbutil', function ($scope, $routeParams, $location, user, fbutil) {
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
            }
        });
        
        /* TODO 3: Fetch /SurveyHeaders/<surveyHeaderID> and check its type (template.nameSurvey) */
        ref.child("SurveyHeaders/" + surveyHeaderID + "/template/nameSurvey").once("value", function (data) {
            console.log(data.val());
            var surveyType = data.val().toLowerCase();

            if(['tpp', 'gallop'].indexOf(surveyType) !== -1) {
                /* TODO 4: Redirect to corresponding Survey controller (TPP, etc) */
                $location.path('/survey/' + surveyType + '/' + surveyHeaderID);
                $scope.$apply();
            } else {
                /* TODO: show proper error message; type does not exist */
                alert('Survey type does not exist!');
            }
        });

    }]);


    app.config(['$routeProvider', function ($routeProvider ) {
        
        $routeProvider.whenAuthenticated('/survey/:surveyHeaderID', {
            templateUrl: 'app/survey/survey.html',
            controller: 'SurveyCtrl'
        });
    }]);


})(angular);