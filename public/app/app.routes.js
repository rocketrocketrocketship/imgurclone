angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl : 'app/views/pages/home.html',
            controller: 'frontImageCtrl',
            controllerAs: 'submission'
        })
        .when('/show/:submissionId', {
            templateUrl: 'app/views/pages/album.html',
            controller: 'imageCtrl',
            controllerAs: 'images'
        })
        
    $locationProvider.html5Mode(true);

});