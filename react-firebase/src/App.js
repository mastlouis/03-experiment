import React, { Component } from 'react';
import './App.css';
import fire from './firebase';

const PAGES = {
  welcome: 'Welcome',
  experiment: 'Experiment',
  about: 'About',
  survey: 'Survey',
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const SESSION_ID = uuidv4();

console.log(uuidv4());
class Page extends Component{
  
  constructor(props){
    super(props);
    this.state={
      page: PAGES.welcome,
      demographic: null,
      dataset: [],
    }
  }

  handleSurvey = response => {
    this.setState({demographic: response});
  }

  handleDataset = dataset => {
    this.setState({dataset: dataset});
  }

  setPage = newPage => {
    this.setState({page: newPage});
  }

  renderContent() {
    switch(this.state.page) {
      case PAGES.welcome:
        return <Welcome setPage={this.setPage}/>
      case PAGES.experiment:
        return (
          <Experiment 
            dataset={this.state.dataset}
            handleDataset={this.handleDataset}
          />
        );
      case PAGES.survey:
        return (
          <Survey 
            demographic={this.state.demographic}
            handleSurvey={this.handleSurvey}
          />
        );
      case PAGES.about:
        return <About/>
      default:
        return (
          <div>
            <h2>Lost</h2>
            <p>Please select a page from the top bar to continue.</p>
          </div>
        )
    }
  }

  render() {
    return(
      <div>
        <div className="top-bar">
          <div className="top-bar-left">
            <ul className="menu">
              <li className="menu-text">CS 584 Data Vis Project 3</li>
              <li><button className="button" onClick={() => this.setPage(PAGES.welcome)}>Welcome</button></li>
              <li><button className="button" onClick={() => this.setPage(PAGES.experiment)}>Experiment</button></li>
              <li><button className="button" onClick={() => this.setPage(PAGES.survey)}>Survey</button></li>
              <li><button className="button" onClick={() => this.setPage(PAGES.about)}>About</button></li>
            </ul>
          </div>
        </div>
        <div className="page-container">
          {this.renderContent()}
        </div>
      </div>
    )
  }
}

function About() {
  return (
    <div>
      <h2>About</h2>
      <p>This project was created by [names] for [class].</p>
    </div>
  )
}

function Welcome(props) {
  return (
    <div>
      <h2>Welcome!</h2>
      <p>
        Welcome to our Data Vis Project! Thank you for taking a few minutes of 
        your day to help us out. This page is a brief guide to the steps of our
        experiment.
      </p>
      <h3>Step 1: Survey</h3>
      <p>Please complete a brief survey about</p>
      <button type="button" className="button" onClick={() => props.setPage(PAGES.survey)}>
        Take Survey
      </button>
    </div>
  )
}

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
    })
  }

  handleChange=e=> {
    this.setState({
      select: e.target.value,
    })
  }

  render() {
    return(
      <div id="experiment">
        <h2>Current Experiment</h2>
        <div>
          <VisForm 
            high={this.state.trials[this.state.trials.length - 1].high}
            low={this.state.trials[this.state.trials.length - 1].low}
            nextTrial={this.nextTrial}
            key={this.state.trials.length - 1}
          />
        </div>
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
      <h2>Survey</h2>
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
        <button type="submit" className="button" onClick={() => this.props.handleSurvey(this.state)}>Submit</button>
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
            className="button" 
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
        <button 
          type="submit" 
          className="button"
          onClick={this.handleSubmit}
        >Submit Guess</button>
        {this.renderError()}
      </div>
    );
  }
}

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
      <div>
        {/* <div className="App-header"> */}
          {/* <input type="text" id="inputText" onChange={this.changeText}></input> */}
          {/* <br/> */}
          {/* <button onClick={this.submit}>Submit Data</button> */}
        {/* </div> */}
        <Page/>
      </div>
    );
  }
}

export default App;
