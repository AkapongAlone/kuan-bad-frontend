import React from 'react';
import { X } from 'lucide-react';
import { Settings } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  settings: Settings;
  onClose: () => void;
  onSettingsChange: (settings: Settings) => void;
  onCalculateSplitCost: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSettingsChange,
  onCalculateSplitCost
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-light">ตั้งค่าระบบ</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">จำนวนสนาม</label>
            <input
              type="number"
              value={settings.courts === 0 ? '' : settings.courts}
              onChange={(e) => onSettingsChange({
                ...settings,
                courts: parseInt(e.target.value) || 0
              })}
              placeholder="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">ระบบคิดเงิน</label>
            <select
              value={settings.costSystem}
              onChange={(e) => onSettingsChange({
                ...settings,
                costSystem: e.target.value as 'club' | 'split'
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            >
              <option value="club">ระบบก๊วน</option>
              {/* <option value="split">หารเท่า</option> */}
            </select>
          </div>

          {settings.costSystem === 'club' ? (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-2">ค่าสนาม (บาท/คน)</label>
                <input
                  type="number"
                  value={settings.fixedCost || ''}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    fixedCost: parseInt(e.target.value) || 0
                  })}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">ค่าลูก (บาท/ลูก/คน)</label>
                <input
                  type="number"
                  value={settings.shuttleCost || ''}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    shuttleCost: parseInt(e.target.value) || 0
                  })}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  *ค่าลูกที่แต่ละคนต้องจ่ายต่อ 1 ลูก (ไม่หาร 4)
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-2">ค่าใช้จ่ายทั้งหมด (บาท)</label>
                <input
                  type="number"
                  value={settings.totalCost || ''}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    totalCost: parseInt(e.target.value) || 0
                  })}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                />
              </div>
              <button
                onClick={onCalculateSplitCost}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                คำนวณค่าใช้จ่าย
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;