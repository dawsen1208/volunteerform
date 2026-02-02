import React from 'react';
import { Form, Input, Select, Row, Col, Card, Checkbox } from 'antd';

const { Option } = Select;

export default function HealthSection() {
  const myopiaOptions = [];
  for (let i = 50; i >= 30; i--) {
    const val = (i / 10).toFixed(1);
    myopiaOptions.push(<Option key={val} value={val}>{val}</Option>);
  }

  return (
    <Card title="体检信息 (Health)" className="mb-6 shadow-sm">
      <Row gutter={16}>
        <Col xs={24} sm={24}>
          <Form.Item name={['health', 'medicalConclusion']} label="体检结论">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name={['health', 'leftEye']} label="左眼视力">
            <Select showSearch placeholder="请选择">
              {myopiaOptions}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name={['health', 'rightEye']} label="右眼视力">
            <Select showSearch placeholder="请选择">
              {myopiaOptions}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['health', 'colorVision']} label="色盲色弱">
            <Input placeholder="无/色盲/色弱" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['health', 'hepatitisB']} label="乙肝" valuePropName="checked">
             <Checkbox>有乙肝病史</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['health', 'limbDisability']} label="肢体" valuePropName="checked">
             <Checkbox>肢体残疾</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name={['health', 'heartHistory']} label="心脏病史">
            <Input placeholder="无/有/不详" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name={['health', 'others']} label="其他病史">
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
