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
          <h2>Rich Text Editor Using <a href='https://draftjs.org/'>Draft.js</a> 
            &nbsp;and <a href='http://www.wiris.com/en/editor'>Wiris</a></h2>
        </div>
        <div className="App-intro">
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
          <TextEditor />
        </div>
      </div>
    );
  }
}

export default App;
