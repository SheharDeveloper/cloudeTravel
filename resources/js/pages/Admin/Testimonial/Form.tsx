interface TestimonialFormProps {
    data: {
        client_name: string;
        client_image: string;
        message: string;
        rating: number;
        order: number;
        status: number;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onFileChange: (file: File | null) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onRatingChange: (rating: number) => void;
    isLoading: boolean;
    editingId: number | null;
    preview?: string;
}

export default function TestimonialForm({ data, onChange, onFileChange, onSubmit, onRatingChange, isLoading, editingId, preview }: TestimonialFormProps) {
    const renderStars = () => {
        return (
            <div className="d-flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onRatingChange(star)}
                        className="btn btn-link p-0"
                        style={{ cursor: 'pointer', fontSize: '20px' }}
                    >
                        <i className={`fa-${data.rating >= star ? 'solid' : 'regular'} fa-star`} style={{ color: '#ff6b35' }}></i>
                    </button>
                ))}
            </div>
        );
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Client Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="client_name"
                        value={data.client_name}
                        onChange={onChange}
                        placeholder="Enter client name"
                        required
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Client Image</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                        required={!editingId}
                    />
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                    className="form-control"
                    name="message"
                    value={data.message}
                    onChange={onChange}
                    placeholder="Enter testimonial message"
                    rows={4}
                    required
                ></textarea>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Rating</label>
                    {renderStars()}
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Order</label>
                    <input
                        type="number"
                        className="form-control"
                        name="order"
                        value={data.order}
                        onChange={onChange}
                        min="1"
                        required
                    />
                </div>
            </div>
            {(preview || data.client_image) && (
                <div className="mb-3">
                    <label className="form-label">Preview</label>
                    <img src={preview || data.client_image} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {editingId ? 'Update Testimonial' : 'Create Testimonial'}
            </button>
        </form>
    );
}
