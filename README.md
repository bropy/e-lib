# 📚 E-Library Demo

A modern e-library demo showcasing **server-side caching**, **client-side state management**, and **real-time interactions**.

## ✨ Features

- 🔍 **Real-time Search** - Search books by title with debounced input
- ❤️ **Like Books** - Simple Zustand state management for likes
- 💬 **Comments** - Add comments using React Hook Form
- 📦 **Server Caching** - Popular books cached with Next.js ISR
- 💾 **Client Caching** - Book details cached with TanStack Query
- 🎨 **Modern UI** - Beautiful interface with HeroUI components

## 🚀 Tech Stack

- **⚡ Next.js 15** - App Router with SSR/ISR
- **🗄️ TanStack Query** - Server state management & caching
- **🐻 Zustand** - Simple client state management
- **📝 React Hook Form** - Form validation & handling
- **🎨 HeroUI** - Modern React component library
- **🔗 Open Library API** - Real book data

## 🎯 Demo Features

### Server-Side Caching (SSR/ISR)
- Popular books are fetched server-side
- Cached for 1 hour with automatic revalidation
- Visual indicators show cache status

### Client-Side Caching
- Book details cached in browser
- Instant navigation between visited books
- Cache indicators show data freshness

### Simple State Management
- Like books (stored in Zustand)
- Add comments (stored in Zustand)
- Real-time counter updates

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## 📖 How to Test

1. **Server Caching**: 
   - Refresh the page - popular books load instantly from cache
   - Notice the "📦 Server Cached" indicator

2. **Client Caching**:
   - Click on any book to view details
   - Go back and click the same book - loads instantly
   - Notice the "💾 Client Cached" indicator

3. **State Management**:
   - Like books and see the counter update
   - Add comments and see them persist
   - Navigate between pages - state is maintained

## 🎨 Design Features

- Responsive grid layouts
- Smooth hover animations
- Gradient backgrounds
- Visual cache indicators
- Loading skeletons
- Error handling

## 📁 Project Structure

```
src/app/
├── components/          # Reusable UI components
├── store/              # Zustand state management
├── services/           # API services
├── book/[slug]/        # Dynamic book pages
└── modules/            # Page modules
```

This demo showcases modern React patterns with optimal caching strategies!