import React from 'react';
import { Form, Select, InputNumber, Row, Col, Card, Divider, Checkbox } from 'antd';

const { Option } = Select;

export default function ExamSection() {
  const subjectOptions = [
    { label: '物理', value: 'physics' },
    { label: '化学', value: 'chemistry' },
    { label: '生物', value: 'biology' },
    { label: '历史', value: 'history' },
    { label: '政治', value: 'politics' },
    { label: '地理', value: 'geography' },
  ];

  // Watch for selected subjects to conditionally render score inputs
  const selectedSubjects = Form.useWatch(['exam', 'selectedSubjects']);
  // Default subjects that are always shown
  const defaultSubjects = ['chinese', 'math', 'english'];
  
  // Helper to check if a subject should be shown
  const shouldShowSubject = (subjectKey: string) => {
    if (defaultSubjects.includes(subjectKey)) return true;
    return selectedSubjects?.includes(subjectKey);
  };

  return (
    <Card title="考试成绩 (Exam)" className="mb-6 shadow-sm">
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item name={['exam', 'totalScore']} label="总分" rules={[{ required: true, message: '请输入总分' }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['exam', 'rankPosition']} label="位次" rules={[{ required: true, message: '请输入位次' }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name={['exam', 'oralEnglish']} label="英语口语">
            <Select>
              <Option value="合格">合格</Option>
              <Option value="不合格">不合格</Option>
              <Option value="未参加">未参加</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name={['exam', 'selectedSubjects']} label="选考科目">
            <Checkbox.Group options={subjectOptions} />
          </Form.Item>
        </Col>
      </Row>
      <Divider>单科成绩</Divider>
      <Row gutter={16}>
        <Col xs={12} sm={4}>
          <Form.Item name={['exam', 'subjectScores', 'chinese']} label="语文">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={12} sm={4}>
          <Form.Item name={['exam', 'subjectScores', 'math']} label="数学">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={12} sm={4}>
          <Form.Item name={['exam', 'subjectScores', 'english']} label="英语">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {shouldShowSubject('physics') && (
          <Col xs={12} sm={4}>
            <Form.Item name={['exam', 'subjectScores', 'physics']} label="物理">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        )}
        {shouldShowSubject('chemistry') && (
          <Col xs={12} sm={4}>
            <Form.Item name={['exam', 'subjectScores', 'chemistry']} label="化学">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        )}
        {shouldShowSubject('biology') && (
          <Col xs={12} sm={4}>
            <Form.Item name={['exam', 'subjectScores', 'biology']} label="生物">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        )}
        {shouldShowSubject('history') && (
          <Col xs={12} sm={4}>
            <Form.Item name={['exam', 'subjectScores', 'history']} label="历史">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        )}
        {shouldShowSubject('politics') && (
          <Col xs={12} sm={4}>
            <Form.Item name={['exam', 'subjectScores', 'politics']} label="政治">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        )}
        {shouldShowSubject('geography') && (
          <Col xs={12} sm={4}>
            <Form.Item name={['exam', 'subjectScores', 'geography']} label="地理">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        )}
      </Row>
    </Card>
  );
}
