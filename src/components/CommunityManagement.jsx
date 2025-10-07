import React, { useState, useEffect } from 'react';
import {
  Modal,
  Tabs,
  List,
  Avatar,
  Button,
  Space,
  Typography,
  Tag,
  message,
  Popconfirm,
  Input,
  Select,
  Form,
  Card,
  Divider,
  Empty
} from 'antd';
import {
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
  UserAddOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined
} from '@ant-design/icons';
import ApiClient from '../services/apiClient';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const CommunityManagement = ({ visible, onClose, communityId, communityName }) => {
  const [loading, setLoading] = useState(false);
  const [managementData, setManagementData] = useState(null);
  const [searchMembers, setSearchMembers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [inviteForm] = Form.useForm();

  useEffect(() => {
    if (visible && communityId) {
      loadManagementData();
    }
  }, [visible, communityId]);

  const loadManagementData = async () => {
    try {
      setLoading(true);
      const response = await ApiClient.getCommunityManagementData(communityId);
      if (response?.data) {
        setManagementData(response.data);
      }
    } catch (error) {
      console.error('Failed to load management data:', error);
      message.error('Failed to load community management data');
    } finally {
      setLoading(false);
    }
  };

  const searchAllMembers = async (query) => {
    if (!query) {
      setSearchMembers([]);
      return;
    }

    try {
      setSearchLoading(true);
      // This would typically search all church members
      // For now, we'll use a placeholder
      const response = await ApiClient.searchMembers(query);
      if (response?.data) {
        setSearchMembers(response.data);
      }
    } catch (error) {
      console.error('Failed to search members:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleApproveRequest = async (memberId) => {
    try {
      const response = await ApiClient.approveJoinRequest(communityId, memberId);
      if (response?.success) {
        message.success(response.message);
        loadManagementData();
      }
    } catch (error) {
      console.error('Failed to approve request:', error);
      message.error('Failed to approve join request');
    }
  };

  const handleRejectRequest = async (memberId) => {
    try {
      const response = await ApiClient.rejectJoinRequest(communityId, memberId);
      if (response?.success) {
        message.success(response.message);
        loadManagementData();
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      message.error('Failed to reject join request');
    }
  };

  const handleRemoveInvitation = async (memberId) => {
    try {
      const response = await ApiClient.removeInvitation(communityId, memberId);
      if (response?.success) {
        message.success('Invitation removed successfully');
        loadManagementData();
      }
    } catch (error) {
      console.error('Failed to remove invitation:', error);
      message.error('Failed to remove invitation');
    }
  };

  const handleInviteMembers = async () => {
    if (selectedMembers.length === 0) {
      message.warning('Please select members to invite');
      return;
    }

    try {
      const response = await ApiClient.inviteMultipleMembersToCommunity(communityId, selectedMembers);
      if (response?.success) {
        message.success(response.message);
        setSelectedMembers([]);
        setSearchMembers([]);
        inviteForm.resetFields();
        loadManagementData();
      }
    } catch (error) {
      console.error('Failed to invite members:', error);
      message.error('Failed to invite members');
    }
  };

  const JoinRequestsTab = () => (
    <div style={{ padding: '16px' }}>
      {managementData?.joinRequests?.length > 0 ? (
        <List
          dataSource={managementData.joinRequests}
          renderItem={member => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleApproveRequest(member.id)}
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                  Approve
                </Button>,
                <Popconfirm
                  title="Are you sure you want to reject this request?"
                  onConfirm={() => handleRejectRequest(member.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="default"
                    icon={<CloseOutlined />}
                    danger
                  >
                    Reject
                  </Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={member.avatar} icon={<UserOutlined />} />}
                title={member.name}
                description={member.email}
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No pending join requests" />
      )}
    </div>
  );

  const InvitedMembersTab = () => (
    <div style={{ padding: '16px' }}>
      {managementData?.invitedMembers?.length > 0 ? (
        <List
          dataSource={managementData.invitedMembers}
          renderItem={member => (
            <List.Item
              actions={[
                <Popconfirm
                  title="Are you sure you want to remove this invitation?"
                  onConfirm={() => handleRemoveInvitation(member.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="default"
                    icon={<DeleteOutlined />}
                    danger
                  >
                    Remove
                  </Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={member.avatar} icon={<UserOutlined />} />}
                title={member.name}
                description={
                  <Space>
                    <MailOutlined />
                    <Text type="secondary">{member.email}</Text>
                    <Tag color="orange">Invitation Pending</Tag>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No pending invitations" />
      )}
    </div>
  );

  const InviteMembersTab = () => (
    <div style={{ padding: '16px' }}>
      <Form form={inviteForm} layout="vertical">
        <Form.Item label="Search Members">
          <Search
            placeholder="Search by name or email..."
            onSearch={searchAllMembers}
            loading={searchLoading}
            style={{ marginBottom: 16 }}
          />
        </Form.Item>

        {searchMembers.length > 0 && (
          <Form.Item label="Select Members to Invite">
            <Select
              mode="multiple"
              placeholder="Select members to invite"
              value={selectedMembers}
              onChange={setSelectedMembers}
              style={{ width: '100%' }}
              optionLabelProp="label"
            >
              {searchMembers.map(member => (
                <Option 
                  key={member.id} 
                  value={member.id}
                  label={member.name}
                >
                  <Space>
                    <Avatar src={member.avatar} icon={<UserOutlined />} size="small" />
                    <span>{member.name}</span>
                    <Text type="secondary">({member.email})</Text>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleInviteMembers}
            disabled={selectedMembers.length === 0}
            style={{ width: '100%' }}
          >
            Send Invitations ({selectedMembers.length} selected)
          </Button>
        </Form.Item>
      </Form>

      <Divider />
      
      <Title level={5}>How Invitations Work</Title>
      <Text type="secondary">
        • Invited members will see this community in their available communities list
        <br />
        • They will have an "Accept Invitation" button to join directly
        <br />
        • Invitations can be removed at any time before they're accepted
      </Text>
    </div>
  );

  const CurrentMembersTab = () => (
    <div style={{ padding: '16px' }}>
      <List
        dataSource={managementData?.currentMembers || []}
        renderItem={member => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={member.avatar} icon={<UserOutlined />} />}
              title={member.name}
              description={member.email}
            />
            <Tag color="blue">Member</Tag>
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Modal
      title={`Manage ${communityName}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      bodyStyle={{ padding: 0 }}
    >
      <Tabs
        defaultActiveKey="requests"
        items={[
          {
            key: 'requests',
            label: (
              <Space>
                <CloseOutlined />
                Join Requests
                {managementData?.joinRequests?.length > 0 && (
                  <Tag color="orange">{managementData.joinRequests.length}</Tag>
                )}
              </Space>
            ),
            children: <JoinRequestsTab />
          },
          {
            key: 'invited',
            label: (
              <Space>
                <MailOutlined />
                Invited Members
                {managementData?.invitedMembers?.length > 0 && (
                  <Tag color="blue">{managementData.invitedMembers.length}</Tag>
                )}
              </Space>
            ),
            children: <InvitedMembersTab />
          },
          {
            key: 'invite',
            label: (
              <Space>
                <UserAddOutlined />
                Invite Members
              </Space>
            ),
            children: <InviteMembersTab />
          },
          {
            key: 'members',
            label: (
              <Space>
                <UserOutlined />
                Current Members
                <Tag color="green">{managementData?.currentMembers?.length || 0}</Tag>
              </Space>
            ),
            children: <CurrentMembersTab />
          }
        ]}
      />
    </Modal>
  );
};

export default CommunityManagement;