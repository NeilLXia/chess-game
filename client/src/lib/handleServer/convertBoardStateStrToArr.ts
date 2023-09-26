const convertBoardStateStrToArr = (boardString: string) => {
  if (!boardString) return null;

  return boardString
    .split(/(..)/g)
    .filter((s: string) => s)
    .map((s: string) => {
      return Number(s) - 1;
    });
};

export default convertBoardStateStrToArr;
