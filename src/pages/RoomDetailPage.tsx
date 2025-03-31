import React from 'react';
import { useParams } from 'react-router-dom';
import RoomDetail from '../components/RoomDetail';
import Layout from '../components/Layout';

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = parseInt(id || '0');

  return (
    <Layout>
      <RoomDetail roomId={roomId} />
    </Layout>
  );
};

export default RoomDetailPage;