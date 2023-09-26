class UserState {
  prevFirstSelection: number;
  prevSecondSelection: number;
  firstSelection: number;
  secondSelection: number;
  rootNode: string;
  currentNode: string;
  gameWinner: string;
  turnNumber: number;
  canCastle: {
    black: { queen: boolean; king: boolean };
    white: { queen: boolean; king: boolean };
  };
  isPromo: boolean;
  promoValue: string;
}

export default UserState;
