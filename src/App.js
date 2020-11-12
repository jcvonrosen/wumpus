import React, { Component } from 'react';
import './App.css';
import resources from './game/resources';
import Game from './game/Game';
import Hud from './Hud';
import Console from './Console';
import UserInput from './UserInput';

class App extends Component {
  constructor(props) {
    super(props);

    this.logCount = 0;
    this.state = {
      log: [],
      userPrompt: '',
      validator: () => true,
    };
  }

  consoleWrite = (message, align) => {
    const logItem = { message, align, id: this.logCount++ };

    const newLog = this.state.log.concat(logItem);

    this.setState({
      log: newLog,
    });
  };

  prompt = (message, validator) => new Promise((resolve) => {
    this.setState({
      userPrompt: message,
      validator: (action) => {
        const isValid = !validator || validator(action);

        if (isValid) {
          this.consoleWrite(`${message} ${action}`);
          resolve(action);
        }
      },
    });
  });

  game = new Game(this.consoleWrite, this.prompt);

  initGame = async () => {
    const [header, prompt] = await resources.getResources('Header', 'Instructions-Input');

    this.consoleWrite(header, 'center');
    const instructions = await this.prompt(
      prompt,
      (action) => ['Y', 'N'].includes(action.toUpperCase()),
    );

    if (instructions === 'Y') {
      this.showInstructions();
    } else {
      this.runGame();
    }
  }

  showInstructions = async () => {
    const instructions = await resources.getResource('Instructions');
    this.consoleWrite(instructions);
    this.runGame();
  }

  runGame = async () => {
    await this.game.runGame();

    // ToDo: play again?
    this.prompt('Just refresh to play again.', () => false);
  }

  render() {
    return (
      <div>
        <header className="App-header">
          <div className="Console-view">
            <Console log={this.state.log} />
          </div>
          <div className="User-view">
            <UserInput
              prompt={this.state.userPrompt}
              validator={this.state.validator}
            />
          </div>
          <div className="Map-view">
            <Hud currentRoom={this.game.Cave.CurrentRoom} />
          </div>
        </header>
      </div>
    );
  }

  componentDidMount() {
    this.initGame();
  }
}

export default App;
