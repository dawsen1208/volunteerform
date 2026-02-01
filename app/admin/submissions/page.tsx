'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, message, Tag, Input, Select, DatePicker, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { EyeOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function AdminSubmissionsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
    formType: '',
    dateFrom: '',
    dateTo: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.keyword) params.append('keyword', currentFilters.keyword);
      if (currentFilters.formType) params.append('formType', currentFilters.formType);
      if (currentFilters.dateFrom) params.append('dateFrom', currentFilters.dateFrom);
      if (currentFilters.dateTo) params.append('dateTo', currentFilters.dateTo);

      const res = await fetch(`/api/admin/submissions?${params.toString()}`);
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        message.error('加载失败');
      }
    } catch (error) {
      console.error(error);
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchData();
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (filters.formType) params.append('formType', filters.formType);
    window.open(`/api/admin/export?${params.toString()}`, '_blank');
  };

  const columns = [
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '表单类型',
      dataIndex: 'formType',
      key: 'formType',
      render: (type: string) => (
        <Tag color={type === 'undergrad' ? 'blue' : 'green'}>
          {type === 'undergrad' ? '本科志愿约谈表' : '专科志愿单'}
        </Tag>
      ),
      filters: [
        { text: '本科', value: 'undergrad' },
        { text: '专科', value: 'junior' },
      ],
      onFilter: (value: any, record: any) => record.formType === value,
    },
    {
      title: '姓名',
      dataIndex: ['data', 'profile', 'name'],
      key: 'name',
    },
    {
      title: '电话',
      dataIndex: ['data', 'profile', 'studentPhone'],
      key: 'studentPhone',
    },
    {
      title: '考生号',
      dataIndex: ['data', 'profile', 'examCandidateNumber'],
      key: 'examCandidateNumber',
    },
    {
      title: '总分',
      dataIndex: ['data', 'exam', 'totalScore'],
      key: 'totalScore',
      sorter: (a: any, b: any) => (a.data?.exam?.totalScore || 0) - (b.data?.exam?.totalScore || 0),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />} 
          onClick={() => router.push(`/admin/submissions/${record._id}`)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={3} style={{ margin: 0 }}>所有提交记录</Title>
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
          导出 CSV
        </Button>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded">
        <Space wrap>
          <Input 
            placeholder="搜索姓名/电话/考生号" 
            style={{ width: 200 }} 
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Select 
            placeholder="表单类型" 
            style={{ width: 120 }}
            allowClear
            value={filters.formType || undefined}
            onChange={(val) => setFilters({ ...filters, formType: val })}
          >
            <Option value="undergrad">本科</Option>
            <Option value="junior">专科</Option>
          </Select>
          <RangePicker 
            onChange={(_, dateStrings) => {
              setFilters({ ...filters, dateFrom: dateStrings[0], dateTo: dateStrings[1] });
            }} 
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            筛选
          </Button>
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="_id" 
        loading={loading}
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
}
