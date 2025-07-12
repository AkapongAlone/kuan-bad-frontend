import { useEffect } from 'react';
import { Player } from '../types';

// Constants
const WAIT_TIME_UPDATE_INTERVAL = 10000; // 10 seconds

export function useWaitTime(
  players: Player[],
  setPlayers: (players: Player[]) => void
) {
  useEffect(() => {
    const updateWaitTimes = () => {
      setPlayers(
        players.map(player => {
          if (!player.isPlaying && player.lastPlayTime) {
            const waitTime = Math.floor(
              (new Date().getTime() - new Date(player.lastPlayTime).getTime()) / 60000
            );
            return { ...player, waitTime };
          }
          return player;
        })
      );
    };

    const interval = setInterval(updateWaitTimes, WAIT_TIME_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [players, setPlayers]);
}