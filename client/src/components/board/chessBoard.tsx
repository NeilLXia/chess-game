import * as React from "react";
import { useContext, MutableRefObject } from "react";
import { UserContext } from "../../hooks/userContext";
import ChessSquare from "./chessSquare";
import PromotionDialog from "../dialogs/promotionDialog";

const ChessBoard = ({
  moves,
  promoModalRef,
}: {
  moves: any;
  promoModalRef: MutableRefObject<HTMLDialogElement>;
}) => {
  const [userState] = useContext(UserContext);

  // render 8 x 8 square grid and mark them as either black or white
  const squares = Array.from(Array(64).keys()).map(
    (piece: number, index: number) => {
      const squareColor =
        ((index % 8) + Math.floor(index / 8)) % 2 ? "black" : "white";

      const noSelectionColor = moves[index]
        ? "blue"
        : index === userState.prevFirstSelection ||
          index === userState.prevSecondSelection
        ? "yellow"
        : "";

      const pieceSelectedColor =
        index === userState.firstSelection
          ? "grey"
          : moves[userState.firstSelection]?.attackRange.has(index)
          ? "red"
          : moves[userState.firstSelection]?.moveRange.has(index)
          ? "blue"
          : index === userState.prevFirstSelection ||
            index === userState.prevSecondSelection
          ? "yellow"
          : "";

      const overlayColor =
        userState.firstSelection !== -1 ? pieceSelectedColor : noSelectionColor;

      return { index, squareColor, overlayColor };
    }
  );

  return (
    <div id="chessboard" className="chessboard">
      <PromotionDialog promoModalRef={promoModalRef} />
      {squares.map(
        (square: {
          index: number;
          squareColor: string;
          overlayColor: string;
        }) => (
          <ChessSquare key={`${square.index}`} square={square} />
        )
      )}
    </div>
  );
};

export default ChessBoard;
