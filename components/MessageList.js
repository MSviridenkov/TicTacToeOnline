/**
 * Created by MSviridenkov on 12.03.17.
 */
'use strict';
import React from 'react';
import Message from './Message';

class MessageList extends React.Component {
    /**
     * Прокручивает чат до нижнего сообщения в списке сообщений.
     */
    scrollToBottom() {
        const scrollHeight = this.messageList.scrollHeight;
        const height = this.messageList.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        return (
            <div className='message-list' ref={(div) => {this.messageList = div;}}>
                {
                    this.props.messages.map((message, i) => {
                        return (
                            <Message
                                key={i}
                                user={message.user}
                                text={message.text}
                            />
                        );
                    })
                }
            </div>
        );
    }
};

export default MessageList
