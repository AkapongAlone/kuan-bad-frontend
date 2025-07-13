import React, { useState, useEffect } from 'react';
import {
  Header,
  SettingsModal,
  SummaryDialog,
  QueueTableModal,
  AddPlayerForm,
  PlayerTable,
  ActiveMatches
} from './components';
import { Player, Match, Settings, BadmintonData, Queue } from './types';
import { DEFAULT_SETTINGS, LOCAL_STORAGE_KEY } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useWaitTime } from './hooks/useWaitTime';
import {
  hasTeamsPlayedBefore,
  getActiveCourtCount
} from './utils/matchUtils';
import {
  calculateShuttleCostPerPlayer,
  updatePlayerCostsForSplitSystem
} from './utils/costCalculator';

const App = () => {
  const [data, setData] = useLocalStorage<BadmintonData>(LOCAL_STORAGE_KEY, {
    players: [],
    matches: [],
    deletedPlayers: [],
    queues: [],
    matchHistory: [],
    settings: DEFAULT_SETTINGS
  });

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  // Destructure data for easier access
  const { players, matches, matchHistory, settings, deletedPlayers, queues } = data;

  // ตรวจสอบว่าตั้งค่าระบบแล้วหรือยัง
  const isSystemConfigured = settings.costSystem === 'split' 
    ? settings.totalCost > 0 
    : settings.fixedCost > 0 && settings.shuttleCost > 0;

  // Update wait times
  useWaitTime(players, (updatedPlayers) => {
    setData({ ...data, players: updatedPlayers });
  });

  // เปิด settings modal อัตโนมัติถ้ายังไม่ได้ตั้งค่า
  useEffect(() => {
    if (!isSystemConfigured && players.length === 0 && matches.length === 0) {
      setShowSettings(true);
    }
  }, [isSystemConfigured, players.length, matches.length]);

  const handleAddPlayer = (name: string, skill: Player['skill']) => {
    if (!isSystemConfigured) {
      alert('กรุณาตั้งค่าระบบก่อน (ค่าคอร์ดและค่าลูก)');
      setShowSettings(true);
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name,
      skill,
      gamesPlayed: 0,
      waitTime: 0,
      cost: settings.costSystem === 'club' ? settings.fixedCost : 0,
      isPlaying: false
    };

    setData({
      ...data,
      players: [...players, newPlayer]
    });
  };

  const handleRemovePlayer = (id: string) => {
    const playerToRemove = players.find(p => p.id === id);
    if (playerToRemove) {
      setData({
        ...data,
        players: players.filter(p => p.id !== id),
        deletedPlayers: [...data.deletedPlayers, playerToRemove]
      });
      setSelectedPlayers(selectedPlayers.filter(pid => pid !== id));
    }
  };

  const handleTogglePlayerSelection = (id: string) => {
    if (selectedPlayers.includes(id)) {
      setSelectedPlayers(selectedPlayers.filter(pid => pid !== id));
    } else if (selectedPlayers.length < 4) {
      setSelectedPlayers([...selectedPlayers, id]);
    }
  };

  const handleAddToQueue = () => {
    if (selectedPlayers.length !== 4) return;

    const [p1, p2, p3, p4] = selectedPlayers;
    const team1: [string, string] = [p1, p2];
    const team2: [string, string] = [p3, p4];

    const newQueue: Queue = {
      id: Date.now().toString(),
      team1,
      team2,
      createdAt: new Date()
    };

    setData({
      ...data,
      queues: [...data.queues, newQueue]
    });

    setSelectedPlayers([]);
    alert('เพิ่มคิวเรียบร้อยแล้ว');
  };

  const handleShowQueue = () => {
    setShowQueue(true);
  };

  const handleDeleteQueue = (queueId: string) => {
    setData({
      ...data,
      queues: queues.filter(q => q.id !== queueId)
    });
  };

  const handleStartMatchFromQueue = (queueId: string) => {
    const queue = queues.find(q => q.id === queueId);
    if (!queue) return;

    const activeCourts = getActiveCourtCount(matches);
    if (activeCourts >= settings.courts) {
      alert('ไม่มีสนามว่าง!');
      return;
    }

    const newMatch: Match = {
      id: Date.now().toString(),
      court: activeCourts + 1,
      team1: queue.team1,
      team2: queue.team2,
      shuttlesUsed: 1,
      startTime: new Date()
    };

    const playerIds = [...queue.team1, ...queue.team2];
    const updatedPlayers = players.map(p => {
      if (playerIds.includes(p.id)) {
        return { ...p, isPlaying: true, gamesPlayed: p.gamesPlayed + 1 };
      }
      return p;
    });

    setData({
      ...data,
      matches: [...matches, newMatch],
      matchHistory: [...matchHistory, [queue.team1.join(','), queue.team2.join(',')]],
      players: updatedPlayers,
      queues: queues.filter(q => q.id !== queueId)
    });

    setShowQueue(false);
  };

  const handleCreateMatch = () => {
    if (!isSystemConfigured) {
      alert('กรุณาตั้งค่าระบบก่อน (ค่าคอร์ดและค่าลูก)');
      setShowSettings(true);
      return;
    }

    if (selectedPlayers.length !== 4) return;

    const activeCourts = getActiveCourtCount(matches);
    if (activeCourts >= settings.courts) {
      alert('ไม่มีสนามว่าง!');
      return;
    }

    const [p1, p2, p3, p4] = selectedPlayers;
    const team1: [string, string] = [p1, p2];
    const team2: [string, string] = [p3, p4];

    if (hasTeamsPlayedBefore(team1, team2, matchHistory)) {
      const confirmed = window.confirm('คู่นี้เคยเจอกันแล้ว! ต้องการจัดแมทช์นี้หรือไม่?');
      if (!confirmed) return;
    }

    const newMatch: Match = {
      id: Date.now().toString(),
      court: activeCourts + 1,
      team1,
      team2,
      shuttlesUsed: 1,
      startTime: new Date()
    };

    const updatedPlayers = players.map(p => {
      if (selectedPlayers.includes(p.id)) {
        return { ...p, isPlaying: true, gamesPlayed: p.gamesPlayed + 1 };
      }
      return p;
    });

    setData({
      ...data,
      matches: [...matches, newMatch],
      matchHistory: [...matchHistory, [team1.join(','), team2.join(',')]],
      players: updatedPlayers
    });

    setSelectedPlayers([]);
  };

  const handleEndMatch = (matchId: string, shuttlesUsed: number) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const updatedMatches = matches.map(m => {
      if (m.id === matchId) {
        return { ...m, endTime: new Date(), shuttlesUsed };
      }
      return m;
    });

    const playerIds = [...match.team1, ...match.team2];
    const updatedPlayers = players.map(p => {
      if (playerIds.includes(p.id)) {
        const shuttleCostPerPlayer = calculateShuttleCostPerPlayer(
          shuttlesUsed,
          settings.shuttleCost
        );
        return {
          ...p,
          isPlaying: false,
          lastPlayTime: new Date(),
          waitTime: 0,
          cost: settings.costSystem === 'club' 
            ? p.cost + shuttleCostPerPlayer 
            : p.cost
        };
      }
      return p;
    });

    setData({
      ...data,
      matches: updatedMatches,
      players: updatedPlayers
    });
  };

  const handleSettingsChange = (newSettings: Settings) => {
    setData({ ...data, settings: newSettings });
  };

  const handleCalculateSplitCost = () => {
    if (settings.costSystem === 'split' && players.length > 0) {
      const updatedPlayers = updatePlayerCostsForSplitSystem(
        players,
        settings.totalCost
      );
      setData({ ...data, players: updatedPlayers });
    }
  };

  const handleEndSession = () => {
    setShowSummary(true);
  };

  const handleConfirmEndSession = () => {
    // Reset all data
    setData({
      players: [],
      matches: [],
      deletedPlayers: [],
      queues: [],
      matchHistory: [],
      settings: DEFAULT_SETTINGS
    });
    setSelectedPlayers([]);
    setShowSummary(false);
    alert('ข้อมูลทั้งหมดถูกรีเซ็ตเรียบร้อยแล้ว');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSettingsClick={() => setShowSettings(true)} 
        onEndSession={handleEndSession}
      />
      
      <SettingsModal
        isOpen={showSettings}
        settings={settings}
        onClose={() => setShowSettings(false)}
        onSettingsChange={handleSettingsChange}
        onCalculateSplitCost={handleCalculateSplitCost}
      />

      <SummaryDialog
        isOpen={showSummary}
        players={players}
        deletedPlayers={data.deletedPlayers}
        matches={matches}
        settings={settings}
        onClose={() => setShowSummary(false)}
        onConfirmEnd={handleConfirmEndSession}
      />

      <QueueTableModal
        isOpen={showQueue}
        queues={queues}
        players={players}
        hasAvailableCourt={getActiveCourtCount(matches) < settings.courts}
        onClose={() => setShowQueue(false)}
        onStartMatch={handleStartMatchFromQueue}
        onDeleteQueue={handleDeleteQueue}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isSystemConfigured && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800">
              <strong>โปรดตั้งค่าระบบก่อนเริ่มใช้งาน:</strong> กรุณากำหนดค่าคอร์ดและค่าลูกในหน้าตั้งค่า
            </p>
          </div>
        )}
        
        <AddPlayerForm onAddPlayer={handleAddPlayer} />
        
        <ActiveMatches
          matches={matches}
          players={players}
          onEndMatch={handleEndMatch}
        />
        
        <PlayerTable
          players={players}
          selectedPlayers={selectedPlayers}
          queueCount={queues.length}
          onPlayerSelect={handleTogglePlayerSelection}
          onPlayerRemove={handleRemovePlayer}
          onCreateMatch={handleCreateMatch}
          onAddToQueue={handleAddToQueue}
          onShowQueue={handleShowQueue}
        />
      </div>
    </div>
  );
};

export default App;