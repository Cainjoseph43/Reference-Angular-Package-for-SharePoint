(function () {
  'use strict';

  var HomeCtrl = function($scope, $sharepointJSOMService, $rootScope) {
    $scope.viewMsg = "Hello...";
    $scope.overallInformation = [];
    $scope.firstCategory = "Learning";
    $scope.secondCategory = "Developing";
    $scope.thirdCategory = "Experienced";
    $sharepointJSOMService.getUserContext().then(function (globalData) {
      var userName = globalData.name !== undefined ? globalData.name : "";
      $scope.viewMsg = "Hello " + userName + "...!!!";
      $sharepointJSOMService.retrieveListItems(globalData.id).then(function (result) {
        $scope.loaderShow = false;
        $scope.overallInformation=result;
      });
    });
  };

  HomeCtrl.$inject = ['$scope', 'sharepointJSOMService', '$rootScope'];
  
  angular.module('RAP')
    .controller('HomeCtrl', HomeCtrl)
    .directive('overallInfo', function overallInfo() {
      return {
          restrict: "A",
          transclude: true,
          templateUrl: "app/templates/overall-info.html",
          link: function ($scope, $element, $attr) {
              // directive modifications/data passing code can be written here
          }
      };
  });
}());