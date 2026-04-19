import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { MenuOutlined } from '@ant-design/icons'
import { Avatar, Button, Grid, Layout, Space, Typography } from 'antd'
import { useAuth } from '../../context/auth/AuthContext'
import { displayNameFromJwtToken } from '../../utils/jwt'
import Sidebar from '../Sidebar/Sidebar'

function displayNameFromUser(user) {
  if (!user || typeof user !== 'object') return null
  const name = user.name?.trim()
  if (name) return name
  const username = user.username?.trim()
  if (username) return username
  const email = user.email?.trim()
  if (email) return email.split('@')[0]
  return null
}

const { Header, Content } = Layout
const { useBreakpoint } = Grid

const titleMap = {
  '/': 'Dashboard',
  '/add-policy': 'Add Policy',
  '/policy-leads': 'Policy Leads',
  '/policy-clients': 'Policy Clients',
}

export default function AppShell() {
  const { user, isAuthenticated, token } = useAuth()
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

  const welcomeName = useMemo(() => {
    const fromUser = displayNameFromUser(user)
    if (fromUser) return fromUser
    const resolvedToken =
      token ??
      (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
    const fromJwt = displayNameFromJwtToken(resolvedToken)
    if (fromJwt) return fromJwt
    return isAuthenticated ? 'Member' : null
  }, [user, isAuthenticated, token])

  const avatarLetter = (welcomeName ?? 'U').charAt(0).toUpperCase()

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
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Space
            align="center"
            style={{
              width: '100%',
              justifyContent: 'space-between',
              flexWrap: 'nowrap',
            }}
          >
            <Space align="center" size="middle">
              {!screens.md ? (
                <Button
                  icon={<MenuOutlined />}
                  onClick={() => setOpen(true)}
                  type="text"
                />
              ) : null}
              <Typography.Title level={4} style={{ margin: 0, lineHeight: 1.3 }}>
                {title}
              </Typography.Title>
            </Space>
            {welcomeName ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: screens.md ? 12 : 10,
                  flexShrink: 0,
                  minWidth: 0,
                  maxWidth: screens.md ? 280 : 220,
                }}
              >
                <Avatar
                  style={{
                    backgroundColor: '#3a63f3',
                    flexShrink: 0,
                  }}
                  size={screens.md ? 40 : 36}
                >
                  {avatarLetter}
                </Avatar>
                <div
                  style={{
                    minWidth: 0,
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 2,
                  }}
                >
                  <Typography.Text
                    type="secondary"
                    style={{
                      fontSize: screens.md ? 12 : 11,
                      lineHeight: 1.25,
                      display: 'block',
                      margin: 0,
                    }}
                  >
                    Welcome back
                  </Typography.Text>
                  <Typography.Text
                    strong
                    style={{
                      fontSize: screens.md ? 15 : 14,
                      lineHeight: 1.25,
                      display: 'block',
                      margin: 0,
                      color: 'rgba(0, 0, 0, 0.88)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={welcomeName}
                  >
                    {welcomeName}
                  </Typography.Text>
                </div>
              </div>
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
