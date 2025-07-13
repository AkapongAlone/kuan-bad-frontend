import React from 'react';
import { X, Play, Trash2, Users } from 'lucide-react';
import { Queue, Player } from '../../types';
import { SKILL_COLORS } from '../../constants';

interface QueueTableModalProps {
  isOpen: boolean;
  queues: Queue[];
  players: Player[];
  hasAvailableCourt: boolean;
  onClose: () => void;
  onStartMatch: (queueId: string) => void;
  onDeleteQueue: (queueId: string) => void;
}

const QueueTableModal: React.FC<QueueTableModalProps> = ({
  isOpen,
  queues,
  players,
  hasAvailableCourt,
  onClose,
  onStartMatch,
  onDeleteQueue
}) => {
  if (!isOpen) return null;

  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || 'Unknown';
  };

  const getPlayerSkill = (playerId: string) => {
    return players.find(p => p.id === playerId)?.skill || 'N';
  };

  const formatQueueTime = (createdAt: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(createdAt).getTime()) / 60000);
    
    if (diff < 1) return 'เมื่อสักครู่';
    if (diff < 60) return `${diff} นาทีที่แล้ว`;
    
    const hours = Math.floor(diff / 60);
    return `${hours} ชั่วโมงที่แล้ว`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-light flex items-center gap-2">
            <Users size={24} />
            รายการคิว ({queues.length})
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {!hasAvailableCourt && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>สนามเต็ม:</strong> ไม่สามารถเริ่มแมทช์ใหม่ได้จนกว่าจะมีสนามว่าง
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {queues.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              ยังไม่มีคิว
            </div>
          ) : (
            <div className="space-y-3">
              {queues.map((queue, index) => (
                <div key={queue.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          คิวที่ {index + 1}
                        </span>
                        <span className="text-xs text-gray-500">
                          • {formatQueueTime(queue.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            ทีม A
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{getPlayerName(queue.team1[0])}</span>
                            <span className={`px-1.5 py-0.5 text-white text-xs rounded-full ${SKILL_COLORS[getPlayerSkill(queue.team1[0])]}`}>
                              {getPlayerSkill(queue.team1[0])}
                            </span>
                            <span className="text-gray-400">+</span>
                            <span className="font-medium">{getPlayerName(queue.team1[1])}</span>
                            <span className={`px-1.5 py-0.5 text-white text-xs rounded-full ${SKILL_COLORS[getPlayerSkill(queue.team1[1])]}`}>
                              {getPlayerSkill(queue.team1[1])}
                            </span>
                          </div>
                        </div>
                        
                        <span className="text-gray-400 self-center">VS</span>
                        
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                            ทีม B
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{getPlayerName(queue.team2[0])}</span>
                            <span className={`px-1.5 py-0.5 text-white text-xs rounded-full ${SKILL_COLORS[getPlayerSkill(queue.team2[0])]}`}>
                              {getPlayerSkill(queue.team2[0])}
                            </span>
                            <span className="text-gray-400">+</span>
                            <span className="font-medium">{getPlayerName(queue.team2[1])}</span>
                            <span className={`px-1.5 py-0.5 text-white text-xs rounded-full ${SKILL_COLORS[getPlayerSkill(queue.team2[1])]}`}>
                              {getPlayerSkill(queue.team2[1])}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => onStartMatch(queue.id)}
                        disabled={!hasAvailableCourt}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-sm ${
                          hasAvailableCourt
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Play size={16} />
                        เริ่ม
                      </button>
                      <button
                        onClick={() => onDeleteQueue(queue.id)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5 text-sm"
                      >
                        <Trash2 size={16} />
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueTableModal;