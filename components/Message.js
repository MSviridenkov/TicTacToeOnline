/**
 * Created by MSviridenkov on 12.03.17.
 */
import React from 'react';

class Message extends React.Component {
    render() {
        return (
            <div className="message">
                <strong>{this.props.user}: </strong>
                <span>{this.props.text}</span>
            </div>
        );
    }
}

export default Message
