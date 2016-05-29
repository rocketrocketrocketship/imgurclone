angular.module('uploadService', [])

.service('uploadImage', function($http, $q, AuthToken) {
	var vm = this;
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
});