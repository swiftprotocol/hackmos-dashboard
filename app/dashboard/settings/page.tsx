'use client'

import { Divider } from '@/components/catalyst/divider'
import { useAuth } from '@/contexts/auth'
import React, { useState, ChangeEvent } from 'react'

interface TeamMember {
  name: string
  email: string
  role: string
}

interface AppIdSectionProps {
  id: string
}

interface AppNameSectionProps {
  name: string
}

function AppIdSection({ id }: AppIdSectionProps): JSX.Element {
  return (
    <div className="mb-8">
      <h3 className="text-base font-medium">App ID</h3>
      <p className="text-sm text-gray-500 mt-1 mb-2">
        Use this ID to identify your application in authorization lists and to sign requests.{' '}
        <a href="#" className="text-blue-500 hover:text-blue-700">Read docs for more info</a>
      </p>
      <div className="flex items-center gap-4 mt-2">
        <div className="text-3xl font-mono">{id}</div>
      </div>
    </div>
  )
}

function AppNameSection({ name }: AppNameSectionProps): JSX.Element {
  return (
    <div className="mb-8">
      <h3 className="text-base font-medium">App Name</h3>
      <p className="text-sm text-gray-500 mt-1 mb-2">
        This will be used when requesting authorization to send notifications to users.
      </p>
      <div className="flex items-center gap-4 mt-2">
        <input
          type="text"
          value={name}
          className="border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-zinc-900 w-full max-w-md"
          readOnly
        />
      </div>
    </div>
  )
}

function AppLogoSection(): JSX.Element {
  return (
    <div className="mb-8">
      <h3 className="text-base font-medium">App Logo</h3>
      <p className="text-sm text-gray-500 mt-1 mb-2">
        This will be used when requesting authorization to send notifications to users and on your dashboard.
      </p>
      <div className="flex items-center gap-4 mt-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-200 to-orange-500 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 text-white">🦄</div>
          </div>
          <button className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700">
            <span>×</span>
          </button>
        </div>
        <div className="flex gap-2">
          <button className="border border-gray-300 dark:border-gray-700 rounded-md py-1.5 px-3 hover:bg-gray-100 dark:hover:bg-gray-800">
            Upload
          </button>
          <button className="border border-gray-300 dark:border-gray-700 rounded-md py-1.5 px-3 hover:bg-gray-100 dark:hover:bg-gray-800">
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

function ServicesSection(): JSX.Element {
  return (
    <div className="mb-8">
      <h3 className="text-base font-medium mb-4">Services</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center text-blue-600 dark:text-blue-400">
              <span>✉️</span>
            </div>
            <span>Email</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600 inline-block"></span>
              Operational
            </span>
            <button className="text-sm text-red-500 hover:text-red-700">Disable</button>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center text-purple-600 dark:text-purple-400">
              <span>🔔</span>
            </div>
            <span>Push</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600 inline-block"></span>
              Operational
            </span>
            <button className="text-sm text-red-500 hover:text-red-700">Disable</button>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-md flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              <span>📱</span>
            </div>
            <span>SMS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 text-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-600 inline-block"></span>
              Action Required
            </span>
            <button className="text-sm text-blue-500 hover:text-blue-700">View</button>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center text-gray-600 dark:text-gray-400">
              <span>📊</span>
            </div>
            <span>Data Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-600 text-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
              Inactive
            </span>
            <button className="text-sm text-blue-500 hover:text-blue-700">Contact us</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamSection(): JSX.Element {
  const teamMembers: TeamMember[] = [
    { name: 'John Cooper', email: 'john@example.com', role: 'Owner' },
    { name: 'Michael Foster', email: 'michael@example.com', role: 'Admin' },
    { name: 'Dries Vincent', email: 'vincent@example.com', role: 'User' },
    { name: 'Lindsay Walton', email: 'lindsay@example.com', role: 'User' },
    { name: 'Courtney Henry', email: 'courtney@example.com', role: 'User' },
  ]

  const [newMemberEmail, setNewMemberEmail] = useState('')

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMemberEmail(e.target.value)
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Team</h2>
      
      <div className="bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500 font-medium">
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
        </div>
        
        {teamMembers.map((member, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 dark:border-gray-800 items-center">
            <div>{member.name}</div>
            <div>{member.email}</div>
            <div>{member.role}</div>
          </div>
        ))}
        
        <div className="p-4">
          <h3 className="text-base font-medium mb-4">Invite New Team Member</h3>
          <div className="flex gap-2 items-center">
            <input
              type="email"
              value={newMemberEmail}
              onChange={handleEmailChange}
              placeholder="josef@example.com"
              className="border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-zinc-900 flex-1"
            />
            <button className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md py-2 px-4 font-medium">
              Send Invite
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Your new member will receive an email invitation prompting them to create an account. Once the account is created, all organization admins will receive an email to assign apps to the new team member.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Settings(): JSX.Element {
  const { app } = useAuth()
  const [error, setError] = useState<string | null>(null)
  
  if (!app) {
    return (
      <div className="p-4 flex items-center justify-center h-40">
        <span className="text-gray-600">Loading settings...</span>
      </div>
    )
  }
  
  return (
    <div className="max-w-full">
      {error && (
        <div className="bg-red-50 dark:bg-red-900 p-3 rounded-md mb-4 text-red-800 dark:text-red-200">
          {error}
        </div>
      )}
      
      <h1 className="font-semibold text-2xl mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <AppIdSection id={app?.id?.toString() || '12'} />
          <AppNameSection name={app?.name || 'Pegasus'} />
          <AppLogoSection />
          <ServicesSection />
        </div>
        
        <TeamSection />
      </div>
    </div>
  )
} 