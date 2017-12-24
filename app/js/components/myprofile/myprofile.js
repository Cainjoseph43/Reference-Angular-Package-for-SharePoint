(function () {
    'use strict';

    var myprofileCtrl = function($scope, $sharepointJSOMService, $sharepointRESTService, ngDialog, $sce, $rootScope, $formDigestService) {
        $scope.userData = [];
        $scope.newName = "";
        $scope.newCat = "";
        $scope.selectedList = [];
        var query = "_api/web/lists/getbytitle('" + LIST_NAME.TARGETLIST + "')/items?$select=ID,Title,Category,Author/ID&$expand=Author&$filter=Author/ID eq '17'";
        /* Rendering view onload */
        var renderListItems = function () {
            $sharepointRESTService.getRequest(query).then(function (response) {
                response.d.results.forEach(function (value, key) {
                    $scope.userData.push({
                        "ID": key + 1,
                        "ListItemID": value.ID,
                        "Name": value.Title,
                        "Category": value.Category
                    });
                });
                $formDigestService.startFormDigestInterval($rootScope).then(function () {
                    $scope.loaderShow = false;
                });
            });
        };
        /* Re rendering the view after updates */
        var reRenderListItems = function (query, data, mode) {
            if (mode === "delete") {
                $sharepointRESTService.deleteRequest(query).then(function () {
                    $scope.loaderShow = false;
                    $scope.userData = [];
                    renderListItems();
                });
            } else if (mode === "edit") {
                $sharepointRESTService.updateRequest(data, query).then(function () {
                    $scope.loaderShow = false;
                    $scope.userData = [];
                    renderListItems();
                });
            } else {
                $sharepointRESTService.postRequest(data, query).then(function () {
                    $scope.loaderShow = false;
                    $scope.userData = [];
                    renderListItems();
                });
            }
        };
        renderListItems();
        /* Deleting items to SP List and View */
        $scope.deleteItem = function () {
            var popupObj = {};
            var delQuery = "_api/web/lists/getbytitle('" + LIST_NAME.TARGETLIST + "')/items(" + this.result.ListItemID + ")";
            popupObj.title = "Delete Item";
            popupObj.icon = "glyphicon glyphicon-info-sign";
            popupObj.message = $sce.trustAsHtml(DELETE_MESSAGE);
            popupObj.button_1 = true;
            popupObj.button_1_label = "OK";
            popupObj.button_2 = true;
            popupObj.key = "deleteItem";
            popupObj.button_2_label = "Cancel";
            popupObj.donotshow = true;
            $scope.dlg;
            popupObj.button_2_click = function () {
                $scope.dlg.close();
                $scope.dlg = null;
            };
            $scope.popup = popupObj;
            $scope.dlg = ngDialog.open({
                template: 'app/templates/delete-item.html',
                className: 'ngdialog-theme-default',
                closeByDocument: false,
                closeByEscape: false,
                preserveFocus: false,
                trapFocus: false,
                scope: $scope,
                controller: ['$scope', 'sharepointRESTService', function ($scope, sharepointRESTService) {
                    $scope.popup;
                    $scope.popupDonotShow = function (donotshow, key) {
                        if (donotshow) {
                            sessionStorage.setItem(key, "noshow");
                        } else {
                            sessionStorage.removeItem(key);
                        }
                    };
                    $scope.popup.button_1_click = function () {
                        $scope.$parent.loaderShow = true;
                        reRenderListItems(delQuery, "", "delete");
                        $scope.dlg.close();
                        $scope.dlg = null;
                    };
                }]
            });
        };
        /* Editing items to SP List and View */
        $scope.editItem = function () {
            var popupObj = {};
            var editQuery = "_api/web/lists/getbytitle('" + LIST_NAME.TARGETLIST + "')/items(" + this.result.ListItemID + ")";
            var dropDown = "";
            var currentCat = this.result.Category;
            USER_CAT.forEach(function (value, key) {
                if (currentCat === value) {
                    dropDown += "<option selected='selected'>" + value + "</option>";
                } else {
                    dropDown += "<option>" + value + "</option>";
                }
            });
            popupObj.title = "Edit Item";
            popupObj.icon = "glyphicon glyphicon-info-sign";
            popupObj.message = $sce.trustAsHtml("<label for='user'>Name:</label><input type='text' value='" + this.result.Name + "' class='form-control' id='user-name'><br/>" +
                "<label for='sel1'>Select Category:</label><select class='form-control' id='user-cat'>" + dropDown + "</select>");
            popupObj.button_1 = true;
            popupObj.button_1_label = "Save";
            popupObj.button_2 = true;
            popupObj.button_2_label = "Cancel";
            $scope.dlg;
            popupObj.button_2_click = function () {
                $scope.dlg.close();
                $scope.dlg = null;
            };
            $scope.popup = popupObj;
            $scope.dlg = ngDialog.open({
                template: 'app/templates/edit-item.html',
                className: 'ngdialog-theme-default',
                closeByDocument: false,
                closeByEscape: false,
                preserveFocus: false,
                trapFocus: false,
                scope: $scope,
                controller: ['$scope', 'sharepointRESTService', function ($scope, sharepointRESTService) {
                    $scope.popup;
                    $scope.popup.button_1_click = function () {
                        $scope.$parent.loaderShow = true;
                        var data = {
                            __metadata: {
                                'type': $sharepointRESTService.listItemEntityTypeFullName(LIST_NAME.TARGETLIST)
                            },
                            Title: angular.element('#user-name').val(),
                            Category: angular.element('#user-cat').val()
                        };
                        reRenderListItems(editQuery, data, "edit");
                        $scope.dlg.close();
                        $scope.dlg = null;
                    };
                }]
            });
        };
        /* Adding items to SP List and View */
        $scope.addItem = function () {
            var popupObj = {};
            var addQuery = "_api/web/lists/getbytitle('" + LIST_NAME.TARGETLIST + "')/items";
            var dropDown = "";
            USER_CAT.forEach(function (value, key) {
                dropDown += "<option>" + value + "</option>";
            });
            popupObj.title = "Add Item";
            popupObj.icon = "glyphicon glyphicon-info-sign";
            popupObj.message = $sce.trustAsHtml("<label for='user'>Name:</label><input type='text' value='' class='form-control' id='user-name' ng-model='inputName'><br/>" +
                "<label for='selection'>Select Category:</label><select class='form-control' id='user-cat' ng-model='inputCategory'>" + dropDown + "</select>");
            popupObj.button_1 = true;
            popupObj.button_1_label = "Save";
            popupObj.button_2 = true;
            popupObj.button_2_label = "Cancel";
            $scope.dlg;
            popupObj.button_2_click = function () {
                $scope.dlg.close();
                $scope.dlg = null;
            };
            $scope.popup = popupObj;
            $scope.dlg = ngDialog.open({
                template: 'app/templates/add-item.html',
                className: 'ngdialog-theme-default',
                closeByDocument: false,
                closeByEscape: false,
                preserveFocus: false,
                trapFocus: false,
                scope: $scope,
                controller: ['$scope', 'sharepointRESTService', function ($scope, sharepointRESTService) {
                    $scope.popup;
                    $scope.popup.button_1_click = function () {
                        $scope.$parent.loaderShow = true;
                        var data = {
                            __metadata: {
                                'type': 'SP.Data.RAPListListItem'
                            },
                            Title: angular.element('#user-name').val(),
                            Category: angular.element('#user-cat').val(),
                        };
                        reRenderListItems(addQuery, data, "add");
                        $scope.dlg.close();
                        $scope.dlg = null;
                    };
                }]
            });
        };
    }
    myprofileCtrl.$inject = ['$scope', 'sharepointJSOMService', 'sharepointRESTService', 'ngDialog', '$sce', '$rootScope', 'formDigestService'];
    angular
    .module('RAP')
    .controller('myprofileCtrl', myprofileCtrl)
    .directive('userData', function userData() {
        return {
            restrict: "A",
            transclude: true,
            templateUrl: "app/templates/user-data.html",
            link: function ($scope, $element, $attr) {
                // directive modifications/data passing code can be written here
            }
        };
    });
}());