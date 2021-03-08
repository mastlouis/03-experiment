import React, { Component } from 'react';
import './App.css';
import fire from './firebase';
import {fillChart, gen_data, CHARTS, indices_to_compare, DATAPOINT_COUNTS} from './all-charts';
import { shuffle } from 'd3-array';

const PAGES = {
  welcome: 'Welcome',
  experiment: 'Experiment',
  about: 'About',
  survey: 'Survey',
}

const TRIALS = [
  CHARTS.bar, CHARTS.bar, CHARTS.bar, CHARTS.bar, CHARTS.bar,
  CHARTS.pie, CHARTS.pie, CHARTS.pie, CHARTS.pie, CHARTS.pie,
  CHARTS.spiral, CHARTS.spiral, CHARTS.spiral, CHARTS.spiral, CHARTS.spiral,
]

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function shuffleArray(array) {
  let arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice()
}

const SESSION_ID = uuidv4();
console.log(`Session ID: ${SESSION_ID}`);

function renderChartTarget() {
  return <div id="svgcontainer"></div>
}

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
    const order = shuffleArray(TRIALS);
    let type = order[0];
    let points = gen_data(DATAPOINT_COUNTS[type]);
    let markedIndices = indices_to_compare(DATAPOINT_COUNTS[type]);
    let {high, low} = this.getHighLow(points, markedIndices)

    this.state = {
      order: order,
      trials: [{
        guess: null,
        high: high,
        low: low,
        type: type,
        markedIndices: markedIndices,
        points: points,
      }],
    };
  }

  nextTrial = guess => {
    const trials = this.state.trials.slice();
    trials[trials.length - 1].guess = guess;

    let type = this.state.order[trials.length - 1];
    let points = gen_data(DATAPOINT_COUNTS[type]);
    let markedIndices = indices_to_compare(DATAPOINT_COUNTS[type]);
    let {high, low} = this.getHighLow(points, markedIndices)

    trials.push({
      guess: null,
      high: high,
      low: low,
      type: type,
      markedIndices: markedIndices,
      points: points,
    });
    this.setState({
      trials: trials,
    })
  }

  getHighLow = (array, indices) => {
    if (array[indices.random_idx] > array[indices.other_idx]){
      return {high: array[indices.random_idx], low: array[indices.other_idx]};
    }
    return {high: array[indices.other_idx], low: array[indices.random_idx]};
  }

  handleChange=e=> {
    this.setState({
      select: e.target.value,
    })
  }

  render() {
    return(
      <div id="experiment">
        <h2>Experiment</h2>
        <p>Trial {this.state.trials.length} out of {this.state.order.length}</p>
        <div>
          <VisForm 
            high={this.state.trials[this.state.trials.length - 1].high}
            low={this.state.trials[this.state.trials.length - 1].low}
            type={this.state.trials[this.state.trials.length - 1].type}
            markedIndices={this.state.trials[this.state.trials.length - 1].markedIndices}
            points={this.state.trials[this.state.trials.length - 1].points}
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
    if (this.guessIsValid()){
      this.props.nextTrial(this.state.guess)
    }
  }

  guessIsValid = () => {
    return this.state.guess && (0 < this.state.guess && this.state.guess <= 1);
  }

  componentDidMount() {
    fillChart(this.props.type, this.props.points, this.props.markedIndices);
  }

  renderError() {
    // return this.guessIsValid() ? null : <p>Please enter a valid guess before continuing.</p>
    return null;
  }

  render() {
    return(
      <div className="vis-form">
        {renderChartTarget()}
        <p>True Value: {this.props.low / this.props.high}</p>
        <input 
          type="number"
          min={0}
          max={1}
          onChange={this.handleChange}
        ></input>
        <br/>
        <button 
          type="submit" 
          className="button"
          disabled={!this.guessIsValid()}
          onClick={this.handleSubmit}
        >Next</button>
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
