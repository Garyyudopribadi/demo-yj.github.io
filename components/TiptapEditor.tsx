import React, { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Blockquote from '@tiptap/extension-blockquote';

interface TiptapEditorProps {
  value?: string;
  onChange?: (content: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ value = '', onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write a description...',
        emptyNodeClass: 'text-gray-600',
      }),
      Bold,
      Underline,
      Link,
      BulletList,
      OrderedList,
      Blockquote,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap prose min-h-[180px] max-h-[320px] overflow-y-auto p-2 rounded border border-gray-300 bg-white focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 mb-2 bg-gray-100 p-1 rounded-lg">
        <button type="button" className="toolbar-btn" onClick={() => editor?.chain().focus().toggleBold().run()} disabled={!editor} title="Bold">
          <b>B</b>
        </button>
        <button type="button" className="toolbar-btn" onClick={() => editor?.chain().focus().toggleItalic().run()} disabled={!editor} title="Italic">
          <i>I</i>
        </button>
        <button type="button" className="toolbar-btn" onClick={() => editor?.chain().focus().toggleUnderline().run()} disabled={!editor} title="Underline">
          <u>U</u>
        </button>
        <button type="button" className="toolbar-btn" onClick={() => editor?.chain().focus().toggleStrike().run()} disabled={!editor} title="Strike">
          <s>S</s>
        </button>
        <button type="button" className="toolbar-btn" onClick={() => editor?.chain().focus().toggleBulletList().run()} disabled={!editor} title="Bullet List">
          • List
        </button>
        <button type="button" className="toolbar-btn" onClick={() => editor?.chain().focus().toggleOrderedList().run()} disabled={!editor} title="Ordered List">
          1. List
        </button>
        <button type="button" className="toolbar-btn" onClick={() => editor?.chain().focus().toggleBlockquote().run()} disabled={!editor} title="Blockquote">
          “”
        </button>
        <button type="button" className="toolbar-btn" onClick={() => {
          const url = window.prompt('URL');
          if (url) editor?.chain().focus().setLink({ href: url }).run();
        }} disabled={!editor} title="Link">
          🔗
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
