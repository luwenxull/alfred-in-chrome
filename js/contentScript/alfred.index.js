console.log('welcome to alfred-in-chrome');

document.body.addEventListener('keydown', function (e) {
	var key = e.key,
		code = e.code
	alt = e.altKey;
	if ((key == ',' || code == 'Comma') && alt) {
		e.stopPropagation();
		e.preventDefault();
		createAlfred()
	}
})

document.body.addEventListener('keydown', function (e) {
	var key = e.key,
		alt = e.altKey;
	// if(key==='')	
})