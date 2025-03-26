'use client'

import Spinner from '@/components/app/spinner'
import { Heading } from '@/components/catalyst/heading'
import { Text } from '@/components/catalyst/text'
import { useAuth } from '@/contexts/auth'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => resolve(event.target?.result)
    reader.onerror = (error) => reject(error)
    reader.readAsText(file)
  })
}

export default function Login() {
  const { importPemKey, loading, app } = useAuth()
  const router = useRouter()
  const [localLoading, setLocalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (app) {
      router.push('/dashboard')
    }
  }, [app, router])

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return
    setLocalLoading(true)
    setError(null)
    
    try {
      const data = await readFile(event.target.files[0])
      
      if (typeof data !== 'string' || !data.includes('PRIVATE KEY')) {
        setError('The selected file does not appear to be a valid PEM key. Please try another file or use the development login.')
        setLocalLoading(false)
        return
      }
      
      const app = await importPemKey(data as string)
      
      if (app) {
        router.push('/dashboard')
      } else {
        setError('Invalid PEM key or unregistered app. Contact support for more information.')
      }
    } catch (err) {
      console.error('Error importing PEM key:', err)
      setError('An error occurred while processing your key. In development mode, use the "Development Login" button instead.')
    } finally {
      setLocalLoading(false)
    }
  }
  
  // For development mode, add a quick login button
  const handleDevLogin = async () => {
    try {
      setLocalLoading(true)
      setError(null)
      const app = await importPemKey('MOCK_PEM_KEY')
      if (app) {
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Error with dev login:', err)
      setError('Development login failed. Check console for errors.')
    } finally {
      setLocalLoading(false)
    }
  }

  const isLoading = loading || localLoading

  return (
    <main className="flex justify-center items-center w-screen h-screen overflow-hidden">
      <div className="border border-zinc-950/10 dark:border-white/10 rounded-xl py-16 px-8">
        <div className="flex justify-center items-center flex-col">
          <Image
            src="/logo.svg"
            width={337}
            height={232}
            className="h-12 w-auto"
            alt="Swift Protocol"
          />
          <Heading level={1} className="mt-8">
            Log In
          </Heading>
          <Text className="mt-4 max-w-xs text-center leading-none">
            Use your organization PEM key to log into the Swift dashboard.
          </Text>
          
          {error && (
            <div className="mt-4 text-red-600 text-sm max-w-xs text-center p-2 bg-red-50 dark:bg-red-900/30 rounded">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="mt-6 flex items-center justify-center flex-col">
              <Spinner className="w-6 h-6 text-black dark:text-white" />
              <span className="mt-2 text-sm text-gray-500">Loading dashboard...</span>
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center">
              <label className="mb-2 text-sm text-gray-600 dark:text-gray-300">Upload your PEM key file:</label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".pem"
                className="mx-auto mb-6"
                onChange={handleFileChange}
              />
              
              <div className="w-full border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                <p className="text-xs text-center text-gray-500 mb-3">
                  For demonstration purposes only:
                </p>
                <button
                  onClick={handleDevLogin}
                  className="w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-md text-sm font-medium transition-colors"
                >
                  Development Mode (Skip Authentication)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
