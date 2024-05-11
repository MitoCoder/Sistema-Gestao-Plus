import React, { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import {
  Layout,
  Menu,
  Popover,
  ConfigProvider,
  FloatButton,
  Avatar,
  Popconfirm,
  message,
} from "antd";
import {
  AppstoreOutlined,
  AuditOutlined,
  MenuUnfoldOutlined,
  AntDesignOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import ptBR from "antd/lib/locale/pt_BR";
import EntregaForm from "./paginas/entrega"; // Importe o componente do formulário EntregaForm

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [color, setColor] = useState("#270a33");
  const [clickedMenuItem, setClickedMenuItem] = useState(null);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const handleMenuCollapse = () => {
    if (window.innerWidth > 768) {
      setCollapsed(!collapsed);
    }
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    setColorPickerVisible(false);
  };

  const colorOptions = ["#270a33", "#0061a7", "#7c001b", "#1C1C1C"];

  const colorPickerContent = (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {colorOptions.map((c) => (
        <div
          key={c}
          className="color-option"
          style={{
            backgroundColor: c,
            border: `3px solid ${c === color ? "#000" : "transparent"}`,
            borderRadius: "5px",
            marginRight: "8px",
            marginBottom: "8px",
            width: "32px",
            height: "32px",
            cursor: "pointer",
          }}
          onClick={() => handleColorChange(c)}
        />
      ))}
    </div>
  );

  const handleMenuItemClick = (e) => {
    setClickedMenuItem(e.key);
  };

  const handleLogout = () => {
    // Lógica para deslogar
    message.success("Deslogado com sucesso!");
    localStorage.removeItem("auth"); // Remover o estado de autenticação ao deslogar
    window.location.href = "/"; // Redirecionar para a página de login
  };

  return (
    <ConfigProvider locale={ptBR}>
      <Layout style={{ minHeight: "100vh", background: color }}>
        <Header
          className="site-layout-background"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: color,
            borderBottom: "2px solid #000",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            color: "#fff",
          }}
        >
          <div style={{ flex: 1, fontSize: "24px" }}>Sistema Gestão Plus</div>

          <Popconfirm
            title="Deseja sair?"
            onConfirm={handleLogout}
            onCancel={() => {
              // Lógica para fechar o Popconfirm
            }}
            okText="Deslogar"
            cancelText="Cancelar"
          >
            <Avatar
              icon={<AntDesignOutlined />}
              size="small"
              style={{ marginRight: "24px" }}
            />
          </Popconfirm>

          <div style={{ flex: 0 }}>
            <MenuUnfoldOutlined
              onClick={handleMenuCollapse}
              style={{ fontSize: "16px", cursor: "pointer" }}
            />
          </div>
        </Header>
        <Layout className="site-layout">
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{ background: color }}
          >
            <div className="demo-logo-vertical" />
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["1"]}
              selectedKeys={[clickedMenuItem]}
              onClick={handleMenuItemClick}
              style={{ background: color }}
            >
              <Menu.Item
                key="1"
                icon={<AppstoreOutlined />}
                style={{
                  backgroundColor: clickedMenuItem === "1" ? color : null,
                  color: clickedMenuItem === "1" ? "#fff" : null,
                }}
              >
                <Link to="/home">Home</Link>
              </Menu.Item>
              <Menu.SubMenu
                key="comercial"
                title="Comercial"
                icon={<AuditOutlined />}
                style={{ backgroundColor: color }}
              >
                <Menu.Item
                  key="entrega"
                  style={{
                    backgroundColor:
                      clickedMenuItem === "entrega" ? color : null,
                    color: clickedMenuItem === "entrega" ? "#fff" : null,
                  }}
                >
                  <Link to="/comercial/entrega">Entrega</Link>
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Content
              className="site-layout-background"
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: 280,
                background: color,
                borderRadius: "10px",
                color: "#fff",
                position: "relative",
              }}
            >
              <Routes>
                <Route path="/home">Home</Route>
                <Route path="/comercial/entrega" element={<EntregaForm />} />
              </Routes>

              <Popover
                placement="bottom"
                content={colorPickerContent}
                visible={colorPickerVisible}
                trigger="click"
                onClose={() => setColorPickerVisible(false)}
              >
                <FloatButton
                  icon={<BgColorsOutlined />}
                  tooltip="Cansou da cor atual?"
                  style={{
                    position: "absolute",
                    bottom: 31,
                    left: 21,
                    boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.8)",
                  }}
                  onClick={() => setColorPickerVisible(true)}
                />
              </Popover>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
