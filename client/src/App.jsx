import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/HomePage';
import PersonShow from './PersonDetail';
import { Layout } from 'antd';

const { Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '50px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/people/:id" element={<PersonShow />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
