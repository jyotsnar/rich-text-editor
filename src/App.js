import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TextEditor from './textEditor';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Our New Rich Text Editor</h2>
        </div>
        <div className="App-intro">
          <TextEditor />
        </div>
      </div>
    );
  }
}

export default App;
