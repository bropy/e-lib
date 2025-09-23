import { type FC } from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { HomeModule } from './modules'
import { getQueryClient } from './shared/utils/query-client'
import { popularBooksQueryOptions } from './shared/api/book-queries'

export const dynamic = 'force-static'
export const revalidate = 300 // 5 minutes

interface IProps {
  params: Promise<{ locale: string }>
}

const Page: FC<Readonly<IProps>> = async () => {
  const queryClient = getQueryClient()
  
  await queryClient.prefetchQuery(popularBooksQueryOptions())
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeModule />
    </HydrationBoundary>
  )
}

export default Page
