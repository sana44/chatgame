//côté server
const uuid = require ('uuid/v4');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const settings = require('./settings');

// Instanciation du serveur web, de Express et de Socket.io
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

//const port = 8080;

// Lancement du serveur HTTP
server.listen(settings.port, ()=>{
	console.log('Listening on port ' + settings.port);
});

/*app.get('/', function (req, res) {//envoyer index.html quand on est à la racine
  res.sendfile(__dirname + '/index.html');
});*/

// Contenu du dossier public accessible sur le web
app.use('/', express.static(__dirname + '/public'));

//initialisation de la liste de users
	const users = [];

// Connexion des clients socket.io
io.on('connection', (socket) => {	
	console.log('User (' + socket.id + ') vient de se connecter');

	//création du user
	const user = {
		id: socket.id,
		nickname: settings.defaultNicknames[Math.floor(Math.random() * settings.defaultNicknames.length)]
	};
	
	//envoie d'un nouveau user à la liste de users
	users.push(user);

	//envoie de la liste de clients au client
	io.emit('users', users);		 	
	
	//écoute du message client
	socket.on('msg', (txt) => {
		const message = {
			id: uuid(),
			userId: user.id,
			txt: txt,//txt:txt c'est la même que mettre txt (valable qu'à partir de ECMAscript6 )
			date: new Date()
		};	
		io.emit('msg', message);
	});

	//ecoute du msg nick
	socket.on('nick', (nickname) => {
		user.nickname = nickname;
		socket.emit('users', users);
	});

    // Déconnexion de l'utilisateur
    socket.on('disconnect', (user) => {
        console.log('User (' + socket.id + ') vient de se déconnecter');
		// Suppression du user de la liste
		users.splice(users.indexOf(user),1);
		//envoie de la nouvelle liste de users
		io.emit('users', users);
    });
	
	
	/*const newuser = Object.keys(user).map(function(id) {
		console.log(socket.id);
	});*/
	
});


