import React from 'react';
import { Form, Input, Select, Row, Col, Card, List, Button, Tag, Typography, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

export default function PreferenceSection() {
  const form = Form.useFormInstance();
  const allProvinces = [
    '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江',
    '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东',
    '河南', '湖北', '湖南', '广东', '广西', '海南',
    '重庆', '四川', '贵州', '云南', '西藏',
    '陕西', '甘肃', '青海', '宁夏', '新疆',
    '台湾', '香港', '澳门'
  ];

  const moveProvince = (index: number, direction: 'up' | 'down') => {
    const currentProvinces = form.getFieldValue(['preference', 'intendedProvinces']) || [];
    if (index < 0 || index >= currentProvinces.length) return;
    
    const newProvinces = [...currentProvinces];
    if (direction === 'up' && index > 0) {
      [newProvinces[index - 1], newProvinces[index]] = [newProvinces[index], newProvinces[index - 1]];
    } else if (direction === 'down' && index < newProvinces.length - 1) {
      [newProvinces[index], newProvinces[index + 1]] = [newProvinces[index + 1], newProvinces[index]];
    }
    
    form.setFieldValue(['preference', 'intendedProvinces'], newProvinces);
    // Trigger re-render by forcing update or just relying on form state
    // Since we are inside Form.Item shouldUpdate, it should update automatically? 
    // No, setFieldValue doesn't trigger re-render of the component unless we use useWatch or Form.Item dependencies.
    // The Form.Item below has dependencies so it will re-render.
  };

  return (
    <Card title="报考意向 (Preference)" className="mb-6 shadow-sm">
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name={['preference', 'intendedProvinces']} label="意向省份" extra="请按意向优先级顺序选择，或使用下方箭头调整顺序">
            <Select mode="tags" placeholder="请输入或选择省份" style={{ width: '100%' }}>
              {allProvinces.map(p => (
                  <Option key={p} value={p}>{p}</Option>
              ))}
            </Select>
          </Form.Item>
          
          {/* Sorting UI */}
          <Form.Item
            noStyle
            shouldUpdate={(prev, current) => 
              prev.preference?.intendedProvinces !== current.preference?.intendedProvinces
            }
          >
            {({ getFieldValue }) => {
              const provinces = getFieldValue(['preference', 'intendedProvinces']) || [];
              if (provinces.length === 0) return null;

              return (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <Text strong className="mb-2 block">已选省份优先级排序（点击箭头调整）：</Text>
                  <List
                    size="small"
                    dataSource={provinces}
                    renderItem={(item: string, index: number) => (
                      <List.Item>
                        <Space className="w-full justify-between">
                          <Space>
                            <Tag color="blue" className="mr-0">{index + 1}</Tag>
                            <Text>{item}</Text>
                          </Space>
                          <Space>
                            <Button 
                              size="small" 
                              icon={<ArrowUpOutlined />} 
                              disabled={index === 0}
                              onClick={() => moveProvince(index, 'up')}
                            />
                            <Button 
                              size="small" 
                              icon={<ArrowDownOutlined />} 
                              disabled={index === provinces.length - 1}
                              onClick={() => moveProvince(index, 'down')}
                            />
                          </Space>
                        </Space>
                      </List.Item>
                    )}
                  />
                </div>
              );
            }}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name={['preference', 'schoolNature']} label="院校性质">
            <Select mode="multiple">
              <Option value="公办">公办</Option>
              <Option value="民办">民办</Option>
              <Option value="中外合作">中外合作</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name={['preference', 'tuitionRange']} label="学费区间">
            <Select>
              <Option value="无要求">无要求</Option>
              <Option value="1万以内">1万以内</Option>
              <Option value="1-2万">1-2万</Option>
              <Option value="2-3万">2-3万</Option>
              <Option value="3-5万">3-5万</Option>
              <Option value="5-10万">5-10万</Option>
              <Option value="10万以上">10万以上</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name={['preference', 'hukou']} label="户口性质">
            <Select>
              <Option value="城市">城市</Option>
              <Option value="农村">农村</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name={['preference', 'careerPlan']} label="读研/就业意向">
            <Select mode="multiple">
              <Option value="考研">考研</Option>
              <Option value="就业">就业</Option>
              <Option value="出国">出国</Option>
              <Option value="考公">考公</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name={['preference', 'remarks']} label="备注">
            <TextArea rows={2} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
