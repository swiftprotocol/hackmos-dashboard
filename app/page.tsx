'use client'

import Spinner from '@/components/app/spinner'
import { Heading } from '@/components/catalyst/heading'
import { Text } from '@/components/catalyst/text'
import { useAuth } from '@/contexts/auth'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => resolve(event.target?.result)
    reader.onerror = (error) => reject(error)
    reader.readAsText(file)
  })
}

export default function Login() {
  const { importPemKey } = useAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return
    setIsLoading(true)
    const data = await readFile(event.target.files[0])
    const app = await importPemKey(data as string)
    setIsLoading(false)
    if (app) router.push('/dashboard')
    else
      alert(
        'Invalid PEM key or unregistered app. Contact support for more information.'
      )
  }

  return (
    <main className="flex justify-center items-center w-screen h-screen overflow-hidden">
      <div className="border border-zinc-950/10 dark:border-white/10 rounded-xl py-16 px-4">
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
          {isLoading ? (
            <Spinner className="w-6 mt-6 h-6 text-black dark:text-white" />
          ) : (
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept=".pem"
              className="mt-6 mx-auto"
              onChange={handleFileChange}
            />
          )}
        </div>
      </div>
    </main>
  )
}
