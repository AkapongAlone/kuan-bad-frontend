// src/components/RoomForm.tsx

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../api/apiClient';
import { RoomFormData } from '../types';

const RoomForm: React.FC = () => {
  const [name, setName] = useState('');
  const [openTime, setOpenTime] = useState<Date | null>(new Date());
  const [closeTime, setCloseTime] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setError(null);
    
    // Validate form
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    if (!openTime || !closeTime) {
      setError('Open and close times are required');
      return;
    }
    
    // Format times for API
    const formattedOpenTime = format(openTime, 'HH:mm:ss');
    const formattedCloseTime = format(closeTime, 'HH:mm:ss');
    
    const roomData: RoomFormData = {
      name: name.trim(),
      open_time: formattedOpenTime,
      close_time: formattedCloseTime,
    };
    
    setLoading(true);
    
    try {
      const newRoom = await createRoom(roomData);
      setLoading(false);
      // Navigate to the room detail page after successful creation
      navigate(`/rooms/${newRoom.id}`);
    } catch (error) {
      setLoading(false);
      setError('Failed to create room. Please try again.');
      console.error('Error creating room:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Create New Room
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="name"
              label="Room Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Open Time"
                value={openTime}
                onChange={(newValue) => setOpenTime(newValue)}
                slotProps={{ textField: { fullWidth: true, required: true } }}
                disabled={loading}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Close Time"
                value={closeTime}
                onChange={(newValue) => setCloseTime(newValue)}
                slotProps={{ textField: { fullWidth: true, required: true } }}
                disabled={loading}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Room'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default RoomForm;