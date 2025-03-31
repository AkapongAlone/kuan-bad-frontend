// src/components/RoomList.tsx

import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  CardActionArea, 
  Grid, 
  Box,
  Chip,
  Alert,
  CircularProgress 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchRooms } from '../api/apiClient';
import { Room } from '../types';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError('Failed to load rooms. Please try again later.');
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  const handleRoomClick = (roomId: number) => {
    navigate(`/rooms/${roomId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (rooms.length === 0) {
    return (
      <Box textAlign="center" my={4}>
        <Typography variant="h6" color="text.secondary">
          No rooms available. Create your first room!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Badminton Rooms
      </Typography>
      
      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card elevation={3}>
              <CardActionArea onClick={() => handleRoomClick(room.id)}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {room.name}
                  </Typography>
                  
                  <Box display="flex" gap={1} alignItems="center" mb={1}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {room.open_time.substring(0, 5)} - {room.close_time.substring(0, 5)}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip 
                      label={`${room.players?.length || 0} players`} 
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RoomList;