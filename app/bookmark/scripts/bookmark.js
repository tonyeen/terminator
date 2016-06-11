/**
 * Created by tony on 16-6-11.
 */
(function () {
    'use strict';

    var _templateBase = './views';

    angular.module('bookmark', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate'
    ])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: _templateBase + '/bookmark.html',
                controller: 'folderController',//['folderController', 'pageController'],
                controllerAs: 'ctrl'//['_fc', '_pc']
            });
            $routeProvider.otherwise({redirectTo: '/'});
        }
        ]);

})();
