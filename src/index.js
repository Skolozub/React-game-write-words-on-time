// write logic 1h 20m

import React from "react";
import ReactDOM from "react-dom";
import { words } from "./words";
import styles from "./styles.module.scss";

class App extends React.Component {
  state = {
    words: words,
    currentWord: "",
    input: "",
    timerId: 0,
    timer: 0,
    commonTime: 0
  };

  componentDidMount = () => {
    this.initialiseNewLevel();
  };

  componentDidUpdate = (_, prevState) => {
    const { input: prevInput } = prevState;

    const hasInputChanged = prevInput !== this.state.input;
    if (!hasInputChanged) return null;

    const isWin = this.isWinGame();
    if (isWin) this.initialiseNewLevel();
  };

  getRandomWord = words => {
    const { length: wordsLength } = words;
    const numOfRandWord = Math.floor(Math.random() * wordsLength);

    return words[numOfRandWord];
  };

  initialiseNewLevel = () => {
    const currentWord = this.getRandomWord(this.state.words);
    this.startTimer();
    this.setState({ currentWord, input: "" });
  };

  isWinGame = () => {
    const { currentWord, input, timer } = this.state;
    this.setState(({ commonTime }) => ({
      commonTime: commonTime + timer
    }));
    return currentWord === input;
  };

  onChangeHandler = e => {
    const { value } = e.currentTarget;
    this.setState({ input: value });
  };

  getUserFriendlyTime = ms => {
    const mseconds = ms % 1000;
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(seconds / 60);
    return `${`0${minutes}`.slice(-2)}:${`0${seconds}`.slice(
      -2
    )}:${`00${mseconds}`.slice(-3)}`;
  };

  startTimer = () => {
    const startMSeconds = Date.now();
    clearInterval(this.state.timerId);
    const timerId = setInterval(() => {
      const currMSeconds = Date.now();
      const deltaMSeconds = currMSeconds - startMSeconds;

      this.setState({ timer: deltaMSeconds });
    }, 1);

    this.setState({ timerId });
  };

  render = () => {
    const { currentWord, input, timer, commonTime } = this.state;

    return (
      <div className={styles.wrapper}>
        <div className={styles.currentWord}>{currentWord}</div>
        <input onChange={this.onChangeHandler} value={input} />
        <div>{this.getUserFriendlyTime(timer)}</div>
        <div>Common Time: {this.getUserFriendlyTime(commonTime)}</div>
      </div>
    );
  };
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
