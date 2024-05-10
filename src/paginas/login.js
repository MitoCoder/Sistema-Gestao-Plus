import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Card } from 'antd';

const Login = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(false);
  const [error, setError] = useState('');

  // Verificar se o login foi salvo ao carregar o componente
  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth === 'true') {
      setAuthenticated(true);
    }
  }, [setAuthenticated]);

  const handleLogin = () => {
    setLoading(true);
    // Lógica de autenticação (exemplo simples)
    if (username === 'plus' && password === '123') {
      setAuthenticated(true); // Autenticação bem-sucedida
      if (rememberLogin) {
        localStorage.setItem('auth', 'true'); // Salvar o estado de autenticação
      } else {
        localStorage.removeItem('auth'); // Remover o estado de autenticação se não lembrar
      }
    } else {
      // Autenticação falhou
      setLoading(false);
      if (username !== 'plus') {
        setError('Usuário incorreto.');
      } else {
        setError('Senha incorreta.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card style={{ width: '90%', maxWidth: 400, borderRadius: 10, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', backgroundColor: '#270a33', color: '#ffffff' }}>
        <div style={{ padding: '10px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '24px', color: '#ffffff' }}>SISTEMA GESTÃO</h3> {/* Título centralizado e com tamanho de fonte aumentado */}
          <Form
            name="login-form"
            initialValues={{ remember: false }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Por favor, insira seu nome de usuário!' }]}
              validateStatus={error && error.includes('Usuário') ? 'error' : ''}
              help={error && error.includes('Usuário') ? error : ''}
            >
              <Input placeholder="Nome de Usuário" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
              validateStatus={error && error.includes('Senha') ? 'error' : ''}
              help={error && error.includes('Senha') ? error : ''}
            >
              <Input.Password placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox style={{ color: '#ffffff' }} onChange={e => setRememberLogin(e.target.checked)}>Lembrar Login</Checkbox>
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
              <Button type="primary" loading={loading} onClick={handleLogin} style={{ width: '100%', backgroundColor: '#270a33', borderColor: '#ffffff', color: '#ffffff', transition: 'background-color 0.3s, color 0.3s' }}>
                Entrar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Login;
