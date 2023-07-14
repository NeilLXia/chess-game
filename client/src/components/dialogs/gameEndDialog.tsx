import * as React from "react";
import { MutableRefObject } from "react";

function GameEndDialog({
  gameEndModalRef,
  userState,
}: {
  gameEndModalRef: MutableRefObject<HTMLDialogElement>;
  userState: { [key: string]: any };
}) {
  return (
    <dialog ref={gameEndModalRef} className="promotion-dialog">
      <div className="dialog-title">{userState.gameWinner} wins!</div>
      <div className="promotion-list">
        <button
          className=""
          onClick={() => {
            location.reload();
          }}
        >
          New Game
        </button>
        <button
          className=""
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
