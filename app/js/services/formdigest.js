(function() {
    'use strict';

    angular
        .module('RAP')
        .service('formDigestService', ['$http', '$q', formDigestService]);

    /** @ngInject */
    function formDigestService($http, $q) {
        //Define the headers
        $http.defaults.headers.common.Accept = "application/json;odata=verbose";
        $http.defaults.headers.post['Content-Type'] = 'application/json;odata=verbose';

        //Define the service call
        this.getFormDigest = function() {
            //Fetch the Url	
            var appweburl = decodeURIComponent(SITE_URL);
            var dfd = $q.defer();
            //Http post to the context info rest service
            $http.post(appweburl + "_api/contextinfo", {
                data: '',
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "text/xml"
                },
            }).success(function(data) {
                //Resolve the FormDigestValue from the success callback.
                dfd.resolve(data.d.GetContextWebInformation.FormDigestValue);
            }).error(function() {
                dfd.reject("Error finding form digest");
            });
            return dfd.promise;
        };
        this.startFormDigestInterval = function($rootScope) {
            var dfd = $q.defer();
            //Define a property on the rootScope called formRequestDigest
            if (!$rootScope.formRequestDigest) {
                $rootScope.formRequestDigest = "";
            }
            //Set the Form Digest Value to the $rootScope every 24 min
            this.getFormDigest().then(function(digest) {
                $rootScope.formRequestDigest = digest;
                setTimeout(function() {
                    startFormDigestInterval($rootScope);
                }, 1440000);
                dfd.resolve();
                return false;
            }, function(error) {
                console.error("Error retrieving form digest value: ", error);
                dfd.reject();
            });
            return dfd.promise;
        };
    }
}());