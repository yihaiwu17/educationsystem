import React from 'react';
import {Input } from 'antd';
import '../styles/globals.css';
import TableInfo from '../component/table';
import styled from 'styled-components';
import AppLayout from '../component/Layout'

const Search = styled(Input.Search)`
  width: 30%;
  margin-bottom: 16px;
  display: block;
`;

export default function Dashboard(){

    return (
          <AppLayout>
            <Search
              placeholder="input search text"
              onSearch={(value) => console.log(value)}
              style={{ width: 500, marginBottom:'20px'}}
            />
            <TableInfo 
            ></TableInfo>
          </AppLayout>
    );
  
}
