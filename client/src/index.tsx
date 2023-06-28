import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom/client";

import "./css/app.css";

import { UserContext, BoardContext } from "./contexts/userContext";
import initialBoardState from "./lib/initialBoardState";
import Chessboard from "./components/chessboard";

const App = () => {
  const [boardState, setBoardState] = useState(initialBoardState);
  const [userState, setUserState] = useState({
    turn: "white",
    selected: -1,
    state: "none",
  });

  return (
    <div id="app">
      <BoardContext.Provider value={[boardState, setBoardState]}>
        <UserContext.Provider value={[userState, setUserState]}>
          <Chessboard />
        </UserContext.Provider>
      </BoardContext.Provider>
    </div>
  );
};

const Root = ReactDOM.createRoot(document.getElementById("root")!);
Root.render(<App />);
