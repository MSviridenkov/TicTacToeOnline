/**
 * Created by MSviridenkov on 10.03.17.
 */
'use strict'
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class Square extends React.Component {
    /**
     * Отрисовывает в квадрате поля либо кнопку, если еще не был произведен клик по данному квадрату,
     * либо соответсвующее изображение (крест или круг, в зависимости от того, кто сделал клик),
     * если клик был произведен.
     * Изображение отрисовывается с анимацией.
     * @returns {XML}
     */
    render() {
        var imgSrc;
        if (this.props.value === 'X') {
            imgSrc = "/images/cross.png";
        } else if (this.props.value === 'O') {
            imgSrc = "/images/circle.png";
        }

        var squareView;
        if (!this.props.clicked) {
            squareView = <button className="squareButton"
                                 disabled={!this.props.isMyTurn}
                                 onClick={() => this.props.onClick()}>
                         </button>
        } else {
            squareView = <ReactCSSTransitionGroup
                            transitionName="square"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={300}
                            transitionAppear={true}
                            transitionAppearTimeout={500}>
                            <img src={imgSrc} className="square-img"/>
                         </ReactCSSTransitionGroup>;
        }

        return (
            <div>{squareView}</div>
        );
    }
}

export default Square
