import findMovablePieces from "./findMovablePieces";
import HistoryNode from "./historyNode";
import { pieceToNumber } from "./pieceTypes";
import simulateBoardMove from "./simulateBoardMove";

const gameHandler = (
  {
    boardState,
    setBoardState,
  }: { boardState: Array<number>; setBoardState: Function },
  {
    userState,
    setUserState,
  }: { userState: { [key: string]: any }; setUserState: Function },
  { history, setHistory }: { history: Set<HistoryNode>; setHistory: Function },
  setMoves: Function,
  timer: { white: any; black: any }
) => {
  // start and stop timers based on player turn
  if (userState.playerTurn === "white" && userState.timeExpire === "") {
    timer.white.resume();
    timer.black.pause();
  } else {
    timer.black.resume();
    timer.white.pause();
  }

  setMoves(() => {
    const newMoves = findMovablePieces(boardState, userState, history);

    if (!Object.keys(newMoves).length) {
      // if no more valid moves, the king is in checkmate. declare the winner and show history
      window.confirm(
        `${userState.playerTurn === "white" ? "Black" : "White"} wins!`
      );
      timer.white.pause();
      timer.black.pause();
      console.log(history);
    } else if (userState.timeExpire !== "") {
      // if the timer runs out, declare the winner and show history
      window.confirm(
        `${userState.timeExpire === "white" ? "Black" : "White"} wins!`
      );
      timer.white.pause();
      timer.black.pause();
      console.log(history);
      return {};
    }
    return newMoves;
  });

  if (userState.secondSelection !== -1) {
    const [indexFrom, indexTo] = [
      userState.firstSelection,
      userState.secondSelection,
    ];

    [userState.firstSelection, userState.secondSelection] = [-1, -1];

    //cancel selection if selected piece is re-selected
    if (indexTo === indexFrom) {
      return;
    }

    setUserState((prevState: { [key: string]: any }) => {
      return { ...prevState, prevSelection: indexFrom };
    });

    // update board state to reflect valid move
    setBoardState((prevState: Array<number>) => {
      const newBoardState = simulateBoardMove(prevState, indexFrom, indexTo);

      // check for pawn promotion and prompt the user for a promotion piece.
      const isPawnReachEnd =
        prevState[indexFrom] === (userState.playerTurn === "white" ? 1 : 11) &&
        Math.floor(indexTo / 8) === (userState.playerTurn === "white" ? 0 : 7);

      if (isPawnReachEnd) {
        let promoSelection = "";
        const validPromos = new Set(["Q", "R", "B", "N"]);

        while (!validPromos.has(promoSelection)) {
          promoSelection = window.prompt(
            "Promote to which piece? Please select from: Q, R, B, N.",
            "Q"
          );
          if (!validPromos.has(promoSelection)) {
            window.alert("Invalid choice");
          }
        }

        newBoardState[indexTo] = isPawnReachEnd
          ? pieceToNumber[promoSelection][userState.playerTurn]
          : newBoardState[indexTo];
      }

      // check for castling moves. if king moves 2 squares, it's a castle move.
      const queenCastleRook = userState.playerTurn === "white" ? 56 : 0;
      const kingCastleRook = userState.playerTurn === "white" ? 63 : 7;

      const isKingMoveTwo =
        prevState[indexFrom] === (userState.playerTurn === "white" ? 0 : 10) &&
        Math.abs(indexFrom - indexTo) === 2;

      const castlingBoardState = isKingMoveTwo
        ? indexTo - indexFrom > 0
          ? simulateBoardMove(newBoardState, kingCastleRook, indexTo - 1)
          : simulateBoardMove(newBoardState, queenCastleRook, indexTo + 1)
        : null;
      if (castlingBoardState) {
        userState.canCastle[userState.playerTurn][kingCastleRook] = false;
        userState.canCastle[userState.playerTurn][queenCastleRook] = false;
      }

      // check for en passant. if the pawn moves diagonally to an empty square, it's an en passant.
      const oneRowForward = userState.playerTurn === "white" ? -8 : 8;
      const isPawnAttackingEmpty =
        prevState[indexFrom] === (userState.playerTurn === "white" ? 1 : 11) &&
        prevState[indexTo] < 0 &&
        (Math.abs(indexTo - indexFrom) === 7 ||
          Math.abs(indexTo - indexFrom) === 9);

      const enPassantBoardState = isPawnAttackingEmpty
        ? simulateBoardMove(newBoardState, -1, indexTo - oneRowForward)
        : null;

      const finalBoardState = enPassantBoardState
        ? enPassantBoardState
        : castlingBoardState || newBoardState;

      // add move to history
      setHistory((prevState: Set<HistoryNode>) => {
        const newNode = new HistoryNode(finalBoardState, timer);
        newNode.parent = userState.currentNode;
        userState.currentNode.children.add(newNode);

        // switch player turn
        setUserState((prevState: { [key: string]: any }) => {
          const newUserState = { ...prevState };
          newUserState.currentNode = newNode;
          newUserState.playerTurn =
            newUserState.playerTurn === "white" ? "black" : "white";

          // determine new moves available for next player
          setMoves(() =>
            findMovablePieces(newBoardState, newUserState, history)
          );
          return newUserState;
        });

        prevState.add(newNode);
        return prevState;
      });

      return finalBoardState;
    });
  }
};

export default gameHandler;
