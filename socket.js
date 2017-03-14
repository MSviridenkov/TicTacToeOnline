/**
 * Created by MSviridenkov on 09.03.2017.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var roomId;
var byInvite = false;

app.use(express.static(__dirname + '/public'));

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

/**
 * Устанавалиет, что игрок пришел по инвайту.
 * Сохраняет номер комнаты из инвайта.
 */
app.get('/:id', function(req, res) {
    roomId = (req.url).substr(1);
    byInvite = true;
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    /**
     * Если игрок пришел не по инвайту, значит он хост.
     * В таком случае, придумываем ему номер комнаты; добавляем его в эту комнату;
     * говорим ему показать ссылку с инвайтом на эту комнату.
     *
     * Иначе - игрок пришел по инвайту.
     * В таком случае смотрим на комнату, в которую хочет войти игрок.
     * Если комната существует - проверяем, есть ли в ней место.
     * Если есть - добавляем его в эту комнату и говорим всем в комнате,
     * что можно начинать игру.
     * Если же места в комнате нет - отправляем игроку сообщение об этом.
     * Если комнаты не существует - отправляем игроку сообщение об этом.
     */

    if (!byInvite) {
        roomId = Math.round((Math.random() * 1000000));
        socket.join('room-' + roomId);
        socket.emit('set invite link', roomId);
    } else {
        let room = io.sockets.adapter.rooms['room-' + roomId];
        if (room) {
            if (room.length < 2) {
                socket.join('room-' + roomId);
                io.sockets.in('room-' + roomId).emit('start game', roomId);
            } else {
                socket.emit('room is full');
            }
        } else {
            socket.emit('room does not exist');
        }
    }
    byInvite = false;

    /**
     * Если кто-то походил - сообщаем остальным (оппоненту) в комнате об этом.
     * Вместе с сообщением отправляем состояние квадратов после совершенного хода.
     */
    socket.on('next turn', function(data) {
        socket.to('room-' + data.roomId).emit('after opponent turn', data.squares);
    });

    /**
     * Если кто-то отправил сообщение в чат - пересылаем это сообщение остальным (оппоненту) в комнате.
     */
    socket.on('send:message', function (data) {
        socket.to('room-' + data.roomId).emit('send:message', {
            user: data.message.user,
            text: data.message.text
        });
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
