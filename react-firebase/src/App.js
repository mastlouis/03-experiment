import React, { Component } from 'react';
import './App.css';
import fire from './firebase';

class App extends Component{

  state={
    inputText : "",
    test: "test"
  }

  changeText=e=>{
    this.setState({
      inputText : e.target.value
    });
  }

  submit=e=>{
    let dataRef = fire.database().ref('data').orderByKey();
    fire.database().ref('data').push(this.state);
    this.setState({
      inputText : ""
    });
    document.getElementById("inputText").value="";
  }

  render(){
    return (
      <div className="App-header">
        <input type="text" id="inputText" onChange={this.changeText}></input>
        <br/>
        <button onClick={this.submit}>Submit Data</button>
      </div>
    );
  }
}

export default App;
