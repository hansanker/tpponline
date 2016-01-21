(function (angular) {
    "use strict";

    var app = angular.module('myApp.TPPsurvey', ['ngRoute', 'firebase.utils', 'firebase']);

    app.controller('TppSurveyCtrl', ['$scope', 'user', '$routeParams', '$firebaseObject', 'fbutil', function ($scope, user, $routeParams, $firebaseObject, fbutil) {
        var surveyHeaderID = $routeParams.surveyHeaderID;
        var surveyHeaderRef = fbutil.ref().child('SurveyHeaders').child(surveyHeaderID);
        var answersRef = fbutil.ref().child('SurveyReactions').child(surveyHeaderID).child(user.uid);
        var userReactionDetailsRef = fbutil.ref().child('users').child(user.uid).child('surveys').child(surveyHeaderID);

        $scope.userReactionDetailsRefObject = $firebaseObject(userReactionDetailsRef).$bindTo($scope, "bindedUserReactionDeatils");

        $scope.userAnswers = {};

        userReactionDetailsRef.once("value", function (snapshot) {
            if (snapshot.child("completed").exists()) {
                $scope.surveyCompleted = snapshot.child("completed").val();
            }
        });

        surveyHeaderRef.once('value', function (surveySnapshot) {
            var surveyHeader = surveySnapshot.val();
            $scope.surveyHeader = surveyHeader;
            $scope.survey = surveyHeader.template;
            $scope.teams = surveyHeader.teams;

            var answersObject = $firebaseObject(answersRef);

            answersObject.$watch(function () { console.log('watcher triggered') });
            answersObject.$loaded(function () {
                var questions = $scope.survey.questions;
                for (var questionID in questions) {
                    if (!answersObject[questionID]) {
                        answersObject[questionID] = [];
                    }
                    var answers = answersObject[questionID];
                    for (var answerID in questions[questionID].answers) {
                        if (!answers[answerID]) {
                            answers[answerID] = 0;
                        }
                    }
                }
                answersObject.$save();
            });
            $scope.answers = answersObject;
        });

        $scope.totalPoints = function () {
            var answers = $scope.answers;
            var totalPoints = 0;

            for (var key in answers) {
                totalPoints += answers[key] || 0;
            }
        };

        $scope.saveAnswer = function (questionID, answerID, event, points) {

            if ($scope.answers[questionID][answerID] == points) {
                $scope.answers[questionID][answerID] = 0;

            } else {
                $scope.answers[questionID][answerID] = points;
            }

            $scope.answers.$save();
        };

        $scope.completeSurvey = function () {
            userReactionDetailsRef.child('completed').set(true);
            $scope.surveyCompleted = true;
            $scope.beginnen = undefined;
        };

        $scope.getAnswerPoints = function (questionID) {
            var userAnswers = $scope.answers[questionID];
            var totalPoints = 0;

            for (var answerIndex in userAnswers) {
                totalPoints += parseInt(userAnswers[answerIndex]) || 0;
            }

            return totalPoints;
        };

        $scope.isQuestionAnswered = function (questionID) {
            return $scope.getAnswerPoints(questionID) === 3;
        };

        $scope.allQuestionsAnswered = function () {
            var allAnswered = true;

            if (!$scope.survey) { return false; }

            for (var questionID in $scope.survey.questions) {
                if (!$scope.isQuestionAnswered(questionID)) {
                    allAnswered = false;
                    break;
                }
            }

            return allAnswered;
        };

    }]);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.whenAuthenticated('/survey/tpp/:surveyHeaderID', {
            templateUrl: 'app/survey/tpp/tpp.html',
            controller: 'TppSurveyCtrl'
        });
    }]);


})(angular);