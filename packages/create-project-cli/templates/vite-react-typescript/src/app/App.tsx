import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query';

import './App.scss';
import { RootRoute } from '../router/RootRoute';

const queryClient = new QueryClient();

function Routes() {
  return useRoutes(RootRoute);
}

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
