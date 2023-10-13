import { MutableRefObject } from "react";
import findMovablePieces from "./findMovablePieces";
import HistoryNode from "../graphBuilder/historyNode";
import { numberToPiece, pieceToNumber } from "./referenceData/pieceTypes";
import simulateBoardMove from "./simulateBoardMove";
import UserState from "./referenceData/userStateType";

const gameHandler = (
  gameID: number,
  {
    boardState,
    setBoardState,
  }: { boardState: number[]; setBoardState: Function },
  { userState, setUserState }: { userState: UserState; setUserState: Function },
  {
    history,
    addHistNode,
  }: { history: Map<string, HistoryNode>; addHistNode: Function },
  promoModalRef: MutableRefObject<HTMLDialogElement>,
  gameEndModalRef: MutableRefObject<HTMLDialogElement>,
  setMoves: Function,
  timer: { white: any; black: any }
) => {
  const playerTurn = userState.turnNumber % 2 ? "black" : "white";
  handleTimer(userState, timer, history);

  // find moves for player and disable moves if there is a game winner
  setMoves(() => {
    const newMoves = findMovablePieces(boardState, userState);
    checkWinner(
      Object.keys(newMoves).length,
      userState.gameWinner,
      setUserState,
      gameEndModalRef,
      timer
    );
    return newMoves;
  });

  // player hasn't made 2 valid selections
  if (userState.secondSelection === -1 || promoModalRef.current.open) {
    return;
  }

  const [indexFrom, indexTo] = [
    userState.firstSelection,
    userState.secondSelection,
  ];

  const isPawnReachEnd =
    boardState[indexFrom] === (playerTurn === "white" ? 1 : 11) &&
    Math.floor(indexTo / 8) === (playerTurn === "white" ? 0 : 7);

  // check for pawn promotion and prompt the user for a promotion piece.
  if (isPawnReachEnd && userState.promoValue === "") {
    openPromoModal(indexTo, playerTurn, setUserState, promoModalRef);
    return;
  }

  if (promoModalRef.current.open) {
    return;
  }

  [userState.firstSelection, userState.secondSelection] = [-1, -1];

  //cancel selection if selected piece is re-selected
  if (indexTo === indexFrom) {
    return;
  }

  setUserState((prevState: { [key: string]: any }) => {
    return {
      ...prevState,
      prevFirstSelection: indexFrom,
      prevSecondSelection: indexTo,
    };
  });

  // update board state to reflect valid move
  setBoardState((prevBoardState: Array<number>) => {
    const newBoardState = simulateBoardMove(prevBoardState, indexFrom, indexTo);

    // check for pawn promotion and set new board state.
    if (userState.isPromo) {
      newBoardState[indexTo] = isPawnReachEnd
        ? pieceToNumber[userState.promoValue][playerTurn]
        : newBoardState[indexTo];
      setUserState((prevState: { [key: string]: any }) => {
        return { ...prevState, isPromo: false, promoValue: "" };
      });
    }
    // });

    // setBoardState((prevBoardState: Array<number>) => {
    //   const newBoardState = simulateBoardMove(prevBoardState, indexFrom, indexTo);

    const queenCastleRook = playerTurn === "white" ? 56 : 0;
    const kingCastleRook = playerTurn === "white" ? 63 : 7;

    // If king or rook moves, castling is turned off.
    if (numberToPiece[prevBoardState[indexFrom]] === "R") {
      if (
        userState.canCastle[playerTurn]["queen"] === true &&
        indexFrom === queenCastleRook
      ) {
        setUserState((prevState: UserState) => {
          const newState = { ...prevState };
          newState.canCastle[playerTurn]["queen"] = false;
          return newState;
        });
      }
      if (
        userState.canCastle[playerTurn]["king"] === true &&
        indexFrom === kingCastleRook
      ) {
        setUserState((prevState: { [key: string]: any }) => {
          const newState = { ...prevState };
          newState.canCastle[playerTurn]["king"] = false;
          return newState;
        });
      }
    }
    if (numberToPiece[prevBoardState[indexFrom]] === "K") {
      setUserState((prevState: { [key: string]: any }) => {
        const newState = { ...prevState };
        newState.canCastle[playerTurn]["king"] = false;
        newState.canCastle[playerTurn]["queen"] = false;
        return newState;
      });
    }

    // check for castling moves. if king moves 2 squares, it's a castle move.
    const isKingMoveTwo =
      prevBoardState[indexFrom] === (playerTurn === "white" ? 0 : 10) &&
      Math.abs(indexFrom - indexTo) === 2;

    const castlingBoardState = isKingMoveTwo
      ? indexTo - indexFrom > 0
        ? simulateBoardMove(newBoardState, kingCastleRook, indexTo - 1)
        : simulateBoardMove(newBoardState, queenCastleRook, indexTo + 1)
      : null;
    if (castlingBoardState) {
      setUserState((prevState: { [key: string]: any }) => {
        const newState = { ...prevState };
        newState.canCastle[playerTurn]["king"] = false;
        newState.canCastle[playerTurn]["queen"] = false;
        return newState;
      });
    }

    // check for en passant. if the pawn moves diagonally to an empty square, it's an en passant.
    const oneRowForward = playerTurn === "white" ? -8 : 8;
    const isPawnAttackingEmpty =
      prevBoardState[indexFrom] === (playerTurn === "white" ? 1 : 11) &&
      prevBoardState[indexTo] < 0 &&
      (Math.abs(indexTo - indexFrom) === 7 ||
        Math.abs(indexTo - indexFrom) === 9);

    const enPassantBoardState = isPawnAttackingEmpty
      ? simulateBoardMove(newBoardState, -1, indexTo - oneRowForward)
      : null;

    const finalBoardState = enPassantBoardState
      ? enPassantBoardState
      : castlingBoardState || newBoardState;

    // switch player turn
    setUserState((prevUserState: UserState) => {
      const newUserState = { ...prevUserState };
      newUserState.currentNode = JSON.stringify(finalBoardState);
      newUserState.turnNumber += 1;
      // determine new moves available for next player
      setMoves(() => findMovablePieces(newBoardState, newUserState));

      // add move to history
      const historyKey =
        JSON.stringify(finalBoardState) + newUserState.turnNumber.toString();
      const newNode =
        history.get(historyKey) ||
        new HistoryNode(
          finalBoardState,
          newUserState,
          history.get(
            JSON.stringify(prevBoardState) + prevUserState.turnNumber.toString()
          ),
          timer
        );
      addHistNode(gameID, historyKey, newNode);

      return newUserState;
    });

    return finalBoardState;
  });
};

const handleTimer = (
  userState: UserState,
  timer: { white: any; black: any },
  history: Map<string, HistoryNode>
) => {
  // start and stop timers based on player turn
  if (userState.turnNumber === 0 || userState.gameWinner === "") {
    timer.white.pause();
    timer.black.pause();
  } else {
    if (userState.turnNumber % 2) {
      timer.black.resume();
      timer.white.pause();
    } else {
      timer.white.resume();
      timer.black.pause();
    }
  }
};

const checkWinner = (
  newMovesNumber: number,
  gameWinner: string,
  setUserState: Function,
  gameEndModalRef: MutableRefObject<HTMLDialogElement>,
  timer: { white: any; black: any }
) => {
  if (!newMovesNumber || gameWinner !== "") {
    // if win by checkmate (no valid moves for opponent), set game winner
    if (gameWinner === "") {
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
      (document.activeElement as HTMLElement)?.blur();
    }
    timer.white.pause();
    timer.black.pause();
    return {};
  }
};

const openPromoModal = (
  indexTo: number,
  playerTurn: string,
  setUserState: Function,
  promoModalRef: MutableRefObject<HTMLDialogElement>
) => {
  if (!promoModalRef.current.open) {
    promoModalRef.current.style.left = `${((indexTo % 8) - 4) * 52 + 208}px`;
    promoModalRef.current.style.top = playerTurn === "white" ? "51px" : "309px";
    promoModalRef.current.show();
    (document.activeElement as HTMLElement)?.blur();
    setUserState((prevState: { [key: string]: any }) => {
      return { ...prevState, isPromo: true };
    });
  }
};

export default gameHandler;
