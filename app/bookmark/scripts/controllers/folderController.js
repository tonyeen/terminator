/**
 * Created by tony on 16-6-11.
 */
(function () {
    'use strict';
    angular.module('bookmark')
        .controller('folderController', ['folderService', FolderController]);

    function FolderController(folderService){
        var self = this;

        self.folderTree=[];

        function loadFolderTree(){
            folderService.findTree().then(function(folderTree){
                self.folderTree = folderTree;
            });
        }

        function selectFolder(){}

        function createFolder(){}

        function editFolder(){}

        function saveFolder(){}

        function deleteFolder(){}
    }
})();