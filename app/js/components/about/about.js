(function () {
  'use strict';

  angular.module('RAP')
    .controller('aboutCtrl', ['$scope', aboutCtrl]);

  function aboutCtrl($scope) {
    $scope.viewMsg = "Directory Structure of RAP : ";
    $scope.loadershow = false;
  };
}());