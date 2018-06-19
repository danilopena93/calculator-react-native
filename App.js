import React, { Component } from 'react';

import { 
    View,
    Text, 
    AppRegistry,
    StyleSheet 
} 
from 'react-native';

import Style from './src/Style'
import InputButton from './src/InputButton'

const inputButtons = [
    [1, 2, 3, '/'],
    [4, 5, 6, '*'],
    [7, 8, 9, '-'],
    [0, '.', '=', '+']
]

var initialState;

export default class ReactCalculator extends Component {
    
    constructor(props) {
        super(props);
  
        this.state = {
            previousInputValue: 0,
            inputValue: 0,
            selectedSymbol: null,
            isDecimal : null,
            memorizedNumber: 0,
            history : ''
        }
  
        this.initialState = this.state;
    }
    
    render() {
        return (
            <View style={Style.rootContainer}>
                <View style={Style.displayContainer}>
                    <Text style={Style.displayText}>{this.state.inputValue}</Text>
                </View>
                <View style={Style.inputContainer}>
                    {this._renderInputButtons()}
                </View>
            </View>
        )
    }

    _renderInputButtons() {
        let views = [];

        for (var r = 0; r<inputButtons.length; r++) {
            let row = inputButtons[r];

            let inputRow = [];
            for (var i = 0; i< row.length; i ++) {
                let input = row[i];
                inputRow.push (
                    <InputButton 
                        value={input} 
                        highlight={this.state.selectedSymbol == input}
                        onPress={this._onInputButtonPressed.bind(this, input)}
                        key={r + '-' + i} />
                );
            }
            views.push(<View style={Style.inputRow} key={"row-" + r}>{inputRow}</View>)
        }
        return views;
    }

    _onInputButtonPressed(input) {
        switch (typeof input) {
            case 'number':
                return this._handleNumberInput(input)
            case 'string':
                return this._handleStringInput(input)
        }
    }

    _handleNumberInput(num) {
        let inputValue = (this.state.inputValue) * 10 + num

        this.setState({
            inputValue: inputValue
        })
    }

    _handleStringInput(str) {
        switch (str) {
            case '/':
            case '*':
            case '+':
            case '-':
                this.setState({
                    selectedSymbol: str,
                    previousInputValue: this.state.inputValue,
                    inputValue: 0,
                    isDecimal: null,
                    history: this.state.history + str
                });
                break;
            case '=':
                let symbol = this.state.selectedSymbol,
                    inputValue = this.state.inputValue,
                    previousInputValue = this.state.previousInputValue;
    
                if (!symbol) {
                    return;
                }
    
                result = eval(previousInputValue + symbol + inputValue);
    
                this.setState({
                    previousInputValue: 0,
                    inputValue: result,
                    selectedSymbol: null,
                    isDecimal: null,
                    history: this.state.history + str + result
                });
                break;
            case 'C':
                this.setState({
                    isDecimal: null,
                    selectedSymbol: null,
                    previousInputValue: 0,
                    inputValue: 0
                });
                break;
            case 'CE':
                this.setState({
                    isDecimal: this.initialState.isDecimal,
                    selectedSymbol: this.initialState.selectedSymbol,
                    previousInputValue: this.initialState.previousInputValue,
                    inputValue: this.initialState.inputValue,
                    history: this.initialState.history
                });
                break;
            case '.':
                let isDecimal = this.state.isDecimal;
                if(isDecimal) break;
    
                this.setState({
                    isDecimal: true,
                    inputValue: this.state.inputValue + str,
                    history: this.state.history + this.state.inputValue
                });
                break;
            case 'MC':
                this.setState({
                    memorizedNumber: 0
                });
                break;
            case 'MR':
                this.setState({
                    inputValue: this.state.memorizedNumber
                });
                break;
            case 'MS':
                this.setState({
                    memorizedNumber: this.state.inputValue,
                    inputValue: 0
                });
                break;
            case 'M+':
                memorizedNumber = this.state.memorizedNumber;
                inputValue = this.state.inputValue;
    
                this.setState({
                    inputValue: eval(memorizedNumber + "+" + inputValue)
                });
                break;
            }
    }
}