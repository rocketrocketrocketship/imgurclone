angular.module('imageCtrl', [])

.controller('uploadController', function($rootScope, $window, Auth) {
	var vm = this;
	vm.name = "awesome people";
	vm.link = '';	
	vm.upload = function () {
		var form 		= document.getElementById('uploadForm'),
			fileSelect  = document.getElementById('uploadFile'),
			files 		= fileSelect.files,
			formData 	= new FormData();
		
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			if (file.type.match('image.*')) {
				formData.append('photos', file);
			}
		}

		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/img/upload', true);
		xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
		xhr.onload = function () {
			if (xhr.status === 200) {
				var res = JSON.parse(xhr.response),
					imageId = res.imageId;
				$window.location.href = '/show/' + imageId;
			} else {
				alert('An error occurred!');
			}
		};
		xhr.send(formData);
	};

})
.controller('singleImageController', function ($routeParams, $http) {
	var vm = this,
		imageId = $routeParams.imageId;
	vm.link = '';

	$http.post('/img/single', {"imageId": imageId})
		.success(function(data, status, headers, config) {
	    	vm.link = data;
		}).
		error(function(data, status, headers, config) {
	    	console.log('failure');
		});
});
