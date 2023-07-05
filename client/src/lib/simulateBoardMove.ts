const simulateBoardMove = (
  boardState: Array<number>,
  indexFrom: number,
  indexTo: number
) => {
  const newBoardState = [...boardState];
  [newBoardState[indexTo], newBoardState[indexFrom]] = [
    newBoardState[indexFrom],
    -1,
  ];

  return newBoardState;
};

export default simulateBoardMove;
