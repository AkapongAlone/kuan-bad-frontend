import React, { useState, useMemo } from 'react';
import { Play, Clock, AlertCircle, Search, Filter, Users } from 'lucide-react';
import { Player } from '../../types';
import { SKILL_COLORS, WAIT_TIME_WARNING_THRESHOLD } from '../../constants';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface PlayerTableProps {
  players: Player[];
  selectedPlayers: string[];
  queueCount: number;
  onPlayerSelect: (playerId: string) => void;
  onPlayerRemove: (playerId: string) => void;
  onCreateMatch: () => void;
  onAddToQueue: () => void;
  onShowQueue: () => void;
}

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  selectedPlayers,
  onPlayerSelect,
  onPlayerRemove,
  onCreateMatch,
  onAddToQueue
}) => {
  // State สำหรับ dialog ยืนยันการลบ
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  
  // State สำหรับ search และ filter
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter players based on search and filters
  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      // Search filter
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Skill filter
      const matchesSkill = skillFilter === 'all' || player.skill === skillFilter;
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'playing' && player.isPlaying) ||
        (statusFilter === 'waiting' && !player.isPlaying);
      
      return matchesSearch && matchesSkill && matchesStatus;
    });
  }, [players, searchTerm, skillFilter, statusFilter]);

  const handleDeleteClick = (e: React.MouseEvent, player: Player) => {
    e.stopPropagation();
    setPlayerToDelete(player);
    setDeleteDialogOpen(true);
  };

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
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-light text-gray-700">รายชื่อสมาชิก</h2>
            <p className="text-sm text-gray-500 mt-1">{getStatusMessage()}</p>
          </div>
          {selectedPlayers.length === 4 && (
            <div className="flex gap-2">
              <button
                onClick={onAddToQueue}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Users size={18} />
                เพิ่มคิว
              </button>
              <button
                onClick={onCreateMatch}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Play size={18} />
                จัดแมทช์
              </button>
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ค้นหาผู้เล่น..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            >
              <option value="all">ทุกระดับ</option>
              <option value="BG">BG</option>
              <option value="N">N</option>
              <option value="S">S</option>
              <option value="P-">P-</option>
              <option value="P/P+">P/P+</option>
              <option value="C">C</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="waiting">รอ</option>
              <option value="playing">กำลังเล่น</option>
            </select>
          </div>
        </div>
        
        {/* Result count */}
        {(searchTerm || skillFilter !== 'all' || statusFilter !== 'all') && (
          <p className="text-sm text-gray-500 mt-3">
            พบ {filteredPlayers.length} คน จากทั้งหมด {players.length} คน
          </p>
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
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  {searchTerm || skillFilter !== 'all' || statusFilter !== 'all' 
                    ? 'ไม่พบผู้เล่นที่ตรงกับเงื่อนไข' 
                    : 'ยังไม่มีผู้เล่น'}
                </td>
              </tr>
            ) : (
              filteredPlayers.map(player => {
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
              })
            )}
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