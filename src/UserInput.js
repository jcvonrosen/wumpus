import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UserInput extends Component {
    constructor(props){
        super(props);

        this.state = {
            currentInput: '',
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    render() {
        return (
        <div>
            {this.props.prompt} {this.state.currentInput}
            <input type="text" />
            <div className="cursor"></div>
        </div>
    )}

    handleKeyPress(event){
        const keycode = event.which || event.keyCode;

        if(isPrintable(keycode)){
            const currentInput = `${this.state.currentInput}${event.key}`;
            this.setState({
                currentInput: currentInput,
            });
        }

        if(keycode == 8 && this.state.currentInput.length > 0){
            const currentInput = this.state.currentInput.slice(0,-1);

            this.setState({
                currentInput: currentInput,
            });
        }

        if(keycode == 13){
            this.props.validator(this.state.currentInput.toUpperCase());
 
            this.setState({
                currentInput: '',
            });
        }
    }

    componentDidMount(){
        window.addEventListener('keydown', this.handleKeyPress);
    }
}

const isPrintable = (keycode) => {
    var valid = 
        (keycode > 47 && keycode < 58)   || // number keys
        keycode == 32  || // spacebar 
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223);   // [\]' (in order)

    return valid;
}

UserInput.propTypes = {
    validator: PropTypes.func,
    prompt: PropTypes.string.isRequired,
}

export default UserInput;