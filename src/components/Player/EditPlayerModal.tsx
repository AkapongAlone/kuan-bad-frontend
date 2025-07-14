import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Player } from '../../types';

interface EditPlayerModalProps {
  isOpen: boolean;
  player: Player | null;
  onClose: () => void;
  onSave: (playerId: string, updates: Partial<Player>) => void;
}

const EditPlayerModal: React.FC<EditPlayerModalProps> = ({
  isOpen,
  player,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [skill, setSkill] = useState<Player['skill']>('N');

  React.useEffect(() => {
    if (player) {
      setName(player.name);
      setSkill(player.skill);
    }
  }, [player]);

  if (!isOpen || !player) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(player.id, {
        name: name.trim(),
        skill
      });
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">แก้ไขข้อมูลผู้เล่น</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">ชื่อ</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">ระดับฝีมือ</label>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value as Player['skill'])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            >
              <option value="BG">BG</option>
              <option value="N">N</option>
              <option value="S">S</option>
              <option value="P-">P-</option>
              <option value="P/P+">P/P+</option>
              <option value="C">C</option>
            </select>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">เล่นแล้ว:</span>
              <span className="font-medium">{player.gamesPlayed} เกม</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ลูกที่ใช้:</span>
              <span className="font-medium">{player.shuttlesUsed || 0} ลูก</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ค่าใช้จ่าย:</span>
              <span className="font-medium">฿{player.cost.toFixed(0)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlayerModal;