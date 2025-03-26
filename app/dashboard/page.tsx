'use client'

import UserTable, { User } from '@/components/app/user-table'
import { Divider } from '@/components/catalyst/divider'
import { useAuth } from '@/contexts/auth'
import React, { useEffect, useState, ReactNode } from 'react'

interface ChangeData {
  value: number
  positive: boolean
}

interface StatProps {
  title: string
  value: string
  change?: ChangeData
  period?: string
}

interface MetricCardProps {
  title: string
  value: string
  chart?: ReactNode
}

interface StatsData {
  totalUsers: string
  notificationsSent: string
  newslettersSent: string
  conversionRate: string
  newsletterUsers: string
  pushUsers: string
  smsUsers: string
  dataStorageUsers: string
}

function Greeting(): JSX.Element {
  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 18
        ? 'Good afternoon'
        : 'Good evening'

  const { app } = useAuth()
  const name = app?.name || 'John'

  return <h1 className="font-semibold text-2xl">{greeting}, {name}</h1>
}

function Stat({ 
  title, 
  value, 
  change, 
  period = "from last week" 
}: StatProps): JSX.Element {
  return (
    <div className="pr-6">
      <p className="font-medium text-sm">{title}</p>
      <p className="text-4xl font-semibold mt-1">{value}</p>
      {change && (
        <div className="flex items-center mt-1">
          <span className={`inline-flex items-center ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
            {change.positive ? '↑' : '↓'} 
            {change.positive ? '+' : ''}{change.value}%
          </span>
          <span className="text-gray-500 text-sm ml-1">{period}</span>
        </div>
      )}
    </div>
  )
}

function MetricCard({ title, value, chart }: MetricCardProps): JSX.Element {
  return (
    <div className="bg-white dark:bg-zinc-950 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-800">
      <div>
        <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
        <p className="text-3xl font-semibold mt-1">{value}</p>
      </div>
      {chart && <div className="mt-4">{chart}</div>}
    </div>
  )
}

function LineChart(): JSX.Element {
  // This would be replaced with an actual chart implementation
  return (
    <div className="h-20 w-full bg-blue-50 dark:bg-blue-950 rounded flex items-end">
      <div className="h-4 w-2 bg-blue-500 rounded mx-0.5"></div>
      <div className="h-8 w-2 bg-blue-500 rounded mx-0.5"></div>
      <div className="h-6 w-2 bg-blue-500 rounded mx-0.5"></div>
      <div className="h-12 w-2 bg-blue-500 rounded mx-0.5"></div>
      <div className="h-8 w-2 bg-blue-500 rounded mx-0.5"></div>
      <div className="h-10 w-2 bg-blue-500 rounded mx-0.5"></div>
      <div className="h-14 w-2 bg-blue-500 rounded mx-0.5"></div>
      <div className="h-16 w-2 bg-blue-500 rounded mx-0.5"></div>
      <div className="h-12 w-2 bg-blue-500 rounded mx-0.5"></div>
      <div className="h-18 w-2 bg-blue-500 rounded mx-0.5"></div>
    </div>
  )
}

function BarChart(): JSX.Element {
  return (
    <div className="flex items-end h-32 gap-2">
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full bg-blue-500 h-[92%] rounded"></div>
        <span className="text-xs mt-1">92%</span>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full bg-purple-500 h-[55%] rounded"></div>
        <span className="text-xs mt-1">55%</span>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full bg-green-500 h-[30%] rounded"></div>
        <span className="text-xs mt-1">30%</span>
      </div>
    </div>
  )
}

function ConversionMetrics(): JSX.Element {
  return (
    <div className="bg-white dark:bg-zinc-950 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-800">
      <h3 className="text-sm text-gray-500 font-medium">Newsletter conversion rate</h3>
      <p className="text-3xl font-semibold mt-1">30%</p>
      
      <div className="mt-4">
        <BarChart />
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm">Received newsletter</span>
          </div>
          <span className="font-medium">92%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-sm">Opened newsletter</span>
          </div>
          <span className="font-medium">55%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Clicked through CTA</span>
          </div>
          <span className="font-medium">30%</span>
        </div>
      </div>
    </div>
  )
}

function DataStorageStatus(): JSX.Element {
  return (
    <div className="mt-6 bg-white dark:bg-zinc-950 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="flex items-center mb-2">
        <span className="font-medium">Data Storage</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Data storage is not enabled for your app. Contact us to add it to your organization's plan.</p>
      <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded text-sm font-medium transition-colors">Get in touch</button>
    </div>
  )
}

// Add an ErrorBoundary component
function ErrorFallback({error}: {error: Error}) {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900 rounded-md text-red-800 dark:text-red-200 my-4">
      <h2 className="text-lg font-semibold">Something went wrong:</h2>
      <p className="mt-2">{error.message}</p>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { app, signMessage, publicKeyHex } = useAuth()
  const [users, setUsers] = useState<User[] | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [dashboardError, setDashboardError] = useState<Error | null>(null)
  const [stats, setStats] = useState<StatsData>({
    totalUsers: '1,458',
    notificationsSent: '12,604',
    newslettersSent: '506',
    conversionRate: '30%',
    newsletterUsers: '890',
    pushUsers: '402',
    smsUsers: '110',
    dataStorageUsers: '0'
  })

  useEffect(() => {
    async function fetchUsers() {
      if (!app || !publicKeyHex || !signMessage) return
      
      try {
        if (!process.env.NEXT_PUBLIC_SWIFT_API) {
          console.warn('Swift API URL is missing from environment variables. Using mock data.')
          return
        }
        
        const signature = await signMessage(app.id.toString())
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SWIFT_API}/notify/auth/all`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              pubkey: publicKeyHex,
              signature,
            }),
          }
        )
        
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        
        const data = await res.json()
        setUsers(data.authorizations)
      } catch (error) {
        console.error('Error fetching users:', error)
        setError('Failed to load user data. Using mock data instead.')
      }
    }
    
    try {
      fetchUsers()
    } catch (err) {
      console.error('Error in fetchUsers:', err)
      setDashboardError(err instanceof Error ? err : new Error('Unknown error'))
    }
  }, [app, publicKeyHex, signMessage])

  // If there's a critical error, show the error fallback
  if (dashboardError) {
    return <ErrorFallback error={dashboardError} />;
  }

  return (
    <div className="max-w-full">
      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <Greeting />

      <div className="flex items-center justify-between mt-8">
        <h2 className="font-semibold">Overview</h2>
        <select className="text-sm rounded-md border border-gray-300 dark:border-gray-700 px-2 py-1 bg-white dark:bg-zinc-900">
          <option>Last week</option>
          <option>Last month</option>
          <option>Last quarter</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Stat 
          title="Total users" 
          value={stats?.totalUsers || '0'} 
          change={{ value: 4.5, positive: true }}
        />
        <Stat 
          title="Notifications sent" 
          value={stats?.notificationsSent || '0'}
          change={{ value: 20, positive: true }}
        />
        <Stat 
          title="Newsletters sent" 
          value={stats?.newslettersSent || '0'}
          change={{ value: 2.8, positive: false }}
        />
        <Stat 
          title="Newsletter conversion rate" 
          value={stats?.conversionRate || '0%'}
          change={{ value: 10, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <ConversionMetrics />
        
        <div className="bg-white dark:bg-zinc-950 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-800">
          <h3 className="text-sm text-gray-500 font-medium">Total users</h3>
          <p className="text-3xl font-semibold mt-1">{stats?.totalUsers || '0'}</p>
          <div className="mt-4">
            <LineChart />
          </div>
        </div>

        <div className="space-y-4">
          <MetricCard 
            title="Newsletter users" 
            value={stats?.newsletterUsers || '0'} 
            chart={<LineChart />}
          />
          <MetricCard 
            title="Push users" 
            value={stats?.pushUsers || '0'} 
            chart={<LineChart />}
          />
          <MetricCard 
            title="SMS users" 
            value={stats?.smsUsers || '0'} 
            chart={<LineChart />}
          />
        </div>
      </div>

      <DataStorageStatus />

      <h2 className="mt-8 font-semibold">Users</h2>
      <div className="mt-2">
        <UserTable />
      </div>
    </div>
  )
} 