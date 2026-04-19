import {
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Button, Drawer, Layout, Menu, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth/AuthContext'
import './Sidebar.css'

const { Sider } = Layout

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/policy-leads', icon: <FileTextOutlined />, label: 'Policy Leads' },
  { key: '/policy-clients', icon: <TeamOutlined />, label: 'Policy Clients' },
]

export default function Sidebar({
  isDesktop,
  isOpen,
  selectedKey,
  onNavigate,
  onClose,
}) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const logoutBlock = (
    <div className="app-sidebar__footer">
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        {user?.username ? (
          <Typography.Text type="secondary" ellipsis style={{ fontSize: 12 }}>
            {user.name ?? user.username}
          </Typography.Text>
        ) : null}
        <Button
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          block
          type="default"
        >
          Log out
        </Button>
      </Space>
    </div>
  )

  const navMenu = (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      items={menuItems}
      onClick={({ key }) => onNavigate(key)}
      style={{ borderInlineEnd: 0, flex: 1 }}
    />
  )

  if (isDesktop) {
    return (
      <Sider width={240} theme="light" className="app-sidebar">
        <div className="app-sidebar__inner">
          <div className="app-sidebar__brand">
            <Typography.Title level={4} style={{ marginBottom: 2 }}>
              LIC Client Hub
            </Typography.Title>
            <Typography.Text type="secondary">Agent workspace</Typography.Text>
          </div>
          <div className="app-sidebar__scroll">{navMenu}</div>
          {logoutBlock}
        </div>
      </Sider>
    )
  }

  return (
    <Drawer
      title="Navigation"
      open={isOpen}
      onClose={onClose}
      placement="left"
      bodyStyle={{ padding: 0 }}
    >
      <div className="app-sidebar__brand" style={{ paddingBottom: 0 }}>
        <Typography.Title level={5} style={{ marginBottom: 2 }}>
          LIC Client Hub
        </Typography.Title>
      </div>
      {navMenu}
      <div style={{ padding: '12px 16px 16px' }}>{logoutBlock}</div>
    </Drawer>
  )
}
