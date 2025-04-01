'use client'

import { uploadImageAction } from '@/app/admin/accounts/account-actions/action'
import { cn } from '@/lib/utils'
import BulletList from '@tiptap/extension-bullet-list'
import CodeBlock from '@tiptap/extension-code-block'
import FontFamily from '@tiptap/extension-font-family'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import OrderedList from '@tiptap/extension-ordered-list'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import {
  Content,
  EditorContent,
  EditorContentProps,
  useEditor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { App } from 'antd'
import React from 'react'
import ImageResize from 'tiptap-extension-resize-image'
import TiptapToolbars from './TiptapToolbars'

type TiptapEditorProps = Omit<EditorContentProps, 'editor' | 'ref'> & {
  content?: Content
  onChange?: (content: string) => void
  showToolbar?: boolean
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  showToolbar = true,
  ...rest
}) => {
  const { message } = App.useApp()

  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      ImageResize,
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-3',
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc ml-4',
        },
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      TextStyle.configure({ mergeNestedSpanStyles: true }),
      Underline.configure({
        HTMLAttributes: {
          class: 'underline',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class:
            'bg-[#2E2B29] px-[16px] py-[12px] rounded-[8px] text-[#fff] my-[24px] font-mono',
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: false,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        linkOnPaste: true,
        isAllowedUri: (url, ctx) => {
          try {
            const parsedUrl = url.includes(':')
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`)

            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }

            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === 'string' ? p : p.scheme,
            )

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            const disallowedDomains = [
              'example-phishing.com',
              'malicious-site.net',
            ]
            const domain = parsedUrl.hostname

            if (disallowedDomains.includes(domain)) {
              return false
            }

            return true
          } catch {
            return false
          }
        },
        shouldAutoLink: (url) => {
          try {
            const parsedUrl = url.includes(':')
              ? new URL(url)
              : new URL(`https://${url}`)

            const disallowedDomains = [
              'example-no-autolink.com',
              'another-no-autolink.com',
            ]
            const domain = parsedUrl.hostname

            return !disallowedDomains.includes(domain)
          } catch {
            return false
          }
        },
        HTMLAttributes: {
          target: '_blank',
          class: 'text-[#1677ff] underline font-[500]',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'size-auto',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'w-full h-auto',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          'min-h-[150px] p-[8px] border-x border-b rounded-b-[12px] focus:outline-hidden',
          {
            '!min-h-[180px] border-t rounded-t-[12px]': !showToolbar,
          },
        ),
      },
    },
    onPaste: async (e) => {
      e.preventDefault()

      const file = e.clipboardData?.files[0]

      if (!file) return

      const maxSize = 2 * 1024 * 1024

      if (file.size > maxSize) {
        message.error('Kích thước file vượt quá 2MB')
        return
      }

      const formData = new FormData()

      formData.append('image', file || '')

      try {
        const { urlImage: url, error } = await uploadImageAction(formData)

        if (error) {
          message.error(error)
          return
        }

        if (url) {
          editor?.chain().focus().setImage({ src: url }).run()
        }
      } catch (error) {
        throw new Error(String(error))
      }
    },
  })

  return (
    <div>
      {showToolbar && <TiptapToolbars editor={editor} />}
      <EditorContent editor={editor} {...rest} />
    </div>
  )
}

export default TiptapEditor
