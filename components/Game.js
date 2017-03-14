/**
 * Created by MSviridenkov on 10.03.17.
 */
'use strict';
import React from 'react';
import Sound from 'react-sound';
import Square from './Square';

const myTurnStatus = 'It\'s your turn';
const opponentsTurnStatus = 'Waiting for the opponent\'s turn...';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            isMyTurn: this.props.host,
            status: this.props.host ? myTurnStatus : opponentsTurnStatus,
            buttonTransparent: true,
            playClickSound: false
        };

        this.changeStateAfterTurn = this.changeStateAfterTurn.bind(this);
    }

    componentDidMount() {
        this.props.socket.on('after opponent turn', this.changeStateAfterTurn);
    }

    /**
     * Изменяет состояние (состояние поля, может ли игрок ходить в данный момент,
     * статус игры) после совершенного кем-либо хода в зависимости от переданного
     * в параметрах массива состояний квадратов поля.
     * Для этого, в том числе, определяется: настала ли ничья; определился ли победитель, и кто он.
     * @param squares
     */
    changeStateAfterTurn(squares) {
        const draw = calculateDraw(squares);
        const winner = calculateWinner(squares);

        let newStatus;
        let newIsMyTurn = !this.state.isMyTurn;

        if (draw) {
            newStatus = 'DRAW!';
            newIsMyTurn = false;
        } else if (winner) {
            if ((winner === 'X' && this.props.host) || (winner === 'O' && !this.props.host)) {
                newStatus = 'YOU WIN!';
            } else {
                newStatus = 'YOU LOSE!';
            }
            newIsMyTurn = false;
        } else {
            newStatus = newIsMyTurn ? myTurnStatus : opponentsTurnStatus;
        }

        this.setState({
            squares: squares,
            isMyTurn: newIsMyTurn,
            status: newStatus,
            playClickSound: true
        });
    }

    /**
     * Изменяет состояние квадратов поля после клика на один из квадратов.
     * Сообщает серверу о том, что был совершен ход.
     * @param i
     */
    handleClick(i) {
        const squares = this.state.squares.slice();
        squares[i] = this.props.host ? 'X' : 'O';
        this.props.socket.emit('next turn', {squares: squares, host: this.props.host, roomId: this.props.roomId});
        this.changeStateAfterTurn(squares);
    }

    /**
     * Отрисовывает i-й квадрат поля.
     * @param i
     * @returns {XML}
     */
    renderSquare(i) {
        return <Square value={this.state.squares[i]}
                       isMyTurn={this.state.isMyTurn}
                       clicked={(this.state.squares[i] != null)}
                       host={this.props.host}
                       onClick={() => this.handleClick(i)} />;
    }

    render() {
        return (
            <div>
                <div>{this.state.playClickSound ? <Sound url="/sounds/click.wav" playStatus={Sound.status.PLAYING}/> : null}</div>
                <div className="status">{this.state.status}</div>
                <table className="board-table">
                    <tr id="row1">
                        <td>{this.renderSquare(0)}</td>
                        <td>{this.renderSquare(1)}</td>
                        <td>{this.renderSquare(2)}</td>
                    </tr>
                    <tr id="row2">
                        <td>{this.renderSquare(3)}</td>
                        <td>{this.renderSquare(4)}</td>
                        <td>{this.renderSquare(5)}</td>
                    </tr>
                    <tr id="row3">
                        <td>{this.renderSquare(6)}</td>
                        <td>{this.renderSquare(7)}</td>
                        <td>{this.renderSquare(8)}</td>
                    </tr>
                </table>
            </div>
        );
    }
}

/**
 * Определяет выявился ли победитель на основе переданного
 * в параметрах массива состояний квадратов поля.
 * Возвращает победителя (X или O) или null, если он не выявлен.
 * @param squares
 * @returns {*}
 */
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}


/**
 * Определяет, настала ли ничья.
 * @param squares
 * @returns {boolean}
 */
function calculateDraw(squares) {
    var draw = true;
    for (let i = 0; i < squares.length; i++) {
        draw = draw && (squares[i] != null);
    }
    return draw;
}

export default Game
