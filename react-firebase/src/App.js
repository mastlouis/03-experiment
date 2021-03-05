import React, { Component } from 'react';
import './App.css';
import fire from './firebase';

class Experiment extends Component{
  constructor(props) {
    super(props);
    let firstNumbers = generateHighLow()
    let firstTrial = {
      guess: null,
      high: firstNumbers.high,
      low: firstNumbers.low,
    };
    this.state = {
      trials: [firstTrial],
      select: 'Experiment',
      survey: {
        familiarity: "little",
      }
    };
  }

  nextTrial = guess => {
    const trials = this.state.trials.slice();
    trials[trials.length - 1].guess = guess;
    let nextNumbers = generateHighLow();
    trials.push({
      guess: null,
      high: nextNumbers.high,
      low: nextNumbers.low,
    });
    this.setState({
      trials: trials,
      select: 'Experiment',
      survey: this.state.survey,
    })
  }

  handleChange=e=> {
    this.setState({
      trials: this.state.trials,
      select: e.target.value,
      survey: this.state.survey,
    })
  }

  submitSurvey = response => {
    this.setState({
      trials: this.state.trials,
      select: this.state.select,
      survey: response,
    })
  }

  renderContent() {
    switch (this.state.select) {
      case 'Experiment':
        return (
          <div>
            <h2>Current Experiment</h2>
            <VisForm 
              high={this.state.trials[this.state.trials.length - 1].high}
              low={this.state.trials[this.state.trials.length - 1].low}
              nextTrial={this.nextTrial}
              key={this.state.trials.length - 1}
            />
          </div>
        )
      case 'About':
        return (
          <div>
            <h2>About</h2>
            <p>
              This experiment was developed for Graduate Data Vis. The assignment
              is based on <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
              this</a> impressive-sounding research paper.
            </p>
          </div>
        )
      case 'Survey':
        return (
          <div>
            <h2>Survey</h2>
            <p>Please answer the following questions.</p>
            <Survey submitSurvey={this.submitSurvey}/>
          </div>
        )
    }
  }

  render() {
    console.log(this.state.trials)
    console.log(`length: ${this.state.trials.length}`)
    return(
      <div id="experiment">
        <h2>Select View</h2>
        <select value={this.state.value} onChange={this.handleChange}>
          <option value="Experiment">Experiment</option>
          <option value="Survey">Survey</option>
          <option value="About">About</option>
        </select>

        {this.renderContent()}
        <br/>
        <br/>
        <h2>Past Experiments</h2>
        {this.state.trials.map((trial, index) => {
          return(
            <p key={index}>
              High: {trial.high} Low: {trial.low} Guess: {trial.guess}
            </p>
          );
        })}
      </div>
    )
  }
}

class Survey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      familiarity: '',
    }
  }

  handleChangeFamiliarity=e=> {
    this.setState({
      familiarity: e.target.value,
    })
  }

  render() {
    return (
      <div>
        <label>
          How familiar would you say you are with data visualizations?
          <select value={this.state.familiarity} onChange={this.handleChangeFamiliarity}>
            <option value="Little">
              Data Vis? Sorry, vis isn't my type.
            </option>
            <option value="A lot">
              I was born with eyes. I've been vizzing all my life!
            </option>
          </select>
        </label>
        <button type="submit" onClick={() => this.props.submitSurvey(this.state)}>Submit</button>
      </div>
    )
  }
}

function generateHighLow() {
  let high = 0;
  let low = 0;
  while ((high - low) < 0.1) {
    high = Math.floor((Math.random() * 100) + 1);
    low = Math.floor((Math.random() * 100) + 1);
    if (low > high){
      let temp = low;
      low = high;
      high = temp;
    }
  }
  return {
    high: high,
    low: low
  };
}

class VisForm extends Component{
  constructor(props) {
    super(props);
    this.state = {
      guess: null,
      message: this.props.message,
    }
  }

  handleChange=e=> {
    this.setState({
      guess: e.target.value,
      message: this.state.message,
    });
  }

  handleSubmit=e=>{
    let newMessage = this.state.guess ? `You were off by ${
      Math.abs((this.props.low / this.props.high) - this.state.guess)
    }` : `Please enter a guess.`;
    this.setState({
      guess: this.state.guess,
      message: newMessage,
    });
  }

  renderError() {
    if (this.state.message) {
      return (
        <div>
          <p>{this.state.message}</p>
          <br/>
          <button 
            type="button" 
            onClick={() => this.props.nextTrial(this.state.guess)}
          >Next Trial</button>
        </div>
      )
    }
    return null;
  }

  render() {
    return(
      <div className="vis-form">
        <p>True Value: {this.props.low / this.props.high}</p>
        <input 
          type="number"
          onChange={this.handleChange}
        ></input>
        <br/>
        <button type="submit" onClick={this.handleSubmit}>Submit Guess</button>
        {this.renderError()}
      </div>
    );
  }
}

// class VisField extends Component {
//   render() {
//     return (
//       <div>
//         <p>{this.props.question}</p>
//         <input 
//           type="number"
//           placeholder="50"
//           onChange={this.props.handleChange}
//         ></input>
//       </div>
//     )
//   }
// }

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
        <Experiment/>
        {/* <input type="text" id="inputText" onChange={this.changeText}></input> */}
        {/* <br/> */}
        {/* <button onClick={this.submit}>Submit Data</button> */}
      </div>
    );
  }
}

export default App;
