console.log('welcome to alfred-in-chrome');

document.body.addEventListener('keydown', function (e) {
	var key = e.key,
		alt = key.alt;
		if(key==',' && alt){
			show()
		}
})