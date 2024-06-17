import * as monaco from 'monaco-editor';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

self.MonacoEnvironment = {
  getWorker: async function (_workerId, label: string) {
    switch (label) {
      case 'json':
        return new (await import('monaco-editor/esm/vs/language/json/json.worker?worker')).default();
      default:
        return new (await import('monaco-editor/esm/vs/editor/editor.worker?worker')).default();
    }
  },
};

export const JsonEditor = forwardRef<monaco.editor.IStandaloneCodeEditor | undefined, { defaultValue: string, disabled?: boolean }>(({ disabled, defaultValue }, forwardedRef) => {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | undefined>(undefined);

  useImperativeHandle(forwardedRef, () => editor, [editor]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // SOLUTION: instead use dynamic imports on the client side
    if (ref) {
      const editor = monaco.editor.create(ref.current!, {
        value: '',
        language: 'json',
        automaticLayout: true,
        lineNumbers: 'off',
        tabSize: 2,
      });

      setEditor(editor);
      return () => editor.dispose();
    }
  }, []);

  useEffect(() => {
    if (editor) {
      editor.updateOptions({
        lineNumbers: disabled ? 'off' : 'on',
        lineDecorationsWidth: disabled ? 0 : undefined,
        readOnly: disabled,
      });
    }
  }, [editor, disabled]);

  useEffect(() => {
    if (editor) {
      editor.setValue(defaultValue);
    }
  }, [editor, defaultValue]);

  return <div className="w-full h-full" ref={ref} style={{ height: '100%', width: '100%' }}></div>;
});
