// Bible API Service using Bible-API.com (free) and other APIs
class BibleService {
  constructor() {
    // Primary API: Bible-API.com (free, no auth required)
    this.primaryAPI = 'https://bible-api.com';
    
    // Backup API: API.Bible (requires free API key)
    this.backupAPI = 'https://api.scripture.api.bible/v1';
    this.apiKey = import.meta.env.VITE_BIBLE_API_KEY || '';
    
    // ESV API (requires free API key)
    this.esvAPI = 'https://api.esv.org/v3';
    this.esvApiKey = import.meta.env.VITE_ESV_API_KEY || '';
  }

  // Get verse(s) using Bible-API.com
  async getVerse(reference) {
    try {
      const response = await fetch(`${this.primaryAPI}/${encodeURIComponent(reference)}`);
      if (!response.ok) throw new Error('Failed to fetch verse');
      
      const data = await response.json();
      return {
        success: true,
        data: {
          reference: data.reference,
          verses: data.verses?.map(v => ({
            book: v.book_name,
            chapter: v.chapter,
            verse: v.verse,
            text: v.text
          })) || [],
          text: data.text
        }
      };
    } catch (error) {
      console.error('Error fetching verse:', error);
      return { success: false, error: error.message };
    }
  }

  // Get full chapter
  async getChapter(book, chapter) {
    try {
      const reference = `${book} ${chapter}`;
      const response = await fetch(`${this.primaryAPI}/${encodeURIComponent(reference)}`);
      if (!response.ok) throw new Error('Failed to fetch chapter');
      
      const data = await response.json();
      return {
        success: true,
        data: {
          reference: data.reference,
          verses: data.verses?.map(v => ({
            number: v.verse,
            text: v.text.trim()
          })) || []
        }
      };
    } catch (error) {
      console.error('Error fetching chapter:', error);
      return { success: false, error: error.message };
    }
  }

  // Search verses (limited functionality with free API)
  async searchVerses(query) {
    try {
      // For demo, search through common verses
      const commonVerses = [
        { reference: 'John 3:16', text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
        { reference: 'Romans 8:28', text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
        { reference: 'Philippians 4:13', text: 'I can do all this through him who gives me strength.' },
        { reference: 'Psalm 23:1', text: 'The Lord is my shepherd, I lack nothing.' },
        { reference: 'Jeremiah 29:11', text: 'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future.' },
        { reference: 'Matthew 28:19', text: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,' },
        { reference: 'Romans 6:23', text: 'For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.' },
        { reference: 'Ephesians 2:8-9', text: 'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God— not by works, so that no one can boast.' },
        { reference: '1 John 1:9', text: 'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.' },
        { reference: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.' }
      ];

      const results = commonVerses.filter(verse =>
        verse.text.toLowerCase().includes(query.toLowerCase()) ||
        verse.reference.toLowerCase().includes(query.toLowerCase())
      );

      // Also try to fetch specific reference if it looks like one
      if (query.match(/\w+\s+\d+:\d+/)) {
        try {
          const verseResult = await this.getVerse(query);
          if (verseResult.success && verseResult.data.verses) {
            results.unshift(...verseResult.data.verses.map(v => ({
              reference: `${v.book} ${v.chapter}:${v.verse}`,
              text: v.text
            })));
          }
        } catch (error) {
          console.log('Could not fetch specific reference');
        }
      }

      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('Error searching verses:', error);
      return { success: false, error: error.message };
    }
  }

  // Get verse of the day
  async getVerseOfTheDay() {
    try {
      // Rotate through popular verses based on day of year
      const verses = [
        'John 3:16',
        'Romans 8:28',
        'Philippians 4:13',
        'Psalm 23:1',
        'Jeremiah 29:11',
        'Matthew 28:19',
        'Romans 6:23',
        'Ephesians 2:8-9',
        '1 John 1:9',
        'Proverbs 3:5-6'
      ];

      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      const verseIndex = dayOfYear % verses.length;
      const todayVerse = verses[verseIndex];

      return await this.getVerse(todayVerse);
    } catch (error) {
      console.error('Error getting verse of the day:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Get available books
  getBooks() {
    return [
      // Old Testament
      { value: 'genesis', label: 'Genesis', chapters: 50, testament: 'old' },
      { value: 'exodus', label: 'Exodus', chapters: 40, testament: 'old' },
      { value: 'leviticus', label: 'Leviticus', chapters: 27, testament: 'old' },
      { value: 'numbers', label: 'Numbers', chapters: 36, testament: 'old' },
      { value: 'deuteronomy', label: 'Deuteronomy', chapters: 34, testament: 'old' },
      { value: 'joshua', label: 'Joshua', chapters: 24, testament: 'old' },
      { value: 'judges', label: 'Judges', chapters: 21, testament: 'old' },
      { value: 'ruth', label: 'Ruth', chapters: 4, testament: 'old' },
      { value: '1samuel', label: '1 Samuel', chapters: 31, testament: 'old' },
      { value: '2samuel', label: '2 Samuel', chapters: 24, testament: 'old' },
      { value: '1kings', label: '1 Kings', chapters: 22, testament: 'old' },
      { value: '2kings', label: '2 Kings', chapters: 25, testament: 'old' },
      { value: '1chronicles', label: '1 Chronicles', chapters: 29, testament: 'old' },
      { value: '2chronicles', label: '2 Chronicles', chapters: 36, testament: 'old' },
      { value: 'ezra', label: 'Ezra', chapters: 10, testament: 'old' },
      { value: 'nehemiah', label: 'Nehemiah', chapters: 13, testament: 'old' },
      { value: 'esther', label: 'Esther', chapters: 10, testament: 'old' },
      { value: 'job', label: 'Job', chapters: 42, testament: 'old' },
      { value: 'psalms', label: 'Psalms', chapters: 150, testament: 'old' },
      { value: 'proverbs', label: 'Proverbs', chapters: 31, testament: 'old' },
      { value: 'ecclesiastes', label: 'Ecclesiastes', chapters: 12, testament: 'old' },
      { value: 'song-of-solomon', label: 'Song of Solomon', chapters: 8, testament: 'old' },
      { value: 'isaiah', label: 'Isaiah', chapters: 66, testament: 'old' },
      { value: 'jeremiah', label: 'Jeremiah', chapters: 52, testament: 'old' },
      { value: 'lamentations', label: 'Lamentations', chapters: 5, testament: 'old' },
      { value: 'ezekiel', label: 'Ezekiel', chapters: 48, testament: 'old' },
      { value: 'daniel', label: 'Daniel', chapters: 12, testament: 'old' },
      { value: 'hosea', label: 'Hosea', chapters: 14, testament: 'old' },
      { value: 'joel', label: 'Joel', chapters: 3, testament: 'old' },
      { value: 'amos', label: 'Amos', chapters: 9, testament: 'old' },
      { value: 'obadiah', label: 'Obadiah', chapters: 1, testament: 'old' },
      { value: 'jonah', label: 'Jonah', chapters: 4, testament: 'old' },
      { value: 'micah', label: 'Micah', chapters: 7, testament: 'old' },
      { value: 'nahum', label: 'Nahum', chapters: 3, testament: 'old' },
      { value: 'habakkuk', label: 'Habakkuk', chapters: 3, testament: 'old' },
      { value: 'zephaniah', label: 'Zephaniah', chapters: 3, testament: 'old' },
      { value: 'haggai', label: 'Haggai', chapters: 2, testament: 'old' },
      { value: 'zechariah', label: 'Zechariah', chapters: 14, testament: 'old' },
      { value: 'malachi', label: 'Malachi', chapters: 4, testament: 'old' },
      
      // New Testament
      { value: 'matthew', label: 'Matthew', chapters: 28, testament: 'new' },
      { value: 'mark', label: 'Mark', chapters: 16, testament: 'new' },
      { value: 'luke', label: 'Luke', chapters: 24, testament: 'new' },
      { value: 'john', label: 'John', chapters: 21, testament: 'new' },
      { value: 'acts', label: 'Acts', chapters: 28, testament: 'new' },
      { value: 'romans', label: 'Romans', chapters: 16, testament: 'new' },
      { value: '1corinthians', label: '1 Corinthians', chapters: 16, testament: 'new' },
      { value: '2corinthians', label: '2 Corinthians', chapters: 13, testament: 'new' },
      { value: 'galatians', label: 'Galatians', chapters: 6, testament: 'new' },
      { value: 'ephesians', label: 'Ephesians', chapters: 6, testament: 'new' },
      { value: 'philippians', label: 'Philippians', chapters: 4, testament: 'new' },
      { value: 'colossians', label: 'Colossians', chapters: 4, testament: 'new' },
      { value: '1thessalonians', label: '1 Thessalonians', chapters: 5, testament: 'new' },
      { value: '2thessalonians', label: '2 Thessalonians', chapters: 3, testament: 'new' },
      { value: '1timothy', label: '1 Timothy', chapters: 6, testament: 'new' },
      { value: '2timothy', label: '2 Timothy', chapters: 4, testament: 'new' },
      { value: 'titus', label: 'Titus', chapters: 3, testament: 'new' },
      { value: 'philemon', label: 'Philemon', chapters: 1, testament: 'new' },
      { value: 'hebrews', label: 'Hebrews', chapters: 13, testament: 'new' },
      { value: 'james', label: 'James', chapters: 5, testament: 'new' },
      { value: '1peter', label: '1 Peter', chapters: 5, testament: 'new' },
      { value: '2peter', label: '2 Peter', chapters: 3, testament: 'new' },
      { value: '1john', label: '1 John', chapters: 5, testament: 'new' },
      { value: '2john', label: '2 John', chapters: 1, testament: 'new' },
      { value: '3john', label: '3 John', chapters: 1, testament: 'new' },
      { value: 'jude', label: 'Jude', chapters: 1, testament: 'new' },
      { value: 'revelation', label: 'Revelation', chapters: 22, testament: 'new' }
    ];
  }
}

export default new BibleService();
