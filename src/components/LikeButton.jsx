import React, { useState } from 'react';
import { Button, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

/**
 * Reusable Like Button Component
 * 
 * Props:
 * - likes: Number of likes (default: 0)
 * - isLiked: Boolean indicating if current user has liked
 * - onLike: Async function to handle like/unlike (targetId) => Promise<{likes, isLiked}>
 * - targetId: ID of the target item
 * - showText: Show "Like/Liked" text (default: true)
 * - size: Button size ('small', 'middle', 'large')
 * - type: Button type (default: 'text')
 */
const LikeButton = ({
  likes = 0,
  isLiked = false,
  onLike,
  targetId,
  showText = true,
  size = 'middle',
  type = 'text',
  style = {}
}) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [liked, setLiked] = useState(isLiked);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleLike = async () => {
    if (!user) {
      message.warning('Please sign in to like');
      return;
    }

    setLoading(true);
    try {
      const result = await onLike(targetId);
      
      // Update local state
      if (result) {
        setLikeCount(result.likes || likeCount);
        setLiked(result.isLiked !== undefined ? result.isLiked : !liked);
      } else {
        // Fallback: toggle optimistically
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error('Failed to like:', error);
      message.error('Failed to update like status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      type={type}
      size={size}
      icon={liked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
      onClick={handleLike}
      loading={loading}
      style={style}
    >
      {showText ? (
        `${likeCount} ${liked ? 'Liked' : 'Like'}`
      ) : (
        likeCount
      )}
    </Button>
  );
};

export default LikeButton;
