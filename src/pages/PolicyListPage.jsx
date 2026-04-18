import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import PolicyItemCard from "../components/cards/PolicyItemCard";
import { usePolicies } from "../hooks/usePolicies.js";

const LIST_PAGE = 1;
const LIST_LIMIT = 50;
const SORT_BY = "createdAt";
const SORT_ORDER = "desc";

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
    status: p.status ?? "Pending",
  };
}

export default function PolicyListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loadError, setLoadError] = useState(null);
  const navigate = useNavigate();
  const { policies, policiesLoading, getPolicies, deletePolicy } =
    usePolicies();

  useEffect(() => {
    let cancelled = false;
    const statusFilter = status === "All" ? undefined : status.toLowerCase();
    getPolicies(
      LIST_PAGE,
      LIST_LIMIT,
      SORT_BY,
      SORT_ORDER,
      undefined,
      statusFilter,
    )
      .then(() => {
        if (!cancelled) setLoadError(null);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err?.message ?? "Failed to load policies");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [getPolicies, status]);

  const data = useMemo(() => {
    const items = policies?.items ?? [];
    const rows = items.map(policyToCardItem);
    return rows.filter((item) => {
      const q = search.trim().toLowerCase();
      const bySearch =
        q === "" ||
        item.name.toLowerCase().includes(q) ||
        item.phone.includes(search.trim());
      return bySearch;
    });
  }, [policies, search]);

  function handleEdit(id) {
    navigate(`/edit-policy/${id}`);
  }

  function handleDelete(id) {
    Modal.confirm({
      title: "Delete this policy?",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deletePolicy(id);
          message.success("Policy deleted");
        } catch {
          message.error("Could not delete policy");
        }
      },
    });
  }

  const loading = policiesLoading || policies === null;

  return (
    <Card
      className="hero-card"
      title={
        <Typography.Title level={4} className="page-title">
          Policy List
        </Typography.Title>
      }
    >
      {loadError ? (
        <Typography.Text type="danger">{loadError}</Typography.Text>
      ) : null}
      <Space
        direction="vertical"
        size={12}
        style={{ width: "100%", marginBottom: 16 }}
      >
        <Input
          placeholder="Search by name or phone"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          value={status}
          onChange={setStatus}
          options={[
            { label: "All", value: "All" },
            { label: "Pending", value: "Pending" },
            { label: "Completed", value: "Completed" },
          ]}
          style={{ width: "100%", maxWidth: 240 }}
        />
      </Space>
      <Spin spinning={loading}>
        {!loading && data.length === 0 ? (
          <Typography.Text type="secondary">No policies found.</Typography.Text>
        ) : null}
        {!loading && data.length > 0 ? (
          <Row gutter={[16, 16]}>
            {data.map((item) => (
              <Col xs={24} md={12} lg={8} key={item.key}>
                <PolicyItemCard
                  policy={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Col>
            ))}
          </Row>
        ) : null}
      </Spin>
    </Card>
  );
}
