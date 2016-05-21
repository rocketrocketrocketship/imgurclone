angular.module('userApp', ['ngAnimate', 'app.routes', 'authService', 'mainCtrl', 'imageCtrl', 'userCtrl', 'userService'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');

});

