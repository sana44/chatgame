// Connexion au serveur Socket.io
// avec la même adresse (host + port) que la  page courante
var socket = io();//on est sur la même adresse, même port => pas besoin de repréciser le port

// Log lorsqu'on est bien connecté
socket.on('connect', function() {
	console.log('Connecté!');
});


// Réception d'un nouveau message
// et ajout dans la liste
socket.on('msg', function(message) {
	// Récupération du user expéditeur du message et de son nickname
	var user = users.filter(function(user){
		return user.id === message.userId;
	})[0];
	var nickname = user ? user.nickname : "anonyme";
	var messages = document.getElementById('messages');
	var li = document.createElement('li');
	li.innerText = message.date + " " + nickname + ": " + message.txt;
	messages.appendChild(li);
});

/* Ma méthode
Réception de la nouvelle liste des connectés
// de type [{id, nickname}, ...]
socket.on('users', function(users) {
	var users = document.getElementById('users');
	var li=document.createElement('li');
	li.innerText = users.map(u => u.nickname);
	utilisateurs.appendChild(li);;
});*/

// Réception de la nouvelle liste des connectés
// de type [{id, nickname}, ...]
var usersUl = document.querySelector('#users ul');
var users = [];
socket.on('users', function(_users) {
	users = _users;
	usersUl.innerHTML = _users.map(u => '<li>' + u.nickname + '</li>').join('');
});

// Envoi d'un nouveau message
var msgform = document.getElementById('msgform');
msgform.addEventListener('submit', function(e){//le e est une instance d'event
	e.preventDefault();
	//texte du champ
	var txt = this.message.value;
	//commande /nick pour changer de pseudo
	if(txt.indexOf('/nick') === 0){
		var nickname = txt.substring(6);
		socket.emit('nick', nickname);
	}else{
		//Envoi d'un message normal
		socket.emit('msg', txt);
	}
	this.message.value = '';

	/*socket.emit('msg', this.message.value);
	const nick = this.message.value.substring(0, 6);
	if(nick === this.message.value.indexOf('/nick')){
		socket.emit('nick', 'bob');
	}
	this.message.value = '';*/

});

// Autofocus sur le champ de texte
msgform.message.focus(); 


