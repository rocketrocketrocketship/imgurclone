angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl : 'app/views/pages/home.html',
            controller: 'uploadController',
            controllerAs: 'image'
        })

        .when('/show/:imageId', {
            templateUrl: 'app/views/pages/image.html',
            controller: 'singleImageController',
            controllerAs: 'single'
        })
        .when('/showalbum/:albumId', {
            templateUrl: 'app/views/pages/album.html',
            controller: 'albumController',
            controllerAs: 'album'
        })
        .when('/show', {
            templateUrl: 'app/views/pages/image.html',
            controller: 'singleImageController',
            controllerAs: 'single'
        })

    $locationProvider.html5Mode(true);

});