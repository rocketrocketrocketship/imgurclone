angular.module('imageCtrl', [])

.controller('uploadController', function($rootScope, $window, Auth) { // here it all begins
	var vm = this;
	vm.name = "world!";
	vm.link = '';	
	vm.upload = function () {
		// get all user's files and append them to FormData so we can send them to the server
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
		var total = 20000;
		var xhr = new XMLHttpRequest();
		xhr.upload.onprogress = function(e) {
           if (e.lengthComputable) {
       			var percentComplete = Math.ceil((e.loaded / e.total) * 100);
       			document.querySelector('.progressbar').style.display = 'block';
       			document.querySelector('.innerprogress').style.width = percentComplete + '%';
   			}
        }
		xhr.open('POST', '/img/upload', true);
		xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
		xhr.setRequestHeader('files-length', files.length);
		xhr.onload = function () {
			if (xhr.status === 200) {
				// server responded. gotta check if it sent back an album or just single image
				// based on that we're gonna redirect user to single image page or to an album page
				var res = JSON.parse(xhr.response),
					imageId = res.imageId || res.albumId,
					loc = (res.imageId) ? '/show/' + imageId : '/showalbum/' + imageId;
				$window.location.href = loc;
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
})
.controller('albumController', function ($routeParams, $http) {
	var vm = this,
		albumId = $routeParams.albumId;
	vm.name = 'My album';
	vm.links = [];
	$http.post('/img/album', {"albumId": albumId})
		.success(function(data, status, headers, config) {
	    	vm.links = data;
		}).
		error(function(data, status, headers, config) {
	    	console.log('failure');
		});
});

