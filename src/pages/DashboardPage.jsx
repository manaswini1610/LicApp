import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Col,
  Empty,
  Grid,
  InputNumber,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { usePolicies } from "../hooks/usePolicies";

const upcomingColumns = [
  { title: "Client Name", dataIndex: "name", key: "name" },
  { title: "Policy Type", dataIndex: "policyType", key: "policyType" },
  { title: "Date", dataIndex: "date", key: "date" },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
    render: (value) => (
      <Tag
        color={value === "High" ? "red" : value === "Medium" ? "gold" : "blue"}
      >
        {value}
      </Tag>
    ),
  },
];

export default function DashboardPage() {
  const { getDashboard, dashboard } = usePolicies();
  const [yearlyTarget, setYearlyTarget] = useState(50);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.sm;

  useEffect(() => {
    getDashboard(yearlyTarget);
    // getDashboard comes from context and changes identity on render.
    // We only want to re-fetch when target changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearlyTarget]);

  const stats = dashboard?.stats ?? {};
  const annualProgress = dashboard?.annualProgress ?? {};
  const monthlyProgress = dashboard?.monthlyProgress ?? [];
  const upcomingFollowUps = dashboard?.upcomingFollowUps ?? [];

  const summary = [
    { title: "Yearly Target", value: stats.yearlyTarget ?? 0 },
    { title: "Completed Policies", value: stats.completedPolicies ?? 0 },
    { title: "Required / Month", value: stats.requiredPerMonth ?? 0 },
    { title: "Pending Policies", value: stats.pendingPolicies ?? 0 },
  ];

  const monthlyRows = useMemo(
    () =>
      monthlyProgress.map((item, index) => ({
        key: item.month || index,
        month: item.month,
        submitted: item.submitted ?? 0,
        target: item.monthlyTarget ?? 0,
        progressPercent: item.progressPercent ?? 0,
      })),
    [monthlyProgress],
  );

  const upcomingRows = useMemo(
    () =>
      upcomingFollowUps.map((item, index) => ({
        key: item._id || item.id || index,
        name: item.customerName || item.name || "—",
        policyType: item.policyType || "—",
        date: item.followUpDate || item.date || "—",
        priority: item.priority || "Low",
      })),
    [upcomingFollowUps],
  );

  const monthlyColumns = [
    { title: "Month", dataIndex: "month", key: "month" },
    {
      title: "Submitted",
      dataIndex: "submitted",
      key: "submitted",
      render: (value) => <Typography.Text strong>{value}</Typography.Text>,
    },
    { title: "Monthly Target", dataIndex: "target", key: "target" },
    {
      title: "Progress",
      dataIndex: "progressPercent",
      key: "progressPercent",
      render: (value) => (
        <Progress
          percent={value}
          size="small"
          status={value >= 100 ? "success" : "active"}
        />
      ),
    },
  ];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card className="hero-card">
        <Typography.Title level={3} style={{ marginBottom: 8 }}>
          LIC CRM Dashboard
        </Typography.Title>
        <Typography.Text type="secondary">
          Dashboard data is loaded live from API.
        </Typography.Text>
        <Space
          wrap
          style={{
            width: "100%",
            justifyContent: isMobile ? "flex-start" : "space-between",
            marginTop: 16,
            gap: 12,
            alignItems: "flex-start",
          }}
          direction={isMobile ? "vertical" : "horizontal"}
        >
          <Typography.Text strong>
            Set Agent Yearly Policy Target
          </Typography.Text>
          <InputNumber
            min={1}
            step={10}
            value={yearlyTarget}
            onChange={(value) => setYearlyTarget(value ?? 1)}
            style={{ width: isMobile ? "100%" : 220 }}
          />
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        {summary.map((item) => (
          <Col xs={24} sm={12} lg={6} key={item.title}>
            <Card className="surface-card">
              <Statistic title={item.title} value={item.value} />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Annual Policy Target Progress" className="surface-card">
        <Typography.Paragraph style={{ marginBottom: 8 }}>
          Yearly progress based on submitted policies and remaining monthly
          pace.
        </Typography.Paragraph>
        <Progress
          percent={annualProgress.progressPercent ?? 0}
          status="active"
        />
        <List
          size="small"
          style={{ marginTop: 12 }}
          dataSource={[
            `Remaining for the year: ${annualProgress.remainingForYear ?? 0} policies`,
            `Months left: ${annualProgress.monthsLeft ?? 0}`,
            `Current needed pace: ${annualProgress.requiredPerMonth ?? 0} per month`,
            `Renewal Rate: ${annualProgress.renewalRate ?? 0}%`,
          ]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Card>

      <Card title="Monthly Policy Submission Progress" className="surface-card">
        <Table
          columns={monthlyColumns}
          dataSource={monthlyRows}
          pagination={false}
          scroll={{ x: 640 }}
        />
      </Card>
    </div>
  );
}
