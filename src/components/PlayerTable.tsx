// src/components/PlayerTable.tsx

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Player } from "../types";
import PlayerForm from "./PlayerForm";
import { deletePlayer } from "../api/apiClient";
import { format } from "date-fns";

interface PlayerTableProps {
  players: Player[];
  roomId: number;
  onPlayerChange: () => void;
}

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  roomId,
  onPlayerChange,
}) => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd HH:mm");
    } catch {
      return dateString;
    }
  };

  const handleCreateClick = () => {
    setOpenCreateDialog(true);
  };

  const handleEditClick = (player: Player) => {
    setSelectedPlayer(player);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (player: Player) => {
    setSelectedPlayer(player);
    setOpenDeleteDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedPlayer(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedPlayer(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPlayer) {
      try {
        await deletePlayer(selectedPlayer.id);
        onPlayerChange(); // Refresh player list
      } catch (error) {
        console.error("Error deleting player:", error);
      }
    }
    handleCloseDeleteDialog();
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" component="h3">
          Players
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Add Player
        </Button>
      </Box>

      {players.length === 0 ? (
        <Typography color="text.secondary" align="center" py={3}>
          No players have joined this room yet
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Skill Level</TableCell>
                <TableCell>Join Time</TableCell>
                <TableCell align="right">Matches</TableCell>
                <TableCell align="right">Shuttlecocks</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.skill}</TableCell>
                  <TableCell>{formatDate(player.join_time)}</TableCell>
                  <TableCell align="right">
                    {player.number_of_matches}
                  </TableCell>
                  <TableCell align="right">
                    {player.number_of_shuttlecock}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(player)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(player)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Player Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Player</DialogTitle>
        <DialogContent>
          <PlayerForm
            roomId={roomId}
            onSuccess={() => {
              handleCloseCreateDialog();
              onPlayerChange();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Player Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Player</DialogTitle>
        <DialogContent>
          {selectedPlayer && (
            <PlayerForm
              roomId={roomId}
              player={selectedPlayer}
              onSuccess={() => {
                handleCloseEditDialog();
                onPlayerChange();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete player "{selectedPlayer?.name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlayerTable;
