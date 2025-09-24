import { GrowthBook } from '@growthbook/growthbook-react'

import { identify } from '@/lib/identify'

let growthbookInstance: GrowthBook | null = null

const getGrowthBookInstance = async (): Promise<GrowthBook> => {
  if (growthbookInstance) {
    return growthbookInstance
  }

  const userContext = identify()

  growthbookInstance = new GrowthBook({
    apiHost: 'https://cdn.growthbook.io',
    clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY || 'dev_key_placeholder',
    enableDevMode: process.env.NODE_ENV === 'development',
    attributes: userContext,
    trackingCallback: (_experiment, _result) => {},
  })

  try {
    await growthbookInstance.loadFeatures()
  } catch (_error) {
    // Features will use defaults
  }

  return growthbookInstance
}

export const showBookSearchFlag = async (): Promise<boolean> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      const devOverride = localStorage.getItem('dev_show_book_search')
      if (devOverride !== null) {
        return devOverride === 'true'
      }
    }

    const growthbook = await getGrowthBookInstance()
    await growthbook.refreshFeatures()
    const result = growthbook.getFeatureValue('show-book-search', false)
    return result
  } catch (_error) {
    return false
  }
}

export const setDevOverride = (flagKey: string, value: boolean | null) => {
  if (process.env.NODE_ENV === 'development') {
    if (value === null) {
      localStorage.removeItem(`dev_${flagKey.replace('-', '_')}`)
    } else {
      localStorage.setItem(`dev_${flagKey.replace('-', '_')}`, String(value))
    }
  }
}

export const featureFlags = {
  showBookSearch: showBookSearchFlag,
} as const
