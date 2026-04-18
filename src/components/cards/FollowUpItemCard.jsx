import { Button, Card, Space, Tag, Tooltip, Typography } from "antd";
import { EditOutlined, PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";
import {
  hasDialablePhone,
  telHref,
  whatsAppHref,
} from "../../utils/phoneLinks.js";

function safeDate(value) {
  if (!value || value === "—") return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function FollowUpItemCard({ followUp, onEdit }) {
  const hasPhone = hasDialablePhone(followUp.customerPhone);

  return (
    <Card hoverable className="surface-card">
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Typography.Text strong>{followUp.customerName ?? "—"}</Typography.Text>
          <Tag color={followUp.status === "Completed" ? "green" : "orange"}>
            {followUp.status ?? "Pending"}
          </Tag>
        </Space>
        <Typography.Text>{followUp.policyType ?? "—"}</Typography.Text>
        <Typography.Text strong>
          Premium {(Number(followUp.premiumAmount) || 0).toLocaleString("en-IN")}
        </Typography.Text>
        {followUp.customerPhone ? (
          <Typography.Text type="secondary">
            {followUp.customerPhone}
          </Typography.Text>
        ) : null}
        {followUp.customerEmail ? (
          <Typography.Text type="secondary">
            {followUp.customerEmail}
          </Typography.Text>
        ) : null}
        <Typography.Text strong>Follow Up Date</Typography.Text>
        <Typography.Text>{safeDate(followUp.followUpDate)}</Typography.Text>
        <Typography.Text strong>Details</Typography.Text>
        <Typography.Text type="secondary">
          {followUp.details ?? "—"}
        </Typography.Text>
        <Space wrap style={{ width: "100%", justifyContent: "flex-end" }}>
          {onEdit ? (
            <Tooltip title="Edit follow up">
              <Button icon={<EditOutlined />} onClick={() => onEdit(followUp)} />
            </Tooltip>
          ) : null}
          <Button
            icon={<WhatsAppOutlined />}
            href={whatsAppHref(followUp.customerPhone)}
            target="_blank"
            rel="noreferrer"
            disabled={!hasPhone}
          >
            WhatsApp
          </Button>
          <Button
            type="primary"
            icon={<PhoneOutlined />}
            href={telHref(followUp.customerPhone)}
            disabled={!hasPhone}
          >
            Call
          </Button>
        </Space>
      </Space>
    </Card>
  );
}
