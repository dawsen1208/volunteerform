'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, message, Tag, Input, Select, DatePicker, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { EyeOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

import { IFormSubmission } from '@/types';

export default function AdminSubmissionsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IFormSubmission[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    keyword: '',
    formType: '',
    province: '',
    dateFrom: '',
    dateTo: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (page = 1, currentFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', '20');
      
      if (currentFilters.keyword) params.append('keyword', currentFilters.keyword);
      if (currentFilters.formType) params.append('formType', currentFilters.formType);
      if (currentFilters.province) params.append('province', currentFilters.province);
      if (currentFilters.dateFrom) params.append('dateFrom', currentFilters.dateFrom);
      if (currentFilters.dateTo) params.append('dateTo', currentFilters.dateTo);

      const res = await fetch(`/api/admin/submissions?${params.toString()}`);
      const json = await res.json();
      if (res.ok) {
        setData(json.items || []);
        setTotal(json.total || 0);
        setCurrentPage(page);
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
    fetchData(1);
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.formType) params.append('formType', filters.formType);
    if (filters.province) params.append('province', filters.province);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    
    window.open(`/api/admin/export?${params.toString()}`, '_blank');
  };

  const columns = [
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a: IFormSubmission, b: IFormSubmission) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
      onFilter: (value: boolean | React.Key, record: IFormSubmission) => record.formType === value,
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
      sorter: (a: IFormSubmission, b: IFormSubmission) => (a.data?.exam?.totalScore || 0) - (b.data?.exam?.totalScore || 0),
    },
    {
      title: '意向省份',
      dataIndex: ['data', 'preference', 'intendedProvinces'],
      key: 'intendedProvinces',
      render: (provinces: string[]) => provinces ? provinces.join(', ') : '-',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: IFormSubmission) => (
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
          <Input 
            placeholder="意向省份" 
            style={{ width: 120 }} 
            value={filters.province}
            onChange={(e) => setFilters({ ...filters, province: e.target.value })}
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
        pagination={{ 
          current: currentPage,
          pageSize: 20, 
          total: total,
          onChange: (page) => fetchData(page),
          showTotal: (total) => `共 ${total} 条`
        }}
      />
    </div>
  );
}
