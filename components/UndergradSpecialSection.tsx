import React from 'react';
import { Form, Select, Card, Radio, Input, Row, Col } from 'antd';

const { Option } = Select;

export default function UndergradSpecialSection() {
  return (
    <Card title="本科专属信息 (Undergrad Special)" className="mb-6 shadow-sm">
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item name={['undergradSpecial', 'schoolTierPreference']} label="院校层次偏好">
            <Select mode="multiple">
              <Option value="985">985</Option>
              <Option value="211">211</Option>
              <Option value="双一流">双一流</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12}>
          <Form.Item name={['undergradSpecial', 'earlyBatchIntent']} label="提前批意向">
            <Input placeholder="如：军校、警校、公费师范等" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item name={['undergradSpecial', 'collegeSpecialPlan']} label="高校专项计划">
            <Select mode="multiple">
              <Option value="高校专项">高校专项</Option>
              <Option value="农村地方专项">农村地方专项</Option>
              <Option value="强基计划">强基计划</Option>
              <Option value="综合评价">综合评价</Option>
              <Option value="小语种">小语种</Option>
              <Option value="涉农专业">涉农专业</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item name={['undergradSpecial', 'publicFundedStudent']} label="公费生意向">
            <Radio.Group>
              <Radio value="有意向">有意向</Radio>
              <Radio value="无意向">无意向</Radio>
              <Radio value="不详">不详</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
