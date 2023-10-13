import { useState } from "react";
import HistoryNode from "../lib/graphBuilder/historyNode";
import updateServerTree from "../lib/handleServer/updateServerTree";

export function useHistory() {
  const [history, setHistory] = useState<Map<string, HistoryNode> | null>();

  const translateExistingHist = (allNodes: any[]) => {
    const historyNodes: Map<string, HistoryNode> = new Map();
    allNodes.forEach((node: any) => {
      const parent =
        historyNodes.get(
          JSON.stringify(node.parentState) +
            (node.userState.turnNumber - 1).toString()
        ) || null;
      const historyNode =
        historyNodes.get(
          JSON.stringify(node.boardState) + node.userState.turnNumber.toString()
        ) ||
        new HistoryNode(node.boardState, node.userState, parent, node.timer);
      historyNode.parent?.children.add(historyNode);
      historyNodes.set(
        JSON.stringify(node.boardState) + node.userState.turnNumber.toString(),
        historyNode
      );
    });
    setHistory(historyNodes);
  };

  const addNode = (gameID: number, key: string, newNode: HistoryNode) => {
    setHistory((prevState: Map<string, HistoryNode>) => {
      if (!history.has(key)) {
        updateServerTree(gameID, newNode);
        newNode.parent?.children.add(newNode);
      }
      prevState.set(key, newNode);

      return prevState;
    });
  };
  return { history, setHistory, addNode, translateExistingHist };
}
