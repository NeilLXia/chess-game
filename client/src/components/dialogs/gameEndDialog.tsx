import * as React from "react";
import { useContext, MutableRefObject } from "react";
import { UserContext } from "../../hooks/userContext";

function GameEndDialog({
  gameEndModalRef,
}: {
  gameEndModalRef: MutableRefObject<HTMLDialogElement>;
}) {
  const [userState, setUserState] = useContext(UserContext);
  return (
    <dialog ref={gameEndModalRef} className="dialog">
      <div className="dialog-title">{userState.gameWinner} wins!</div>
      <div className="dialog-option-list">
        <button
          className="dialog-button"
          onClick={() => {
            location.reload();
          }}
        >
          New Game
        </button>
        <button
          className="dialog-button"
          onClick={() => {
            gameEndModalRef.current.close();
          }}
        >
          Review Game
        </button>
      </div>
    </dialog>
  );
}

export default GameEndDialog;
