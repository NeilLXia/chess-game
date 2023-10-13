import defaultNodes from "../gameHandler/referenceData/defaultNodes";
import ServerNode from "./serverNode";

export const serverNodes: ServerNode[] = document.getElementById("nodes")
  ? JSON.parse(document.getElementById("nodes").textContent)
  : defaultNodes;
export const gameID = document.getElementById("game_id")
  ? JSON.parse(document.getElementById("game_id").textContent)
  : 1;
