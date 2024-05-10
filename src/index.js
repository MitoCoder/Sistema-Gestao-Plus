import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router} from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import './index.css';
import App from './App';
import Login from './paginas/login'; // Importe o componente de login com o nome correto do arquivo

const AppWrapper = () => {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <ConfigProvider locale={ptBR}>
        <React.StrictMode>
          {authenticated ? (
            <App />
          ) : (
            <Login setAuthenticated={setAuthenticated} />
          )}
        </React.StrictMode>
      </ConfigProvider>
    </Router>
  );
};

ReactDOM.render(
  <AppWrapper />,
  document.getElementById('root')
);