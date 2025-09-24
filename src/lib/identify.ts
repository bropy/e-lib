import { nanoid } from 'nanoid'

export const identify = () => {
  let visitorId: string

  if (typeof window !== 'undefined') {
    visitorId = localStorage.getItem('visitor_id') || nanoid()
    localStorage.setItem('visitor_id', visitorId)
  } else {
    visitorId = nanoid()
  }

  return {
    id: visitorId,
    environment: process.env.NODE_ENV || 'development',
    ...(typeof window !== 'undefined' && {
      userAgent: window.navigator.userAgent,
      language: window.navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  }
}
