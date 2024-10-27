'use client'

import fire from '@/api'
import ArticleDialog from '@/components/app/article-dialog'
import { Button } from '@/components/catalyst/button'
import { useAuth } from '@/contexts/auth'
import { PlusIcon } from '@heroicons/react/20/solid'
import { useCallback, useState } from 'react'

export default function Newsletters() {
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false)
  const [articleUrl, setArticleUrl] = useState('')
  const [articleTitle, setArticleTitle] = useState('')

  const { publicKeyBuffer, privateKeyBuffer, app } = useAuth()

  const handleFire = useCallback(async () => {
    setIsArticleDialogOpen(false)
    if (!articleUrl || !articleTitle) return
    if (!app || !publicKeyBuffer || !privateKeyBuffer)
      throw new Error('Auth context missing')

    const encodedUrl = encodeURIComponent(articleUrl)

    const res = await fetch(process.env.NEXT_PUBLIC_MARKDOWN_API! + encodedUrl)
    const markdownText = await res.text()
    console.log(markdownText)
    const markdown = markdownText.split('#')[0]

    const article = {
      title: articleTitle,
      content: markdown,
      href: articleUrl,
    }

    await fire(publicKeyBuffer, privateKeyBuffer, app, article)
  }, [setIsArticleDialogOpen, articleUrl, articleTitle])

  return (
    <main>
      <div className="flex justify-between items-start">
        <h1 className="font-semibold text-2xl">Newsletters</h1>
        <Button outline onClick={() => {}}>
          <PlusIcon />
          New
        </Button>
      </div>

      <ArticleDialog
        isOpen={isArticleDialogOpen}
        setIsOpen={setIsArticleDialogOpen}
        articleUrl={articleUrl}
        setArticleUrl={setArticleUrl}
        articleTitle={articleTitle}
        setArticleTitle={setArticleTitle}
        onSubmit={handleFire}
      />

      <div className="mt-4 p-8 border border-zinc-950/10 dark:border-white/10 rounded-lg">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <p className="text-xl font-semibold">Monthly Roundup</p>
            <p className="text-sm mt-1">
              Monthly newsletter containing user delegation details, governance
              results and a custom article.
            </p>
          </div>
          <div className="flex flex-col w-full space-y-2">
            <Button
              color="dark/white"
              onClick={() => setIsArticleDialogOpen(true)}
            >
              Fire Now
            </Button>
            <Button outline>Delete</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="border p-4 border-zinc-950/10 dark:border-white/10 rounded-lg">
            <p className="font-medium text-sm">Signed up users</p>
            <p className="text-2xl font-semibold mt-2">2</p>
          </div>
          <div className="border p-4 border-zinc-950/10 dark:border-white/10 rounded-lg">
            <p className="font-medium text-sm">Frequency</p>
            <p className="text-2xl font-semibold mt-2">Monthly</p>
          </div>
        </div>
      </div>
    </main>
  )
}
