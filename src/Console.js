import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Console extends Component {
    constructor(){
        super();
    }

    render() {
        return (
            <>
                {this.props.log.map((line) => (
                    <div key={line.id}
                        style={{'textAlign': line.align}}
                    >{line.message}</div>
                ))}
                <div style={{ float:"left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>
            </>
        )}

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
    
    componentDidMount() {
        this.scrollToBottom();
    }
    
    componentDidUpdate() {
        this.scrollToBottom();
    }
}

Console.propTypes = {
    log: PropTypes.array.isRequired,
}

export default Console;