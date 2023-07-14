import { MutableRefObject } from "react";
import findMovablePieces from "./findMovablePieces";
import HistoryNode from "./historyNode";
import { numberToPiece, pieceToNumber } from "./pieceTypes";
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
  promoModalRef: MutableRefObject<HTMLDialogElement>,
  gameEndModalRef: MutableRefObject<HTMLDialogElement>,
  setMoves: Function,
  timer: { white: any; black: any }
) => {
  // start and stop timers based on player turn
  if (userState.playerTurn === "white" && userState.gameWinner === "") {
    timer.white.resume();
    timer.black.pause();
  } else {
    timer.black.resume();
    timer.white.pause();
  }

  // find moves for player and disable moves if there is a game winner
  setMoves(() => {
    const newMoves = findMovablePieces(boardState, userState);

    if (!Object.keys(newMoves).length || userState.gameWinner !== "") {
      // if win by checkmate (no valid moves for opponent), set game winner
      if (userState.gameWinner === "") {
        setUserState((prevState: { [key: string]: any }) => {
          return {
            ...prevState,
            gameWinner: prevState.playerTurn == "white" ? "Black" : "White",
          };
        });
      }
      // if no more valid moves, the king is in checkmate. declare the winner and show history
      if (!gameEndModalRef.current.open) {
        gameEndModalRef.current.showModal();
      }
      timer.white.pause();
      timer.black.pause();
      return {};
    }

    return newMoves;
  });

  // player has clicked two valid selections (e.g. a piece and where to move)
  if (userState.secondSelection !== -1) {
    const [indexFrom, indexTo] = [
      userState.firstSelection,
      userState.secondSelection,
    ];

    const isPawnReachEnd =
      boardState[indexFrom] === (userState.playerTurn === "white" ? 1 : 11) &&
      Math.floor(indexTo / 8) === (userState.playerTurn === "white" ? 0 : 7);

    // check for pawn promotion and prompt the user for a promotion piece.
    if (isPawnReachEnd && userState.promoValue === "") {
      if (!promoModalRef.current.open) {
        promoModalRef.current.showModal();
        setUserState((prevState: { [key: string]: any }) => {
          return { ...prevState, isPromo: true };
        });
      }
      return;
    }

    [userState.firstSelection, userState.secondSelection] = [-1, -1];

    //cancel selection if selected piece is re-selected
    if (indexTo === indexFrom) {
      return;
    }

    setUserState((prevState: { [key: string]: any }) => {
      return { ...prevState, prevSelection: [indexFrom, indexTo] };
    });

    // update board state to reflect valid move
    setBoardState((prevState: Array<number>) => {
      const newBoardState = simulateBoardMove(prevState, indexFrom, indexTo);

      // check for pawn promotion and set new board state.
      if (userState.isPromo) {
        newBoardState[indexTo] = isPawnReachEnd
          ? pieceToNumber[userState.promoValue][userState.playerTurn]
          : newBoardState[indexTo];
        setUserState((prevState: { [key: string]: any }) => {
          return { ...prevState, isPromo: false, promoValue: "" };
        });
      }

      const queenCastleRook = userState.playerTurn === "white" ? 56 : 0;
      const kingCastleRook = userState.playerTurn === "white" ? 63 : 7;

      // If king or rook moves, castling is turned off.
      if (numberToPiece[prevState[indexFrom]] === "R") {
        if (
          userState.canCastle[userState.playerTurn][queenCastleRook] === true &&
          indexFrom === queenCastleRook
        ) {
          setUserState((prevState: { [key: string]: any }) => {
            const newState = { ...prevState };
            newState.canCastle[userState.playerTurn][queenCastleRook] = false;
            return newState;
          });
        }
        if (
          userState.canCastle[userState.playerTurn][kingCastleRook] === true &&
          indexFrom === kingCastleRook
        ) {
          setUserState((prevState: { [key: string]: any }) => {
            const newState = { ...prevState };
            newState.canCastle[userState.playerTurn][kingCastleRook] = false;
            return newState;
          });
        }
      }
      if (numberToPiece[prevState[indexFrom]] === "K") {
        setUserState((prevState: { [key: string]: any }) => {
          const newState = { ...prevState };
          newState.canCastle[userState.playerTurn][kingCastleRook] = false;
          newState.canCastle[userState.playerTurn][queenCastleRook] = false;
          return newState;
        });
      }

      // check for castling moves. if king moves 2 squares, it's a castle move.
      const isKingMoveTwo =
        prevState[indexFrom] === (userState.playerTurn === "white" ? 0 : 10) &&
        Math.abs(indexFrom - indexTo) === 2;

      const castlingBoardState = isKingMoveTwo
        ? indexTo - indexFrom > 0
          ? simulateBoardMove(newBoardState, kingCastleRook, indexTo - 1)
          : simulateBoardMove(newBoardState, queenCastleRook, indexTo + 1)
        : null;
      if (castlingBoardState) {
        setUserState((prevState: { [key: string]: any }) => {
          const newState = { ...prevState };
          newState.canCastle[userState.playerTurn][kingCastleRook] = false;
          newState.canCastle[userState.playerTurn][queenCastleRook] = false;
          return newState;
        });
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
          setMoves(() => findMovablePieces(newBoardState, newUserState));
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
