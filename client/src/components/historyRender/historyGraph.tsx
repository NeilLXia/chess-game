import * as React from "react";
import { useContext, MutableRefObject, ReactNode } from "react";
import {
  UserContext,
  BoardContext,
  HistoryContext,
} from "../../contexts/userContext";
import HistoryNode from "../../lib/graphBuilder/historyNode";

interface HistoryGraphProps {
  historyGraphRef: MutableRefObject<SVGSVGElement>;
}

function HistoryGraph({ historyGraphRef }: HistoryGraphProps) {
  const [userState, setUserState] = useContext(UserContext);
  const [boardState, setBoardState] = useContext(BoardContext);
  const [history, setHistory] = useContext(HistoryContext);

  const xSpacing = 60;
  const ySpacing = 80;
  const nodeRadius = 16;
  const rootNode = history.get(userState.rootNode);
  const nodeCounter: number[] = [];
  const numberOfBranchesByNode = new Map();

  const graphLines: React.ReactNode[] = [];
  const graphNodes: React.ReactNode[] = [];
  const nodeLabels: React.ReactNode[] = [];
  const moveLabels: React.ReactNode[] = [];

  let maxMoves = 0;
  let maxVariation = 0;

  const historyDFS = (node: HistoryNode) => {
    if (!nodeCounter[node.userState.turnNumber]) {
      nodeCounter[node.userState.turnNumber] = 0;
    }
    nodeCounter[node.userState.turnNumber]++;

    const childIndices: number[] = [];
    let minimumChildIndex = Infinity;

    node.children.forEach((child: HistoryNode) => {
      childIndices.push(historyDFS(child));
      minimumChildIndex = Math.min(
        minimumChildIndex,
        childIndices[childIndices.length - 1]
      );
    });

    const locationIndex =
      minimumChildIndex === Infinity
        ? nodeCounter[node.userState.turnNumber]
        : Math.max(minimumChildIndex, nodeCounter[node.userState.turnNumber]);

    numberOfBranchesByNode.set(node, locationIndex);
    maxVariation = Math.max(maxVariation, locationIndex);
    maxMoves = Math.max(maxMoves, node.userState.turnNumber);

    childIndices.forEach((childIndex: number) => {
      graphLines.push(
        <path
          key={"line of " + JSON.stringify(node) + "to " + childIndex}
          d={`M${xSpacing / 2 + xSpacing * locationIndex} ${
            ySpacing / 2 +
            ySpacing * node.userState.turnNumber +
            (node.userState.turnNumber > 0 ? Number(nodeRadius) * 2.5 : 0)
          } L${xSpacing / 2 + xSpacing * childIndex} ${
            ySpacing / 2 +
            ySpacing * (node.userState.turnNumber + 1) -
            Number(nodeRadius)
          }`}
          stroke="white"
        />
      );
    });

    graphNodes.push(
      <circle
        key={JSON.stringify(node)}
        cx={`${xSpacing / 2 + xSpacing * locationIndex}`}
        cy={`${ySpacing / 2 + ySpacing * node.userState.turnNumber}`}
        r={nodeRadius}
        fill={node.userState.turnNumber % 2 !== 0 ? "#eee" : "#222"}
        stroke={node === history.get(userState.currentNode) ? "#f00" : "#fff"}
        strokeWidth="2"
        onClick={() => {
          setUserState(() => {
            setBoardState(() => [...node.boardState]);
            return { ...node.userState };
          });
        }}
      />
    );

    nodeLabels.push(
      <text
        key={"chess notation for " + JSON.stringify(node)}
        x={`${xSpacing / 2 + xSpacing * locationIndex}`}
        y={`${
          ySpacing / 2 +
          ySpacing * node.userState.turnNumber +
          Number(nodeRadius) * 2
        }`}
        className="graph-label"
        fontSize="14"
        textAnchor="middle"
        fill="white"
      >
        {node.chessNotation}
      </text>
    );

    return locationIndex;
  };
  historyDFS(rootNode);

  for (let i = 0; i <= maxMoves; i++) {
    moveLabels.push(
      <text
        key={`label for move ${i}`}
        x={`${xSpacing + 6}`}
        y={`${ySpacing / 2 + ySpacing * i + 9}`}
        className="graph-label"
        fontSize="18"
        textAnchor="end"
        fill="white"
      >
        {i === 0 ? "Move " : ""}
        {i}:
      </text>
    );
  }

  const svgWidth = `${Math.max(350, xSpacing * (maxVariation + 1)) || "100%"}`;
  const svgHeight = `${ySpacing * (maxMoves + 1)}px`;

  return (
    <div className="graph-container" id="graph-container">
      <svg
        className="history-graph"
        ref={historyGraphRef}
        width={svgWidth}
        height={svgHeight}
      >
        {moveLabels}
        {graphLines}
        {graphNodes}
        {nodeLabels}
      </svg>
    </div>
  );
}

export default HistoryGraph;
