import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Form, Spin, Typography, message } from "antd";
import dayjs from "dayjs";
import { usePolicies } from "../hooks/usePolicies.js";
import { STATUS } from "../constants/policyConstants.js";
import PolicyForm from "../components/PolicyForm.jsx";

function toPolicyPayload(values) {
  return {
    customerName: values.customerName,
    customerPhone: values.customerPhone,
    customerEmail: values.customerEmail,
    policyType: values.policyType,
    policyTerm: values.policyTerm,
    premiumAmount: values.premiumAmount ?? 0,
    notes: values.notes,
    address: values.address,
    status: values.status ?? STATUS.PENDING,
    startDate: values.startDate ? dayjs(values.startDate).toISOString() : undefined,
    endDate: values.endDate ? dayjs(values.endDate).toISOString() : undefined,
    nextFollowUpDate: values.nextFollowUpDate
      ? dayjs(values.nextFollowUpDate).toISOString()
      : undefined,
  };
}

export default function PolicyActionPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { getPolicyById, createPolicy, updatePolicy } = usePolicies();
  const returnTo = location.state?.returnTo ?? "/policy-leads";
  const defaultStatus = location.state?.defaultStatus ?? STATUS.PENDING;

  useEffect(() => {
    if (!isEditMode || !id) return undefined;

    let cancelled = false;
    setLoading(true);

    getPolicyById(id)
      .then((p) => {
        if (cancelled || !p) return;
        form.setFieldsValue({
          customerName: p.customerName ?? p.clientName ?? p.name ?? "",
          customerPhone: p.customerPhone ?? p.phone ?? "",
          customerEmail: p.customerEmail ?? p.email ?? "",
          policyType: p.policyType ?? "",
          policyTerm: p.policyTerm ?? "",
          premiumAmount:
            p.premiumAmount ?? p.premium ?? p.policyPremium ?? p.policyAmount ?? 0,
          status: p.status ?? STATUS.PENDING,
          address: p.address ?? "",
          startDate: p.startDate ? dayjs(p.startDate) : undefined,
          endDate: p.endDate ? dayjs(p.endDate) : undefined,
          notes: p.notes ?? "",
          nextFollowUpDate: p.nextFollowUpDate
            ? dayjs(p.nextFollowUpDate)
            : undefined,
        });
      })
      .catch(() => {
        if (!cancelled) message.error("Could not load policy");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isEditMode, getPolicyById, form]);

  async function onFinish(values) {
    setSubmitting(true);
    try {
      const payload = toPolicyPayload(values);
      if (isEditMode && id) {
        await updatePolicy(id, payload);
        message.success("Policy updated");
      } else {
        await createPolicy(payload);
        message.success("Policy created");
      }
      navigate(returnTo);
    } catch (e) {
      message.error(
        e?.response?.data?.message ??
          (isEditMode ? "Could not update policy" : "Could not create policy"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="hero-card">
      <Typography.Title level={3}>
        {isEditMode ? "Edit Policy" : "Add New Policy"}
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        {isEditMode
          ? "Update policy details and save. Changes show on the policy list."
          : "Create a policy; it will appear in the policy list after you save."}
      </Typography.Paragraph>

      <Spin spinning={loading}>
        <PolicyForm
          form={form}
          onFinish={onFinish}
          onCancel={() => navigate(-1)}
          submitting={submitting}
          submitText={isEditMode ? "Update Policy" : "Save Policy"}
          initialValues={isEditMode ? undefined : { status: defaultStatus }}
          disabled={loading}
        />
      </Spin>
    </Card>
  );
}
