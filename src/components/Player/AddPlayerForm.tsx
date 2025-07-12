import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { Player } from '../../types';

interface AddPlayerFormProps {
  onAddPlayer: (name: string, skill: Player['skill']) => void;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ onAddPlayer }) => {
  const [name, setName] = useState('');
  const [skill, setSkill] = useState<Player['skill']>('N');

  const handleSubmit = () => {
    if (name.trim()) {
      onAddPlayer(name.trim(), skill);
      setName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <h2 className="text-lg font-light text-gray-700 mb-4 flex items-center gap-2">
        <Users size={20} />
        เพิ่มสมาชิก
      </h2>
      <div className="flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="ชื่อสมาชิก"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
        />
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value as Player['skill'])}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
        >
          <option value="BG">BG</option>
          <option value="N">N</option>
          <option value="S">S</option>
          <option value="P-">P-</option>
          <option value="P/P+">P/P+</option>
          <option value="C">C</option>
        </select>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          เพิ่ม
        </button>
      </div>
    </div>
  );
};

export default AddPlayerForm;