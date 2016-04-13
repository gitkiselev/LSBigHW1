var filteredArray = [];
var	  baseFriends = [];


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
			baseFriends = response.response; //Сохранение данных
			//Отрисовка
				var source = userlistTemplate.innerHTML;
				templateFn = Handlebars.compile(source);

				//Шаблон разметки для левого столбца
				var prep_array = response.response.map(function(t){
					var a = t;
					a.right = 0;
					return a;
				});
				template   = templateFn({list: prep_array});

				//Шаблон разметки для правого столбца
				prep_array = response.response.map(function(t){
					var a = t;
					a.right = 1;
					return a;
				});
				template2  = templateFn({list: prep_array});
				//
				friendsList.innerHTML 		= template;
				friendsListSorted.innerHTML = template2;
				//
				var rightContainer = friendsListSorted.querySelectorAll('.friends__item');
				for (var i = 0; i < rightContainer.length; i++){
					rightContainer[i].classList.add('hide');
				}
			//Окончание отрисовки

			
			console.log(response);
			if(response.error){
				reject(new Error(response.error.error_msg));
			}else{
				/*изменения*/
				if (localStorage.getItem('savedFriendsList')){
					var savedFriendsList = localStorage.getItem('savedFriendsList');
					var	savedFriendsList = JSON.parse(savedFriendsList);
					filteredArray = savedFriendsList;
					if(filteredArray.length) {
						filteredArray.forEach(function(t){
						document.querySelector('#friendsList [data-id="'+ t +'"]').classList.add('hide');
						document.querySelector('#friendsListSorted [data-id="'+ t +'"]').classList.remove('hide');
					})
					}
					
				

				} else {
					filteredArray = [];
				}
				
				resolve();
				
				
			}
		})
	})
}).then(function(){
	
	//Перенос друзей в правую колонку по клику на знак "+"
	friendsList.addEventListener('click',function(e){
		if (e.target.classList.contains('friends__add')){
			var fValue = e.target.closest('.friends__item').getAttribute('data-id');//берем выбранного друга
			friendsList.querySelector('[data-id="'+ fValue +'"]').classList.add('hide');//ставим ему display: none в левом столбце
			friendsListSorted.querySelector('[data-id="'+ fValue +'"]').classList.remove('hide');//ставим display: block в правом столбце
			filteredArray.push(fValue);//добавляем в правый массив отсортированных друзей
		}
		console.log(filteredArray);
	});
	
}).then(function(){
	//Перенос добавленных друзей в левую колонку по клику на знак "x"
	friendsListSorted.addEventListener('click',function(e){
		if (e.target.classList.contains('friends__added')){
			var fValue = e.target.closest('.friends__item').getAttribute('data-id');
			friendsList.querySelector('[data-id="'+ fValue +'"]').classList.remove('hide');
			friendsListSorted.querySelector('[data-id="'+ fValue +'"]').classList.add('hide');
			filteredArray = filteredArray.filter(function(t){ return t != fValue });
		}
		console.log(filteredArray);
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
		e.dataTransfer.setData("text", e.target.getAttribute('data-id'));
		return true;
	}
	
	function dragOver(e){
		e.preventDefault();
	}
	
	function dragDrop(e){
		console.log('drop');
		e.preventDefault();
		var friendDrop = e.dataTransfer.getData('text');
		console.log('droped:'+ friendDrop);
		var dropZone = document.querySelector('.elect-friends__list');
		var electList = document.querySelector('#friendsListSorted [data-id="'+ friendDrop +'"]');
		var baseList = document.querySelector('#friendsList [data-id="'+ friendDrop +'"]');
		filteredArray.push(friendDrop);
		console.log(filteredArray);
		electList.classList.remove('hide');
		baseList.classList.add('hide');
		return false;
	}

	function dragDropBack(e){
		console.log('backDrop');
		e.preventDefault();
		var friendDrop = e.dataTransfer.getData('text');
		console.log('dropedback:'+ friendDrop);
		var backDropZone = document.querySelector('.friends__list');
		var electList = document.querySelector('#friendsListSorted [data-id="'+ friendDrop +'"]');
		var baseList = document.querySelector('#friendsList [data-id="'+ friendDrop +'"]');
		baseFriends.push(friendDrop);
		console.log(baseFriends);
		electList.classList.add('hide');
		baseList.classList.remove('hide');
		return false;

	}
	//Получим коллекцию друзей для того, чтобы навесить обработчик события 'dragstart' на каждого
	var electList = document.querySelectorAll('.friends__item');
	for(var i = 0; i < electList.length; i++) {
		electList[i].addEventListener('dragstart', dragStart, false);
	}
	//Правая зона приемки
	var dropZone = document.querySelector('#friendsListSorted > ul');
	//Левая зона приемки
	var backDropZone = document.querySelector('#friendsList > ul');
	//Перетаскивание друзей в правую колону
	dropZone.addEventListener('dragover', dragOver, false);
	dropZone.addEventListener('drop', dragDrop, false);
	//Перетаскивание друзей обратно в левую колонку
	backDropZone.addEventListener('dragover', dragOver, false);
	backDropZone.addEventListener('drop', dragDropBack, false);

	
	//Поиск в правой форме

	rightSearch.addEventListener('keyup', function(e){
		var search = this.value;

		var filteredFriendArray = baseFriends.filter(function(e){
			return filteredArray.some(function(t){ return t == e.uid })
		}).filter(function(t){
			return (t.first_name + ' ' + t.last_name).toLowerCase().indexOf(search.toLowerCase()) != -1;
		});

		
		var allRightFriends = friendsListSorted.querySelectorAll('.friends__item:not(.hide)');
		for (var i = 0; i < allRightFriends.length; i++){
			if (filteredFriendArray.some(function(t){ return t.uid == allRightFriends[i].getAttribute('data-id') })) {
				allRightFriends[i].classList.remove('searched');
			} else {
				allRightFriends[i].classList.add('searched');
			}
		}

	});
	//Поиск в левой форме

	leftSearch.addEventListener('keyup', function(){
		var search = this.value;

		var filteredFriendArray = baseFriends.filter(function(t){
			return (t.first_name + ' ' + t.last_name).toLowerCase().indexOf(search.toLowerCase()) != -1;
		})


		var allLeftFriends = friendsList.querySelectorAll('.friends__item');
		for (var i = 0; i < allLeftFriends.length; i++){
			if (filteredFriendArray.some(function(t){ return t.uid == allLeftFriends[i].getAttribute('data-id') })) {
				allLeftFriends[i].classList.remove('searched');
			} else {
				allLeftFriends[i].classList.add('searched');
			}
		}

	});
	
	
}).then(function(){
	console.log('здесь будем сохранять в Local Storage');
	var saveButton = document.querySelector('.save__link');
	saveButton.addEventListener('click', function(e){
		e.preventDefault();
		console.log('press button save');
		localStorage.clear();//очищаем перед сохранением
		localStorage.setItem('savedFriendsList', JSON.stringify(filteredArray));
	}, false);

	
}).then(function(){
	/*console.log('Блок закрытия окна');
	var closeWindow = document.querySelector('.select__close-btn');
	closeWindow.addEventListener('click', function(){
		console.log('Нажали на крестик');
		window.close();
	});*/	
});

