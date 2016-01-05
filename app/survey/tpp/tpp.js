(function (angular) {
    "use strict";

    var app = angular.module('myApp.TPPsurvey', ['ngRoute', 'firebase.utils', 'firebase']);

    app.controller('TppSurveyCtrl', ['$scope', 'user', '$routeParams', '$firebaseObject', 'fbutil', function ($scope, user, $routeParams, $firebaseObject, fbutil) {
        var surveyHeaderID = $routeParams.surveyHeaderID;
        var surveyHeaderRef = fbutil.ref().child('SurveyHeaders').child(surveyHeaderID);

        var answersRef = fbutil.ref().child('SurveyReactions').child(surveyHeaderID).child(user.uid);

        $scope.userAnswers = {};

        surveyHeaderRef.once('value', function (surveySnapshot) {
            var surveyHeader = surveySnapshot.val();
            $scope.surveyHeader = surveyHeader;
            $scope.survey = surveyHeader.template;

            var answersObject = $firebaseObject(answersRef);
            
            answersObject.$watch(function () {console.log('watcher triggered')});
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

        $scope.saveAnswer = function (questionID, answerID, event) {
            if ($scope.getAnswerPoints(questionID) > 3) {
                alert('Je kunt niet meer dan 3 punten aan een vraag toekennen');
                event.preventDefault();
                return false;
            }

            $scope.answers[questionID][answerID] = parseInt($scope.answers[questionID][answerID]);
            $scope.answers.$save();
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