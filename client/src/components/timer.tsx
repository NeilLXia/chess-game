import * as React from "react";

interface TimerProps {
  seconds: number;
  minutes: number;
  isRunning: boolean;
}

function Timer(props: TimerProps) {
  const { seconds, minutes, isRunning } = props;

  return (
    <div className="player-timer">
      <span>{("00" + minutes).slice(-2)}</span>:
      <span>{("00" + seconds).slice(-2)}</span>
    </div>
  );
}

export default Timer;
