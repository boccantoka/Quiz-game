/*global questions*/

const getUniqueData = (arr, key) => {
  const result = arr.reduce((unique, o) => {
    if (!unique.some((obj) => obj[key] === o[key])) {
      unique.push(o);
    }
    return unique;
  }, []);

  return result;
};

const removeNewLine = (arr, prop) => {
  for (const question of arr) {
    question[prop] = question[prop].replace(/(\r\n|\n|\r)/gm, "");
  }
};

const showGameErea = () => {
  document.querySelector(".skip-btn").classList.remove("hidden");
  document.querySelector(".game-section").classList.remove("hidden");
  document.querySelector(".answers-wrap").classList.remove("hidden");
  document.querySelector(".question-wrap").classList.remove("hidden");
  document.querySelector(".total-prize").classList.remove("hidden");
  document.querySelector(".round-prize").classList.remove("hidden");
};
const resetState = () => {
  state.answeredQuestions = [];
  state.totalPrize = 0;
  state.roundPrize = 100;
  state.isSkipUsed = false;
  state.maxPrize = 1000000;
};

const startNextRound = () => {
  renderQuestion(getNewQuestion());
  updatePrizes();
};

const updatePrizes = () => {
  document.querySelector(
    ".total-prize"
  ).innerText = `Current Prize: ${state.totalPrize}`;
  document.querySelector(
    ".round-prize"
  ).innerText = `Round Prize: ${state.roundPrize}`;
};

const renderQuestion = (question) => {
  document.querySelector(".question").innerText = question.question;
  document.querySelectorAll(".answer").forEach((item, index) => {
    item.innerText = question.content[index];
  });
};

const getNewQuestion = () => {
  let question = null;
  let isQuestionNew = false;
  while (isQuestionNew === false) {
    question = uniqueQuestions[getRandomInt(uniqueQuestions.length)];
    isQuestionNew = !isRepeated(question);
  }
  state.answeredQuestions.push(question);
  return question;
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const isRepeated = (question) => {
  return state.answeredQuestions.includes(question);
};

const wrongAnswer = () => {
  renderEndGameSection();
  renderLoseMsg(document.querySelector(".end-game-msg p"));
};

const renderLoseMsg = (element) => {
  element.innerText = `Game over. Your prize is: ${state.totalPrize}.`;
};

const correctAnswer = () => {
  increaseTotalPrize();
  doubleRoundPrice();
  if (userWon()) {
    renderEndGameSection();
    renderWinMsg(document.querySelector(".end-game-msg p"));
  } else {
    startNextRound();
  }
};

const hideGameArea = () => {
  document.querySelector(".question-wrap").classList.add("hidden");
  document.querySelector(".answers-wrap").classList.add("hidden");
  document.querySelector(".total-prize").classList.add("hidden");
  document.querySelector(".round-prize").classList.add("hidden");
};

const renderEndGameSection = () => {
  hideGameArea();
  document.querySelector(".end-game-msg").classList.remove("hidden");
};

const doubleRoundPrice = () => {
  const two = 2;
  state.roundPrize = state.roundPrize * two;
};

const increaseTotalPrize = () => {
  state.totalPrize += state.roundPrize;
};

const userWon = () => {
  return state.totalPrize >= state.maxPrize;
};

const renderWinMsg = (element) => {
  element.innerText = "Congratulations! You won 1000000.";
};

const state = {
  answeredQuestions: [],
  totalPrize: 0,
  roundPrize: 100,
  isSkipUsed: false,
  maxPrize: 1000000,
};

document.querySelector(".start-btn").addEventListener("click", () => {
  document.querySelector(".end-game-msg").classList.add("hidden");
  showGameErea();
  resetState();
  startNextRound();
});

document.querySelector(".skip-btn").addEventListener("click", () => {
  if (state.isSkipUsed) {
    return;
  }
  renderQuestion(getNewQuestion());
  state.isSkipUsed = true;
});

document.querySelectorAll(".answer").forEach((item) => {
  item.addEventListener("click", () => {
    state.answeredQuestions[state.answeredQuestions.length - 1].correct ===
    parseInt(item.value, 10)
      ? correctAnswer()
      : wrongAnswer();
  });
});

const uniqueQuestions = getUniqueData(questions, "question");

removeNewLine(uniqueQuestions, "question");
