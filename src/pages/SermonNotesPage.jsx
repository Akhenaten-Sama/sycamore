import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Form, 
  Input, 
  DatePicker, 
  Tag, 
  Space, 
  List, 
  Modal,
  message,
  Tabs,
  Empty,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  BookOutlined,
  CalendarOutlined,
  SearchOutlined,
  SaveOutlined,
  FileTextOutlined,
  SyncOutlined,
  CloudUploadOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../styles/colors';
import ApiClient from '../services/apiClient';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Search } = Input;

const SermonNotesPage = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user?.id) {
      loadSermonNotes();
    }
  }, [user?.id]);

  const loadSermonNotes = async () => {
    if (!user?.id) {
      // If no user, load from localStorage as fallback
      loadLocalNotes();
      return;
    }

    try {
      setLoading(true);
      const response = await ApiClient.getSermonNotes(user.id);
      
      if (response?.success && response.data) {
        console.log('Loaded notes from server:', response.data);
        setNotes(response.data.map(note => ({
          ...note,
          date: note.date ? dayjs(note.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
        })));
      } else {
        console.log('No notes from server, loading local backup');
        loadLocalNotes();
      }
    } catch (error) {
      console.error('Error loading notes from server:', error);
      message.warning('Loading notes from local storage');
      loadLocalNotes();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalNotes = () => {
    try {
      const storageKey = `sermonNotes_${user?.id || 'guest'}`;
      console.log('Loading notes with key:', storageKey);
      const savedNotes = localStorage.getItem(storageKey);
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        console.log('Loaded local notes:', parsedNotes);
        setNotes(parsedNotes);
      } else {
        console.log('No local notes found');
        setNotes([]);
      }
    } catch (error) {
      console.error('Error loading local notes:', error);
      setNotes([]);
    }
  };

  const saveNotesToStorage = (notesToSave) => {
    try {
      const storageKey = `sermonNotes_${user?.id || 'guest'}`;
      console.log('Saving notes with key:', storageKey, notesToSave);
      localStorage.setItem(storageKey, JSON.stringify(notesToSave));
    } catch (error) {
      console.error('Error saving notes:', error);
      message.error('Failed to save notes to storage');
    }
  };

  const handleSaveNote = async (values) => {
    if (!user?.id) {
      message.warning('Please sign in to save notes to the cloud');
      return handleSaveNoteLocal(values);
    }

    try {
      setLoading(true);
      const noteData = {
        userId: user.id,
        title: values.title,
        date: values.date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
        speaker: values.speaker || '',
        scripture: values.scripture || '',
        keyPoints: values.keyPoints || '',
        personalNotes: values.personalNotes || '',
        actionItems: values.actionItems || ''
      };

      let response;
      if (editingNote) {
        response = await ApiClient.updateSermonNote(editingNote.id, noteData);
      } else {
        response = await ApiClient.createSermonNote(noteData);
      }

      if (response?.success && response.data) {
        // Update local state
        let updatedNotes;
        if (editingNote) {
          updatedNotes = notes.map(note => 
            note.id === editingNote.id ? response.data : note
          );
        } else {
          updatedNotes = [response.data, ...notes];
        }

        setNotes(updatedNotes);
        saveNotesToStorage(updatedNotes); // Also save locally as backup
        
        setIsModalVisible(false);
        setEditingNote(null);
        form.resetFields();
        message.success(editingNote ? 'Note updated successfully!' : 'Note saved successfully!');
      } else {
        throw new Error('Failed to save note to server');
      }
    } catch (error) {
      console.error('Error saving note to server:', error);
      message.warning('Saving note locally due to connection issue');
      handleSaveNoteLocal(values);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNoteLocal = (values) => {
    try {
      const noteData = {
        id: editingNote?.id || Date.now().toString(),
        title: values.title,
        date: values.date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
        speaker: values.speaker || '',
        scripture: values.scripture || '',
        keyPoints: values.keyPoints || '',
        personalNotes: values.personalNotes || '',
        actionItems: values.actionItems || '',
        createdAt: editingNote?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let updatedNotes;
      if (editingNote) {
        updatedNotes = notes.map(note => 
          note.id === editingNote.id ? noteData : note
        );
      } else {
        updatedNotes = [noteData, ...notes];
      }

      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      
      setIsModalVisible(false);
      setEditingNote(null);
      form.resetFields();
      message.success(editingNote ? 'Note updated locally!' : 'Note saved locally!');
    } catch (error) {
      console.error('Error saving note locally:', error);
      message.error('Failed to save note');
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    form.setFieldsValue({
      title: note.title,
      date: dayjs(note.date),
      speaker: note.speaker,
      scripture: note.scripture,
      keyPoints: note.keyPoints,
      personalNotes: note.personalNotes,
      actionItems: note.actionItems
    });
    setIsModalVisible(true);
  };

  const handleDeleteNote = (noteId) => {
    Modal.confirm({
      title: 'Delete Note',
      content: 'Are you sure you want to delete this sermon note?',
      onOk: async () => {
        if (!user?.id) {
          // Local delete only
          const updatedNotes = notes.filter(note => note.id !== noteId);
          setNotes(updatedNotes);
          saveNotesToStorage(updatedNotes);
          message.success('Note deleted locally!');
          return;
        }

        try {
          const response = await ApiClient.deleteSermonNote(noteId);
          
          if (response?.success) {
            const updatedNotes = notes.filter(note => note.id !== noteId);
            setNotes(updatedNotes);
            saveNotesToStorage(updatedNotes);
            message.success('Note deleted successfully!');
          } else {
            throw new Error('Failed to delete from server');
          }
        } catch (error) {
          console.error('Error deleting note from server:', error);
          message.warning('Deleting note locally due to connection issue');
          
          const updatedNotes = notes.filter(note => note.id !== noteId);
          setNotes(updatedNotes);
          saveNotesToStorage(updatedNotes);
          message.success('Note deleted locally!');
        }
      }
    });
  };

  const syncNotes = async () => {
    if (!user?.id) {
      message.warning('Please sign in to sync notes');
      return;
    }

    try {
      setSyncing(true);
      await loadSermonNotes();
      message.success('Notes synced successfully!');
    } catch (error) {
      console.error('Error syncing notes:', error);
      message.error('Failed to sync notes');
    } finally {
      setSyncing(false);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.scripture.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const NoteCard = ({ note }) => (
    <Card
      style={{ 
        marginBottom: 16, 
        borderRadius: '12px',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`
      }}
      actions={[
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={() => handleEditNote(note)}
        >
          Edit
        </Button>,
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => handleDeleteNote(note.id)}
        >
          Delete
        </Button>
      ]}
    >
      <Card.Meta
        title={
          <Space>
            <FileTextOutlined style={{ color: colors.text }} />
            <Text strong style={{ color: colors.text }}>{note.title}</Text>
          </Space>
        }
        description={
          <div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <CalendarOutlined style={{ color: isDarkMode ? '#888' : '#666' }} />
                <Text type="secondary" style={{ color: isDarkMode ? '#888' : '#666' }}>{dayjs(note.date).format('MMMM D, YYYY')}</Text>
                <Tag color="#2d7a7a">{note.speaker}</Tag>
              </Space>
              
              {note.scripture && (
                <div>
                  <Text strong style={{ color: colors.text }}>Scripture: </Text>
                  <Text style={{ color: colors.text }}>{note.scripture}</Text>
                </div>
              )}
              
              {note.keyPoints && (
                <div>
                  <Text strong style={{ color: colors.text }}>Key Points:</Text>
                  <Paragraph ellipsis={{ rows: 2 }} style={{ color: isDarkMode ? '#888' : '#666' }}>{note.keyPoints}</Paragraph>
                </div>
              )}
              
              {note.personalNotes && (
                <div>
                  <Text strong style={{ color: colors.text }}>Personal Notes:</Text>
                  <Paragraph ellipsis={{ rows: 2 }} style={{ color: isDarkMode ? '#888' : '#666' }}>{note.personalNotes}</Paragraph>
                </div>
              )}
              
              <Text type="secondary" style={{ fontSize: '12px', color: isDarkMode ? '#888' : '#666' }}>
                Last updated: {dayjs(note.updatedAt).format('MMM D, YYYY h:mm A')}
              </Text>
            </Space>
          </div>
        }
      />
    </Card>
  );

  return (
    <div style={{ padding: '16px', background: colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8, color: colors.text }}>
          <BookOutlined /> Sermon Notes
        </Title>
        <Text type="secondary" style={{ color: isDarkMode ? '#888' : '#666' }}>
          Keep track of your spiritual insights and reflections
        </Text>
      </div>

      {/* Search and Add Button */}
      <div style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Search
            placeholder="Search notes by title, speaker, or scripture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Space>
            {user?.id && (
              <Button 
                icon={syncing ? <SyncOutlined spin /> : <CloudUploadOutlined />}
                onClick={syncNotes}
                loading={syncing}
              >
                Sync
              </Button>
            )}
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingNote(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
              style={{ borderRadius: '8px' }}
            >
              New Note
            </Button>
          </Space>
        </Space>
      </div>

      {/* Notes List */}
      {filteredNotes.length > 0 ? (
        <div>
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <Card style={{ 
          textAlign: 'center', 
          padding: '50px 0',
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e0e0e0'}`
        }}>
          <Empty 
            description={
              searchTerm 
                ? "No notes found matching your search" 
                : "No sermon notes yet"
            }
          />
          {!searchTerm && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
              style={{ marginTop: 16 }}
            >
              Create Your First Note
            </Button>
          )}
        </Card>
      )}

      {/* Add/Edit Note Modal */}
      <Modal
        title={editingNote ? 'Edit Sermon Note' : 'New Sermon Note'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingNote(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
        styles={{
          content: { background: isDarkMode ? '#1a1a1a' : '#ffffff' },
          header: { background: isDarkMode ? '#1a1a1a' : '#ffffff', borderBottom: 'none' }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveNote}
          initialValues={{
            date: dayjs(),
            speaker: 'Pastor John Smith'
          }}
        >
          <Form.Item
            name="title"
            label="Sermon Title"
            rules={[{ required: true, message: 'Please enter the sermon title' }]}
          >
            <Input placeholder="e.g., Faith in Uncertain Times" />
          </Form.Item>

          <Space style={{ width: '100%' }}>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select the date' }]}
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="speaker"
              label="Speaker"
              rules={[{ required: true, message: 'Please enter the speaker name' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Pastor name" />
            </Form.Item>
          </Space>

          <Form.Item
            name="scripture"
            label="Scripture Reference"
          >
            <Input placeholder="e.g., Matthew 6:25-34, Psalm 23" />
          </Form.Item>

          <Form.Item
            name="keyPoints"
            label="Key Points"
          >
            <TextArea 
              rows={4} 
              placeholder="Main points from the sermon..."
            />
          </Form.Item>

          <Form.Item
            name="personalNotes"
            label="Personal Notes & Reflections"
          >
            <TextArea 
              rows={4} 
              placeholder="Your thoughts, insights, and reflections..."
            />
          </Form.Item>

          <Form.Item
            name="actionItems"
            label="Action Items"
          >
            <TextArea 
              rows={3} 
              placeholder="What will you do differently? How will you apply this message?"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SaveOutlined />}
              >
                {editingNote ? 'Update Note' : 'Save Note'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SermonNotesPage;
