import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Tabs,
  Typography,
  message,
} from "antd";
import PolicyItemCard from "../components/cards/PolicyItemCard";
import { usePolicies } from "../hooks/usePolicies.js";
import { PLANS_BY_CATEGORY } from "../data/planCatalog.js";

const LIST_PAGE = 1;
const LIST_LIMIT = 50;
const SORT_BY = "createdAt";
const SORT_ORDER = "desc";
const policyTermOptions = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Half Yearly", value: "half_yearly" },
  { label: "Yearly", value: "yearly" },
];
const policyTypeOptions = Object.entries(PLANS_BY_CATEGORY).map(
  ([category, plans]) => ({
    label: category,
    options: plans.map((plan) => ({ label: plan, value: plan })),
  }),
);

function policyToCardItem(p, index) {
  const id = p._id ?? p.id ?? `idx-${index}`;
  const premium = Number(
    p.premium ??
      p.policyPremium ??
      p.policyAmount ??
      p.premiumAmount ??
      p.amount ??
      0,
  );
  return {
    key: String(id),
    name: p.customerName ?? p.clientName ?? p.name ?? p.fullName ?? "—",
    phone: String(p.customerPhone ?? p.phone ?? ""),
    email: p.customerEmail ?? p.email ?? "",
    policyType: String(p.policyType ?? "—"),
    premium: Number.isFinite(premium) ? premium : 0,
    status: p.status ?? "pending",
    nextFollowUpDate:
      p.nextFollowUpDate ?? p.followUpDate ?? p.followupDate ?? null,
    notes: p.notes ?? p.followUpDetails ?? p.details ?? "",
  };
}

export default function PolicyLeadsPage() {
  const [search, setSearch] = useState("");
  const [activeRange, setActiveRange] = useState("today");
  const [loadError, setLoadError] = useState(null);
  const [actionPolicyId, setActionPolicyId] = useState(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [convertingLeadId, setConvertingLeadId] = useState(null);
  const [convertSubmitting, setConvertSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [convertForm] = Form.useForm();
  const navigate = useNavigate();
  const { policies, policiesLoading, getPolicies, updatePolicy, deletePolicy } =
    usePolicies();

  useEffect(() => {
    let cancelled = false;
    getPolicies(
      LIST_PAGE,
      LIST_LIMIT,
      SORT_BY,
      SORT_ORDER,
      activeRange,
      "pending",
    )
      .then(() => {
        if (!cancelled) setLoadError(null);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err?.message ?? "Failed to load policy leads");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeRange, getPolicies]);

  const data = useMemo(() => {
    const items = policies?.items ?? [];
    const rows = items
      .filter((item) => String(item?.status ?? "").toLowerCase() === "pending")
      .map(policyToCardItem);
    return rows.filter((item) => {
      const q = search.trim().toLowerCase();
      return (
        q === "" ||
        item.name.toLowerCase().includes(q) ||
        item.phone.includes(search.trim())
      );
    });
  }, [policies, search]);
  const policyById = useMemo(() => {
    const items = policies?.items ?? [];
    return new Map(
      items.map((item) => [String(item?._id ?? item?.id ?? ""), item]),
    );
  }, [policies]);

  function handleEdit(id) {
    navigate(`/edit-policy/${id}`);
  }

  function handleDelete(id) {
    Modal.confirm({
      title: "Delete this policy lead?",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deletePolicy(id);
          message.success("Policy lead deleted");
        } catch {
          message.error("Could not delete policy lead");
        }
      },
    });
  }

  async function updateLeadById(id, overridePayload) {
    const current = policyById.get(String(id));
    const payload = {
      customerName:
        current?.customerName ?? current?.clientName ?? current?.name ?? "",
      customerPhone: current?.customerPhone ?? current?.phone ?? "",
      customerEmail: current?.customerEmail ?? current?.email ?? "",
      policyType: current?.policyType ?? "",
      policyTerm: current?.policyTerm ?? "",
      premiumAmount:
        current?.premiumAmount ??
        current?.premium ??
        current?.policyPremium ??
        current?.policyAmount ??
        0,
      notes: current?.notes ?? "",
      address: current?.address ?? "",
      status: current?.status ?? "pending",
      startDate: current?.startDate,
      endDate: current?.endDate,
      nextFollowUpDate: current?.nextFollowUpDate,
      ...overridePayload,
    };
    return updatePolicy(id, payload);
  }

  async function handleInlineFollowUpSave(id, values) {
    setActionPolicyId(id);
    try {
      await updateLeadById(id, {
        notes: values?.notes ?? "",
        nextFollowUpDate: values?.nextFollowUpDate
          ? dayjs(values.nextFollowUpDate).toISOString()
          : undefined,
      });
      message.success("Follow up updated");
      await getPolicies(
        LIST_PAGE,
        LIST_LIMIT,
        SORT_BY,
        SORT_ORDER,
        activeRange,
        "pending",
      );
    } catch (err) {
      message.error(
        err?.response?.data?.message ?? "Could not update follow up",
      );
    } finally {
      setActionPolicyId(null);
    }
  }

  async function handleConvertToClient(id) {
    const current = policyById.get(String(id));
    setConvertingLeadId(id);
    convertForm.setFieldsValue({
      policyType: current?.policyType ?? undefined,
      premiumAmount:
        current?.premiumAmount ??
        current?.premium ??
        current?.policyPremium ??
        current?.policyAmount ??
        undefined,
      policyTerm: current?.policyTerm ?? undefined,
    });
    setConvertModalOpen(true);
  }

  function closeConvertModal() {
    setConvertModalOpen(false);
    setConvertingLeadId(null);
    setConvertSubmitting(false);
    convertForm.resetFields();
  }

  async function submitConvertToClient(values) {
    if (!convertingLeadId) return;
    setActionPolicyId(convertingLeadId);
    setConvertSubmitting(true);
    try {
      await updateLeadById(convertingLeadId, {
        status: "converted_to_client",
        policyType: values?.policyType,
        premiumAmount: values?.premiumAmount ?? 0,
        policyTerm: values?.policyTerm,
      });
      closeConvertModal();
      await getPolicies(
        LIST_PAGE,
        LIST_LIMIT,
        SORT_BY,
        SORT_ORDER,
        activeRange,
        "pending",
      );
      setShowCelebration(true);
      window.setTimeout(() => {
        setShowCelebration(false);
      }, 3200);
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Could not convert lead");
    } finally {
      setActionPolicyId(null);
      setConvertSubmitting(false);
    }
  }

  const loading = policiesLoading || policies === null;

  return (
    <>
      <Card
        className="hero-card"
        title={
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Typography.Title
              level={4}
              className="page-title"
              style={{ margin: 0 }}
            >
              Policy Leads
            </Typography.Title>
            <Button
              type="primary"
              onClick={() =>
                navigate("/add-policy", {
                  state: { returnTo: "/policy-leads" },
                })
              }
            >
              Add Policy
            </Button>
          </Space>
        }
      >
        {loadError ? (
          <Typography.Text type="danger">{loadError}</Typography.Text>
        ) : null}
        <Space
          direction="vertical"
          size={12}
          style={{ width: "100%", marginBottom: 16, marginTop: 8 }}
        >
          <Tabs
            activeKey={activeRange}
            onChange={setActiveRange}
            items={[
              { key: "today", label: "Today" },
              { key: "upcoming", label: "Upcoming" },
            ]}
          />
          <Input
            placeholder="Search by name or phone"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Space>
        <Spin spinning={loading}>
          {!loading && data.length === 0 ? (
            <Typography.Text type="secondary">
              No policy leads found.
            </Typography.Text>
          ) : null}
          {!loading && data.length > 0 ? (
            <Row gutter={[16, 16]}>
              {data.map((item) => (
                <Col xs={24} md={12} lg={8} key={item.key}>
                  <PolicyItemCard
                    policy={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onInlineUpdate={handleInlineFollowUpSave}
                    onConvertToClient={handleConvertToClient}
                    editableFollowUp
                    showConvertButton
                    actionLoading={actionPolicyId === item.key}
                  />
                </Col>
              ))}
            </Row>
          ) : null}
        </Spin>
        <Modal
          title="Convert Lead to Client"
          open={convertModalOpen}
          onCancel={closeConvertModal}
          onOk={() => convertForm.submit()}
          okText="Convert to Client"
          confirmLoading={convertSubmitting}
          width="min(92vw, 520px)"
          centered
          destroyOnClose
        >
          <Form
            form={convertForm}
            layout="vertical"
            onFinish={submitConvertToClient}
          >
            <Form.Item
              label="Policy Type"
              name="policyType"
              rules={[{ required: true, message: "Please select policy type" }]}
            >
              <Select
                showSearch
                allowClear
                placeholder="Select policy type"
                options={policyTypeOptions}
                optionFilterProp="label"
              />
            </Form.Item>
            <Form.Item
              label="Premium"
              name="premiumAmount"
              rules={[
                { required: true, message: "Please enter premium amount" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                controls={false}
                placeholder="Enter premium amount"
              />
            </Form.Item>
            <Form.Item
              label="Policy Term"
              name="policyTerm"
              rules={[{ required: true, message: "Please select policy term" }]}
            >
              <Select
                placeholder="Select policy term"
                options={policyTermOptions}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
      {showCelebration ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(255, 245, 251, 0.85)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={`flower-${index}`}
              style={{
                position: "absolute",
                top: "-10%",
                left: `${(index * 13) % 100}%`,
                fontSize: `${18 + (index % 3) * 6}px`,
                animation: `flowerFall ${2.2 + (index % 4) * 0.45}s linear ${
                  (index % 6) * 0.2
                }s forwards`,
              }}
            >
              {index % 2 === 0 ? "🌸" : "🌼"}
            </span>
          ))}
          <Card
            style={{
              width: "min(92vw, 520px)",
              textAlign: "center",
              borderRadius: 20,
              boxShadow: "0 14px 42px rgba(120, 32, 80, 0.2)",
              background: "linear-gradient(180deg, #fff8fc 0%, #ffffff 100%)",
            }}
            bodyStyle={{ padding: "28px 20px" }}
          >
            <Typography.Title
              level={2}
              style={{
                margin: 0,
                fontSize: "clamp(24px, 5vw, 36px)",
                color: "#b4237a",
              }}
            >
              Congratulations!
            </Typography.Title>
            <Typography.Paragraph
              style={{ marginTop: 10, marginBottom: 0, color: "#5f2a4a" }}
            >
              New policy client added successfully.
            </Typography.Paragraph>
          </Card>
          <style>{`
            @keyframes flowerFall {
              0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
              12% { opacity: 1; }
              100% { transform: translateY(115vh) translateX(28px) rotate(320deg); opacity: 0.85; }
            }
          `}</style>
        </div>
      ) : null}
    </>
  );
}
