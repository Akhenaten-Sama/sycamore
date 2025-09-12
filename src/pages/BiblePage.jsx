import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Input, 
  Select, 
  Button, 
  Space, 
  Divider, 
  List,
  Tag,
  message,
  Spin,
  Empty,
  Tabs,
  Modal,
  Form
} from 'antd';
import { 
  SearchOutlined, 
  BookOutlined, 
  HeartOutlined,
  HeartFilled,
  CopyOutlined,
  ShareAltOutlined,
  StarOutlined,
  StarFilled
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import BibleService from '../services/bibleService';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const BiblePage = () => {
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState('john');
  const [selectedChapter, setSelectedChapter] = useState(3);
  const [verses, setVerses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [dailyVerse, setDailyVerse] = useState(null);
  const [bibleBooks, setBibleBooks] = useState([]);

  useEffect(() => {
    loadFavorites();
    loadDailyVerse();
    setBibleBooks(BibleService.getBooks());
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem(`bibleFavorites_${user?.id || 'guest'}`);
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const loadDailyVerse = async () => {
    try {
      const result = await BibleService.getVerseOfTheDay();
      if (result.success && result.data) {
        setDailyVerse({
          reference: result.data.reference,
          text: result.data.text || (result.data.verses && result.data.verses[0]?.text)
        });
      }
    } catch (error) {
      console.error('Error loading daily verse:', error);
      // Fallback
      setDailyVerse({
        reference: "Jeremiah 29:11",
        text: '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future."'
      });
    }
  };

  const saveFavorites = (newFavorites) => {
    localStorage.setItem(`bibleFavorites_${user?.id || 'guest'}`, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const toggleFavorite = (verse) => {
    const verseId = `${selectedBook}-${selectedChapter}-${verse.number}`;
    const existingIndex = favorites.findIndex(fav => fav.id === verseId);
    
    if (existingIndex >= 0) {
      const newFavorites = favorites.filter(fav => fav.id !== verseId);
      saveFavorites(newFavorites);
      message.success('Removed from favorites');
    } else {
      const newFavorite = {
        id: verseId,
        reference: `${bibleBooks.find(b => b.value === selectedBook)?.label} ${selectedChapter}:${verse.number}`,
        text: verse.text,
        dateAdded: new Date().toISOString()
      };
      saveFavorites([...favorites, newFavorite]);
      message.success('Added to favorites');
    }
  };

  const isFavorite = (verse) => {
    const verseId = `${selectedBook}-${selectedChapter}-${verse.number}`;
    return favorites.some(fav => fav.id === verseId);
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchMode(false);
      return;
    }

    setLoading(true);
    setSearchMode(true);

    try {
      const result = await BibleService.searchVerses(searchTerm);
      if (result.success) {
        setSearchResults(result.data);
      } else {
        message.error('Failed to search verses');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      message.error('Failed to search verses');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadChapter = async () => {
    setLoading(true);
    
    try {
      const bookData = bibleBooks.find(b => b.value === selectedBook);
      const result = await BibleService.getChapter(bookData?.label || selectedBook, selectedChapter);
      
      if (result.success && result.data?.verses) {
        setVerses(result.data.verses);
      } else {
        message.error('Failed to load chapter');
        setVerses([]);
      }
    } catch (error) {
      console.error('Error loading chapter:', error);
      message.error('Failed to load chapter');
      setVerses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchMode) {
      loadChapter();
    }
  }, [selectedBook, selectedChapter, searchMode]);

  const copyToClipboard = (text, reference) => {
    navigator.clipboard.writeText(`"${text}" - ${reference}`);
    message.success('Copied to clipboard');
  };

  const VerseItem = ({ verse, reference, showReference = true }) => (
    <Card 
      size="small" 
      style={{ marginBottom: 12, borderRadius: '8px' }}
      actions={[
        <Button
          type="text"
          icon={isFavorite(verse) ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
          onClick={() => toggleFavorite(verse)}
        >
          Favorite
        </Button>,
        <Button
          type="text"
          icon={<CopyOutlined />}
          onClick={() => copyToClipboard(verse.text, reference || `${bibleBooks.find(b => b.value === selectedBook)?.label} ${selectedChapter}:${verse.number}`)}
        >
          Copy
        </Button>,
        <Button
          type="text"
          icon={<ShareAltOutlined />}
        >
          Share
        </Button>
      ]}
    >
      <div>
        {showReference && (
          <Text strong style={{ color: '#1890ff', marginBottom: 8, display: 'block' }}>
            {reference || `${bibleBooks.find(b => b.value === selectedBook)?.label} ${selectedChapter}:${verse.number}`}
          </Text>
        )}
        <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
          <Text strong style={{ color: '#1890ff', marginRight: 8 }}>
            {verse.number}
          </Text>
          {verse.text}
        </Paragraph>
      </div>
    </Card>
  );

  const tabItems = [
    {
      key: 'read',
      label: 'Read',
      children: (
        <div>
          {/* Navigation */}
          <Card style={{ marginBottom: 16 }}>
            <Space wrap>
              <Select
                value={selectedBook}
                onChange={setSelectedBook}
                style={{ width: 150 }}
                showSearch
                placeholder="Select Book"
              >
                <Select.OptGroup label="Old Testament">
                  {bibleBooks.filter(book => book.testament === 'old').map(book => (
                    <Option key={book.value} value={book.value}>
                      {book.label}
                    </Option>
                  ))}
                </Select.OptGroup>
                <Select.OptGroup label="New Testament">
                  {bibleBooks.filter(book => book.testament === 'new').map(book => (
                    <Option key={book.value} value={book.value}>
                      {book.label}
                    </Option>
                  ))}
                </Select.OptGroup>
              </Select>

              <Select
                value={selectedChapter}
                onChange={setSelectedChapter}
                style={{ width: 100 }}
              >
                {Array.from({ length: bibleBooks.find(b => b.value === selectedBook)?.chapters || 1 }, (_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    Ch. {i + 1}
                  </Option>
                ))}
              </Select>

              <Button 
                type="primary"
                onClick={loadChapter}
                loading={loading}
              >
                Load Chapter
              </Button>
            </Space>
          </Card>

          {/* Chapter Content */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <div>
              <Title level={3} style={{ marginBottom: 24 }}>
                {bibleBooks.find(b => b.value === selectedBook)?.label} Chapter {selectedChapter}
              </Title>
              
              {verses.map(verse => (
                <VerseItem key={verse.number} verse={verse} showReference={false} />
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'search',
      label: 'Search',
      children: (
        <div>
          <Search
            placeholder="Search for verses, keywords, or references..."
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ marginBottom: 24 }}
          />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Spin size="large" />
            </div>
          ) : searchResults.length > 0 ? (
            <List
              dataSource={searchResults}
              renderItem={(result) => (
                <VerseItem 
                  key={result.reference}
                  verse={{ number: '', text: result.text }}
                  reference={result.reference}
                />
              )}
            />
          ) : searchMode ? (
            <Empty description="No results found" />
          ) : (
            <Card style={{ textAlign: 'center', padding: '50px 0' }}>
              <BookOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
              <Title level={4}>Search the Bible</Title>
              <Text type="secondary">
                Enter keywords, phrases, or verse references to search through the scriptures
              </Text>
            </Card>
          )}
        </div>
      )
    },
    {
      key: 'favorites',
      label: `Favorites (${favorites.length})`,
      children: (
        <div>
          {favorites.length > 0 ? (
            <List
              dataSource={favorites}
              renderItem={(favorite) => (
                <VerseItem 
                  key={favorite.id}
                  verse={{ number: '', text: favorite.text }}
                  reference={favorite.reference}
                />
              )}
            />
          ) : (
            <Empty 
              description="No favorite verses yet"
              style={{ padding: '50px 0' }}
            />
          )}
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '16px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          <BookOutlined /> Bible
        </Title>
        <Text type="secondary">
          Read, search, and study God's Word
        </Text>
      </div>

      {/* Daily Verse */}
      {dailyVerse && (
        <Card 
          style={{ 
            marginBottom: 24,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
          bodyStyle={{ padding: '20px' }}
        >
          <div style={{ textAlign: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Verse of the Day</Text>
            <Title level={4} style={{ color: 'white', margin: '8px 0' }}>
              {dailyVerse.reference}
            </Title>
            <Paragraph style={{ 
              color: 'white', 
              fontSize: '16px', 
              fontStyle: 'italic',
              margin: 0
            }}>
              {dailyVerse.text}
            </Paragraph>
          </div>
        </Card>
      )}

      {/* Main Content */}
      <Card>
        <Tabs items={tabItems} size="large" />
      </Card>
    </div>
  );
};

export default BiblePage;
