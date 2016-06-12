angular.module('uploadCtrl', [])

.controller('uploadController', function($rootScope, $window, uploadService) {
	var vm = this;
	vm.closeModal = function () {
		$('#overlay').removeClass('overlay');
		$('#modal').removeClass('modalShow');
		$('body').css('position', 'static');
	};
	vm.upload = function () {
		var submissionTitle 	= $('#uploadForm')[0].elements['submissionTitle'].value,
			files  				= $('#uploadFile').prop("files"),
			formData 			= new FormData();
		formData.append(submissionTitle, submissionTitle);
		$.each(files, (i, file) => {
			if (file.type.match('image.*')) {
				formData.append('photos', file);
			}
		});

		uploadService.upload(formData, files.length);
	};
});