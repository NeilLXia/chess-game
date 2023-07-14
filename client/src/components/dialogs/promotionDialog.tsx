import * as React from "react";
import { MutableRefObject } from "react";
import { pieceToUnicode } from "../../lib/gameHandler/pieceTypes";

function PromotionDialog({
  promoModalRef,
  userState,
  setUserState,
}: {
  promoModalRef: MutableRefObject<HTMLDialogElement>;
  userState: { [key: string]: any };
  setUserState: Function;
}) {
  const promoPieces = ["Q", "R", "B", "N"];

  const promotePawn = (piece: string) => {
    setUserState((prevState: { [key: string]: any }) => {
      return { ...prevState, promoValue: piece };
    });
    promoModalRef.current.close();
  };

  document.addEventListener("keydown", (e) => {
    var charCode = e.key;
    if (charCode === "Escape" && userState.isPromo) {
      e.preventDefault();
    }
  });

  return (
    <dialog ref={promoModalRef} className="promotion-dialog">
      <div className="dialog-title">Pawn Promotion</div>
      <div className="promotion-list">
        {promoPieces.map((piece: string) => {
          return (
            <button
              key={piece}
              className="promotion-button"
              onClick={() => promotePawn(piece)}
            >
              <div
                className={`board-piece ${
                  userState.isPromo ? "black-piece" : "white-piece"
                }`}
              >
                <div className="piece-icon">{pieceToUnicode[piece]}</div>
              </div>
            </button>
          );
        })}
      </div>
    </dialog>
  );
}

export default PromotionDialog;
