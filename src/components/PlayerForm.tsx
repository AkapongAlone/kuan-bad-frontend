// src/components/PlayerForm.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { createPlayer, updatePlayer } from "../api/apiClient";
import { Player, PlayerFormData } from "../types";

interface PlayerFormProps {
  roomId: number;
  player?: Player; // Optional - if provided, we're in edit mode
  onSuccess: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({
  roomId,
  player,
  onSuccess,
}) => {
  const [name, setName] = useState(player?.name || "");
  const [skill, setSkill] = useState(player?.skill || "BG");
  const [matches, setMatches] = useState(player?.number_of_matches || 0);
  const [shuttlecocks, setShuttlecocks] = useState(
    player?.number_of_shuttlecock || 0
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!player;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error state
    setError(null);

    // Validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    const playerData: PlayerFormData = {
      name: name.trim(),
      skill,
      number_of_matches: matches,
      number_of_shuttlecock: shuttlecocks,
      room: roomId,
    };

    setLoading(true);

    try {
      if (isEditMode && player) {
        await updatePlayer(player.id, playerData);
      } else {
        await createPlayer(playerData);
      }
      setLoading(false);
      onSuccess();
    } catch (error) {
      setLoading(false);
      setError(
        `Failed to ${
          isEditMode ? "update" : "create"
        } player. Please try again.`
      );
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} player:`,
        error
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="name"
            label="Player Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth disabled={loading}>
            <InputLabel id="skill-label">Skill Level</InputLabel>
            <Select
              labelId="skill-label"
              id="skill"
              value={skill}
              label="Skill Level"
              onChange={(e) => setSkill(e.target.value)}
            >
              <MenuItem value="BG">BG</MenuItem>
              <MenuItem value="N">N</MenuItem>
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="P-">P-</MenuItem>
              <MenuItem value="P">P</MenuItem>
              <MenuItem value="P+">P+</MenuItem>
              <MenuItem value="C">C</MenuItem>
              <MenuItem value="B/A">B/A</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* แสดงฟิลด์เหล่านี้เฉพาะในโหมดแก้ไขเท่านั้น */}
        {isEditMode && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="matches"
                label="Number of Matches"
                type="number"
                inputProps={{ min: 0 }}
                value={matches}
                onChange={(e) => setMatches(parseInt(e.target.value))}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="shuttlecocks"
                label="Number of Shuttlecocks"
                type="number"
                inputProps={{ min: 0 }}
                value={shuttlecocks}
                onChange={(e) => setShuttlecocks(parseInt(e.target.value))}
                disabled={loading}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : isEditMode ? (
              "Update Player"
            ) : (
              "Add Player"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlayerForm;