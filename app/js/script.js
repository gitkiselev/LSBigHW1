new Promise(function(resolve){
	if(document.readyState === 'complete'){
		resolve();
	} else{
		window.onload = resolve;
	}
}).then(function(){
	return new Promise(function(resolve, reject){
		VK.init({
			apiId: 5384272
		});
		VK.Auth.login(function(response){
			if (response.session){
				   //console.log('Авторизация прошла успешно');
				   resolve(response);
			}
				else {
				   console.log('Ошибка при авторизации');
			}
		},2);
	});
}).then(function(){
	return new Promise(function(resolve, reject){
		VK.api('friends.get', {fields: "uid,photo_50"}, function(response){
			console.log(response);
			if(response.error){
				reject(new Error(response.error.error_msg));
			}else{
				var source = userlistTemplate.innerHTML;
				templateFn = Handlebars.compile(source);
				template   = templateFn({list: response.response});
				friendsList.innerHTML = template;
				resolve();
			}
		})
	})
}).then(function(){
	//Перенос друзей в правую колонку по клику на знак плюс
	var plusButton = document.querySelectorAll('.friends__add');
	var electList = document.querySelector('.elect-friends__list');
	var frItem = document.querySelectorAll('.friends__item');
	var frList = document.querySelector('.friends__list');

	frList.addEventListener('click', function(event){
		//console.log('работает');
		var target = event.target;
		if (target.classList.contains('friends__add')) {
			electList.appendChild(target.parentNode);
			//target.style.backgroundImage = 'url(../img/remove-btn.png)';
			//target.style.width = '14px';
			//target.style.heigth = '14px';
			target.classList.remove('friends__add');
			target.classList.add('friends__added');
		}
		
	});
}).then(function(){
	//console.log('Здесь будет код для обратного переброса');
	var electList = document.querySelector('.elect-friends__list');
	var frList = document.querySelector('.friends__list');
	electList.addEventListener('click', function(){
		var target = event.target;
		if (target.classList.contains('friends__added')) {
			frList.appendChild(target.parentNode);
			target.classList.add('friends__add');
			target.classList.remove('friends__added');
		}
	});
}).then(function(){
	console.log('Здесь будет перетаскивание элементов');
	var frItem = document.querySelectorAll('.friends__item');
	for (var i = 0; i < frItem.length; i++) {
		frItem[i].setAttribute('draggable', 'true');
	}
	
		
}).then(function(){
	
	function dragStart(e){
		console.log("dragStart");
		e.dataTransfer.effectAllowed = "move";
		var qq = e.dataTransfer.setData("text", e.target.getAttribute('data-id'));
		return true;
		
	}
	function dragOver(e){
		console.log('dragover');
		e.preventDefault();
	}
	function dragDrop(e){
		
            
		
		console.log('drop');
		e.preventDefault();
		e.dataTransfer.getData('text/plain', e.target.getAttribute('data-id'));
		var electList = document.querySelector('.elect-friends__list');
		for(var i = 0; i < electList.length; i++) {
			
			electList.appendChild(qq);
		}
		
		
		return false;
	}
	
	var electList = document.querySelector('.elect-friends__list');
	for(var i = 0; i < electList.length; i++) {
		electList.addEventListener('dragstart', dragStart, false);
	}
	
	var electList = document.querySelector('.elect-friends__list');
	electList.addEventListener('dragover', dragOver, false);
	electList.addEventListener('drop', dragDrop, false);
	
	
	

});









		

		







