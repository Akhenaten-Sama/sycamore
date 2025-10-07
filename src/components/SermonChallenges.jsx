import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Typography,
  Radio,
  Checkbox,
  Input,
  Form,
  message,
  Space,
  Progress,
  Alert,
  Divider,
  Tag,
  Row,
  Col,
  Empty
} from 'antd';
import {
  QuestionCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  SendOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../styles/colors';
import ApiClient from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const SermonChallenges = ({ eventId, challenges = [] }) => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const currentChallenge = challenges[currentQuestionIndex];
  const totalQuestions = challenges.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitChallenges();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitChallenges = async () => {
    try {
      setLoading(true);
      
      const submissionData = {
        eventId,
        memberId: user.memberId || user.id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
          timestamp: new Date().toISOString()
        })),
        timeSpent,
        completedAt: new Date().toISOString()
      };

      const response = await ApiClient.submitSermonChallenge(submissionData);
      
      if (response?.success) {
        message.success('Sermon challenge completed successfully!');
        setCompleted(true);
      }
    } catch (error) {
      console.error('Error submitting sermon challenge:', error);
      message.error('Failed to submit answers');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (challenges.length === 0) {
    return (
      <Card style={{ margin: '16px 0' }}>
        <Empty 
          image={<BulbOutlined style={{ fontSize: 48, color: colors.textSecondary }} />}
          description="No sermon challenges available for this event"
        />
      </Card>
    );
  }

  if (completed) {
    return (
      <Card 
        style={{ 
          margin: '16px 0',
          background: `linear-gradient(135deg, ${colors.success}20, ${colors.primary}20)`,
          border: `1px solid ${colors.success}`
        }}
      >
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <TrophyOutlined style={{ fontSize: 64, color: colors.success, marginBottom: 16 }} />
          <Title level={3} style={{ color: colors.success, marginBottom: 8 }}>
            Challenge Completed!
          </Title>
          <Text style={{ color: colors.textSecondary }}>
            You've successfully completed the sermon challenge in {formatTime(timeSpent)}
          </Text>
          <div style={{ marginTop: 16 }}>
            <Tag color="success">
              {totalQuestions} questions answered
            </Tag>
            <Tag color="blue">
              Time: {formatTime(timeSpent)}
            </Tag>
          </div>
        </div>
      </Card>
    );
  }

  if (!currentChallenge) {
    return null;
  }

  return (
    <Card
      style={{
        margin: '16px 0',
        borderRadius: '12px',
        border: `1px solid ${colors.primary}`,
        background: colors.cardBackground
      }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <QuestionCircleOutlined style={{ color: colors.primary }} />
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>
              Sermon Challenge
            </Text>
          </Space>
          <Space>
            <ClockCircleOutlined style={{ color: colors.textSecondary }} />
            <Text style={{ color: colors.textSecondary }}>
              {formatTime(timeSpent)}
            </Text>
          </Space>
        </div>
      }
    >
      {/* Progress Bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: colors.textSecondary }}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            {Math.round(progress)}% Complete
          </Text>
        </div>
        <Progress 
          percent={progress} 
          strokeColor={colors.primary}
          trailColor={`${colors.primary}20`}
          showInfo={false}
        />
      </div>

      {/* Question */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ color: colors.textPrimary, marginBottom: 16 }}>
          {currentChallenge.question}
        </Title>

        {/* Answer Options */}
        {currentChallenge.type === 'multiple_choice' && (
          <Radio.Group
            value={answers[currentChallenge._id]}
            onChange={(e) => handleAnswer(currentChallenge._id, e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {currentChallenge.options?.map((option, index) => (
                <Radio key={index} value={option} style={{ color: colors.textPrimary }}>
                  {option}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}

        {currentChallenge.type === 'text' && (
          <TextArea
            value={answers[currentChallenge._id] || ''}
            onChange={(e) => handleAnswer(currentChallenge._id, e.target.value)}
            placeholder="Enter your answer here..."
            rows={4}
            style={{ backgroundColor: colors.inputBackground }}
          />
        )}

        {currentChallenge.type === 'true_false' && (
          <Radio.Group
            value={answers[currentChallenge._id]}
            onChange={(e) => handleAnswer(currentChallenge._id, e.target.value)}
          >
            <Space direction="vertical">
              <Radio value={true} style={{ color: colors.textPrimary }}>True</Radio>
              <Radio value={false} style={{ color: colors.textPrimary }}>False</Radio>
            </Space>
          </Radio.Group>
        )}
      </div>

      {/* Hint */}
      {currentChallenge.hint && (
        <Alert
          message="Hint"
          description={currentChallenge.hint}
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          style={{ visibility: currentQuestionIndex === 0 ? 'hidden' : 'visible' }}
        >
          Previous
        </Button>

        <Text style={{ color: colors.textSecondary }}>
          {Object.keys(answers).length} of {totalQuestions} answered
        </Text>

        <Button
          type="primary"
          onClick={nextQuestion}
          disabled={!answers[currentChallenge._id]}
          loading={loading}
          icon={currentQuestionIndex === totalQuestions - 1 ? <SendOutlined /> : undefined}
          style={{
            backgroundColor: colors.primary,
            borderColor: colors.primary
          }}
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </Card>
  );
};

export default SermonChallenges;