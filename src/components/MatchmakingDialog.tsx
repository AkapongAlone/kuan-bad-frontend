// src/components/MatchmakingDialog.tsx
import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, Paper, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Chip, Alert
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearIcon from '@mui/icons-material/Clear';
import { generateMatchmaking } from '../api/apiClient';

interface Player {
  id: number;
  name: string;
  skill: string;
}

interface Team {
  team_name: string;
  players: Player[];
  compatibility_score: number;
}

interface Match {
  team1: string;
  team2: string;
  balance_score: number;
  recommended_play_time: number;
}

interface MatchmakingData {
  teams: Team[];
  match: Match;
  analysis: string;
}

interface MatchmakingDialogProps {
  open: boolean;
  onClose: () => void;
  roomId: number;
}

const MatchmakingDialog: React.FC<MatchmakingDialogProps> = ({ open, onClose, roomId }) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [matchmakingData, setMatchmakingData] = React.useState<MatchmakingData | null>(null);
  
  const fetchMatchmaking = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await generateMatchmaking(roomId);
      setMatchmakingData(response.matchmaking);
    } catch (err) {
      setError('ไม่สามารถจับคู่แมตช์ได้ โปรดลองอีกครั้ง');
      console.error('Error generating matchmaking:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // โหลดข้อมูลครั้งแรกเมื่อเปิด dialog
  React.useEffect(() => {
    if (open) {
      fetchMatchmaking();
    }
  }, [open, roomId]);
  
  // รีเซ็ตข้อมูลเมื่อปิด dialog
  React.useEffect(() => {
    if (!open) {
      setMatchmakingData(null);
      setError(null);
    }
  }, [open]);
  
  // ฟังก์ชันสำหรับจับคู่ใหม่
  const handleRegenerateMatchmaking = () => {
    fetchMatchmaking();
  };
  
  // ฟังก์ชันสำหรับปิด dialog และล้างข้อมูล
  const handleClear = () => {
    onClose();
  };
  
  // แปลงข้อมูลความสามารถเป็นสี
  const getSkillColor = (skill: string) => {
    const skillColors: Record<string, string> = {
      'BG': '#C0C0C0', // เทา
      'N': '#A0D6B4',  // เขียวอ่อน
      'S': '#5CB85C',  // เขียว
      'P-': '#F0AD4E', // ส้มอ่อน
      'P': '#FF8C00',  // ส้ม
      'P+': '#D9534F', // แดงอ่อน
      'C': '#C9302C',  // แดง
      'B': '#800080',  // ม่วง
      'A': '#4B0082',  // ม่วงเข้ม
    };
    
    return skillColors[skill] || '#777777';
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">การจับคู่แมตช์อัตโนมัติ</Typography>
          <Box>
            <Button 
              startIcon={<RefreshIcon />} 
              onClick={handleRegenerateMatchmaking}
              disabled={loading}
              sx={{ mr: 1 }}
            >
              จับคู่ใหม่
            </Button>
            <Button 
              startIcon={<ClearIcon />} 
              onClick={handleClear}
              color="error"
            >
              ปิด
            </Button>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={5}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              กำลังวิเคราะห์การจับคู่...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        ) : matchmakingData ? (
          <Box>
            {/* แสดงเกมแข่งขัน */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                การแข่งขัน
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <strong>{matchmakingData.match.team1}</strong> VS <strong>{matchmakingData.match.team2}</strong>
                </Typography>
                <Box display="flex" gap={2} mt={1}>
                  <Chip 
                    label={`ความสมดุล: ${matchmakingData.match.balance_score}/100`} 
                    color={matchmakingData.match.balance_score > 75 ? "success" : "warning"}
                  />
                </Box>
              </Box>
            </Paper>
            
            {/* แสดงตารางทีม */}
            <Typography variant="h6" gutterBottom>ทีมที่จับคู่แล้ว</Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ชื่อทีม</TableCell>
                    <TableCell>ผู้เล่น</TableCell>
                    <TableCell align="center">ความเข้ากัน</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matchmakingData.teams.map((team, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          {team.team_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="column" gap={1}>
                          {team.players.map((player) => (
                            <Box 
                              key={player.id} 
                              display="flex" 
                              alignItems="center"
                              gap={1}
                            >
                              <Chip 
                                label={player.skill} 
                                size="small"
                                sx={{ 
                                  bgcolor: getSkillColor(player.skill),
                                  color: '#fff',
                                  minWidth: '40px' 
                                }}
                              />
                              <Typography>{player.name}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={`${team.compatibility_score}/100`}
                          color={team.compatibility_score > 80 ? "success" : 
                                team.compatibility_score > 60 ? "primary" : "warning"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* แสดงคำอธิบายจาก AI */}
            <Typography variant="h6" gutterBottom>คำอธิบายการจับคู่</Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                {matchmakingData.analysis}
              </Typography>
            </Paper>
          </Box>
        ) : (
          <Typography>ไม่พบข้อมูลการจับคู่</Typography>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchmakingDialog;