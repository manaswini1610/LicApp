import { useNavigate } from "react-router-dom";
import {
  IdcardOutlined,
  LockOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/auth/AuthContext";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Typography,
  message,
} from "antd";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const result = await register(values);
    if (result.ok) {
      message.success("Account created. You can log in now.");
      navigate("/login", { replace: true });
    } else {
      message.error(result.message ?? "Registration failed");
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
        style={{ width: "min(440px, 100%)", borderRadius: 18 }}
      >
        <Typography.Title
          level={3}
          style={{ marginTop: 0, textAlign: "center" }}
        >
          Register as LIC Agent
        </Typography.Title>
        <Typography.Paragraph
          type="secondary"
          style={{ textAlign: "center", marginBottom: 24 }}
        >
          Create an account to access the dashboard
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
            rules={[{ required: true, message: "Enter a username" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="e.g. rahul_agent"
              size="large"
              autoComplete="username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Choose a password" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Password"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Confirm password"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Full name"
            rules={[{ required: true, message: "Enter your full name" }]}
          >
            <Input
              prefix={<IdcardOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="e.g. Rahul Sharma"
              size="large"
              autoComplete="name"
            />
          </Form.Item>
          <Form.Item
            name="experience"
            label="Experience (years)"
            rules={[
              { required: true, message: "Enter years of experience" },
              {
                type: "number",
                min: 0,
                max: 60,
                message: "Enter a value between 0 and 60",
              },
            ]}
          >
            <InputNumber
              placeholder="e.g. 5"
              min={0}
              max={60}
              style={{ width: "100%" }}
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="mobileNumber"
            label="Mobile number"
            rules={[
              { required: true, message: "Enter mobile number" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit mobile number",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="e.g. 9876543210"
              size="large"
              maxLength={10}
              inputMode="numeric"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 12 }}>
            <Button type="primary" htmlType="submit" block size="large">
              Create account
            </Button>
          </Form.Item>
          <Button
            type="default"
            block
            size="large"
            onClick={() => navigate("/login")}
          >
            Back to login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
