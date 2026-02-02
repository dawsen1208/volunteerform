import React from 'react';
import { Form, Select, Card, Radio, Input, Row, Col } from 'antd';

const { Option } = Select;

export default function UndergradSpecialSection() {
  const line2Type = Form.useWatch(['undergradSpecial', 'earlyBatchIntentLine2Type']);

  const line1Options = [
    '军队院校', '公安政法类', '免费师范生/医学生/农学生',
    '小语种', '飞行航海类', '五所特殊类型的院校',
    '综合评价招生', '港澳院校'
  ];

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
          <Form.Item name={['undergradSpecial', 'earlyBatchIntentLine1']} label="提前批意向（一段线以上）">
            <Select mode="multiple" placeholder="请选择">
              {line1Options.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item name={['undergradSpecial', 'earlyBatchIntentLine2Type']} label="提前批意向（一段线以下二段线以上）">
            <Select placeholder="请选择">
              <Option value="直招士官">直招士官</Option>
              <Option value="飞行技术">飞行技术</Option>
              <Option value="无">无</Option>
            </Select>
          </Form.Item>
        </Col>

        {(line2Type === '直招士官' || line2Type === '飞行技术') && (
          <Col xs={24} sm={12}>
            <Form.Item 
              name={['undergradSpecial', 'earlyBatchIntentLine2School']} 
              label="确定院校及专业"
              rules={[{ required: true, message: '请填写确定院校及专业' }]}
            >
              <Input placeholder="请填写院校及专业" />
            </Form.Item>
          </Col>
        )}

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
