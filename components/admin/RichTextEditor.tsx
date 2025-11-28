'use client';

import { useRef, useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

// Clean HTML - remove inline styles and keep only semantic tags
function cleanHtml(html: string): string {
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Remove all style attributes
  const allElements = temp.querySelectorAll('*');
  allElements.forEach((el) => {
    el.removeAttribute('style');
    el.removeAttribute('class');
    // Remove empty spans
    if (el.tagName === 'SPAN' && !el.hasAttributes()) {
      const parent = el.parentNode;
      while (el.firstChild) {
        parent?.insertBefore(el.firstChild, el);
      }
      parent?.removeChild(el);
    }
  });

  // Convert div to p for better semantics
  const divs = temp.querySelectorAll('div');
  divs.forEach((div) => {
    const p = document.createElement('p');
    p.innerHTML = div.innerHTML;
    div.parentNode?.replaceChild(p, div);
  });

  return temp.innerHTML;
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = '400px' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    // Update the value after command
    if (editorRef.current) {
      onChange(cleanHtml(editorRef.current.innerHTML));
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(cleanHtml(editorRef.current.innerHTML));
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    // Get plain text or clean HTML
    let content = e.clipboardData.getData('text/html');
    if (content) {
      content = cleanHtml(content);
    } else {
      // If no HTML, get plain text and convert line breaks to paragraphs
      const text = e.clipboardData.getData('text/plain');
      content = text.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    }
    document.execCommand('insertHTML', false, content);
    handleInput();
  }, [handleInput]);

  const toolbarStyles = {
    container: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '4px',
      padding: '8px 12px',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
    },
    button: {
      padding: '6px 10px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500' as const,
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '32px',
      transition: 'all 0.15s',
    },
    buttonHover: {
      backgroundColor: '#f3f4f6',
    },
    separator: {
      width: '1px',
      height: '24px',
      backgroundColor: '#e5e7eb',
      margin: '0 4px',
    },
    editor: {
      minHeight,
      padding: '16px',
      border: '1px solid #d1d5db',
      borderTop: 'none',
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
      outline: 'none',
      lineHeight: '1.8',
      fontSize: '16px',
      fontFamily: 'inherit',
      backgroundColor: 'white',
    },
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={toolbarStyles.container}>
        <button
          type="button"
          onClick={() => execCommand('bold')}
          style={toolbarStyles.button}
          title="Gras (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          style={toolbarStyles.button}
          title="Italique (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          style={toolbarStyles.button}
          title="Souligné (Ctrl+U)"
        >
          <u>U</u>
        </button>

        <div style={toolbarStyles.separator} />

        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'h2')}
          style={toolbarStyles.button}
          title="Titre H2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'h3')}
          style={toolbarStyles.button}
          title="Sous-titre H3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'h4')}
          style={toolbarStyles.button}
          title="Sous-titre H4"
        >
          H4
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'h5')}
          style={toolbarStyles.button}
          title="Sous-titre H5"
        >
          H5
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'h6')}
          style={toolbarStyles.button}
          title="Sous-titre H6"
        >
          H6
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'p')}
          style={toolbarStyles.button}
          title="Paragraphe"
        >
          ¶
        </button>

        <div style={toolbarStyles.separator} />

        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          style={toolbarStyles.button}
          title="Liste à puces"
        >
          • —
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          style={toolbarStyles.button}
          title="Liste numérotée"
        >
          1. —
        </button>

        <div style={toolbarStyles.separator} />

        <button
          type="button"
          onClick={() => {
            const url = prompt('URL du lien:');
            if (url) execCommand('createLink', url);
          }}
          style={toolbarStyles.button}
          title="Insérer un lien"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => execCommand('unlink')}
          style={toolbarStyles.button}
          title="Supprimer le lien"
        >
          ⛓️‍💥
        </button>

        <div style={toolbarStyles.separator} />

        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          style={toolbarStyles.button}
          title="Aligner à gauche"
        >
          ⬅
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          style={toolbarStyles.button}
          title="Centrer"
        >
          ⬌
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          style={toolbarStyles.button}
          title="Aligner à droite"
        >
          ➡
        </button>

        <div style={toolbarStyles.separator} />

        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          style={toolbarStyles.button}
          title="Supprimer le formatage"
        >
          ✕
        </button>
        <button
          type="button"
          onClick={() => {
            if (editorRef.current) {
              const cleaned = cleanHtml(editorRef.current.innerHTML);
              editorRef.current.innerHTML = cleaned;
              onChange(cleaned);
            }
          }}
          style={{ ...toolbarStyles.button, backgroundColor: '#fef3c7' }}
          title="Nettoyer les styles (supprimer les styles inline)"
        >
          🧹
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
        style={toolbarStyles.editor}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
