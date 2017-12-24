(function () {
    'use strict';

    angular
        .module('RAP')
        .factory('sharepointJSOMService', ['$http', '$q', '$rootScope', sharepointJSOMService]);

    /** @ngInject */
    function sharepointJSOMService($http, $q, $rootScope) {
        var baseUrl = SITE_URL;
        /* JSOM Request for getting current user,current user's group memberships */
        var getUserContext = function () {
            var deferred = $q.defer();
            var currentUserGroups = [];
            var currentUserGroupId = [];
            var context = new SP.ClientContext(SITE_URL);
            var web = context.get_web();
            var current_user = web.get_currentUser();
            context.load(current_user);
            var userGroups = current_user.get_groups();
            context.load(userGroups);
            context.executeQueryAsync(function () {
                var user = {};
                user.name = current_user.get_title();
                user.id = current_user.get_id();
                user.loginName = current_user.get_loginName() ? current_user.get_loginName().substring(7) : "";
                var groupEnumerator = userGroups.getEnumerator();
                while (groupEnumerator.moveNext()) {
                    var oGroup = groupEnumerator.get_current();
                    currentUserGroupId[currentUserGroupId.length] = oGroup.get_id(); //Permission groupID
                    currentUserGroups[currentUserGroups.length] = oGroup.get_title(); //Permission groupName
                }
                /* Checking user is member of a permission group or not */
                user.isInOwnerGroup = jQuery.inArray("CodeBox Owners", currentUserGroups) > -1;
                deferred.resolve(user);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        /* JSOM Request for getting items created by me */
        var retrieveListItems = function (userId) {
            var deferred = $q.defer();
            var listItemInfo = [];
            var clientContext = new SP.ClientContext(baseUrl);
            var oList = clientContext.get_web().get_lists().getByTitle('' + LIST_NAME.TARGETLIST + '');
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name="Author" LookupId="True"/><Value Type="Lookup">' + userId + '</Value></Eq></Where></Query></View>');
            var collListItem = oList.getItems(camlQuery);
            clientContext.load(collListItem);
            clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
                var listItemEnumerator = collListItem.getEnumerator();
                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    listItemInfo.push({
                        "Title": oListItem.get_item("Title"),
                        "Category": oListItem.get_item("Category")
                    });
                }
                deferred.resolve(listItemInfo);
            }, function onQueryFailed(sender, args) {
                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                deferred.reject(err);
            });
            return deferred.promise;
        };
        /*JSOM request to update the column values*/
        var batchUpdate = function (listName, idList, deferred) {
            deferred = deferred || $q.defer();
            var updatingID = [],
                k = 0,
                oListItem = null,
                clientContext = new SP.ClientContext(baseUrl),
                oList = clientContext.get_web().get_lists().getByTitle(listName);
            if (idList.length > 0) {
                for (k = 0; k < idList.length; k += 1) {
                    if (idList[k] !== undefined) {
                        oListItem = oList.getItemById(idList[k]);
                        oListItem.set_item("Category", "Learning");
                        oListItem.update();
                        updatingID[k] = oListItem;
                        clientContext.load(updatingID[k]);
                    } else {
                        break;
                    }
                }
            }
            clientContext.executeQueryAsync(function () {
                deferred.resolve();
            }, function (sender,args) {
                deferred.reject(args);
            });
            return deferred.promise;
        };
        /* JSOM request to delete columns values */
        var batchDelete = function (listName, deleteItems) {
            var deferred = $q.defer();
            var clientContext = SP.ClientContext(baseUrl);
            var oList = clientContext.get_web().get_lists().getByTitle('' + listName + '');
            deleteItemsLength = deleteItems.length;
            for (var i = 0; i < deleteItemsLength; i += 1) {
                var oListItem = oList.getItemById(deleteItems[i]);
                oListItem.deleteObject();
            }
            clientContext.executeQueryAsync(function () {
                deferred.resolve();
            }, function (sender,args) {
                deferred.reject(args);
            });
            return deferred.promise;
        }
        return {
            getUserContext: getUserContext,
            retrieveListItems: retrieveListItems,
            batchUpdate: batchUpdate,
            batchDelete: batchDelete
        };
    }

}());