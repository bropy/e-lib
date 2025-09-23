'use client';

import { create } from 'zustand';

export interface Comment {
  id: string;
  bookKey: string;
  author: string;
  text: string;
  createdAt: string;
}

interface BookStore {
  // Simple liked books array instead of Set
  likedBooks: string[];
  comments: Comment[];
  
  // Actions
  toggleLike: (bookKey: string) => void;
  isLiked: (bookKey: string) => boolean;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getCommentsForBook: (bookKey: string) => Comment[];
}

// Simple Zustand store without persistence complexity
export const useBookStore = create<BookStore>((set, get) => ({
  likedBooks: [],
  comments: [],
  
  toggleLike: (bookKey: string) => {
    set((state) => ({
      likedBooks: state.likedBooks.includes(bookKey)
        ? state.likedBooks.filter(id => id !== bookKey)
        : [...state.likedBooks, bookKey]
    }));
  },
  
  isLiked: (bookKey: string) => {
    return get().likedBooks.includes(bookKey);
  },
  
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    set((state) => ({
      comments: [
        ...state.comments,
        {
          ...comment,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },
  
  getCommentsForBook: (bookKey: string) => {
    return get().comments.filter(comment => comment.bookKey === bookKey);
  },
}));
