angular.module('uploadService', [])

.service('uploadService', function($http, $window) {
	var vm = this;
	vm.upload = function (data, length) {
		var xhr = new XMLHttpRequest();
		xhr.upload.onprogress = function(e) {
           if (e.lengthComputable) {
       			var percentComplete = Math.ceil((e.loaded / e.total) * 100);
       			$('.progressbar' ).css('display', 'block');
       			$('.innerprogress').css('width', percentComplete + '%');
   			}
        }
		xhr.open('POST', '/img/upload', true);
		xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
		xhr.setRequestHeader('files-length', length);
		xhr.onload = function () {
			if (xhr.status === 200) {
				var res = JSON.parse(xhr.response),
					submissionId = res.submissionId,
					loc = '/show/' + submissionId;
				$window.location.href = loc;
			} else {
				alert('An error occurred!');
			}
		};
		xhr.send(data);
	};
});