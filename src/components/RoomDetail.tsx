// src/components/RoomDetail.tsx

// import components ที่มีอยู่แล้ว
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Divider, Chip, Alert, CircularProgress, Button
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SportsIcon from '@mui/icons-material/Sports'; // เพิ่ม icon ใหม่
import { useNavigate } from 'react-router-dom';
import { fetchRoomById } from '../api/apiClient';
import { Room } from '../types';
import PlayerTable from './PlayerTable';
import MatchmakingDialog from './MatchmakingDialog'; // นำเข้า component ใหม่

interface RoomDetailProps {
  roomId: number;
}

const RoomDetail: React.FC<RoomDetailProps> = ({ roomId }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchmakingOpen, setMatchmakingOpen] = useState(false); // เพิ่ม state ใหม่
  const navigate = useNavigate();

  // ฟังก์ชันเดิม
  const loadRoomData = async () => {
    try {
      const data = await fetchRoomById(roomId);
      setRoom(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching room details:', error);
      setError('Failed to load room details. Please try again later.');
      setLoading(false);
    }
  };

  // useEffect เดิม
  useEffect(() => {
    loadRoomData();
  }, [roomId]);

  // ฟังก์ชันเดิม
  const handlePlayerChange = () => {
    loadRoomData();
  };

  const handleBack = () => {
    navigate('/');
  };

  // ฟังก์ชันใหม่สำหรับเปิด/ปิด dialog จับคู่แมตช์
  const handleOpenMatchmaking = () => {
    setMatchmakingOpen(true);
  };

  const handleCloseMatchmaking = () => {
    setMatchmakingOpen(false);
  };

  // ตรวจสอบว่ามีผู้เล่นพอสำหรับจับคู่หรือไม่ (ต้องมีอย่างน้อย 4 คน)
  const hasEnoughPlayers = room?.players && room.players.length >= 4;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !room) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Rooms
        </Button>
        <Alert severity="error">
          {error || 'Room not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        Back to Rooms
      </Button>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            {room.name}
          </Typography>
          
          {/* เพิ่มปุ่มจับคู่แมตช์ */}
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<SportsIcon />}
            onClick={handleOpenMatchmaking}
            disabled={!hasEnoughPlayers}
            sx={{ mb: 2 }}
          >
            จับคู่แมตช์อัตโนมัติ
          </Button>
        </Box>
        
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Chip 
            icon={<AccessTimeIcon />}
            label={`${room.open_time.substring(0, 5)} - ${room.close_time.substring(0, 5)}`}
            variant="outlined"
          />
          <Chip
            label={`${room.players?.length || 0} players`}
            color="primary"
          />
          
          {/* เพิ่มคำเตือนถ้ามีผู้เล่นไม่พอ */}
          {!hasEnoughPlayers && (
            <Chip
              label="ต้องมีผู้เล่นอย่างน้อย 4 คนเพื่อจับคู่แมตช์"
              color="warning"
              variant="outlined"
            />
          )}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <PlayerTable 
          players={room.players || []} 
          roomId={room.id}
          onPlayerChange={handlePlayerChange}
        />
        
        {/* เพิ่ม Matchmaking Dialog */}
        <MatchmakingDialog
          open={matchmakingOpen}
          onClose={handleCloseMatchmaking}
          roomId={roomId}
        />
      </Paper>
    </Box>
  );
};

export default RoomDetail;