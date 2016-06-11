/**
 * Created by tony on 16-6-11.
 */
(function () {
    'use strict';

    angular.module('bookmark')
        .service('folderService', ['$http', FolderService]);

    function FolderService($http) {
        return {
            findTree: findTree,
            save: save,
            remove: remove
        };

        function findTree() {

        }

        function save() {

        }

        function remove() {

        }
    }
})();