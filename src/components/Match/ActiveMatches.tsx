import React, { useState } from 'react';
import { Play, ChevronDown, ChevronUp } from 'lucide-react';
import { Match, Player } from '../../types';
import { getMatchDuration } from '../../utils/matchUtils';

interface ActiveMatchesProps {
  matches: Match[];
  players: Player[];
  onEndMatch: (matchId: string, shuttlesUsed: number) => void;
}

const ActiveMatches: React.FC<ActiveMatchesProps> = ({
  matches,
  players,
  onEndMatch
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const activeMatches = matches.filter(m => !m.endTime);

  if (activeMatches.length === 0) return null;

  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || 'Unknown';
  };

  const handleEndMatch = (matchId: string) => {
    const input = document.getElementById(`shuttles-${matchId}`) as HTMLInputElement;
    const shuttlesUsed = parseInt(input.value) || 0;
    onEndMatch(matchId, shuttlesUsed);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-8">
      <div 
        className="p-6 cursor-pointer select-none"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h2 className="text-lg font-light text-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play size={20} />
            แมทช์ที่กำลังเล่น ({activeMatches.length})
          </div>
          {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </h2>
      </div>
      
      {!isCollapsed && (
        <div className="p-6 pt-0">
          <div className="grid gap-4 md:grid-cols-2">
            {activeMatches.map(match => (
              <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-900">สนาม {match.court}</span>
                  <span className="text-sm text-gray-500">
                    {getMatchDuration(match.startTime)} นาที
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-4">
                  <span className="inline-flex items-center gap-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      ทีม A
                    </span>
                    <span className="font-medium">
                      {getPlayerName(match.team1[0])} + {getPlayerName(match.team1[1])}
                    </span>
                  </span>
                  <span className="mx-3 text-gray-400">VS</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      ทีม B
                    </span>
                    <span className="font-medium">
                      {getPlayerName(match.team2[0])} + {getPlayerName(match.team2[1])}
                    </span>
                  </span>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    placeholder="จำนวนลูก"
                    defaultValue="1"
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 w-28"
                    id={`shuttles-${match.id}`}
                  />
                  <button
                    onClick={() => handleEndMatch(match.id)}
                    className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    จบแมทช์
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveMatches;