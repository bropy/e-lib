export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  edition_count?: number;
  subject?: string[];
}

export interface OpenLibraryResponse {
  docs: Book[];
  numFound: number;
  start: number;
}

export const openLibraryService = {
  async getPopularBooks(): Promise<Book[]> {
    try {
      // Array of different search topics to rotate through
      const searchTopics = [
        'fiction',
        'science',
        'history',
        'fantasy',
        'mystery',
        'romance',
        'biography',
        'technology',
        'adventure',
        'classic'
      ];
      
      // Use current time to rotate through different topics every 30 seconds
      const topicIndex = Math.floor(Date.now() / 30000) % searchTopics.length;
      const currentTopic = searchTopics[topicIndex];
      
      console.log(`🔄 Fetching books for topic: ${currentTopic} at ${new Date().toLocaleTimeString()}`);
      
      const response = await fetch(
        `https://openlibrary.org/search.json?subject=${currentTopic}&sort=rating desc&limit=10&fields=key,title,author_name,cover_i,first_publish_year,edition_count,subject`,
        {
          // Remove Next.js caching to allow real-time updates
          cache: 'no-store'
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OpenLibraryResponse = await response.json();
      return data.docs;
    } catch (error) {
      console.error('Error fetching popular books:', error);
      throw error;
    }
  },

  async searchBooks(query: string): Promise<Book[]> {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,cover_i,first_publish_year,edition_count,subject`,
        {
          next: { 
            revalidate: 1800 // Cache for 30 minutes
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OpenLibraryResponse = await response.json();
      return data.docs;
    } catch (error) {
      console.error('Error searching books:', error);
      throw error;
    }
  },

  async getBookByKey(key: string): Promise<Book | null> {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=key:${key}&fields=key,title,author_name,cover_i,first_publish_year,edition_count,subject`,
        {
          next: { 
            revalidate: 86400 // Cache for 24 hours
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OpenLibraryResponse = await response.json();
      return data.docs[0] || null;
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  },

  getCoverImageUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  },

  createSlugFromTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },

  createSlugFromKey(key: string): string {
    return key.replace('/works/', '').replace('/books/', '');
  }
};
