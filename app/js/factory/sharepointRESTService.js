(function () {
    'use strict';

    angular
        .module('RAP')
        .factory('sharepointRESTService', ['$http', '$q', '$rootScope', sharepointRESTService]);

    /** @ngInject */
    function sharepointRESTService($http, $q, $rootScope) {
        var baseUrl = SITE_URL;
        /*SP REST API GET Request : query should be passed*/
        var getRequest = function (query) {
            var deferred = $q.defer();
            $http({
                url: baseUrl + query,
                method: "GET",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "content-Type": "application/json;odata=verbose"
                }
            })
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (result, status) {
                    deferred.reject(status);
                });
            return deferred.promise;
        };
        /*SP REST API POST Request : data in appropriate format and url should be passed*/
        var postRequest = function (data, url) {
            var deferred = $q.defer();
            $http({
                url: baseUrl + url,
                method: "POST",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": $rootScope.formRequestDigest,
                    "content-Type": "application/json;odata=verbose"
                },
                data: JSON.stringify(data)
            })
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (result, status) {
                    deferred.reject(status);
                });
            return deferred.promise;
        };
        /* SP REST API Update Request for updating list item data in appropriate format and url should be passed*/
        var updateRequest = function (data, url) {
            var deferred = $q.defer();
            $http({
                url: baseUrl + url,
                method: "PATCH",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": $rootScope.formRequestDigest,
                    "content-Type": "application/json;odata=verbose",
                    "X-Http-Method": "PATCH",
                    "If-Match": "*"
                },
                data: JSON.stringify(data)
            })
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (result, status) {
                    deferred.reject(status);
                });
            return deferred.promise;
        };
        /* SP REST API DELETE Request : url should be passed */
        var deleteRequest = function (url) {
            var deferred = $q.defer();
            $http({
                url: baseUrl + url,
                method: "DELETE",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": $rootScope.formRequestDigest,
                    "IF-MATCH": "*"
                }
            })
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (result, status) {
                    deferred.reject(status);
                });
            return deferred.promise;
        };
        /* SP REST Request for getting list entity type name */
        var listItemEntityTypeFullName = function (name) {
            name = name.replace(/_/g, '_x005f_').replace(/-/g, '');
            return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
        };
        return {
            getRequest: getRequest,
            postRequest: postRequest,
            updateRequest: updateRequest,
            deleteRequest: deleteRequest,
            listItemEntityTypeFullName: listItemEntityTypeFullName
        };
    }

}());