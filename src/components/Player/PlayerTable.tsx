

import React, { useState } from 'react';
import { Play, Clock, AlertCircle } from 'lucide-react';
import { Player } from '../../types';
import { SKILL_COLORS, WAIT_TIME_WARNING_THRESHOLD } from '../../constants';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface PlayerTableProps {
players: Player[];
selectedPlayers: string[];
onPlayerSelect: (playerId: string) => void;
onPlayerRemove: (playerId: string) => void;
onCreateMatch: () => void;
}

const PlayerTable: React.FC<PlayerTableProps> = ({
players,
selectedPlayers,
onPlayerSelect,
onPlayerRemove,
onCreateMatch
}) => {
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
const handleDeleteConfirm = () => {
  if (playerToDelete) {
    onPlayerRemove(playerToDelete.id);
  }
  setDeleteDialogOpen(false);
  setPlayerToDelete(null);
};

const handleDeleteCancel = () => {
  setDeleteDialogOpen(false);
  setPlayerToDelete(null);
};
const handleDeleteClick = (e: React.MouseEvent, player: Player) => {
  e.stopPropagation();
  setPlayerToDelete(player);
  setDeleteDialogOpen(true);
};
const getStatusMessage = () => {
  if (selectedPlayers.length === 0) {
    return 'คลิกที่แถวเพื่อเลือกผู้เล่น 4 คน';
  } else if (selectedPlayers.length < 2) {
    return `เลือกทีม A: ${selectedPlayers.length}/2 คน`;
  } else if (selectedPlayers.length < 4) {
    return `เลือกทีม B: ${selectedPlayers.length - 2}/2 คน`;
  } else {
    return 'พร้อมจัดแมทช์ (ทีม A สีฟ้า vs ทีม B สีส้ม)';
  }
};

const getTeamInfo = (playerId: string) => {
  const index = selectedPlayers.indexOf(playerId);
  if (index === -1) return null;
  
  return {
    team: index < 2 ? 'ทีม A' : 'ทีม B',
    color: index < 2 ? 'bg-blue-500' : 'bg-orange-500',
    position: index + 1
  };
};

const getRowClassName = (player: Player) => {
  const baseClasses = 'border-b border-gray-100 transition-colors cursor-pointer';
  const waitTimeClasses = player.waitTime > WAIT_TIME_WARNING_THRESHOLD 
    ? 'bg-red-50 hover:bg-red-100' 
    : 'hover:bg-gray-50';
  
  const teamInfo = getTeamInfo(player.id);
  const selectionClasses = teamInfo
    ? teamInfo.team === 'ทีม A'
      ? 'bg-blue-50 hover:bg-blue-100'
      : 'bg-orange-50 hover:bg-orange-100'
    : '';
  
  const disabledClasses = player.isPlaying ? 'opacity-50 cursor-not-allowed' : '';
  
  return `${baseClasses} ${player.waitTime > WAIT_TIME_WARNING_THRESHOLD ? waitTimeClasses : selectionClasses} ${disabledClasses}`;
};

return (
  <div className="bg-white rounded-lg border border-gray-200">
    <div className="flex justify-between items-center p-6 border-b border-gray-200">
      <div>
        <h2 className="text-lg font-light text-gray-700">รายชื่อสมาชิก</h2>
        <p className="text-sm text-gray-500 mt-1">{getStatusMessage()}</p>
      </div>
      {selectedPlayers.length === 4 && (
        <button
          onClick={onCreateMatch}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Play size={18} />
          จัดแมทช์
        </button>
      )}
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left p-4 font-light text-gray-600">ชื่อ</th>
            <th className="text-left p-4 font-light text-gray-600">ระดับ</th>
            <th className="text-left p-4 font-light text-gray-600">เล่นแล้ว</th>
            <th className="text-left p-4 font-light text-gray-600">เวลารอ</th>
            <th className="text-left p-4 font-light text-gray-600">ค่าใช้จ่าย</th>
            <th className="text-left p-4 font-light text-gray-600">สถานะ</th>
            <th className="text-left p-4 font-light text-gray-600"></th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => {
            const teamInfo = getTeamInfo(player.id);
            
            return (
              <tr
                key={player.id}
                onClick={() => !player.isPlaying && onPlayerSelect(player.id)}
                className={getRowClassName(player)}
              >
                <td className="p-4 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    {teamInfo && (
                      <div className={`px-2 py-0.5 text-xs font-medium rounded-full text-white ${teamInfo.color}`}>
                        {teamInfo.team} ({teamInfo.position})
                      </div>
                    )}
                    {player.name}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-white text-xs rounded-full ${SKILL_COLORS[player.skill]}`}>
                    {player.skill}
                  </span>
                </td>
                <td className="p-4 text-gray-700">{player.gamesPlayed}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    {player.waitTime > WAIT_TIME_WARNING_THRESHOLD && (
                      <AlertCircle size={16} className="text-red-500" />
                    )}
                    <Clock size={14} className="text-gray-400" />
                    <span>{player.waitTime} นาที</span>
                  </div>
                </td>
                <td className="p-4 text-gray-700">฿{player.cost.toFixed(0)}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    player.isPlaying ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {player.isPlaying ? 'กำลังเล่น' : 'รอ'}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={(e) => handleDeleteClick(e, player)}
                    className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    ลบผู้เล่น
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    
    <DeleteConfirmDialog
      isOpen={deleteDialogOpen}
      player={playerToDelete}
      onClose={handleDeleteCancel}
      onConfirm={handleDeleteConfirm}
    />
  </div>
);
};

export default PlayerTable;