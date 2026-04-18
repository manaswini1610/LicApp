import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { MenuOutlined } from '@ant-design/icons'
import { Button, Grid, Layout, Space, Typography } from 'antd'
import Sidebar from '../Sidebar/Sidebar'

const { Header, Content } = Layout
const { useBreakpoint } = Grid

const titleMap = {
  '/': 'Dashboard',
  '/add-policy': 'Add Policy',
  '/policy-leads': 'Policy Leads',
  '/policy-clients': 'Policy Clients',
}

export default function AppShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const screens = useBreakpoint()
  const [open, setOpen] = useState(false)

  const selectedKey = useMemo(() => {
    if (pathname.startsWith('/edit-policy')) return '/policy-leads'
    return pathname
  }, [pathname])

  const title = useMemo(() => {
    if (pathname.startsWith('/edit-policy')) return 'Edit Policy'
    return titleMap[pathname] ?? 'LIC CRM'
  }, [pathname])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar
        isDesktop={screens.md}
        isOpen={open}
        selectedKey={selectedKey}
        onNavigate={(path) => {
          navigate(path)
          setOpen(false)
        }}
        onClose={() => setOpen(false)}
      />

      <Layout>
        <Header
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '0 16px',
            borderBottom: '1px solid #e7ecf7',
          }}
        >
          <Space
            style={{ width: '100%', height: '100%', justifyContent: 'space-between' }}
          >
            <Space>
              {!screens.md ? (
                <Button
                  icon={<MenuOutlined />}
                  onClick={() => setOpen(true)}
                  type="text"
                />
              ) : null}
              <Typography.Title level={4} style={{ margin: 0 }}>
                {title}
              </Typography.Title>
            </Space>
            {screens.md ? (
              <Typography.Text type="secondary">UI only - API ready</Typography.Text>
            ) : null}
          </Space>
        </Header>
        <Content style={{ padding: screens.md ? 20 : 12 }}>
          <div className="page-shell">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
