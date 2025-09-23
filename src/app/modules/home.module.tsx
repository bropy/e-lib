'use client'
import { type FC } from 'react'
import { Card, CardBody, Chip } from '@heroui/react'
import ContainerComponent from '../shared/ui/container.component'
import BookSearch from '../components/book-search.component'
import PopularBooks from '../components/popular-books.component'
import { useBookStore } from '../store/book-store'

//component
const HomeModule: FC = () => {
  const { likedBooks, comments } = useBookStore()
  
  // return
  return (
    <ContainerComponent className='w-full space-y-12 pb-[72px]'>
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            📚 E-Library Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing books with server-side caching, client-side state management, and real-time interactions
          </p>
        </div>
        
        {/* Demo Stats */}
        <Card className="max-w-md mx-auto">
          <CardBody>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{likedBooks.length}</div>
                <div className="text-sm text-gray-500">Liked Books</div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{comments.length}</div>
                <div className="text-sm text-gray-500">Comments</div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tech Stack Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Chip color="primary" variant="flat">⚡ Next.js 15</Chip>
          <Chip color="secondary" variant="flat">🗄️ TanStack Query</Chip>
          <Chip color="success" variant="flat">🐻 Zustand</Chip>
          <Chip color="warning" variant="flat">📝 React Hook Form</Chip>
          <Chip color="danger" variant="flat">🎨 HeroUI</Chip>
        </div>
      </div>

      <BookSearch />
      <PopularBooks />
    </ContainerComponent>
  )
}

export default HomeModule
