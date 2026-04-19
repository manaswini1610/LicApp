import { Navigate, useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useAuth } from "../context/auth/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onFinish = async ({ username, password }) => {
    const result = await login(username, password);
    if (result.ok) {
      navigate("/", { replace: true });
    } else {
      message.error(result.message ?? "Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Card
        className="hero-card"
        style={{ width: "min(400px, 100%)", borderRadius: 18 }}
      >
        <Typography.Title
          level={3}
          style={{ marginTop: 0, textAlign: "center" }}
        >
          LIC Agent Login
        </Typography.Title>
        <Typography.Paragraph
          type="secondary"
          style={{ textAlign: "center", marginBottom: 24 }}
        >
          Sign in to open your dashboard
        </Typography.Paragraph>

        <Form
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
          autoComplete="on"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Enter your username" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
              size="large"
              autoComplete="username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Password"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 12 }}>
            <Button type="primary" htmlType="submit" block size="large">
              Log in
            </Button>
          </Form.Item>
          <Button
            type="default"
            block
            size="large"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Form>
      </Card>
    </div>
  );
}
