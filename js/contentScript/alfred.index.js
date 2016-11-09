console.log('welcome to alfred-in-chrome');

document.body.addEventListener('keydown', function (e) {
	var key = e.key,
		alt = e.altKey;
	if (key == ',' && alt) {
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