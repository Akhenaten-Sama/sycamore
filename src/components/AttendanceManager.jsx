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
      console.log('Loading children for memberId:', memberId);
      const response = await ApiClient.getChildren(memberId);
      console.log('Children response:', response);
      
      if (response?.success && response.data) {
        setChildren(response.data);
      } else if (Array.isArray(response)) {
        // Fallback for direct array response
        setChildren(response);
      } else {
        setChildren([]);
      }
    } catch (error) {
      console.error('Error loading children:', error);
      setChildren([]);
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
        if (response.isDuplicate) {
          message.warning('This child is already registered!');
        } else {
          message.success('Child registered successfully!');
        }
        addChildForm.resetFields();
        setAddChildModalVisible(false);
        await loadChildren(); // Reload children list
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
                          <div>
                            <Text strong>{child.firstName} {child.lastName}</Text>
                            {child.class && (
                              <Tag color="blue" style={{ marginLeft: 8 }}>
                                {child.class.charAt(0).toUpperCase() + child.class.slice(1)}
                              </Tag>
                            )}
                          </div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {dayjs().diff(dayjs(child.dateOfBirth), 'year')} years old
                            {child.barcodeId && ` • ID: ${child.barcodeId}`}
                          </Text>
                          {child.allergies && (
                            <div>
                              <Text type="danger" style={{ fontSize: 11 }}>
                                ⚠️ Allergies: {child.allergies}
                              </Text>
                            </div>
                          )}
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
        title="Register Child for Junior Church"
        open={addChildModalVisible}
        onCancel={() => setAddChildModalVisible(false)}
        footer={null}
        width={700}
      >
        <Alert
          message="Complete Junior Church Registration"
          description="This will register your child for the Junior Church system with full check-in/check-out capabilities."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Form
          form={addChildForm}
          layout="vertical"
          onFinish={handleAddChild}
        >
          <Divider orientation="left">Child Information</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="Child's first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Child's last name" />
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

          <Divider orientation="left">Emergency Contact</Divider>
          <Alert
            message="Emergency contact information is required for Junior Church registration"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['emergencyContact', 'name']}
                label="Emergency Contact Name"
                rules={[{ required: true, message: 'Required' }]}
                initialValue={`${user?.firstName || ''} ${user?.lastName || ''}`}
              >
                <Input placeholder="Full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['emergencyContact', 'phone']}
                label="Emergency Contact Phone"
                rules={[
                  { required: true, message: 'Required' },
                  { pattern: /^[+]?[\d\s()-]+$/, message: 'Invalid phone number' }
                ]}
                initialValue={user?.phone || ''}
              >
                <Input placeholder="+1234567890" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={['emergencyContact', 'relationship']}
            label="Relationship to Child"
            rules={[{ required: true, message: 'Required' }]}
            initialValue="parent"
          >
            <Select>
              <Option value="parent">Parent</Option>
              <Option value="father">Father</Option>
              <Option value="mother">Mother</Option>
              <Option value="guardian">Guardian</Option>
              <Option value="grandparent">Grandparent</Option>
              <Option value="aunt">Aunt</Option>
              <Option value="uncle">Uncle</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Divider orientation="left">Medical Information</Divider>
          
          <Form.Item
            name="allergies"
            label="Allergies"
            extra="List any food or environmental allergies (e.g., Peanuts, Shellfish, Bee stings)"
          >
            <Input placeholder="None or list allergies separated by commas" />
          </Form.Item>

          <Form.Item
            name="specialNeeds"
            label="Medical Notes / Special Needs"
            extra="Include any medications, medical conditions, or special requirements"
          >
            <Input.TextArea rows={3} placeholder="Any important medical information or special needs" />
          </Form.Item>

          <Alert
            message="Pickup Authorization"
            description="A unique barcode ID will be generated for secure check-in/check-out. You (as parent/guardian) will be automatically authorized for pickup."
            type="success"
            showIcon
            style={{ marginTop: 16, marginBottom: 16 }}
          />

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setAddChildModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} icon={<PlusOutlined />}>
                Register Child
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AttendanceManager;