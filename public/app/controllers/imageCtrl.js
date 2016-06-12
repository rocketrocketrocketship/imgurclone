angular.module('imageCtrl', [])

.controller('imageCtrl', function ($routeParams, $http) {
	var vm = this,
		submissionId = $routeParams.submissionId;
	vm.title = '';
	vm.links = [];
	vm.layoutIsSmall = true;
	vm.path = function (id) { 
		return 'https://s3-us-west-2.amazonaws.com/imgurclonebucket/' + id; 
	};
	$http.post('/img/submission', {"submissionId": submissionId})
		.success((data, status, headers, config) => {
	    	vm.links = data.pics;
	    	vm.title = data.title;
		}).
		error((data, status, headers, config) => {
	    	console.log('failure');
		});

})
.controller('frontImageCtrl', function ($routeParams, $http, $window) {
	var vm = this;
	vm.name = 'world';
	vm.submissions = {};
	vm.open = function (submissionId) {
		loc = '/show/' + submissionId;
		$window.location.href = loc;
	}
	vm.thumbnailPath = function (id) {
		return 'https://s3-us-west-2.amazonaws.com/imgurclonebucket-output/images/medium/' + id;
	};
	$http.get('/img/hot')
		.success((data, status, headers, config) => {
	    	vm.submissions = data;
		}).
		error((data, status, headers, config) => {
	    	console.log('failure');
		});
});
