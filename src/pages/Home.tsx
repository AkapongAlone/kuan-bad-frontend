import React from 'react';
import RoomList from '../components/RoomList';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <RoomList />
    </Layout>
  );
};

export default Home;