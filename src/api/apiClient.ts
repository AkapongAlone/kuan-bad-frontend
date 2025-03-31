// src/api/apiClient.ts

import { Room, Player, RoomFormData, PlayerFormData, MatchmakingResponse } from "../types";

const API_URL = "http://localhost:8000";

// Room API calls
export const fetchRooms = async (): Promise<Room[]> => {
  const response = await fetch(`${API_URL}/rooms/`);
  if (!response.ok) {
    throw new Error("Failed to fetch rooms");
  }
  return response.json();
};

export const fetchRoomById = async (id: number): Promise<Room> => {
  const response = await fetch(`${API_URL}/rooms/${id}/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch room with ID ${id}`);
  }
  return response.json();
};

export const createRoom = async (roomData: RoomFormData): Promise<Room> => {
  const response = await fetch(`${API_URL}/rooms/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roomData),
  });

  if (!response.ok) {
    throw new Error("Failed to create room");
  }

  return response.json();
};

// Player API calls
export const createPlayer = async (
  playerData: PlayerFormData
): Promise<Player> => {
  const response = await fetch(`${API_URL}/players/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playerData),
  });

  if (!response.ok) {
    throw new Error("Failed to create player");
  }

  return response.json();
};

export const updatePlayer = async (
  id: number,
  playerData: PlayerFormData
): Promise<Player> => {
  const response = await fetch(`${API_URL}/players/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playerData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update player with ID ${id}`);
  }

  return response.json();
};

export const deletePlayer = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/players/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete player with ID ${id}`);
  }
};

export const generateMatchmaking = async (roomId: number): Promise<MatchmakingResponse> => {
  const response = await fetch(`${API_URL}/rooms/${roomId}/ai_matchmaking/`);

  if (!response.ok) {
    throw new Error("Failed to generate matchmaking");
  }

  return response.json();
};
