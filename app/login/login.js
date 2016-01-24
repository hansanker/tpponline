"use strict";
angular.module('myApp.login', ['firebase.utils', 'firebase.auth', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            controller: 'LoginCtrl',
            templateUrl: 'app/login/login.html'
        });
    }])

    .controller('LoginCtrl', ['$scope', 'Auth', '$location', 'fbutil', '$rootScope', 'loginRedirectPath', function ($scope, Auth, $location, fbutil, $rootScope, loginRedirectPath) {
        $scope.email = null;
        $scope.pass = null;
        $scope.confirm = null;
        $scope.createMode = false;

        $scope.login = function (email, pass) {
            $scope.err = null;
            Auth.$authWithPassword({ email: email, password: pass }, { rememberMe: true })
                .then(function (/* user */) {

                    if ($rootScope.FUCK) {
                        $location.path('/survey/' + $rootScope.FUCK);
                    }

                }, function (err) {
                    $scope.err = errMessage(err);
                });
        };

        //check email       
        $scope.checkEmail = function (email) {
            $scope.knownEmail = false;
            var users = fbutil.ref().child('users')
            users.once("value", function (allUserMessagesSnapshot) {
                allUserMessagesSnapshot.forEach(function (userSnapshot) {
                    var userEmail = userSnapshot.child("email").val();  // e.g. "barney"
                    if (userEmail === email) {
                        $scope.knownEmail = true;
                    } else {
                        $scope.knownEmail = undefined;
                    }

                });
            });
        };

        //change pass

        $scope.resetMyPass = function (myEmail) {
            var ref = fbutil.ref();
            ref.resetPassword({
                email: myEmail
            }, function (error) {
                if (error === null) {
                    console.log("Password reset email sent successfully");
                } else {
                    console.log("Error sending password reset email:", error);
                }
            });
        };



        $scope.createAccount = function () {

            $scope.buttonDisabled = true;
            console.log($scope.buttonDisabled)
            $scope.err = null;


            if (assertValidAccountProps()) {
                var email = $scope.email;
                var pass = $scope.pass;
                // create user credentials in Firebase auth system
                Auth.$createUser({ email: email, password: pass })
                    .then(function () {
                        // authenticate so we have permission to write to Firebase
                        return Auth.$authWithPassword({ email: email, password: pass });
                    })
                    .then(function (user) {
                        // create a user profile in our data store
                        var ref = fbutil.ref('users', user.uid);
                        return fbutil.handler(function (cb) {
                            ref.set({ email: email, name: name || firstPartOfEmail(email) }, cb);
                        });
                    })
                    .then(function (/* user */) {

                        if ($rootScope.FUCK) {
                            $location.path('/survey/' + $rootScope.FUCK);
                        }

                    }, function (err) {
                        $scope.err = errMessage(err);
                    });
            }
        };

        function assertValidAccountProps() {
            if (!$scope.email) {
                $scope.err = 'Please enter an email address';
            }
            else if (!$scope.pass || !$scope.confirm) {
                $scope.err = 'Please enter a password';
            }
            else if ($scope.createMode && $scope.pass !== $scope.confirm) {
                $scope.err = 'Passwords do not match';
            }
            return !$scope.err;
        }

        function errMessage(err) {
            return angular.isObject(err) && err.code ? err.code : err + '';
        }

        function firstPartOfEmail(email) {
            return ucfirst(email.substr(0, email.indexOf('@')) || '');
        }

        function ucfirst(str) {
            // inspired by: http://kevin.vanzonneveld.net
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
        }
    }]);