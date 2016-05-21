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
        .when('/show', {
            templateUrl: 'app/views/pages/image.html',
            controller: 'singleImageController',
            controllerAs: 'single'
        })

    $locationProvider.html5Mode(true);

});