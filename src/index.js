// init git (write all logic) - 1h 20m
// code refactoring - 10m
// added finished words output and backlight letters status - 40m

import React from "react";
import ReactDOM from "react-dom";
import { words } from "./words";
import styles from "./styles.module.scss";

class App extends React.Component {
  state = {
    words: words,
    randomWord: "",
    letters: [],
    input: "",
    timerId: 0,
    timer: 0,
    commonTime: 0,
    finishedWords: []
  };

  componentDidMount = () => {
    this.initialiseNewLevel();
  };

  componentDidUpdate = (_, prevState) => {
    const { input: prevInput } = prevState;

    const hasInputChanged = prevInput !== this.state.input;
    if (!hasInputChanged) return null;

    this.lettersStatusCheck();

    if (this.isWinGame()) {
      this.setFinishedWords();
      this.setCommonTime();
      this.initialiseNewLevel();
    }
  };

  setFinishedWords = () => {
    const { randomWord, timer } = this.state;

    this.setState(({ finishedWords }) => ({
      finishedWords: [...finishedWords, { word: randomWord, time: timer }]
    }));
  };

  getRandomWord = words => {
    const { length: wordsLength } = words;
    const numOfRandWord = Math.floor(Math.random() * wordsLength);

    return words[numOfRandWord];
  };

  initialiseNewLevel = () => {
    const randomWord = this.getRandomWord(this.state.words);
    const letters = [...randomWord].map(letter => ({ letter, status: 2 }));

    this.startTimer();
    this.setState({ randomWord, letters, input: "" });
  };

  lettersStatusCheck = () => {
    const { letters, input } = this.state;

    const newLetters = letters.map(({ letter }, i) =>
      input[i] === undefined
        ? { letter, status: 2 }
        : { letter, status: Number(input[i] === letter) }
    );

    this.setState({ letters: newLetters });
  };

  isWinGame = () => {
    const { randomWord, input } = this.state;

    return randomWord === input;
  };

  setCommonTime = () => {
    const { timer } = this.state;
    this.setState(({ commonTime }) => ({
      commonTime: commonTime + timer
    }));
  };

  onChangeHandler = e => {
    const { value } = e.currentTarget;
    this.setState({ input: value });
  };

  getUserFriendlyTime = ms => {
    const mseconds = ms % 1000;
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60));
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
    const { letters, input, timer, commonTime, finishedWords } = this.state;

    return (
      <div className={styles.wrapper}>
        <div className={styles.letters}>
          {[...letters].map(({ letter, status }) => (
            <span
              className={`${styles.letter} ${
                status !== 2
                  ? status
                    ? styles.success
                    : styles.failed
                  : styles.default
              }`}
            >
              {letter}
            </span>
          ))}
        </div>
        <input onChange={this.onChangeHandler} value={input} />
        <div>{this.getUserFriendlyTime(timer)}</div>
        <div>
          {finishedWords.map(({ word, time }) => (
            <div>{`${word} - ${this.getUserFriendlyTime(time)}`}</div>
          ))}
        </div>
        <div>Common Time: {this.getUserFriendlyTime(commonTime)}</div>
      </div>
    );
  };
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
