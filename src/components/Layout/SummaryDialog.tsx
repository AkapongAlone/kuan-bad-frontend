import React from 'react';
import { X, Users, Award, DollarSign } from 'lucide-react';
import { Player, Match, Settings } from '../../types';
import { SKILL_COLORS } from '../../constants';

interface SummaryDialogProps {
  isOpen: boolean;
  players: Player[];
  matches: Match[];
  settings: Settings;
  onClose: () => void;
  onConfirmEnd: () => void;
}

const SummaryDialog: React.FC<SummaryDialogProps> = ({
  isOpen,
  players,
  matches,
  settings,
  onClose,
  onConfirmEnd
}) => {
  if (!isOpen) return null;

  // คำนวณข้อมูลสรุป
  const totalPlayers = players.length;
  const skillCounts = players.reduce((acc, player) => {
    acc[player.skill] = (acc[player.skill] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalCourtFees = players.reduce((sum, player) => {
    return sum + (settings.costSystem === 'club' ? settings.fixedCost : player.cost);
  }, 0);

  const totalShuttlesUsed = matches.reduce((sum, match) => {
    return sum + match.shuttlesUsed;
  }, 0);

  const totalShuttleFees = totalShuttlesUsed * settings.shuttleCost * 
    (settings.costSystem === 'club' ? players.filter(p => p.gamesPlayed > 0).length : 1);

  const totalIncome = settings.costSystem === 'club' 
    ? totalCourtFees + totalShuttleFees
    : settings.totalCost;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-light">สรุปการจัดก๊วน</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* จำนวนผู้เล่น */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="text-gray-600" size={20} />
              <h3 className="font-medium">ผู้เล่นทั้งหมด</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">{totalPlayers} คน</p>
            
            {/* แสดงจำนวนผู้เล่นตามระดับฝีมือ */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {Object.entries(skillCounts).map(([skill, count]) => (
                <div key={skill} className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 text-xs rounded-full text-white ${SKILL_COLORS[skill as keyof typeof SKILL_COLORS]}`}>
                    {skill}
                  </span>
                  <span className="text-sm text-gray-600">{count} คน</span>
                </div>
              ))}
            </div>
          </div>

          {/* ข้อมูลการเล่น */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="text-gray-600" size={20} />
              <h3 className="font-medium">ข้อมูลการเล่น</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">จำนวนแมทช์ทั้งหมด:</span>
                <span className="font-medium">{matches.length} แมทช์</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ลูกแบดที่ใช้ทั้งหมด:</span>
                <span className="font-medium">{totalShuttlesUsed} ลูก</span>
              </div>
            </div>
          </div>

          {/* ข้อมูลรายได้ */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="text-gray-600" size={20} />
              <h3 className="font-medium">รายได้</h3>
            </div>
            <div className="space-y-2 text-sm">
              {settings.costSystem === 'club' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ค่าคอร์ด:</span>
                    <span className="font-medium">฿{totalCourtFees.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ค่าลูก:</span>
                    <span className="font-medium">฿{totalShuttleFees.toFixed(0)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>รวมทั้งหมด:</span>
                      <span className="text-green-600">฿{totalIncome.toFixed(0)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-lg font-bold">
                  <span>รวมทั้งหมด:</span>
                  <span className="text-green-600">฿{totalIncome.toFixed(0)}</span>
                </div>
              )}
            </div>
          </div>

          {/* คำเตือน */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>คำเตือน:</strong> การกดปุ่ม "ยืนยันเสร็จสิ้น" จะลบข้อมูลทั้งหมดและไม่สามารถกู้คืนได้
            </p>
          </div>

          {/* ปุ่ม */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={onConfirmEnd}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              ยืนยันเสร็จสิ้น
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDialog;