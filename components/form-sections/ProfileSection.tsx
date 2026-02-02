import React from 'react';
import { Form, Input, Select, InputNumber, Row, Col, Card, DatePicker, Divider } from 'antd';

const { Option } = Select;

export default function ProfileSection() {
  return (
    <Card title="基本信息 (Profile)" className="mb-6 shadow-sm">
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'name']} label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'gender']} label="性别" rules={[{ required: true, message: '请选择性别' }]}>
            <Select>
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'ethnicity']} label="民族">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'birthDate']} label="出生日期">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="选择日期" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'heightCm']} label="身高(cm)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'weightKg']} label="体重(kg)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'studentPhone']} label="学生电话" rules={[{ required: true, message: '请输入学生电话' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'idNumber']} label="身份证号" rules={[{ required: true, message: '请输入身份证号' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'examCandidateNumber']} label="考生号" rules={[{ required: true, message: '请输入考生号' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'candidateType']} label="考生类型">
            <Select placeholder="请选择">
              <Option value="普通">普通</Option>
              <Option value="艺术">艺术</Option>
              <Option value="体育">体育</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'schoolClassTeacher']} label="学校及班主任">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'referrer']} label="推荐人">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name={['profile', 'address']} label="通讯地址">
            <Input />
          </Form.Item>
        </Col>
        
        <Col span={24}>
          <Divider orientation="left" style={{ fontSize: '14px', color: '#666' }}>家庭信息</Divider>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'family', 'fatherName']} label="父亲姓名">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'family', 'fatherWork']} label="父亲工作单位">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'family', 'fatherJob']} label="父亲职务">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'family', 'motherName']} label="母亲姓名">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'family', 'motherWork']} label="母亲工作单位">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['profile', 'family', 'motherJob']} label="母亲职务">
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
