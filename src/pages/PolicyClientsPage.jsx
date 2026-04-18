import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import PolicyItemCard from "../components/cards/PolicyItemCard";
import { usePolicies } from "../hooks/usePolicies.js";

const LIST_PAGE = 1;
const LIST_LIMIT = 100;
const SORT_BY = "createdAt";
const SORT_ORDER = "desc";
const CLIENT_STATUS = "converted_to_client";

function isConvertedClientStatus(status) {
  const normalized = String(status ?? "")
    .toLowerCase()
    .replace(/[\s_-]+/g, " ")
    .trim();
  return normalized.includes("convert") && normalized.includes("client");
}

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
    policyName: String(p.policyName ?? p.policyType ?? "—"),
    policyType: String(p.policyType ?? "—"),
    policyTerm: String(p.policyTerm ?? ""),
    premium: Number.isFinite(premium) ? premium : 0,
    status: p.status ?? "pending",
  };
}

export default function PolicyClientsPage() {
  const [search, setSearch] = useState("");
  const [loadError, setLoadError] = useState(null);
  const navigate = useNavigate();
  const { policies, policiesLoading, getPolicies, deletePolicy } =
    usePolicies();

  useEffect(() => {
    let cancelled = false;
    getPolicies(
      LIST_PAGE,
      LIST_LIMIT,
      SORT_BY,
      SORT_ORDER,
      undefined,
      CLIENT_STATUS,
    )
      .then(() => {
        if (!cancelled) setLoadError(null);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err?.message ?? "Failed to load policy clients");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [getPolicies]);

  const data = useMemo(() => {
    const items = policies?.items ?? [];
    const rows = items
      .filter((item) => isConvertedClientStatus(item?.status))
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

  function handleEdit(id) {
    navigate(`/edit-policy/${id}`, { state: { returnTo: "/policy-clients" } });
  }

  function handleDelete(id) {
    Modal.confirm({
      title: "Delete this policy client?",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deletePolicy(id);
          message.success("Policy client deleted");
        } catch {
          message.error("Could not delete policy client");
        }
      },
    });
  }

  const loading = policiesLoading || policies === null;

  return (
    <Card
      className="hero-card"
      title={
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Typography.Title
            level={4}
            className="page-title"
            style={{ margin: 0 }}
          >
            Policy Clients
          </Typography.Title>
          <Button
            type="primary"
            onClick={() =>
              navigate("/add-policy", {
                state: {
                  returnTo: "/policy-clients",
                  defaultStatus: CLIENT_STATUS,
                },
              })
            }
          >
            Create
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
        <Input
          placeholder="Search by name or phone"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Space>
      <Spin spinning={loading}>
        {!loading && data.length === 0 ? (
          <Typography.Text type="secondary">
            No policy clients found.
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
                  hideStatusTag
                  showContactActions
                />
              </Col>
            ))}
          </Row>
        ) : null}
      </Spin>
    </Card>
  );
}
