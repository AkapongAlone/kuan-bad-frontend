import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Player } from '../../types';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  player: Player | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  player,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !player) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <h3 className="text-lg font-medium">ยืนยันการลบผู้เล่น</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            ต้องการลบผู้เล่น "<strong>{player.name}</strong>" ออกจากระบบใช่หรือไม่?
          </p>
          {player.cost > 0 && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mt-3">
              <strong>โปรดตรวจสอบ:</strong> ผู้เล่นนี้มีค่าใช้จ่ายค้างชำระ ฿{player.cost.toFixed(0)} 
              กรุณาตรวจสอบให้แน่ใจว่าได้รับชำระเงินเรียบร้อยแล้ว
            </p>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            ลบผู้เล่น
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;