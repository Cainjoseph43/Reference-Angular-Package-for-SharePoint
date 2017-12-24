(function () {
    'use strict';

    function userData() {
        return {
            restrict: "A",
            transclude: true,
            templateUrl: "app/templates/user-data.html",
            link: function ($scope, $element, $attr) {
                // directive modifications/data passing code can be written here
            }
        };
    }
    angular.module('RAP')
        .directive("userData", userData);
}());