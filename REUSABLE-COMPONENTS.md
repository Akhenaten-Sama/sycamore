# Reusable Comment and Like Components

## Overview
This project now includes reusable `CommentSection` and `LikeButton` components that can be used across the application to provide consistent comment and like functionality.

## CommentSection Component

### Features
- ✅ Automatic refresh every 3 seconds (configurable)
- ✅ Silent updates - new comments appear without disrupting UI
- ✅ Built-in form validation
- ✅ Dark mode support
- ✅ Loading states
- ✅ Error handling

### Usage

```jsx
import CommentSection from './components/CommentSection';
import ApiClient from './services/apiClient';

<CommentSection
  targetId={item.id}
  targetType="media" // 'media', 'blog', 'devotional', 'community_post'
  getComments={ApiClient.getMediaComments.bind(ApiClient)}
  addComment={ApiClient.addMediaComment.bind(ApiClient)}
  autoRefresh={true}
  refreshInterval={3000}
  showTitle={true}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `targetId` | string | required | ID of the target item |
| `targetType` | string | 'media' | Type of target ('media', 'blog', 'devotional', 'community_post') |
| `getComments` | function | required | Async function to fetch comments: `(targetId) => Promise<{comments: []}>` |
| `addComment` | function | required | Async function to add comment: `(targetId, {content}) => Promise<comment>` |
| `autoRefresh` | boolean | true | Enable automatic refresh |
| `refreshInterval` | number | 3000 | Refresh interval in milliseconds |
| `showTitle` | boolean | true | Show the "Comments (N)" title |

### Auto-Refresh Behavior
- Initial load is **not silent** (shows loading spinner)
- Subsequent refreshes are **silent** (no loading spinner)
- Only updates UI when new comments are detected
- Maintains scroll position during silent updates
- Automatically cleans up interval on unmount

## LikeButton Component

### Features
- ✅ Optimistic updates
- ✅ Authentication checks
- ✅ Loading states
- ✅ Customizable appearance

### Usage

```jsx
import LikeButton from './components/LikeButton';

<LikeButton
  likes={item.likes}
  isLiked={item.isLiked}
  onLike={handleLike}
  targetId={item.id}
  showText={true}
  size="middle"
  type="text"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `likes` | number | 0 | Number of likes |
| `isLiked` | boolean | false | Whether current user has liked |
| `onLike` | function | required | Async function: `(targetId) => Promise<{likes, isLiked}>` |
| `targetId` | string | required | ID of the target item |
| `showText` | boolean | true | Show "Like/Liked" text |
| `size` | string | 'middle' | Button size ('small', 'middle', 'large') |
| `type` | string | 'text' | Button type |
| `style` | object | {} | Custom styles |

## API Client Requirements

### Comment API Methods
Your API client should implement these methods:

```javascript
// Fetch comments
async getMediaComments(mediaId) {
  return this.request(`/mobile/media/${mediaId}/comments`);
}

// Add comment
async addMediaComment(mediaId, commentData) {
  return this.request(`/mobile/media/${mediaId}/comments`, {
    method: 'POST',
    body: JSON.stringify(commentData)
  });
}
```

**Expected response format:**
```json
{
  "comments": [
    {
      "id": "123",
      "content": "Great content!",
      "author": "John Doe",
      "avatar": "https://...",
      "timestamp": "2026-01-04T10:30:00.000Z"
    }
  ]
}
```

### Like API Methods
```javascript
async likeMedia(mediaId) {
  const response = await this.request(`/mobile/media/${mediaId}/like`, {
    method: 'POST'
  });
  return response;
}
```

**Expected response format:**
```json
{
  "liked": true,
  "likeCount": 42
}
```

## Migration Guide

### Before (Old Code)
```jsx
const [comments, setComments] = useState([]);
const [commentForm] = Form.useForm();

const loadComments = async () => {
  const response = await ApiClient.getMediaComments(mediaId);
  setComments(response.comments);
};

const handleComment = async (values) => {
  await ApiClient.addMediaComment(mediaId, values);
  await loadComments(); // Manual refresh
};

// JSX
<Form form={commentForm} onFinish={handleComment}>
  <Form.Item name="comment">
    <TextArea placeholder="Comment..." />
  </Form.Item>
  <Button htmlType="submit">Post</Button>
</Form>
<List dataSource={comments} renderItem={...} />
```

### After (New Code)
```jsx
// Remove all the comment state and handlers!
// Just use:
<CommentSection
  targetId={mediaId}
  targetType="media"
  getComments={ApiClient.getMediaComments.bind(ApiClient)}
  addComment={ApiClient.addMediaComment.bind(ApiClient)}
/>
```

## Components Using Reusable Components

### Updated Components
- ✅ `MediaGallery.jsx` - Uses `CommentSection` and `LikeButton`
- ✅ `Devotionals.jsx` - Uses `CommentSection` and `LikeButton`

### Components to Migrate (Future)
- ⏳ `BlogPage.jsx`
- ⏳ `CommunityDetailsPage.jsx`
- ⏳ Any other components with comments/likes

## Benefits

1. **Reduced Code Duplication** - Write once, use everywhere
2. **Consistent UX** - Same behavior across all pages
3. **Auto-Refresh** - New comments appear automatically
4. **Better Maintainability** - Fix bugs in one place
5. **Dark Mode Support** - Built-in theme awareness
6. **Error Handling** - Consistent error messages
7. **Performance** - Optimized re-renders

## Technical Details

### Auto-Refresh Implementation
```javascript
useEffect(() => {
  if (autoRefresh && targetId) {
    intervalRef.current = setInterval(() => {
      loadComments(true); // silent = true
    }, refreshInterval);

    return () => clearInterval(intervalRef.current);
  }
}, [autoRefresh, targetId, refreshInterval]);
```

### Silent Update Logic
```javascript
if (silent) {
  // Only update if there are NEW comments
  if (newComments.length > lastCommentCountRef.current) {
    setComments(newComments);
    lastCommentCountRef.current = newComments.length;
  }
} else {
  // Always update on explicit refresh
  setComments(newComments);
  lastCommentCountRef.current = newComments.length;
}
```

## Notes

- The `bind(ApiClient)` is necessary to preserve the `this` context when passing methods as props
- For devotionals, you may need to wrap the `addComment` function to add extra fields like `userId` and `devotionalId`
- Auto-refresh can be disabled by setting `autoRefresh={false}`
- Refresh interval can be adjusted (e.g., `refreshInterval={5000}` for 5 seconds)
