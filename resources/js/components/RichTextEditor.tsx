import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Quill uses `document` as soon as it is imported, so it is only loaded in the
// browser — importing it during server-side rendering (SSR) would crash there.
const ReactQuill = lazy(() => import('react-quill-new'));

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    toolbar?: unknown[]; // Overrides the default toolbar rows
}

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
    ],
};

export default function RichTextEditor({ value, onChange, placeholder, toolbar }: RichTextEditorProps) {
    // Quill must get the same modules object on every render
    const editorModules = useMemo(() => (toolbar ? { toolbar } : modules), [toolbar]);
    // Only in the browser, after the first render
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const placeholderBox = <div className="form-control" style={{ minHeight: 120 }} />;

    return (
        <div className="bg-white rounded">
            {mounted ? (
                <Suspense fallback={placeholderBox}>
                    <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={onChange}
                        modules={editorModules}
                        placeholder={placeholder}
                    />
                </Suspense>
            ) : placeholderBox}
        </div>
    );
}
