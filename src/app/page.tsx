import { type FC } from 'react'
import { HomeModule } from './modules'

// Enable dynamic rendering for real-time updates
export const dynamic = 'force-dynamic'

// interface
interface IProps {
  params: Promise<{ locale: string }>
}

// component
const Page: FC<Readonly<IProps>> = async () => {
  // For real-time updates, we skip server-side prefetching
  // and let the client handle all data fetching
  return <HomeModule />
}

export default Page
