import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Col,
  Grid,
  InputNumber,
  List,
  Progress,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { usePolicies } from "../hooks/usePolicies";
import {
  distributeYearlyTargetAcrossMonths,
  getLicFinancialYearMonthIndex,
} from "../data/dashboardData.js";
import { DASHBOARD_YEARLY_TARGET_STORAGE_KEY } from "../services/config.js";

function readStoredYearlyTarget() {
  try {
    const raw = localStorage.getItem(DASHBOARD_YEARLY_TARGET_STORAGE_KEY);
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 1) return n;
  } catch {
    // ignore
  }
  return 50;
}

export default function DashboardPage() {
  const { getDashboard, dashboard } = usePolicies();
  const [yearlyTarget, setYearlyTarget] = useState(readStoredYearlyTarget);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    try {
      localStorage.setItem(DASHBOARD_YEARLY_TARGET_STORAGE_KEY, String(yearlyTarget));
    } catch {
      // ignore
    }
  }, [yearlyTarget]);

  useEffect(() => {
    getDashboard(yearlyTarget);
    // getDashboard comes from context and changes identity on render.
    // We only want to re-fetch when target changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearlyTarget]);

  const stats = dashboard?.stats ?? {};
  const annualProgress = dashboard?.annualProgress ?? {};

  const effectiveYearlyTarget = Math.max(
    1,
    Number(yearlyTarget) || Number(stats.yearlyTarget) || 1,
  );

  const totalLeads =
    stats.totalLeads ??
    stats.totalPolicies ??
    (Number(stats.completedPolicies ?? 0) + Number(stats.pendingPolicies ?? 0));

  const summary = [
    {
      title: "Yearly Target",
      value: stats.yearlyTarget ?? yearlyTarget ?? 0,
    },
    { title: "Total Leads", value: totalLeads },
    { title: "Completed Policies", value: stats.completedPolicies ?? 0 },
    { title: "Pending Policies", value: stats.pendingPolicies ?? 0 },
  ];

  const monthlyRows = useMemo(() => {
    const rows = dashboard?.monthlyProgress ?? [];
    const distributed = distributeYearlyTargetAcrossMonths(effectiveYearlyTarget);

    const mapped = rows.map((item, index) => {
      const submitted = item.submitted ?? 0;
      const licIdx = getLicFinancialYearMonthIndex(item.month, index);
      const monthTarget =
        distributed[licIdx] ??
        distributed[Math.min(licIdx, 11)] ??
        0;
      const progressPercent =
        monthTarget > 0
          ? Math.min(
              100,
              Math.round((submitted / monthTarget) * 100),
            )
          : (item.progressPercent ?? 0);

      return {
        _licIdx: licIdx,
        key: item.month ?? item._id ?? index,
        month: item.month,
        submitted,
        target: monthTarget,
        progressPercent,
      };
    });

    mapped.sort((a, b) => a._licIdx - b._licIdx);

    return mapped.map(({ _licIdx: _unused, ...row }) => row);
  }, [dashboard?.monthlyProgress, effectiveYearlyTarget]);

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

  const cardBodySm = { padding: isMobile ? 14 : 24 };

  return (
    <div
      style={{
        display: "grid",
        gap: isMobile ? 12 : 16,
        width: "100%",
        minWidth: 0,
      }}
    >
      <Card className="hero-card" styles={{ body: cardBodySm }}>
        <Typography.Title
          level={isMobile ? 4 : 3}
          style={{ marginBottom: 8, wordBreak: "break-word" }}
        >
          LIC CRM Dashboard
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: isMobile ? 13 : 14 }}>
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
          <Typography.Text strong style={{ fontSize: isMobile ? 13 : 14 }}>
            Set Agent Yearly Policy Target
          </Typography.Text>
          <InputNumber
            min={1}
            step={10}
            value={yearlyTarget}
            onChange={(value) => setYearlyTarget(value ?? 1)}
            style={{ width: isMobile ? "100%" : 220, maxWidth: "100%" }}
          />
        </Space>
      </Card>

      <Row gutter={[isMobile ? 12 : 20, isMobile ? 12 : 20]}>
        {summary.map((item) => (
          <Col xs={12} sm={12} md={12} lg={6} key={item.title}>
            <div className="dashboard-kpi-card">
              <span className="dashboard-kpi-label">{item.title}</span>
              <div className="dashboard-kpi-value">{item.value}</div>
            </div>
          </Col>
        ))}
      </Row>

      <Card
        title={
          <span style={{ fontSize: isMobile ? 15 : undefined }}>
            Annual Policy Target Progress
          </span>
        }
        className="surface-card"
        styles={{ body: cardBodySm }}
      >
        <Typography.Paragraph
          style={{ marginBottom: 12, fontSize: isMobile ? 13 : undefined }}
        >
          Yearly progress based on submitted policies and time left in the year.
        </Typography.Paragraph>
        <Progress
          percent={annualProgress.progressPercent ?? 0}
          status="active"
          strokeWidth={isMobile ? 10 : 8}
        />
        <List
          size="small"
          style={{ marginTop: 12 }}
          dataSource={[
            `Remaining for the year: ${annualProgress.remainingForYear ?? 0} policies`,
            `Months left: ${annualProgress.monthsLeft ?? 0}`,
          ]}
          renderItem={(item) => (
            <List.Item style={{ padding: "8px 0", fontSize: isMobile ? 13 : undefined }}>
              {item}
            </List.Item>
          )}
        />
      </Card>

      <Card
        title={
          <span style={{ fontSize: isMobile ? 15 : undefined }}>
            Monthly Policy Submission Progress
          </span>
        }
        className="surface-card"
        styles={{ body: isMobile ? { padding: 12 } : { padding: 24 } }}
      >
        {isMobile ? (
          <List
            dataSource={monthlyRows}
            split={false}
            renderItem={(row) => (
              <List.Item
                key={row.key}
                style={{
                  display: "block",
                  padding: "12px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  <Typography.Text strong style={{ fontSize: 15 }}>
                    {row.month}
                  </Typography.Text>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                      Submitted: <Typography.Text strong>{row.submitted}</Typography.Text>
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                      Target: <Typography.Text strong>{row.target}</Typography.Text>
                    </Typography.Text>
                  </div>
                  <Progress
                    percent={row.progressPercent}
                    size="small"
                    status={row.progressPercent >= 100 ? "success" : "active"}
                  />
                </Space>
              </List.Item>
            )}
          />
        ) : (
          <Table
            columns={monthlyColumns}
            dataSource={monthlyRows}
            pagination={false}
            scroll={{ x: "max-content" }}
            size="middle"
          />
        )}
      </Card>
    </div>
  );
}
