import React, { Component } from 'react';
import './App.css';

import _ from '../node_modules/lodash';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

var possibleCombinationSum = function(arr, n) {
    if (arr.indexOf(n) >= 0) { return true; }
    if (arr[0] > n) { return false; }
    if (arr[arr.length - 1] > n) {
        arr.pop();
        return possibleCombinationSum(arr, n);
    }
    var listSize = arr.length,
        combinationsCount = (1 << listSize)
    for (var i = 1; i < combinationsCount; i++) {
        var combinationSum = 0;
        for (var j = 0; j < listSize; j++) {
            if (i & (1 << j)) { combinationSum += arr[j]; }
        }
        if (n === combinationSum) { return true; }
    }
    return false;
};

const Star = (props) => {

    let star = [];
    for (let i = 0; i < props.NbrStar; i++) {
        star.push( <
            i key = { i }
            className = "fa fa-star" > * < /i>);

        }
        return ( <
            div className = "col-5" > { star } <
            /div>
        );
    }


    const Number = (props) => {

        const NumberClassName = (number) => {
            if (props.usedNumbers.indexOf(number) >= 0) {
                return 'used';
            }
            if (props.selectedNumbers.indexOf(number) >= 0) {
                return 'selected';
            }
        }
        return ( <
            div className = "cards text-center" > {
                Number.List.map((number, i) =>
                    <
                    span key = { i }
                    className = { NumberClassName(number) }
                    onClick = {
                        () => props.selectedNumber(number)
                    } > { number } < /span>
                )
            } <
            /div>

        );

    }
    Number.List = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const Button = (props) => {
        let butt;
        switch (props.correctAnswer) {
            case true:
                butt = <
                    button onClick = { props.acceptAnswer } > < i className = "fa fa-check" > v < /i>< /button > ;

                break;
            case false:
                butt = <
                    button > f < /button>;
                break;
            default:
                butt = <
                    button disabled = { props.selectedNumbers.length === 0 }
                onClick = {
                    () => props.answerCheck()
                } > = < /button>;
                break;
        }
        return ( <
            div ClassName = "col-5" > { butt } <
            span > < /span> <
            button onClick = { props.refrech }
            disabled = { props.redraw === 0 } > r { props.redraw } < /button> < /
            div >
        );
    }


    const Answer = (props) => {
        return ( <
            div ClassName = "col-2" > {
                props.selectedNumbers.map((Number, i) =>
                    <
                    span key = { i }
                    onClick = {
                        () => props.unselectNbr(Number)
                    } > { Number } < /span>
                )
            } <
            /div>
        );
    }



    const DonState = (props) => {
        return (

            <
            div className = "text-center " >
            <
            h2 > { props.doneState } < /h2> <
            button onClick = { props.resetGame } >
            Play Again <
            /button> < /
            div >

        );
    }

    class Game extends React.Component {
        static rondomNumber = () => 1 + Math.floor(Math.random() * 9);
        static initial = () => ({
            selectedNumbers: [],
            NbrStar: Game.rondomNumber(),
            correctAnswer: null,
            usedNumbers: [],
            redraw: 5,
            doneState: null
        });
        state = Game.initial();

        resetGame = () => this.setState(Game.initial());
        selectedNumber = (clickedNumber) => {
            if ((this.state.selectedNumbers.indexOf(clickedNumber) < 0) && (this.state.usedNumbers.indexOf(clickedNumber) < 0)) {
                this.setState(prevState => ({
                    correctAnswer: null,
                    selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
                }));
            }
        };
        unselectNbr = (clickedNumber) => {

            this.setState(prevState => ({
                correctAnswer: null,
                selectedNumbers: prevState.selectedNumbers
                    .filter(number => number !== clickedNumber)
            }));
        };

        answerCheck = () => {
            this.setState(prevState => ({
                correctAnswer: prevState.NbrStar === prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
            }));
        }

        refrech = () => {
            this.setState(prevState => ({
                correctAnswer: null,
                selectedNumbers: [],
                NbrStar: Game.rondomNumber(),
                redraw: prevState.redraw - 1


            }), this.updateDoneState);
        };
        acceptAnswer = () => {

            this.setState(prevState => ({
                usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
                correctAnswer: null,
                selectedNumbers: [],
                NbrStar: Game.rondomNumber()
            }), this.updateDoneState);

        };

        possibleSolution = ({ NbrStar, usedNumbers }) => {
            const possibl = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(number => usedNumbers.indexOf(number) === -1);
            return possibleCombinationSum(possibl, NbrStar);
        }


        updateDoneState = () => {
            this.setState(prevState => {
                if (prevState.usedNumbers.length === 9) {
                    return { doneState: "done Nice you win the game " };
                }
                if (prevState.redraw === 0 && !this.possibleSolution(prevState)) {
                    return { doneState: 'Game over you lose' };
                }
            });
        }


        render() {

            const { selectedNumbers, NbrStar, correctAnswer, usedNumbers, redraw, doneState } = this.state;

            return ( <
                    div >
                    <
                    h3 > hello < /h3> <
                    div ClassName = "row" >

                    <
                    Star NbrStar = { NbrStar }
                    /> <
                    Button selectedNumbers = { selectedNumbers }
                    answerCheck = { this.answerCheck }
                    acceptAnswer = { this.acceptAnswer }
                    correctAnswer = { correctAnswer }
                    refrech = { this.refrech }
                    redraw = { redraw }
                    />

                    <
                    Answer selectedNumbers = { selectedNumbers }
                    unselectNbr = { this.unselectNbr }
                    />

                    <
                    hr / >
                    <
                    /div> {
                    doneState ?

                    <
                    DonState doneState = { doneState }
                    resetGame = { this.resetGame }
                    />:

                    <
                    Number selectedNumbers = { selectedNumbers }
                    usedNumbers = { usedNumbers }
                    selectedNumber = { this.selectedNumber }
                    />
                } <
                /div>
        );
    }
}


class App extends Component {
    render() {
        return ( <
            div >
            <
            Game / >
            <
            /div>
        );
    }
}

export default App;