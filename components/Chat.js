/**
 * Created by MSviridenkov on 12.03.17.
 */
'use strict';
import React from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: []
        }

        this.messageReceive = this.messageReceive.bind(this);
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    }

    componentDidMount() {
        this.props.socket.on('send:message', this.messageReceive);
    }

    /**
     * Добавляет полученное сообщение в массив сообщений.
     * @param message
     */
    messageReceive(message) {
        const messages = this.state.messages.slice();
        messages.push(message);
        this.setState({messages});
    }

    /**
     * Добавляет отправленное сообщение в массив сообщений.
     * Отправляет это сообщение серверу вместе с номером комнаты, в которой ведется чат.
     * @param message
     */
    handleMessageSubmit(message) {
        const messages = this.state.messages.slice();
        messages.push(message);
        this.props.socket.emit('send:message', {message: message, roomId: this.props.roomId});
        this.setState({messages});
    }

    render() {
        return (
            <div>
                <div>Chat</div>
                <MessageList
                    messages={this.state.messages}
                />
                <MessageForm
                    onMessageSubmit={this.handleMessageSubmit}
                    user={this.props.host ? 'host' : 'guest'}
                />
            </div>
        );
    }
}

export default Chat