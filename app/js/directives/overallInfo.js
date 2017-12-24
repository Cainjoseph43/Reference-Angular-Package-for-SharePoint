(function () {
    'use strict';

    function overallInfo() {
        return {
            restrict: "A",
            transclude: true,
            templateUrl: "app/templates/overall-info.html",
            link: function ($scope, $element, $attr) {
                // directive modifications/data passing code can be written here
            }
        };
    }
    angular.module('RAP')
        .directive("overallInfo", overallInfo);
}());