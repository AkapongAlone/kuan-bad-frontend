import { Player, Settings } from '../types';

export const calculateShuttleCostPerPlayer = (
  shuttlesUsed: number,
  shuttleCost: number
): number => {
  return shuttlesUsed * shuttleCost;
};

export const calculateSplitCost = (
  totalCost: number,
  playerCount: number
): number => {
  if (playerCount === 0) return 0;
  return totalCost / playerCount;
};

export const updatePlayerCostsForSplitSystem = (
  players: Player[],
  totalCost: number
): Player[] => {
  const costPerPerson = calculateSplitCost(totalCost, players.length);
  return players.map(p => ({ ...p, cost: costPerPerson }));
};