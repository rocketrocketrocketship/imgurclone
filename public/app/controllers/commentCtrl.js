angular.module('commentCtrl', [])

.controller('commentCtrl', function($rootScope, $window, $routeParams, $http) {
	var vm = this;
	vm.commentForm = false;
	vm.submissionId = $routeParams.submissionId;
	vm.comments = [];
	vm.collectComments = function () {
		if (vm.commentForm) {
			var username 	= $('#commentForm')[0].elements['user'].value,
				userContent = $('#commentForm')[0].elements['userContent'].value;
			if (username.length > 0 && userContent.length > 0) {
				$http.post('/cmnt/submission', {
					'submissionId': vm.submissionId,
					'username': username, 
					'userContent': userContent})
				.success((data, status, headers, config) => {
		    		vm.comments.unshift(data.comment);
					vm.commentForm = false;
				}).
				error((data, status, headers, config) => {
			    	console.log('failure');
				});
			}
		}
	}

	$http.get('/cmnt/comments', {
			params: {'submissionId': vm.submissionId}})
		.success((data, status, headers, config) => {
    		vm.comments = data.comments;
		}).
		error((data, status, headers, config) => {
	    	console.log('failure');
		});
});

