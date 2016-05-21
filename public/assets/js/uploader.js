// var form = document.getElementById('uploadForm'),
// 	fileSelect = document.getElementById('uploadFile');

// form.onsubmit = function(event) {
// 	event.preventDefault();

// 	var files = fileSelect.files,
// 		formData = new FormData();
	
// 	for (var i = 0; i < files.length; i++) {
// 		var file = files[i];
// 		if (file.type.match('image.*')) {
// 			formData.append('photos', file);
// 		}
// 	}

// 	var xhr = new XMLHttpRequest();
// 	xhr.open('POST', '/img/upload', true);
// 	xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
// 	xhr.onload = function () {
// 		if (xhr.status === 200) {
// 			var link = xhr.responseText.location;
// 		} else {
// 			alert('An error occurred!');
// 		}
// 	};
// 	xhr.send(formData);
// };
