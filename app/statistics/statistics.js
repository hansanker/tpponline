(function (angular) {
    "use strict";

    var app = angular.module('myApp.statistics', ['ngRoute', 'firebase.utils', 'firebase']);

    app.controller('StatisticsCtrl', ['$scope', '$routeParams', '$location', 'user', '$firebaseArray', 'fbutil', function ($scope, $routeParams, $location, user, $firebaseArray, fbutil) {
        var headersRef = $firebaseArray(fbutil.ref().child('SurveyHeaders'));
        $scope.headers = headersRef;
        
        
        // var reactionsList = $firebaseArray(fbutil.ref().child('SurveyReactions').child(headerID));
         for (var headerID in headersRef) {  
            //  var header = headersRef[headerID];
            // console.log(headersRef[headerID][key]);
            var teamsRef = [headersRef][teams];
             for (var teamID in teamsRef) {
                 console.log('ok')
             }
             
             
         }
        

        
        
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

        // $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        // $scope.series = ['Series A', 'Series B'];

        // $scope.data = [
        //     [65, 59, 80, 81, 56, 55, 40],
        //     [28, 48, 40, 19, 86, 27, 90]
        // ];

        header.$loaded(function () {

            reactionsList.$loaded(function () {
                var data = {};
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
                                var dataEntry = data[questionID + '|' + answerID];
                                dataEntry.answerResult = answer;
                                dataEntry.userID = reaction.$id;
                                dataEntry.userName = users[reaction.$id].name;
                                dataEntry.userMail = users[reaction.$id].email;


                                if (dataEntry.answerCulture === "active") {
                                    $scope.pointsReactive = + $scope.pointsReactive;
                                }


                                console.log($scope.pointsReactive)
                            });
                        });
                    });

                    $scope.data = data;
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