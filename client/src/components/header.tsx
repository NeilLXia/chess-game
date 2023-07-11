import * as React from "react";
import Timer from "./timer";

interface HeaderProps {
  timer: { [key: string]: any };
}

function Header(props: HeaderProps) {
  const { timer } = props;

  return (
    <div className="header">
      <div className="player-tile">
        <div
          className={`player-info ${
            timer.white.isRunning ? "player-info-highlight" : ""
          }`}
          id="player-1"
        >
          <div>
            <div className="player-name">White</div>
            <Timer
              seconds={timer.white.seconds}
              minutes={timer.white.minutes}
              isRunning={timer.white.isRunning}
            />
          </div>
        </div>
      </div>
      <div className="player-tile">
        <div
          className={`player-info ${
            timer.black.isRunning ? "player-info-highlight" : ""
          }`}
          id="player-2"
        >
          <div className="player-name">Black</div>
          <Timer
            seconds={timer.black.seconds}
            minutes={timer.black.minutes}
            isRunning={timer.black.isRunning}
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
