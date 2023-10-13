import * as React from "react";
import { useContext, MutableRefObject } from "react";
import { pieceToUnicode } from "../../lib/gameHandler/referenceData/pieceTypes";
import { UserContext } from "../../hooks/userContext";

function PromotionDialog({
  promoModalRef,
}: {
  promoModalRef: MutableRefObject<HTMLDialogElement>;
}) {
  const [userState, setUserState] = useContext(UserContext);
  const promoPieces = ["Q", "N", "R", "B"];

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
    <dialog ref={promoModalRef} className="dialog promotion-dialog">
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
    </dialog>
  );
}

export default PromotionDialog;
