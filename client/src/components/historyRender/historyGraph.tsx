import * as React from "react";
import HistoryNode from "../../lib/gameHandler/historyNode";

interface HistoryGraphProps {
  history: Set<HistoryNode>;
  userState: { [key: string]: any };
}

function HistoryGraph({ history, userState }: HistoryGraphProps) {
  const rootNode = userState.rootNode;
  return (
    <svg className="history-graph" viewBox="0 30 100 200">
      <rect width="100%" height="100%" fill="none" stroke="green" />
      <circle cx="50%" cy="50%" r="10" fill="red" />
      <circle cx="50" cy="50" r="10" fill="blue" />
    </svg>
  );
}

export default HistoryGraph;
