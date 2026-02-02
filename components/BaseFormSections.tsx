import React from 'react';
import { Form, Input, Select, InputNumber, Row, Col, Card, Divider, DatePicker, Checkbox } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

export default function BaseFormSections() {
  return (
    <>
      {/* 1. 基本信息 */}
      <Card title="基本信息 (Profile)" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item name={['profile', 'name']} label="姓名" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name={['profile', 'gender']} label="性别" rules={[{ required: true }]}>
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
              <Input placeholder="YYYY-MM-DD" />
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
            <Form.Item name={['profile', 'studentPhone']} label="学生电话" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name={['profile', 'idNumber']} label="身份证号" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name={['profile', 'examCandidateNumber']} label="考生号" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name={['profile', 'candidateType']} label="考生类型">
              <Input placeholder="普通/艺/体/其他" />
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
            <Form.Item name={['profile', 'familyInfo']} label="家庭信息 (父母姓名、职业等)">
              <TextArea rows={3} placeholder="请填写父母姓名、工作单位、职务等信息" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 2. 体检信息 */}
      <Card title="体检信息 (Health)" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name={['health', 'medicalConclusion']} label="体检结论">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name={['health', 'myopia']} label="近视情况">
              <Input placeholder="如：左4.8 右5.0" />
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

      {/* 3. 考试成绩 */}
      <Card title="考试成绩 (Exam)" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item name={['exam', 'totalScore']} label="总分" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name={['exam', 'rankPosition']} label="位次" rules={[{ required: true }]}>
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
          <Col xs={12} sm={4}>
            <Form.Item name={['exam', 'subjectScores', 'physics']} label="物理">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={4}>
            <Form.Item name={['exam', 'subjectScores', 'chemistry']} label="化学">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={4}>
            <Form.Item name={['exam', 'subjectScores', 'biology']} label="生物">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={4}>
            <Form.Item name={['exam', 'subjectScores', 'history']} label="历史">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={4}>
            <Form.Item name={['exam', 'subjectScores', 'politics']} label="政治">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={4}>
            <Form.Item name={['exam', 'subjectScores', 'geography']} label="地理">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={4}>
            <Form.Item name={['exam', 'subjectScores', 'tech']} label="技术">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 4. 报考意向 */}
      <Card title="报考意向 (Preference)" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name={['preference', 'intendedProvinces']} label="意向省份">
              <Select mode="tags" placeholder="请输入或选择省份" style={{ width: '100%' }}>
                {['浙江', '上海', '江苏', '北京', '广东', '四川'].map(p => (
                    <Option key={p} value={p}>{p}</Option>
                ))}
              </Select>
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
    </>
  );
}
