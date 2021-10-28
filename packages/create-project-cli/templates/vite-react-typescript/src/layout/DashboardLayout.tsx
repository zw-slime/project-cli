import { FC, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';

import { Avatar, Card, Dropdown, Layout, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

import styles from './index.module.scss';
import { RouteConfig, RouteConfigInterface } from '../router/routeConfig';
import { auth } from '../service/auth';
import logoUrl from '/src/favicon.svg';

export const DashboardLayout: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const userName = auth.getUserName();

  const ExitMenu = (
    <Menu>
      <Menu.Item key={'logout'} onClick={() => auth.logout()}>
        退出
      </Menu.Item>
    </Menu>
  );

  const renderMenu = (v: RouteConfigInterface) => {
    return (
      <Menu.Item
        key={v.key}
        icon={v.icon}
        onClick={() => {
          navigate(v.key);
        }}
      >
        {v.name}
      </Menu.Item>
    );
  };

  const renderMenuList = (v: RouteConfigInterface[]) => {
    return v.map((v1) => {
      if (v1.children) {
        return (
          <SubMenu key={v1.key} icon={v1.icon} title={v1.showButton ? <>{v1.name}</> : v1.name}>
            {renderMenuList(v1.children)}
          </SubMenu>
        );
      }
      return renderMenu(v1);
    });
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Sider trigger={null} collapsed={collapsed} collapsible={true} className={styles.sider}>
        <div className={styles.logo}>
          {!collapsed ? (
            <span className={styles.icon}>
              <img src={logoUrl} alt="" style={{ width: 30, height: 30 }} />
              XX管理平台
            </span>
          ) : (
            <span>
              <HomeOutlined />
            </span>
          )}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} className={styles.menu}>
          {renderMenuList(RouteConfig)}
        </Menu>
      </Sider>

      <Layout
        className={styles.siteLayout}
        style={collapsed ? { marginLeft: 80 } : { marginLeft: 250 }}
      >
        <Header className={styles.header}>
          {collapsed ? (
            <MenuUnfoldOutlined
              className={styles.trigger}
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            />
          ) : (
            <MenuFoldOutlined
              className={styles.trigger}
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            />
          )}

          <div
            style={{ marginRight: '30px', display: 'flex', alignItems: 'center' }}
            key="logoutDiv"
          >
            <Dropdown overlay={ExitMenu}>
              <div
                style={{ height: 48, lineHeight: '48px' }}
                onClick={(e) => e.preventDefault()}
                key="logoutItem"
              >
                <Avatar style={{ marginRight: 8 }} shape="circle" icon={<UserOutlined />} />
                <span>{userName}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.content}>
          <Card style={{ marginTop: '10px', minHeight: '90vh' }}>
            <Outlet />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};
