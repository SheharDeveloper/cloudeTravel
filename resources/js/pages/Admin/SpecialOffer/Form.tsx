interface SpecialOfferFormProps {
    data: {
        airline: string;
        from: string;
        destinations: string;
        price: string;
        description: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    editingId: number | null;
}

export default function SpecialOfferForm({ data, onChange, onSubmit, isLoading, editingId }: SpecialOfferFormProps) {
    return (
        <form onSubmit={onSubmit}>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Airline</label>
                    <input
                        type="text"
                        className="form-control"
                        name="airline"
                        value={data.airline}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">From</label>
                    <input
                        type="text"
                        className="form-control"
                        name="from"
                        value={data.from}
                        onChange={onChange}
                        required
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Destinations</label>
                    <input
                        type="text"
                        className="form-control"
                        name="destinations"
                        value={data.destinations}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Price</label>
                    <input
                        type="text"
                        className="form-control"
                        name="price"
                        value={data.price}
                        onChange={onChange}
                        required
                    />
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                    className="form-control"
                    name="description"
                    value={data.description}
                    onChange={onChange}
                    rows={3}
                    required
                ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {editingId ? 'Update Offer' : 'Create Offer'}
            </button>
        </form>
    );
}
