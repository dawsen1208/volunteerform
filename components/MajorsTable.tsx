import React from 'react';
import { Form, Input, Button, Table, Card } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

export default function MajorsTable() {
  return (
    <Card title="意向专业 (Majors)" className="mb-6 shadow-sm">
      <Form.List name="majors">
        {(fields, { add, remove }) => (
          <>
            <Table
              dataSource={fields}
              pagination={false}
              rowKey="key"
              columns={[
                {
                  title: '专业大类',
                  dataIndex: 'name', // Form.List field name (index)
                  key: 'category',
                  render: (_, field) => (
                    <Form.Item
                      {...field}
                      name={[field.name, 'majorCategory']}
                      noStyle
                    >
                      <Input placeholder="专业大类" />
                    </Form.Item>
                  ),
                },
                {
                  title: '具体专业',
                  dataIndex: 'name',
                  key: 'name',
                  render: (_, field) => (
                    <Form.Item
                      {...field}
                      name={[field.name, 'majorName']}
                      noStyle
                    >
                      <Input placeholder="具体专业" />
                    </Form.Item>
                  ),
                },
                {
                  title: '备注',
                  dataIndex: 'name',
                  key: 'note',
                  render: (_, field) => (
                    <Form.Item
                      {...field}
                      name={[field.name, 'note']}
                      noStyle
                    >
                      <Input placeholder="备注" />
                    </Form.Item>
                  ),
                },
                {
                  title: '操作',
                  dataIndex: 'name',
                  key: 'action',
                  width: 80,
                  render: (_, field) => (
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => remove(field.name)}
                    />
                  ),
                },
              ]}
              footer={() => (
                <Button 
                  type="dashed" 
                  onClick={() => add()} 
                  block 
                  icon={<PlusOutlined />}
                  disabled={fields.length >= 20}
                >
                  添加专业
                </Button>
              )}
            />
          </>
        )}
      </Form.List>
    </Card>
  );
}
