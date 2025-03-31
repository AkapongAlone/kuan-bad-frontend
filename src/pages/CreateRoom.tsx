import React from 'react';
import RoomForm from '../components/RoomForm';
import Layout from '../components/Layout';
import { Typography } from '@mui/material';

const CreateRoom: React.FC = () => {
  return (
    <Layout>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Create a New Room
      </Typography>
      <RoomForm />
    </Layout>
  );
};

export default CreateRoom;