(function (angular) {
    "use strict";

    var app = angular.module('myApp.statistics', ['ngRoute', 'firebase.utils', 'firebase']);

    app.controller('StatisticsCtrl', ['$scope', '$routeParams', '$location', 'user', '$firebaseArray', 'fbutil', function ($scope, $routeParams, $location, user, $firebaseArray, fbutil) {
        var headersRef = $firebaseArray(fbutil.ref().child('SurveyHeaders'));
        $scope.headers = headersRef;
        
       



        $scope.redirectToDetail = function (headerID) {
            $location.path('/statistics/specification/' + headerID);
        }
    }]);



    app.controller('StatisticsSpecificationCtrl', ['$scope', '$routeParams', '$location', 'user', 'fbutil', '$firebaseObject', '$firebaseArray', function ($scope, $routeParams, $location, user, fbutil, $firebaseObject, $firebaseArray) {
        var headerID = $routeParams['surveyHeaderID'];
        var header = $firebaseObject(fbutil.ref().child('SurveyHeaders').child(headerID));
        var reactionsList = $firebaseArray(fbutil.ref().child('SurveyReactions').child(headerID));
        var users = $firebaseObject(fbutil.ref().child('users'));

        


        $scope.labelsPie = ["Proactief", "Actief", "Reactief"];
        $scope.dataPie = [300, 500, 100];



        header.$loaded(function () {
            reactionsList.$loaded(function () {
                var data = {};
                var result = [];
                users.$loaded(function () {
                    var questions = header.template.questions;
                    for (var questionID in questions) {
                        var question = questions[questionID];
                        for (var answerID in question.answers) {
                            var answer = question.answers[answerID];
                            data[questionID + '|' + answerID] = {
                                questionID: questionID,
                                questionTitle: question.titleNL,
                                questionSubject: question.subject,
                                questionTheme: question.theme,
                                answerID: answerID,
                                answerTitle: answer.titleNL,
                                answerCulture: answer.culture
                            };
                        }
                    }

                    angular.forEach(reactionsList, function (reaction) {
                        angular.forEach(reaction, function (question, questionID) {
                            angular.forEach(question, function (answer, answerID) {
                                var dataEntry = _.clone(data[questionID + '|' + answerID]);
                                dataEntry.answerResult = answer;
                                dataEntry.userID = reaction.$id;
                                dataEntry.userName = users[reaction.$id].name;
                                dataEntry.userMail = users[reaction.$id].email;

                                result.push(dataEntry);

                                /*if (dataEntry.answerCulture === "active") {
                                    $scope.pointsReactive = + $scope.pointsReactive;
                                }*/


                            });
                        });
                    });

                    $scope.data = result;
                });
            });
        });
    }]);


    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.whenAuthenticated('/statistics/', {
            templateUrl: 'app/statistics/statistics.html',
            controller: 'StatisticsCtrl'
        });

        $routeProvider.whenAuthenticated('/statistics/specification/:surveyHeaderID', {
            templateUrl: 'app/statistics/specification.html',
            controller: 'StatisticsSpecificationCtrl'
        });
    }]);


})(angular);
