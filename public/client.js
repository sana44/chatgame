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
	var messages = document.getElementById('messages');
	var li=document.createElement('li');
	li.innerText = message.date + " " + message.userId + ": " + message.txt;
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
socket.on('users', function(users) {
	usersUl.innerHTML = users.map(u => '<li>' + u.nickname + '</li>').join('');
});

// Envoi d'un nouveau message
var msgform = document.getElementById('msgform');
msgform.addEventListener('submit', function(e){
	e.preventDefault();
	socket.emit('msg', this.message.value);
	this.message.value = '';
});

// Autofocus sur le champ de texte
msgform.message.focus(); 


