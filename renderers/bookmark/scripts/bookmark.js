/**
 * Created by tony on 16-6-10.
 */

$(function () {
    //$("#sidebar-folders").load("http://localhost:8080/folder/tree");
    var folderTreeSetting = {
        async: {
            enable: true,
            url: "http://localhost:8080/folder/tree"
        },
        callback: {
            onAsyncSuccess: onAsyncSuccess,
            onNodeCreated: onNodeCreated,
            onRename: onRename,
            beforeRemove: beforeRemove,
            onClick: onClick
        },
        view: {
            selectedMulti: false
        }
    };

    // var folderTree =
    $.fn.zTree.init($("#sidebar-folders"), folderTreeSetting);

    function onAsyncSuccess(event, treeId, treeNode, msg) {
        var folderTree = $.fn.zTree.getZTreeObj(treeId);
        // In this place, only loading at first time. So it would be the roots.
        var rootNodes = folderTree.getNodes();
        if (rootNodes.length > 0) {
            //folderTree.checkNode(rootNodes[0], true, false, true);
            folderTree.selectNode(rootNodes[0]);
            folderTree.expandNode(rootNodes[0], true, false, false, true);
            loadPages(rootNodes[0].id);
        }
    }

    function onNodeCreated(event, treeId, treeNode) {
        var folderTree = $.fn.zTree.getZTreeObj(treeId);
        //treeNode.isParent = true;
        treeNode.iconSkin = "folder";
        folderTree.updateNode(treeNode);
    }

    function onRename(event, treeId, treeNode, isCancel) {
        if (isCancel) {
            return;
        }
        var folderTree = $.fn.zTree.getZTreeObj(treeId);
        var parent = treeNode.getParentNode();
        $.post("http://localhost:8080/folder/save", {
            id: treeNode.id || null,
            name: treeNode.name,
            "parent.id": (parent ? parent.id : null)
        }, function (result) {
            if (result.id > 0) {
                treeNode.id = result.id;
            } else {
                if (confirm("Save folder failed. Try again?")) {
                    folderTree.editName(treeNode);
                } else {
                    if (!treeNode.id) {
                        folderTree.removeNode(treeNode);
                    }
                }
            }
        });
    }

    function beforeRemove(treeId, treeNode) {
        var folderTree = $.fn.zTree.getZTreeObj(treeId);
        $.ajax({
            type: "get",
            url: "http://localhost:8080/folder/" + treeNode.id + "/delete",
            //async: false,
            //dataType: "json",
            success: function (result) {
                console.log(result);
                if (result == "success") {
                    folderTree.removeNode(treeNode);
                }
            },
            error: function (result) {
            }
        });

        return false;
    }

    function onClick(event, treeId, treeNode, clickFlag) {
        var folderTree = $.fn.zTree.getZTreeObj(treeId);
        loadPages(treeNode.id);
    }

    function loadPages(folderId) {
        $("#product-content").html("");
        var pageList = $("<ul>").appendTo("#product-content");

        var url = "http://localhost:8080/folder/" + folderId + "/page/list";
        $.get(url, {}, function (result) {
            if (result.length > 0) {
                $(result).each(function (index, item) {
                    $("<li id='page-item-" + item.id + "'><img width='16' height='16' src='" + (item.favicon || "")
                        + "'/> <a href='javascript:openPage(\"" + item.url + "\")' title='"
                        + item.url + "'>" + item.name + "</a> <a class='page-delete pull-right' data-id='" +
                        item.id + "' href='javascript:onPageDelete(" + item.id + ");'>Delete</a></li>").appendTo(pageList);
                });
            }
        }, "json");
    }

    window.openPage = function (url) {
        var childProcess = require('child_process');  //Node.js module
        //process.platform 返回操作系统内核名称，已知可能值:'darwin', 'freebsd', 'linux', 'sunos' , 'win32'
        //console.log(process); //Node.js module
        //操作系统名称，基于linux的返回Linux,基于苹果的返回Darwin,基于windows的返回Windows_NT
        var os = require('os');   //Node.js module
        var type = os.type();
        var pp;
        if (type == "Linux") {
            pp = childProcess.exec("xdg-open " + url);
        } else if (type == "Darwin") {
            pp = childProcess.exec("open " + url);
        } else if (type == "Windows_NT") {
            pp = childProcess.exec("start " + url);
        }
        console.log(pp);
    };


    var treeId = "sidebar-folders";
    $(".add-folder").click(function (e) {
        var folderTree = $.fn.zTree.getZTreeObj(treeId);
        var selectedNodes = folderTree.getSelectedNodes();
        var newNode = folderTree.addNodes(selectedNodes[0], -1, {name: "New folder"});
        folderTree.editName(newNode[0]);
    });

    $(".rename-folder").click(function (e) {
        var folderTree = $.fn.zTree.getZTreeObj(treeId);
        var selectedNodes = folderTree.getSelectedNodes();
        if (selectedNodes.length == 0) {
            //TODO: to toggle active menu by node select status.
            alert("Please select a folder");
            return;
        }
        folderTree.editName(selectedNodes[0]);
    });

    $(".remove-folder").click(function (e) {
        var folderTree = $.fn.zTree.getZTreeObj(treeId);
        var selectedNodes = folderTree.getSelectedNodes();
        if (selectedNodes.length == 0) {
            //TODO: to toggle active menu by node select status.
            alert("Please select a folder");
            return;
        }
        folderTree.removeNode(selectedNodes[0], true);
    });

    $("button#page-form-save").click(function (e) {
        var folderTree = $.fn.zTree.getZTreeObj(treeId);
        var selectedNodes = folderTree.getSelectedNodes();
        if (selectedNodes.length == 0) {
            //TODO: to toggle active menu by node select status.
            alert("Please select a folder");
            return;
        }
        var url = "http://localhost:8080/folder/" + selectedNodes[0].id + "/page/save";
        var form = $("form#page-edit-form");
        $.ajax({
            type: "post",
            url: url,
            data: form.serialize(),
            success: function (result) {
                var pageList = $("div#product-content ul");
                $("<li id='page-item-" + result.id + "'><img width='16' height='16' src='" + (result.favicon || "")
                    + "'/> <a href='javascript:openPage(\"" + result.url + "\")' title='"
                    + result.url + "'>" + result.name + "</a> <a class='page-delete pull-right' data-id='" +
                    result.id + "' href='javascript:onPageDelete(" + result.id + ");'>Delete</a></li>").appendTo(pageList);
                $('#addPageModal').modal("hide");
            }
        });
    });

    //$("a.page-delete").click(onPageDelete);

    window.onPageDelete = function (pageId) {
        var url = "http://localhost:8080/folder/" + getSelectFolder().id + "/page/" + pageId + "/delete";
        $.get(url, function (result) {
            $("#page-item-" + pageId).remove();
        });
    }

    function getSelectFolder() {
        var folderTree = $.fn.zTree.getZTreeObj(treeId);
        var selectedNodes = folderTree.getSelectedNodes();
        if (selectedNodes.length == 0) {
            //TODO: to toggle active menu by node select status.
            alert("Please select a folder");
            return;
        }
        return selectedNodes[0];
    }
});