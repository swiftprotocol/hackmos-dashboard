import { Button } from '@/components/catalyst/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/catalyst/dialog'
import { Field, Label } from '@/components/catalyst/fieldset'
import { Input } from '@/components/catalyst/input'

export default function ArticleDialog({
  isOpen,
  setIsOpen,
  articleUrl,
  setArticleUrl,
  articleTitle,
  setArticleTitle,
  onSubmit,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  articleUrl: string
  setArticleUrl: (url: string) => void
  articleTitle: string
  setArticleTitle: (title: string) => void
  onSubmit: () => void
}) {
  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <DialogTitle>Attach an article</DialogTitle>
      <DialogDescription>
        Insert a URL to an article written in Markdown on any site (blog,
        Medium, Substack) to attach it directly to this newsletter.
      </DialogDescription>
      <DialogBody>
        <Field>
          <Label>Article Title</Label>
          <Input
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.currentTarget.value)}
            name="article-title"
            placeholder="Title of your article"
          />
        </Field>
        <Field className="!mt-4">
          <Label>Article URL</Label>
          <Input
            value={articleUrl}
            onChange={(e) => setArticleUrl(e.currentTarget.value)}
            name="article-url"
            placeholder="https://..."
          />
        </Field>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Attach</Button>
      </DialogActions>
    </Dialog>
  )
}
