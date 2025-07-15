import React, { useState, useMemo } from 'react';
import { Play, Clock, AlertCircle, Search, Filter, Users, Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import { Player } from '../../types';
import { SKILL_COLORS, WAIT_TIME_WARNING_THRESHOLD } from '../../constants';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import EditPlayerModal from './EditPlayerModal';

interface PlayerTableProps {
  players: Player[];
  selectedPlayers: string[];
  queueCount: number;
  onPlayerSelect: (playerId: string) => void;
  onPlayerRemove: (playerId: string) => void;
  onPlayerUpdate: (playerId: string, updates: Partial<Player>) => void;
  onCreateMatch: () => void;
  onAddToQueue: () => void;
  onShowQueue: () => void;
}

type SortField = 'name' | 'skill' | 'gamesPlayed' | 'shuttlesUsed' | 'waitTime' | 'cost' | 'status';
type SortDirection = 'asc' | 'desc';

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  selectedPlayers,
  queueCount,
  onPlayerSelect,
  onPlayerRemove,
  onPlayerUpdate,
  onCreateMatch,
  onAddToQueue,
  onShowQueue
}) => {
  // State สำหรับ dialog ยืนยันการลบ
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  
  // State สำหรับแก้ไขผู้เล่น
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
  
  // State สำหรับ search และ filter
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // State สำหรับ sorting
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Function to handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort players
  const filteredAndSortedPlayers = useMemo(() => {
    let filtered = players.filter(player => {
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

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'skill':
          aValue = a.skill;
          bValue = b.skill;
          break;
        case 'gamesPlayed':
          aValue = a.gamesPlayed;
          bValue = b.gamesPlayed;
          break;
        case 'shuttlesUsed':
          aValue = a.shuttlesUsed || 0;
          bValue = b.shuttlesUsed || 0;
          break;
        case 'waitTime':
          aValue = a.waitTime;
          bValue = b.waitTime;
          break;
        case 'cost':
          aValue = a.cost;
          bValue = b.cost;
          break;
        case 'status':
          aValue = a.isPlaying ? 1 : 0;
          bValue = b.isPlaying ? 1 : 0;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [players, searchTerm, skillFilter, statusFilter, sortField, sortDirection]);

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

  const handleEditClick = (e: React.MouseEvent, player: Player) => {
    e.stopPropagation();
    setPlayerToEdit(player);
    setEditDialogOpen(true);
  };

  const handleEditSave = (playerId: string, updates: Partial<Player>) => {
    onPlayerUpdate(playerId, updates);
    setEditDialogOpen(false);
    setPlayerToEdit(null);
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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />;
    }
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header Section - Fixed */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-light text-gray-700">รายชื่อสมาชิก</h2>
            <p className="text-sm text-gray-500 mt-1">{getStatusMessage()}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onShowQueue}
              className="relative px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Users size={18} />
              ดูคิว
              {queueCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {queueCount}
                </span>
              )}
            </button>
            {selectedPlayers.length === 4 && (
              <>
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
              </>
            )}
          </div>
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
            พบ {filteredAndSortedPlayers.length} คน จากทั้งหมด {players.length} คน
          </p>
        )}
      </div>
      
      {/* Table Section - Scrollable */}
      <div className="max-h-[600px] overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr className="border-b border-gray-200">
              <th 
                className="text-left p-4 font-light text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  ชื่อ
                  <SortIcon field="name" />
                </div>
              </th>
              <th 
                className="text-left p-4 font-light text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('skill')}
              >
                <div className="flex items-center gap-1">
                  ระดับ
                  <SortIcon field="skill" />
                </div>
              </th>
              <th 
                className="text-left p-4 font-light text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('gamesPlayed')}
              >
                <div className="flex items-center gap-1">
                  เล่นแล้ว
                  <SortIcon field="gamesPlayed" />
                </div>
              </th>
              <th 
                className="text-left p-4 font-light text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('shuttlesUsed')}
              >
                <div className="flex items-center gap-1">
                  ลูกที่ใช้
                  <SortIcon field="shuttlesUsed" />
                </div>
              </th>
              <th 
                className="text-left p-4 font-light text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('waitTime')}
              >
                <div className="flex items-center gap-1">
                  เวลารอ
                  <SortIcon field="waitTime" />
                </div>
              </th>
              <th 
                className="text-left p-4 font-light text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('cost')}
              >
                <div className="flex items-center gap-1">
                  ค่าใช้จ่าย
                  <SortIcon field="cost" />
                </div>
              </th>
              <th 
                className="text-left p-4 font-light text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  สถานะ
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="text-left p-4 font-light text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedPlayers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  {searchTerm || skillFilter !== 'all' || statusFilter !== 'all' 
                    ? 'ไม่พบผู้เล่นที่ตรงกับเงื่อนไข' 
                    : 'ยังไม่มีผู้เล่น'}
                </td>
              </tr>
            ) : (
              filteredAndSortedPlayers.map(player => {
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
                    <td className="p-4 text-gray-700">{player.shuttlesUsed || 0}</td>
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
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleEditClick(e, player)}
                          className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1"
                        >
                          <Edit2 size={14} />
                          แก้ไข
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, player)}
                          className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          ลบ
                        </button>
                      </div>
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
      
      <EditPlayerModal
        isOpen={editDialogOpen}
        player={playerToEdit}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default PlayerTable;