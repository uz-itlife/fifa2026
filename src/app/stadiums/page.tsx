'use client'
import dynamic from 'next/dynamic'

const StadiumsClient = dynamic(() => import('./_client'), { ssr: false })

export default function StadiumsPage() {
  return <StadiumsClient />
}
