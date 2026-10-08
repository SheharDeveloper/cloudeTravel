import { useState } from 'react';
import toast from 'react-hot-toast';
import RichTextEditor from '@/components/RichTextEditor';

/**
 * "Send Email" on a visa application: the screen only — To (the client's
 * email), Subject and Message. Sending is not set up yet, so nothing is sent.
 */
export default function SendEmailTab({ to, clientName, applicationNumber }: {
    // The booking client's email (else the applicant's)
    to: string | null;
    clientName: string | null;
    applicationNumber: string;
}) {
    const [subject, setSubject] = useState(`Your visa application ${applicationNumber}`);
    const [message, setMessage] = useState('');

    const send = () => {
        toast('Email sending is not set up yet — nothing was sent.', { icon: 'ℹ️' });
    };

    return (
        <div className="card h-auto">
            <div className="card-header">
                <h6 className="card-title mb-1">Send Email</h6>
                <div className="small text-muted">Write an email to the client about this application</div>
            </div>
            <div className="card-body">
                <div className="alert alert-info py-2 d-flex align-items-center gap-2">
                    <i className="fa fa-info-circle"></i>
                    <span>Email sending is not set up yet. This screen does not send anything.</span>
                </div>

                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">To</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fa fa-envelope"></i></span>
                            <input type="email" className="form-control" value={to ?? ''} placeholder="No email on file" readOnly />
                        </div>
                        {clientName && <small className="text-muted">{clientName}</small>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Subject</label>
                        <input
                            type="text"
                            className="form-control"
                            value={subject}
                            maxLength={255}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Subject"
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Message</label>
                        <RichTextEditor value={message} onChange={setMessage} placeholder="Write your message…" />
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setMessage('')}>
                        Clear
                    </button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={send} disabled={!to}>
                        <i className="fa fa-paper-plane me-2"></i>Send Email
                    </button>
                </div>
            </div>
        </div>
    );
}
