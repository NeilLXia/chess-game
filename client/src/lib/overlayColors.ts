const overlayColors = (state: string) => {
  if (state === "selectPiece") {
    return "overlay overlay-blue";
  } else if (state === "unselect") {
    return "overlay overlay-grey";
  } else if (state === "takePiece") {
    return "overlay overlay-red";
  } else if (state === "movePiece") {
    return "overlay overlay-blue";
  } else if (state === "prevMove") {
    return "overlay overlay-yellow";
  } else {
    return "overlay";
  }
};

export default overlayColors;
