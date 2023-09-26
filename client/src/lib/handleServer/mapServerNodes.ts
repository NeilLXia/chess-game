import initialBoardState from "../gameHandler/referenceData/initialBoardState";
import UserState from "../gameHandler/referenceData/userStateType";
import convertBoardStateStrToArr from "./convertBoardStateStrToArr";
import ServerNode from "./serverNode";

const mapServerNode = (serverNodes: ServerNode[]) => {
  return serverNodes.map((serverNode: ServerNode) => {
    const boardState: number[] = convertBoardStateStrToArr(
      serverNode["board_state"]
    );
    const parentState: number[] = convertBoardStateStrToArr(
      serverNode["parent_state"]
    );
    const userState: UserState = {
      prevFirstSelection: serverNode["user_state"]["selection_1"],
      prevSecondSelection: serverNode["user_state"]["selection_2"],
      firstSelection: -1,
      secondSelection: -1,
      rootNode: JSON.stringify(initialBoardState) + "0",
      currentNode:
        JSON.stringify(boardState) +
        serverNode["user_state"]["turn_number"].toString(), // current location in history
      gameWinner: "", // declare winner
      turnNumber: serverNode["user_state"]["turn_number"],
      canCastle: serverNode["user_state"]["can_castle"],
      isPromo: false, // indicates whether a pawn is up for promotion
      promoValue: "", // stores the selected pawn promotion value
    };
    return {
      boardState: boardState,
      userState: userState,
      parentState: parentState,
      timer: serverNode["timer"],
    };
  });
};

export default mapServerNode;
