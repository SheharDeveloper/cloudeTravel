interface HeroImageFormProps {
    data: {
        image_url: string;
        title: string;
        subtitle: string;
        order: number;
        status: number;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onFileChange: (file: File | null) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    editingId: number | null;
    preview?: string;
}

export default function HeroImageForm({ data, onChange, onFileChange, onSubmit, isLoading, editingId, preview }: HeroImageFormProps) {
    return (
        <form onSubmit={onSubmit}>
            <div className="mb-3">
                <label className="form-label">Image Upload</label>
                <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                    required={!editingId}
                />
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={data.title}
                        onChange={onChange}
                        placeholder="Enter hero title"
                        required
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Subtitle</label>
                    <input
                        type="text"
                        className="form-control"
                        name="subtitle"
                        value={data.subtitle}
                        onChange={onChange}
                        placeholder="Enter hero subtitle"
                        required
                    />
                </div>
            </div>
            {(preview || data.image_url) && (
                <div className="mb-3">
                    <label className="form-label">Preview</label>
                    <img src={preview || data.image_url} alt="Preview" style={{ maxWidth: '200px', borderRadius: '4px' }} />
                </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {editingId ? 'Update Image' : 'Create Image'}
            </button>
        </form>
    );
}
