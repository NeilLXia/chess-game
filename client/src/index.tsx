import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom/client";

import "./css/app.css";

import initialBoardState from "./lib/initialBoardState";
import Chessboard from "./components/chessboard";

const App = () => {
  const [boardState, setBoardState] = useState(initialBoardState);
  const [userState, setUserState] = useState("");

  return (
    <div id="app">
      <Chessboard boardState={boardState} setBoardState={setBoardState} />
    </div>
  );
};

const Root = ReactDOM.createRoot(document.getElementById("root")!);
Root.render(<App />);
