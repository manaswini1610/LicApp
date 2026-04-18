import {
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Drawer, Layout, Menu, Typography } from 'antd'
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
  const navMenu = (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      items={menuItems}
      onClick={({ key }) => onNavigate(key)}
      style={{ borderInlineEnd: 0 }}
    />
  )

  if (isDesktop) {
    return (
      <Sider width={240} theme="light" className="app-sidebar">
        <div className="app-sidebar__brand">
          <Typography.Title level={4} style={{ marginBottom: 2 }}>
            LIC Client Hub
          </Typography.Title>
          <Typography.Text type="secondary">Frontend UI Screens</Typography.Text>
        </div>
        {navMenu}
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
      {navMenu}
    </Drawer>
  )
}
