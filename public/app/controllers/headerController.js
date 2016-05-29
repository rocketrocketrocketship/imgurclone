angular.module('headerCtrl', [])

.controller('headerCtrl', function($rootScope, $window, uploadService) {
	var vm = this;
	vm.openUploadModal = function () {
		$('#overlay').addClass('overlay');
		$('#modal').addClass('modalShow');
		$('body').css('position', 'fixed');
	}
});