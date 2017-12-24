(function () {
    'use strict';
    angular.module('RAP', ['ngRoute', 'ngDialog'])
        .config(appConfig)
        .controller('MainCtrl', ['$scope', '$location', MainCtrl]);
    /** @ngInject */
    function MainCtrl($scope, $location) {
        var globalData = {};
        $scope.isActiveTab = function (viewLocation) {
            var active = (viewLocation === $location.path());
            return active;
        };
        $scope.loaderShow = true;
    }

    function appConfig($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "app/js/components/home/home.html",
                controller: "HomeCtrl"
            })
            .when("/MyProfile", {
                templateUrl: "app/js/components/MyProfile/myprofile.html",
                controller: "myprofileCtrl"
            })
            .when("/About", {
                templateUrl: "app/js/components/about/about.html",
                controller: "aboutCtrl"
            })
            .otherwise({
                redirectTo: '/'
            });
    }
}());
