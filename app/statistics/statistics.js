(function (angular) {
    "use strict";

    var app = angular.module('myApp.statistics', ['ngRoute', 'firebase.utils', 'firebase']);

    app.controller('StatisticsCtrl', ['$scope', '$routeParams', '$location', 'user', '$firebaseArray', 'fbutil',  function ($scope, $routeParams, $location, user, $firebaseArray, fbutil) {
        var headersRef = $firebaseArray(fbutil.ref().child('SurveyHeaders'));
        $scope.headers = headersRef;





        $scope.redirectToDetail = function (headerID) {
            $location.path('/statistics/specification/' + headerID);
        }
    }]);



    app.controller('StatisticsSpecificationCtrl', ['$scope', '$routeParams', '$location', 'user', 'fbutil', '$firebaseObject', '$firebaseArray', '$filter', function ($scope, $routeParams, $location, user, fbutil, $firebaseObject, $firebaseArray, $filter) {
        var headerID = $routeParams['surveyHeaderID'];
        var header = $firebaseObject(fbutil.ref().child('SurveyHeaders').child(headerID));
        var reactionsList = $firebaseArray(fbutil.ref().child('SurveyReactions').child(headerID));
        var users = $firebaseObject(fbutil.ref().child('users'));




        $scope.labelsPie = [];
        $scope.dataPie = [];
        $scope.colorPie = ["#CC0000", "#00CC00", "#0000CC"];



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
                                answerCulture: answer.culture,
                                company: header.company,
                                keyToAnswer: questionID + '|' + answerID
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

                            });
                        });
                    });

                    $scope.data = result;
                    $scope.culture()
                    $scope.barChart()


                });
            });
        })

        $scope.culture = function (userID) {
            var localData;

            if (userID) {
                localData = _.filter($scope.data, function (item) { item.userID === userID });
            } else {
                localData = $scope.data;
            }

            var reduced = _.reduce(localData, function (result, value) {
                var culture = value.answerCulture;
                if (result[culture] === undefined) {
                    result[culture] = 0;
                }

                result[culture] += value.answerResult;
                return result;
            }, {});

            var i = 0;
            for (var name in reduced) {
                $scope.labelsPie[i] = name;
                $scope.dataPie[i] = reduced[name];
                i++;
            }
        }

        $scope.barChart = function () {

            $scope.chartData = {
                labels: theme(),
                options: { tooltipEvents: [] },
                series: ['proactief', 'actief', 'reactief'],
                data: [dataBar('proactief'), dataBar('actief'), dataBar('reactief')],
                color: [{ fillColor: "#00CC00" }, { fillColor: "#0000CC" }, { fillColor: "#CC0000" }]

            };

        }

        var dataBar = function (culture) {

            var reduced = _.reduce(_.filter($scope.data, ['answerCulture', culture]), function (result, value) {
                var theme = value.questionTheme;
                if (result[theme] === undefined) {
                    result[theme] = 0;
                }
                result[theme] += value.answerResult;
                return result;
            }, {});

            var arraySubject = [];
            _.forOwn(reduced, function (value, key) {
                arraySubject.push(value);
            });
            return arraySubject;

        }


        var theme = function () {

            var reduced2 = _.reduce($scope.data, function (result, value) {
                var theme = value.questionTheme;
                if (result[theme] === undefined) {
                    result[theme] = 0;
                }
                result[theme] += 1;
                return result;
            }, {});

            var arraySubject = [];
            _.forOwn(reduced2, function (value, key) {
                arraySubject.push(key);
            });

            return arraySubject;
        }




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
