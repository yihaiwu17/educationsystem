import React from 'react';
import '../styles/globals.css';
import TableInfo from '../component/table';
import AppLayout from '../component/Layout';

export default function Dashboard() {
  return (
    <AppLayout>
      <TableInfo></TableInfo>
    </AppLayout>
  );
}
