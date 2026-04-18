import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Dropdown, Input, Space, Tag, Typography } from "antd";

function statusColor(status) {
  const normalized = String(status ?? "").toLowerCase().replace(/[\s_-]+/g, " ").trim();
  if (normalized === "completed") return "green";
  if (normalized.includes("convert") && normalized.includes("client")) return "blue";
  return "orange";
}

function formatPolicyTerm(term) {
  return String(term ?? "")
    .replace(/_/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function PolicyItemCard({
  policy,
  onEdit,
  onDelete,
  onInlineUpdate,
  onConvertToClient,
  editableFollowUp = false,
  showConvertButton = false,
  actionLoading = false,
  hideStatusTag = false,
  showContactActions = false,
}) {
  const [followUpDate, setFollowUpDate] = useState(
    policy?.nextFollowUpDate ? dayjs(policy.nextFollowUpDate) : null,
  );
  const [notes, setNotes] = useState(policy?.notes ?? "");

  useEffect(() => {
    setFollowUpDate(policy?.nextFollowUpDate ? dayjs(policy.nextFollowUpDate) : null);
    setNotes(policy?.notes ?? "");
  }, [policy?.nextFollowUpDate, policy?.notes, policy?.key]);

  const canSaveFollowUp = editableFollowUp && followUpDate;
  const initialFollowUpDate = policy?.nextFollowUpDate ? dayjs(policy.nextFollowUpDate) : null;
  const initialNotes = policy?.notes ?? "";
  const isFollowUpDateChanged = initialFollowUpDate
    ? !followUpDate || !dayjs(followUpDate).isSame(initialFollowUpDate)
    : Boolean(followUpDate);
  const isNotesChanged = notes !== initialNotes;
  const showSaveFollowUpButton = editableFollowUp && (isFollowUpDateChanged || isNotesChanged);
  const actionMenuItems = [
    { key: "edit", label: "Edit" },
    ...(showConvertButton ? [{ key: "convert", label: "Convert to Client" }] : []),
    { key: "delete", label: "Delete", danger: true },
  ];

  function handleActionMenuClick({ key }) {
    if (key === "edit") onEdit?.(policy.key);
    if (key === "convert") onConvertToClient?.(policy.key);
    if (key === "delete") onDelete?.(policy.key);
  }

  function handleCancelInlineChanges() {
    setFollowUpDate(initialFollowUpDate);
    setNotes(initialNotes);
  }
  const whatsappPhone = String(policy?.phone ?? "").replace(/\D/g, "");
  const whatsappUrl = whatsappPhone ? `https://wa.me/${whatsappPhone}` : null;
  const callUrl = policy?.phone ? `tel:${policy.phone}` : null;

  return (
    <Card hoverable className="surface-card">
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Typography.Text strong>{policy.name}</Typography.Text>
          <Space size={6}>
            {!hideStatusTag ? (
              <Tag color={statusColor(policy.status)}>{policy.status}</Tag>
            ) : null}
            <Dropdown
              trigger={["click"]}
              menu={{ items: actionMenuItems, onClick: handleActionMenuClick }}
            >
              <Button
                size="small"
                aria-label="More actions"
                icon={<MoreOutlined />}
                disabled={actionLoading}
              />
            </Dropdown>
          </Space>
        </Space>

        <Typography.Text type="secondary">{policy.phone}</Typography.Text>
        {policy.email ? (
          <Typography.Text type="secondary">{policy.email}</Typography.Text>
        ) : null}
        <Typography.Text>{policy.policyName ?? policy.policyType}</Typography.Text>
        {policy.policyTerm ? (
          <Space size={6}>
            <Typography.Text type="secondary">Policy Term:</Typography.Text>
            <Tag color="purple">{formatPolicyTerm(policy.policyTerm)}</Tag>
          </Space>
        ) : null}
        <Typography.Text strong>
          INR {(Number(policy.premium) || 0).toLocaleString()}
        </Typography.Text>
        {showContactActions ? (
          <Space wrap>
            <Button href={whatsappUrl ?? undefined} target="_blank" disabled={!whatsappUrl}>
              WhatsApp
            </Button>
            <Button href={callUrl ?? undefined} disabled={!callUrl}>
              Call
            </Button>
          </Space>
        ) : null}
        {editableFollowUp ? (
          <>
            <Typography.Text type="secondary">
              Follow up date
            </Typography.Text>
            <DatePicker
              value={followUpDate}
              onChange={setFollowUpDate}
              style={{ width: "100%" }}
            />
            <Typography.Text type="secondary">Notes</Typography.Text>
            <Input.TextArea
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Enter follow up notes"
            />
            {showSaveFollowUpButton ? (
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button size="middle" onClick={handleCancelInlineChanges} disabled={actionLoading}>
                  Cancel
                </Button>
                <Button
                  type="default"
                  size="middle"
                  disabled={!canSaveFollowUp}
                  loading={actionLoading}
                  onClick={() =>
                    onInlineUpdate?.(policy.key, {
                      nextFollowUpDate: followUpDate
                        ? dayjs(followUpDate).toISOString()
                        : undefined,
                      notes,
                    })
                  }
                >
                  Save Follow Up
                </Button>
              </Space>
            ) : null}
          </>
        ) : null}

      </Space>
    </Card>
  );
}
