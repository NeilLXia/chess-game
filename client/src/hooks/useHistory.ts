import { useState } from "react";
import HistoryNode from "../lib/graphBuilder/historyNode";
import updateServerTree from "../lib/handleServer/updateServerTree";

export function getHistKey(boardState: number[], turnNumber: number) {
  return JSON.stringify(boardState) + (turnNumber - 1).toString();
}

export function useHistory() {
  const [history, setHistory] = useState<Map<string, HistoryNode> | null>();

  const translateExistingHist = (allNodes: any[]) => {
    const historyNodes: Map<string, HistoryNode> = new Map();

    allNodes.forEach((node: any) => {
      const parent =
        historyNodes.get(
          getHistKey(node.parentState, node.userState.turnNumber)
        ) || null;
      const historyNode =
        historyNodes.get(
          getHistKey(node.boardState, node.userState.turnNumber)
        ) ||
        new HistoryNode(node.boardState, node.userState, parent, node.timer);

      parent?.children.add(historyNode);
      historyNodes.set(
        getHistKey(node.boardState, node.userState.turnNumber),
        historyNode
      );
    });

    setHistory(historyNodes);
  };

  const addHistNode = (gameID: number, key: string, newNode: HistoryNode) => {
    setHistory((prevState: Map<string, HistoryNode>) => {
      if (!history.has(key)) {
        updateServerTree(gameID, newNode);
        newNode.parent?.children.add(newNode);
      }
      prevState.set(key, newNode);

      return prevState;
    });
  };
  return { history, addHistNode, translateExistingHist };
}
