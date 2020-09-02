import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import Head from 'next/head';
import { AuthPanel } from './AuthPanel';

const { Header, Sider, Content } = Layout;

export const SiteLayout = ({ children }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);

  const toggle = () => {
    setCollapsed((v) => !v);
  };

  return (
    <Layout className="h-full h-screen">
      <Head>
        <title>NextJs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sider trigger={null} collapsible collapsed={collapsed} className="h-full">
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['/']} selectedKeys={[router.pathname]} className="pt-2">
          <Menu.Item key="/" className="text-2xl" onClick={() => router.push('/')}>
            NextJs
          </Menu.Item>
          <Menu.Item key="/users" icon={<UserOutlined />}>
            <Link href="/users">
              <a>Users</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/categories" icon={<AppstoreOutlined />}>
            <Link href="/categories">
              <a>Categories</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/products" icon={<ShoppingCartOutlined />}>
            <Link href="/products">
              <a>Products</a>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="px-4 bg-white">
          <div className="flex flex-row justify-between">
            <div className="text-lg">
              {collapsed ? <MenuUnfoldOutlined onClick={toggle} /> : <MenuFoldOutlined onClick={toggle} />}
            </div>
            <div>
              <AuthPanel />
            </div>
          </div>
        </Header>
        <Content className="bg-gray-200 p-4 h-full">{children}</Content>
      </Layout>
    </Layout>
  );
};
