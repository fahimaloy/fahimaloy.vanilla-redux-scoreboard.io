// Action Types
const INCREMENT = "score/increment";
const DECREMENT = "score/decrement";
const ADDMATCH = "match/addmatch";
const RESET = "all/reset";

// Initial State
const initialState = {
  scores: [
    {
      id: 1,
      score: 0,
    },
  ],
};

// Actions for Incrementing Score
const incrementScore = (id, value) => {
  return {
    type: INCREMENT,
    payload: {
      id,
      value,
    },
  };
};
// Actions for Decrementing Score
const decrementScore = (id, value) => {
  return {
    type: DECREMENT,
    payload: {
      id,
      value,
    },
  };
};
// Actions for Add Another Match
const addAnotherMatch = () => {
  return {
    type: ADDMATCH,
  };
};
// Actions for Reset All Match
const resetAllMatches = () => {
  return {
    type: RESET,
  };
};

const scoreReducer = (state = initialState, action) => {
  const findMatchIndex = (data) => {
    return data.scores.findIndex((i) => {
      return i.id == action.payload.id;
    });
  };
  let newState = {
    ...state,
    scores: state.scores.map((item) => {
      let newObj = {};
      newObj.id = item.id;
      newObj.score = item.score;
      return newObj;
    }),
  };
  let matchIndex;
  switch (action.type) {
    case INCREMENT:
      matchIndex = findMatchIndex(newState);
      newState.scores[matchIndex].score =
        newState.scores[matchIndex].score + parseInt(action.payload.value);
      break;
    case DECREMENT:
      matchIndex = findMatchIndex(newState);
      const newScore = newState.scores[matchIndex].score - action.payload.value;
      newState.scores[matchIndex].score = newScore > 0 ? newScore : 0;
      break;
    case ADDMATCH:
      const newID = newState.scores[newState.scores.length - 1].id + 1;
      newState.scores.push({
        id: newID,
        score: 0,
      });
      let data = `
                <div class="match">
                    <div class="wrapper">
                        <button class="lws-delete">
                            <img src="./image/delete.svg" alt="" />
                        </button>
                        <h3 class="lws-matchName">Match ${newID}</h3>
                    </div>
                    <div class="inc-dec">
                        <form class="incrementForm" method="post" onsubmit="Increment(event,${newID})">
                            <h4>Increment</h4>
                            <input
                                type="number"
                                name="increment"
                                class="lws-increment"
                                id="incrementField-${newID}"
                            />
                        </form>
                        <form class="decrementForm" method="post" onsubmit="Decrement(event,${newID})">
                            <h4>Decrement</h4>
                            <input
                                type="number"
                                name="decrement"
                                class="lws-decrement"
                                id="decrementField-${newID}"
                            />
                        </form>
                    </div>
                    <div class="numbers">
                        <h2 class="lws-singleResult" id='score-${newID}'>${120}</h2>
                    </div>
                </div>
                `;
      document.getElementById("allMatch").innerHTML += data;
      break;
    case RESET:
      newState = {
        ...state,
        scores: state.scores.map((item) => {
          let newObj = {};
          newObj.id = item.id;
          newObj.score = 0;
          return newObj;
        }),
      };
      break;
    default:
      newState = state;
      break;
  }
  return newState;
};

// create store
const store = Redux.createStore(scoreReducer);

const render = () => {
  const state = store.getState();
  for (let i = 1; i <= state.scores.length; i++) {
    let idName = `score-${state.scores[i - 1].id}`;
    let scoreEl = document.getElementById(idName);
    scoreEl.innerText =
      state.scores[state.scores.findIndex((item) => item.id === i)].score;
  }
};

// update UI initially
render();
store.subscribe(render);
function Increment(event, id) {
  event.preventDefault();
  const value = document.getElementById("incrementField-" + id).value;
  const checkedValue = value > 0 ? value : 0
  if(value < 0){
    alert("Enter a valid positive number to increment.");
  }
  store.dispatch(incrementScore(id, checkedValue));
  document.getElementById("incrementField-" + id).value = "";
}
function Decrement(event, id) {
  event.preventDefault();
  const value = document.getElementById("decrementField-" + id).value;
  const checkedValue = value > 0 ? value : 0
  if(value < 0){
    alert("Enter a valid positive number to decrement.");
  }
  store.dispatch(decrementScore(id, checkedValue));
  document.getElementById("decrementField-" + id).value = "";
}

function addMatch() {
  store.dispatch(addAnotherMatch());
}
function resetAll() {
  store.dispatch(resetAllMatches());
}
