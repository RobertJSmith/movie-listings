import React, { Component } from 'react';
import './App.css';
import MovieList from './components/MovieList';

class App extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        <h1>Upcoming Features</h1>
        </header>
        <MovieList/>
      </div>
    );
  }
}

export default App;
