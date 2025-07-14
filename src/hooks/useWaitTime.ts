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
          if (!player.isPlaying) {
            // ถ้ายังไม่เคยเล่นเลย ให้นับจาก joinedAt
            // ถ้าเคยเล่นแล้ว ให้นับจาก lastPlayTime
            const referenceTime = player.lastPlayTime 
              ? new Date(player.lastPlayTime) 
              : new Date(player.joinedAt);
              
            const waitTime = Math.floor(
              (new Date().getTime() - referenceTime.getTime()) / 60000
            );
            
            return { ...player, waitTime };
          }
          return player;
        })
      );
    };

    // Update immediately when component mounts
    updateWaitTimes();

    const interval = setInterval(updateWaitTimes, WAIT_TIME_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [players, setPlayers]);
}