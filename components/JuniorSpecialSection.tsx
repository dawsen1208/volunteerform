import React from 'react';
import { Form, Select, Card, Radio, Input } from 'antd';

const { Option } = Select;

export default function JuniorSpecialSection() {
  return (
    <Card title="专科专属信息 (Junior Special)" className="mb-6 shadow-sm">
      <Form.Item name={['juniorSpecial', 'upgradeToBachelor']} label="专升本意向">
        <Radio.Group>
          <Radio value="升本">升本</Radio>
          <Radio value="不升本">不升本</Radio>
          <Radio value="不详">不详</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name={['juniorSpecial', 'upgradeToMaster']} label="考研意向">
        <Radio.Group>
          <Radio value="升研">升研</Radio>
          <Radio value="不升研">不升研</Radio>
          <Radio value="不详">不详</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name={['juniorSpecial', 'upgradeDifficulty']} label="升学难度接受度">
        <Input />
      </Form.Item>

      <Form.Item name={['juniorSpecial', 'bachelorTier']} label="本科层次要求">
        <Input />
      </Form.Item>

      <Form.Item name={['juniorSpecial', 'majorCount']} label="专业数量要求">
        <Input />
      </Form.Item>

      <Form.Item name={['juniorSpecial', 'costRank']} label="费用排名">
        <Input />
      </Form.Item>

      <Form.Item name={['juniorSpecial', 'examSubjects']} label="考试科目">
        <Input />
      </Form.Item>

      <Form.Item name={['juniorSpecial', 'internationalPath']} label="国际升学路径">
        <Input />
      </Form.Item>
    </Card>
  );
}
