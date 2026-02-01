import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Radio, Row, Col, Card, Divider } from 'antd';
import { IFormData } from '@/types';

const { Option } = Select;
const { TextArea } = Input;

export default function BaseFormSections() {
  return (
    <>
      <Card title="基本信息 (Profile)" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name={['profile', 'name']} label="姓名" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['profile', 'gender']} label="性别">
              <Select>
                <Option value="男">男</Option>
                <Option value="女">女</Option>
                <Option value="其他/未说明">其他/未说明</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['profile', 'ethnicity']} label="民族">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['profile', 'birthDate']} label="出生日期">
              <Input placeholder="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['profile', 'heightCm']} label="身高(cm)">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['profile', 'weightKg']} label="体重(kg)">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['profile', 'studentPhone']} label="学生电话" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['profile', 'idNumber']} label="身份证号" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['profile', 'examCandidateNumber']} label="考生号" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['profile', 'candidateType']} label="考生类型">
              <Select>
                <Option value="普通">普通</Option>
                <Option value="艺">艺</Option>
                <Option value="体">体</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['profile', 'schoolClassTeacher']} label="学校及班主任">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['profile', 'referrer']} label="推荐人">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name={['profile', 'address']} label="通讯地址">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="left">家庭信息</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name={['profile', 'parents', 'fatherName']} label="父亲姓名">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['profile', 'parents', 'motherName']} label="母亲姓名">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['profile', 'parents', 'parentsOccupation']} label="父母职业">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="体检信息 (Health)" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name={['health', 'physicalStatusNormal']} label="身体状况正常" valuePropName="checked">
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item name={['health', 'medicalConclusion']} label="体检结论">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="视力情况" style={{ marginBottom: 0 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item name={['health', 'myopia', 'has']} label="近视" valuePropName="checked" noStyle>
                    <Radio.Group>
                      <Radio value={true}>是</Radio>
                      <Radio value={false}>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item name={['health', 'myopia', 'leftDegree']} label="左眼度数">
                    <Input placeholder="如 4.8" />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item name={['health', 'myopia', 'rightDegree']} label="右眼度数">
                    <Input placeholder="如 5.0" />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name={['health', 'leftHanded']} label="左撇子" valuePropName="checked">
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name={['health', 'colorBlind']} label="色盲" valuePropName="checked">
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name={['health', 'colorWeak']} label="色弱" valuePropName="checked">
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name={['health', 'monochromeIncomplete']} label="单色不全" valuePropName="checked">
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name={['health', 'hepatitisB']} label="乙肝" valuePropName="checked">
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name={['health', 'limbDisability']} label="肢体残疾" valuePropName="checked">
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['health', 'heartHistory']} label="心脏病史">
              <Select>
                <Option value="有">有</Option>
                <Option value="无">无</Option>
                <Option value="不详">不详</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="高考成绩 (Exam)" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name={['exam', 'totalScore']} label="总分" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['exam', 'rankPosition']} label="位次" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['exam', 'oralEnglish']} label="英语口语">
              <Select>
                <Option value="合格">合格</Option>
                <Option value="不合格">不合格</Option>
                <Option value="未参加">未参加</Option>
                <Option value="不详">不详</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
             <Divider orientation="left" style={{ marginTop: 0 }}>单科成绩</Divider>
          </Col>
          {['chinese', 'math', 'english', 'physics', 'chemistry', 'biology', 'history', 'politics', 'geography'].map((sub) => (
            <Col span={4} key={sub}>
              <Form.Item name={['exam', 'subjectScores', sub]} label={
                {
                  chinese: '语文', math: '数学', english: '英语',
                  physics: '物理', chemistry: '化学', biology: '生物',
                  history: '历史', politics: '政治', geography: '地理'
                }[sub]
              }>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          ))}
          <Col span={24}>
            <Form.Item name={['exam', 'advantageSubjects']} label="优势学科">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="报考意向 (Preference)" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name={['preference', 'intendedProvinces']} label="意向省份">
              <Select mode="tags" placeholder="输入省份后回车" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={['preference', 'schoolOwnership']} label="院校性质">
              <Select>
                <Option value="公办">公办</Option>
                <Option value="民办">民办</Option>
                <Option value="港澳台合作">港澳台合作</Option>
                <Option value="中外合作">中外合作</Option>
                <Option value="其他/不详">其他/不详</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={['preference', 'tuitionRange']} label="学费范围">
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
          <Col span={8}>
            <Form.Item name={['preference', 'hukou']} label="户口性质">
              <Select>
                <Option value="城市">城市</Option>
                <Option value="农村">农村</Option>
                <Option value="不详">不详</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['preference', 'postGradIntent']} label="考研意向" valuePropName="checked">
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['preference', 'employmentIntent']} label="就业意向" valuePropName="checked">
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name={['preference', 'otherOptionsNote']} label="其他要求">
              <TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </>
  );
}
