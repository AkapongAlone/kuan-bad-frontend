import React from 'react';
import { Activity, Settings, CheckCircle } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
  onEndSession: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, onEndSession }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light flex items-center gap-3">
            <Activity className="text-gray-700" size={28} />
            <span className="text-gray-900">ระบบจัดการกลุ่มแบดมินตัน</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={onEndSession}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle size={20} />
              เสร็จสิ้นการจัดก๊วน
            </button>
            <button
              onClick={onSettingsClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="text-gray-600" size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;