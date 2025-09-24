'use client'
import { type FC, useEffect, useState } from 'react'
import { Card, CardBody } from '@heroui/react'
import ContainerComponent from '../shared/ui/container.component'
import BookSearch from '../components/book-search.component'
import PopularBooks from '../components/popular-books.component'
import { useBookStore } from '../store/book-store'
import { showBookSearchFlag } from '@/flags'

//component
const HomeModule: FC = () => {
  const { likedBooks, comments } = useBookStore()
  const [showBookSearch, setShowBookSearch] = useState(false)

  useEffect(() => {
    const loadFeatureFlag = async () => {
      try {
        const enabled = await showBookSearchFlag()
        setShowBookSearch(enabled)
      } catch (error) {
        console.warn('Failed to load feature flag:', error)
        setShowBookSearch(false)
      }
    }

    loadFeatureFlag()

    const handleFocus = () => {
      loadFeatureFlag()
    }

    const interval = setInterval(loadFeatureFlag, 30000)

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [])
  
  // return
  return (
    <ContainerComponent className='w-full space-y-12 pb-[72px]'>
      <div className="text-center space-y-6 py-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            📚 E-Library
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your next great read from our extensive digital collection
          </p>
        </div>
        
        {(likedBooks.length > 0 || comments.length > 0) && (
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
        )}
      </div>

      <PopularBooks />
      
      {showBookSearch && <BookSearch />}
    </ContainerComponent>
  )
}

export default HomeModule
