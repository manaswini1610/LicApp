import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Tabs,
  Typography,
  message,
} from "antd";
import FollowUpItemCard from "../components/cards/FollowUpItemCard";
import { usePolicies } from "../hooks/usePolicies.js";

const LIST_PAGE = 1;
const LIST_LIMIT = 10;
const SORT_BY = "createdAt";
const SORT_ORDER = "desc";
const equalTabLabelStyle = { display: "block", width: "100%", textAlign: "center" };

function normalizeStatus(status) {
  const value = String(status ?? "").toLowerCase();
  if (!value) return "Pending";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function FollowUpsPage() {
  const [loadError, setLoadError] = useState(null);
  const [activeParentTab, setActiveParentTab] = useState("leads");
  const [activeLeadTab, setActiveLeadTab] = useState("today");
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [form] = Form.useForm();
  const { policies, policiesLoading, getPolicies, getPolicyById, updatePolicy } =
    usePolicies();

  const selectedRange = activeParentTab === "leads" ? activeLeadTab : "today";

  useEffect(() => {
    let cancelled = false;
    getPolicies(LIST_PAGE, LIST_LIMIT, SORT_BY, SORT_ORDER, selectedRange, "pending")
      .then(() => {
        if (!cancelled) setLoadError(null);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err?.message ?? "Failed to load follow ups");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedRange, getPolicies]);

  const followUps = useMemo(() => {
    const items = policies?.items ?? [];
    return items
      .filter((item) => String(item?.status ?? "").toLowerCase() === "pending")
      .map((item, index) => ({
        id: String(item?._id ?? item?.id ?? `follow-up-${index}`),
        policyNumber: item?.policyNumber ?? "—",
        customerName: item?.customerName ?? item?.clientName ?? item?.name ?? "—",
        customerPhone: item?.customerPhone ?? item?.phone ?? "",
        customerEmail: item?.customerEmail ?? item?.email ?? "",
        policyType: item?.policyType ?? "—",
        premiumAmount: Number(item?.premiumAmount ?? item?.premium ?? 0),
        status: normalizeStatus(item?.status),
        followUpDate:
          item?.nextFollowUpDate ??
          item?.followUpDate ??
          item?.followupDate ??
          "—",
        details:
          item?.notes ??
          item?.followUpDetails ??
          item?.details ??
          item?.description ??
          "—",
        raw: item,
      }));
  }, [policies]);

  const leadFollowUps = followUps;
  const clientFollowUps = followUps;
  const loading = policiesLoading || policies === null;

  function openEditModal(item) {
    setEditingFollowUp(item);
    form.setFieldsValue({
      nextFollowUpDate: item?.followUpDate ? dayjs(item.followUpDate) : undefined,
      notes: item?.details && item.details !== "—" ? item.details : "",
    });
    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setEditingFollowUp(null);
    form.resetFields();
  }

  async function onUpdateFollowUp(values) {
    if (!editingFollowUp?.id) return;
    setUpdating(true);
    try {
      const current = await getPolicyById(editingFollowUp.id);
      const payload = {
        customerName: current?.customerName ?? current?.clientName ?? current?.name ?? "",
        customerPhone: current?.customerPhone ?? current?.phone ?? "",
        customerEmail: current?.customerEmail ?? current?.email ?? "",
        policyType: current?.policyType ?? "",
        premiumAmount:
          current?.premiumAmount ??
          current?.premium ??
          current?.policyPremium ??
          current?.policyAmount ??
          0,
        notes: values?.notes ?? current?.notes ?? "",
        address: current?.address ?? "",
        status: current?.status ?? "pending",
        startDate: current?.startDate,
        endDate: current?.endDate,
        nextFollowUpDate: values?.nextFollowUpDate
          ? dayjs(values.nextFollowUpDate).toISOString()
          : undefined,
      };
      await updatePolicy(editingFollowUp.id, payload);
      message.success("Follow up updated");
      closeEditModal();
      await getPolicies(
        LIST_PAGE,
        LIST_LIMIT,
        SORT_BY,
        SORT_ORDER,
        activeLeadTab,
        "pending",
      );
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Could not update follow up");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Card className="hero-card">
        <Typography.Title level={3}>Follow Ups</Typography.Title>
        <Typography.Text type="secondary">
          Follow-up date and details from policies API.
        </Typography.Text>
      </Card>

      <Card title="Upcoming Follow Up Tasks" className="surface-card">
        {loadError ? (
          <Typography.Text type="danger">{loadError}</Typography.Text>
        ) : null}
        <Tabs
          activeKey={activeParentTab}
          onChange={setActiveParentTab}
          rootClassName="segmented-tabs segmented-tabs-primary"
          items={[
            {
              key: "leads",
              label: "Leads followup",
              children: null,
            },
            {
              key: "clients",
              label: "Client followUp",
              children: null,
            },
          ]}
          tabBarGutter={0}
          tabBarStyle={{ marginBottom: 14 }}
        />
        {activeParentTab === "leads" ? (
          <Tabs
            activeKey={activeLeadTab}
            onChange={setActiveLeadTab}
            rootClassName="segmented-tabs segmented-tabs-secondary"
            tabBarGutter={0}
            tabBarStyle={{ marginBottom: 16 }}
            items={[
              {
                key: "today",
                label: <span style={equalTabLabelStyle}>today</span>,
              },
              {
                key: "upcoming",
                label: <span style={equalTabLabelStyle}>upcoming</span>,
              },
            ]}
          />
        ) : null}
        <Spin spinning={loading}>
          {!loading &&
          (activeParentTab === "leads" ? leadFollowUps : clientFollowUps).length ===
            0 ? (
            <Typography.Text type="secondary">No follow ups found.</Typography.Text>
          ) : null}
          {!loading &&
          (activeParentTab === "leads" ? leadFollowUps : clientFollowUps).length >
            0 ? (
            <Row gutter={[16, 16]}>
              {(activeParentTab === "leads" ? leadFollowUps : clientFollowUps).map(
                (item) => (
                <Col xs={24} md={12} lg={8} key={item.id}>
                  <FollowUpItemCard
                    followUp={item}
                    onEdit={activeParentTab === "leads" ? openEditModal : undefined}
                  />
                </Col>
                ),
              )}
            </Row>
          ) : null}
        </Spin>
      </Card>

      <Modal
        title="Edit Lead Follow Up"
        open={editModalOpen}
        onCancel={closeEditModal}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={onUpdateFollowUp}>
          <Form.Item
            label="Next Follow Up Date"
            name="nextFollowUpDate"
            rules={[{ required: true, message: "Please select a follow up date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Follow Up Details" name="notes">
            <Input.TextArea rows={4} placeholder="Enter follow up details" />
          </Form.Item>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={closeEditModal}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={updating}>
              Update
            </Button>
          </Space>
        </Form>
      </Modal>
      <style>
        {`
          .segmented-tabs .ant-tabs-nav::before {
            border-bottom: 0;
          }

          .segmented-tabs .ant-tabs-nav {
            margin-bottom: 12px;
          }

          .segmented-tabs .ant-tabs-nav-list {
            display: flex;
            width: 100%;
            border: 1px solid #e9eef5;
            border-radius: 12px;
            background: #ffffff;
            overflow: hidden;
          }

          .segmented-tabs .ant-tabs-tab {
            flex: 1;
            margin: 0 !important;
            justify-content: center;
            padding: 11px 12px;
            color: #5f6b7a;
            background: #ffffff;
            border-right: 1px solid #edf2f8;
            transition: all 0.2s ease;
          }

          .segmented-tabs .ant-tabs-tab:last-child {
            border-right: 0;
          }

          .segmented-tabs .ant-tabs-tab-active {
            background: #f7fcff;
            box-shadow: inset 0 -2px 0 #0ea5b7;
          }

          .segmented-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #0ea5b7;
            font-weight: 500;
          }

          .segmented-tabs .ant-tabs-tab-btn {
            width: 100%;
            text-align: center;
          }

          .segmented-tabs .ant-tabs-ink-bar {
            display: none;
          }

          .segmented-tabs-primary .ant-tabs-tab {
            font-size: 16px;
          }

          .segmented-tabs-primary .ant-tabs-tab-active .ant-tabs-tab-btn {
            font-weight: 600;
          }

          .segmented-tabs-secondary .ant-tabs-nav-list {
            background: #fbfdff;
            border-color: #e6edf6;
          }

          .segmented-tabs-secondary .ant-tabs-tab {
            font-size: 15px;
          }
        `}
      </style>
    </Space>
  );
}
