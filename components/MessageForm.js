/**
 * Created by MSviridenkov on 12.03.17.
 */
'use strict';
import React from 'react';

class MessageForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    /**
     * Обрабатывает событие отправки сообщения из формы.
     * @param e
     */
    handleSubmit(e) {
        e.preventDefault();
        const message = {
            user: this.props.user,
            text: this.state.text
        }
        this.props.onMessageSubmit(message);
        this.setState({text: '' });
    }

    changeHandler(e) {
        this.setState({text: e.target.value });
    }

    render() {
        return(
            <div className='message-form'>
                <form onSubmit={this.handleSubmit}>
                    <input
                        className="chat-input"
                        onChange={this.changeHandler}
                        value={this.state.text}
                    />
                </form>
            </div>
        );
    }
}

export default MessageForm
