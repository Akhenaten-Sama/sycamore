import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Checkbox,
  message,
  Typography,
  Space,
  Avatar,
  Tag,
  Alert,
  Divider,
  Row,
  Col,
  Empty
} from 'antd';
import {
  UserAddOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import ApiClient from '../services/apiClient';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const AttendanceManager = ({ visible, onClose, event }) => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addChildModalVisible, setAddChildModalVisible] = useState(false);
  const [addChildForm] = Form.useForm();

  useEffect(() => {
    if (visible && user) {
      loadChildren();
    }
  }, [visible, user]);

  const loadChildren = async () => {
    try {
      const memberId = user.memberId || user.id;
      const response = await ApiClient.getChildren(memberId);
      if (response) {
        setChildren(response);
      }
    } catch (error) {
      console.error('Error loading children:', error);
    }
  };

  const handleAddChild = async (values) => {
    try {
      setLoading(true);
      const memberId = user.memberId || user.id;
      const childData = {
        ...values,
        parentId: memberId,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD')
      };

      const response = await ApiClient.addChild(childData);
      if (response?.success) {
        message.success('Child added successfully!');
        addChildForm.resetFields();
        setAddChildModalVisible(false);
        loadChildren();
      }
    } catch (error) {
      console.error('Error adding child:', error);
      message.error('Failed to add child');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    try {
      setLoading(true);
      const memberId = user.memberId || user.id;
      
      const response = await ApiClient.markAttendance(
        event.id,
        memberId,
        selectedChildren
      );

      if (response?.success) {
        message.success(response.data.message);
        onClose();
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      message.error('Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title={`Mark Attendance - ${event?.name}`}
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={markAttendance}
            icon={<CheckOutlined />}
          >
            Mark Attendance
          </Button>
        ]}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <Alert
            message="Self Check-in"
            description={`You are checking in for "${event?.name}" on ${dayjs(event?.date).format('MMMM D, YYYY')}`}
            type="info"
            showIcon
          />
        </div>

        <Divider>Your Attendance</Divider>
        <div style={{ marginBottom: 24 }}>
          <Checkbox checked disabled>
            <Space>
              <Avatar src={user?.profilePicture} icon={<UserAddOutlined />} />
              <Text strong>{user?.firstName} {user?.lastName}</Text>
              <Tag color="blue">You</Tag>
            </Space>
          </Checkbox>
        </div>

        {children.length > 0 && (
          <>
            <Divider>Children/Wards</Divider>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Select children/wards to check in:</Text>
            </div>
            <Checkbox.Group
              value={selectedChildren}
              onChange={setSelectedChildren}
              style={{ width: '100%' }}
            >
              <Row gutter={[0, 8]}>
                {children.map(child => (
                  <Col span={24} key={child._id}>
                    <Checkbox value={child._id}>
                      <Space>
                        <Avatar icon={<UserAddOutlined />} />
                        <div>
                          <Text strong>{child.firstName} {child.lastName}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {dayjs().diff(dayjs(child.dateOfBirth), 'year')} years old
                          </Text>
                        </div>
                      </Space>
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </>
        )}

        <Divider />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => setAddChildModalVisible(true)}
          block
        >
          Add Child/Ward
        </Button>
      </Modal>

      <Modal
        title="Add Child/Ward"
        open={addChildModalVisible}
        onCancel={() => setAddChildModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={addChildForm}
          layout="vertical"
          onFinish={handleAddChild}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[{ required: true, message: 'Please select date of birth' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="Select date of birth" />
          </Form.Item>

          <Form.Item
            name="relationship"
            label="Relationship"
            initialValue="child"
          >
            <Select>
              <Option value="child">Child</Option>
              <Option value="ward">Ward</Option>
              <Option value="dependent">Dependent</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="specialNeeds"
            label="Special Needs (Optional)"
          >
            <Input.TextArea rows={2} placeholder="Any special needs or requirements" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => setAddChildModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Add Child/Ward
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AttendanceManager;