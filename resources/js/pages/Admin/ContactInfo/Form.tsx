import { ContactInfo } from '@/services/contactInfoService';

interface ContactInfoFormProps {
    data: ContactInfo;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onFileChange: (fieldName: string, file: File) => void;
    logoPreview?: string;
    touchImagePreview?: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading?: boolean;
}

export default function ContactInfoForm({ data, onChange, onFileChange, logoPreview, touchImagePreview, onSubmit, isLoading = false }: ContactInfoFormProps) {
    return (
        <form onSubmit={onSubmit}>
            {/* Basic Information */}
            <h6 className="mb-3 mt-4">Basic Information</h6>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={data.email || ''}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={data.phone || ''}
                        onChange={onChange}
                        required
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Location</label>
                    <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={data.location || ''}
                        onChange={onChange}
                        placeholder="City, Country"
                        required
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={data.address || ''}
                        onChange={onChange}
                        required
                    />
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">About Text</label>
                <textarea
                    className="form-control"
                    name="about_text"
                    value={data.about_text || ''}
                    onChange={onChange}
                    rows={4}
                    placeholder="Enter company description"
                    required
                ></textarea>
            </div>

            {/* Social Media */}
            <h6 className="mb-3 mt-4">Social Media Links</h6>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Facebook URL</label>
                    <input
                        type="url"
                        className="form-control"
                        name="facebook_url"
                        value={data.facebook_url || ''}
                        onChange={onChange}
                        placeholder="https://facebook.com/..."
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Instagram URL</label>
                    <input
                        type="url"
                        className="form-control"
                        name="instagram_url"
                        value={data.instagram_url || ''}
                        onChange={onChange}
                        placeholder="https://instagram.com/..."
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Twitter URL</label>
                    <input
                        type="url"
                        className="form-control"
                        name="twitter_url"
                        value={data.twitter_url || ''}
                        onChange={onChange}
                        placeholder="https://twitter.com/..."
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">LinkedIn URL</label>
                    <input
                        type="url"
                        className="form-control"
                        name="linkedin_url"
                        value={data.linkedin_url || ''}
                        onChange={onChange}
                        placeholder="https://linkedin.com/..."
                    />
                </div>
            </div>

            {/* Images */}
            <h6 className="mb-3 mt-4">Images</h6>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Logo</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                onFileChange('logo', e.target.files[0]);
                            }
                        }}
                    />
                    {(logoPreview || data.logo) && (
                        <img src={logoPreview || data.logo} alt="Logo" style={{ maxWidth: '100px', marginTop: '10px', borderRadius: '4px' }} />
                    )}
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Get in Touch Image</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                onFileChange('get_in_touch_image', e.target.files[0]);
                            }
                        }}
                    />
                    {(touchImagePreview || data.get_in_touch_image) && (
                        <img src={touchImagePreview || data.get_in_touch_image} alt="Get in Touch" style={{ maxWidth: '100px', marginTop: '10px', borderRadius: '4px' }} />
                    )}
                </div>
            </div>

            <div className="mt-4">
                <button type="submit" disabled={isLoading} className="btn btn-primary">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
