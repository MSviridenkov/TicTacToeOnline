/**
 * Created by MSviridenkov on 10.03.17.
 */
'use strict';
import React from 'react';
import Game from './Game';
import Chat from './Chat';

var socket = io();
const roomIsAlreadyFullStatus = 'Room is already full.\n To create your own game open this link:\n localhost:3000';
const roomDoesNotExistStatus = 'Room does not exist.\n To create your own game open this link:\n localhost:3000';
const invitationStatus = 'Send this link to the second player:\n localhost:3000/';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: null,
            showGame: false,
            host: false,
            appStatus: null,
            showAppStatus: false
        };

        this.setInviteLink = this.setInviteLink.bind(this);
        this.startGame = this.startGame.bind(this);
        this.roomIsFull = this.roomIsFull.bind(this);
        this.roomDoesNotExist = this.roomDoesNotExist.bind(this);
    }

    componentDidMount() {
        socket.on('set invite link', this.setInviteLink);
        socket.on('start game', this.startGame);
        socket.on('room is full', this.roomIsFull);
        socket.on('room does not exist', this.roomDoesNotExist);
    }

    /**
     * Устанавливает статус с ссылкой-приглашением и делает клиента хостом.
     * @param roomId
     */
    setInviteLink(roomId) {
        this.setState({
            appStatus: invitationStatus + roomId,
            showAppStatus: true,
            host: true});
    }

    /**
     * Скрывает статус и показывает игру.
     * @param roomId
     */
    startGame(roomId) {
        this.setState({roomId: roomId, showAppStatus: false, showGame: true});
    }

    roomIsFull() {
        this.changeAppStatus(roomIsAlreadyFullStatus);
    }

    roomDoesNotExist() {
        this.changeAppStatus(roomDoesNotExistStatus);
    }

    /**
     * Изменяет статус на статус, переданный в параметрах.
     * @param status
     */
    changeAppStatus(status) {
        this.setState({
            showAppStatus: true,
            appStatus: status
        });
    }

    render() {
        return(
            <div className="app">
                <div className="appStatus">{this.state.showAppStatus ? this.state.appStatus : null}</div>
                <div className="game">{this.state.showGame ? <Game socket={socket} roomId={this.state.roomId} host={this.state.host} /> : null}</div>
                <div className="game">{this.state.showGame ? <Chat socket={socket} roomId={this.state.roomId} host={this.state.host} /> : null}</div>
            </div>
        );
    }
}

export default App