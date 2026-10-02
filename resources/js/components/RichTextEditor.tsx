import { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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

    return (
        <div className="bg-white rounded">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={editorModules}
                placeholder={placeholder}
            />
        </div>
    );
}
