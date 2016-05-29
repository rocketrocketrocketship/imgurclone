angular.module('uploadCtrl', [])

.controller('uploadController', function($rootScope, $window, uploadService) { // here it all begins
	var vm = this;
	vm.closeModal = function () {
		$('#overlay').removeClass('overlay');
		$('#modal').removeClass('modalShow');
		$('body').css('position', 'static');
	};
	vm.upload = function () {
		var form 		= $('#uploadForm'),
			files  		= $('#uploadFile').prop("files"),
			formData 	= new FormData();

		$.each(files, (i, file) => {
			if (file.type.match('image.*')) {
				formData.append('photos', file);
			}
		});

		uploadService.upload(formData, files.length);
	};
});