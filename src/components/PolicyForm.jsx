import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space } from "antd";
import { PLANS_BY_CATEGORY } from "../data/planCatalog.js";
import { STATUS } from "../constants/policyConstants.js";

const policyTypeOptions = Object.entries(PLANS_BY_CATEGORY).map(
  ([category, plans]) => ({
    label: category,
    options: plans.map((plan) => ({ label: plan, value: plan })),
  }),
);
const policyTermOptions = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Half Yearly", value: "half_yearly" },
  { label: "Yearly", value: "yearly" },
];

export default function PolicyForm({
  form,
  onFinish,
  onCancel,
  submitting = false,
  submitText = "Save Policy",
  initialValues,
  disabled = false,
}) {
  const selectedStatus = Form.useWatch("status", form);
  const effectiveStatus = selectedStatus ?? initialValues?.status;
  const isClientPolicy = effectiveStatus === STATUS.CONVERTED_TO_CLIENT;

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
      disabled={disabled}
    >
      <Row gutter={[16, 8]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Customer Name"
            name="customerName"
            rules={[{ required: true, message: "Enter customer name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Phone Number"
            name="customerPhone"
            rules={[{ required: true, message: "Enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Email" name="customerEmail">
            <Input type="email" placeholder="Enter email" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Policy Type"
            name="policyType"
            rules={[{ required: true, message: "Select policy name" }]}
          >
            <Select
              showSearch
              allowClear
              placeholder="Select policy name"
              options={policyTypeOptions}
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Premium Amount" name="premiumAmount">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter premium"
              min={0}
              controls={false}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Select status" }]}
          >
            <Select
              options={[
                { label: "Pending", value: STATUS.PENDING },
                { label: "Completed", value: STATUS.COMPLETED },
                { label: "Converted to Client", value: STATUS.CONVERTED_TO_CLIENT },
              ]}
            />
          </Form.Item>
        </Col>
        {isClientPolicy ? (
          <Col xs={24} md={12}>
            <Form.Item
              label="Policy Term"
              name="policyTerm"
              rules={[{ required: true, message: "Select policy term" }]}
            >
              <Select placeholder="Select policy term" options={policyTermOptions} />
            </Form.Item>
          </Col>
        ) : (
          <Col xs={24} md={12}>
            <Form.Item label="Next Follow Up Date" name="nextFollowUpDate">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        )}

        <Col xs={24} md={12}>
          <Form.Item label="Start Date" name="startDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="End Date" name="endDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Address" name="address">
            <Input.TextArea rows={3} placeholder="Enter address" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Notes" name="notes">
            <Input.TextArea rows={4} placeholder="Notes for this policy" />
          </Form.Item>
        </Col>
      </Row>

      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button size="large" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="primary" size="large" htmlType="submit" loading={submitting}>
          {submitText}
        </Button>
      </Space>
    </Form>
  );
}
