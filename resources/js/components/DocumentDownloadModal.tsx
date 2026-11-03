import { useEffect, useRef, useState } from 'react';

export interface DownloadableDocument {
    document_name: string;
    file_path: string;
    file_type?: string | null;
}

type Format = 'original' | 'jpg' | 'png' | 'pdf';

const IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];

const kindOf = (doc: DownloadableDocument): 'pdf' | 'image' | 'other' => {
    const type = (doc.file_type || doc.file_path.split('.').pop() || '').toLowerCase();
    return type === 'pdf' ? 'pdf' : IMAGE_TYPES.includes(type) ? 'image' : 'other';
};

const extensionOf = (doc: DownloadableDocument) => (doc.file_path.split('.').pop() || doc.file_type || 'file').toLowerCase();

const safeName = (name: string) => name.replace(/[\\/:*?"<>|]+/g, ' ').trim() || 'document';

const formatBytes = (bytes: number) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(2)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

const saveBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
};

const canvasBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
    new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not create the image.'))), type, quality));

/** Draws onto a new canvas at the size asked for; a white background, since JPG and PDF have no transparency. */
const resized = (source: CanvasImageSource, width: number, height: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, width, height);
    return canvas;
};

/** A JPG, at lower quality as needed to stay under the size limit (when one is set). */
const jpegBlob = async (canvas: HTMLCanvasElement, maxKb: number | null) => {
    let quality = 0.92;
    let blob = await canvasBlob(canvas, 'image/jpeg', quality);
    while (maxKb && blob.size > maxKb * 1024 && quality > 0.1) {
        quality -= 0.08;
        blob = await canvasBlob(canvas, 'image/jpeg', quality);
    }
    return blob;
};

const loadPdfJs = async () => {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const worker = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url');
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    return pdfjs;
};

/**
 * A client document's Download popup: see the file and its size first, then
 * download it as it is, or convert it (PDF to JPG / PNG, image to PDF or
 * another image type), resized if needed. All done in the browser.
 */
export default function DocumentDownloadModal({ doc, onClose }: { doc: DownloadableDocument; onClose: () => void }) {
    const kind = kindOf(doc);
    const baseName = safeName(doc.document_name);
    const previewRef = useRef<HTMLCanvasElement>(null);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(kind !== 'other');
    const [fileSize, setFileSize] = useState<number | null>(null);
    const [blob, setBlob] = useState<Blob | null>(null);

    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [pdf, setPdf] = useState<any>(null);
    const [pageCount, setPageCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    // The current page's (or the image's) own size: pixels for an image, points for a PDF page
    const [natural, setNatural] = useState<{ width: number; height: number } | null>(null);

    const [format, setFormat] = useState<Format>('original');
    const [pagesMode, setPagesMode] = useState<'this' | 'all'>('this');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [keepRatio, setKeepRatio] = useState(true);
    const [maxKb, setMaxKb] = useState('');
    const [working, setWorking] = useState(false);

    // A PDF renders at twice its point size by default (a sharp image)
    const pdfScale = 2;
    const defaultSize = natural && (kind === 'pdf'
        ? { width: Math.round(natural.width * pdfScale), height: Math.round(natural.height * pdfScale) }
        : natural);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const response = await fetch(doc.file_path);
                if (!response.ok) throw new Error('not found');
                const data = await response.blob();
                if (cancelled) return;
                setBlob(data);
                setFileSize(data.size);

                if (kind === 'image') {
                    const img = new Image();
                    img.src = URL.createObjectURL(data);
                    await img.decode();
                    if (cancelled) return;
                    setImage(img);
                    setNatural({ width: img.naturalWidth, height: img.naturalHeight });
                } else if (kind === 'pdf') {
                    const pdfjs = await loadPdfJs();
                    const loaded = await pdfjs.getDocument({ data: await data.arrayBuffer() }).promise;
                    if (cancelled) return;
                    setPdf(loaded);
                    setPageCount(loaded.numPages);
                }
            } catch {
                if (!cancelled) setError('This file could not be read. It may be missing or damaged.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [doc.file_path, kind]);

    // Preview: the image, or the PDF page being looked at
    useEffect(() => {
        const canvas = previewRef.current;
        if (!canvas) return;
        let cancelled = false;
        let task: any = null;
        (async () => {
            if (image) {
                const scale = Math.min(1, 420 / image.naturalWidth);
                canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
                canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
                canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height);
            } else if (pdf) {
                const page = await pdf.getPage(pageNumber);
                if (cancelled) return;
                const base = page.getViewport({ scale: 1 });
                setNatural({ width: base.width, height: base.height });
                const viewport = page.getViewport({ scale: 420 / base.width });
                canvas.width = Math.round(viewport.width);
                canvas.height = Math.round(viewport.height);
                task = page.render({ canvasContext: canvas.getContext('2d')!, viewport });
                await task.promise.catch(() => undefined);
            }
        })();
        return () => { cancelled = true; task?.cancel?.(); };
    }, [image, pdf, pageNumber, loading]);

    const changeWidth = (value: string) => {
        setWidth(value);
        if (keepRatio && natural) setHeight(value ? String(Math.max(1, Math.round((Number(value) * natural.height) / natural.width))) : '');
    };
    const changeHeight = (value: string) => {
        setHeight(value);
        if (keepRatio && natural) setWidth(value ? String(Math.max(1, Math.round((Number(value) * natural.width) / natural.height))) : '');
    };

    // Width and height to use for a source of this size: a typed width scales other PDF pages to match
    const targetSize = (sourceWidth: number, sourceHeight: number) => {
        const w = Number(width) || 0;
        const h = Number(height) || 0;
        if (w && h && !keepRatio) return { width: w, height: h };
        if (w) return { width: w, height: Math.max(1, Math.round((w * sourceHeight) / sourceWidth)) };
        if (h) return { width: Math.max(1, Math.round((h * sourceWidth) / sourceHeight)), height: h };
        return { width: sourceWidth, height: sourceHeight };
    };

    const renderPage = async (number: number) => {
        const page = await pdf.getPage(number);
        const base = page.getViewport({ scale: 1 });
        const target = targetSize(Math.round(base.width * pdfScale), Math.round(base.height * pdfScale));
        const raw = page.getViewport({ scale: target.width / base.width });
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(raw.width);
        canvas.height = Math.round(raw.height);
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport: raw }).promise;
        return canvas.height === target.height ? canvas : resized(canvas, target.width, target.height);
    };

    const imageFile = async (canvas: HTMLCanvasElement) => {
        const limit = Number(maxKb) || null;
        return format === 'jpg' ? jpegBlob(canvas, limit) : canvasBlob(canvas, 'image/png');
    };

    const download = async () => {
        setWorking(true);
        setError('');
        try {
            if (format === 'original') {
                saveBlob(blob ?? await (await fetch(doc.file_path)).blob(), `${baseName}.${extensionOf(doc)}`);
            } else if (kind === 'image' && image) {
                const target = targetSize(image.naturalWidth, image.naturalHeight);
                const canvas = resized(image, target.width, target.height);
                if (format === 'pdf') {
                    const { jsPDF } = await import('jspdf');
                    const file = new jsPDF({
                        unit: 'px',
                        format: [target.width, target.height],
                        orientation: target.width > target.height ? 'landscape' : 'portrait',
                        hotfixes: ['px_scaling'],
                    });
                    const jpeg = await jpegBlob(canvas, Number(maxKb) || null);
                    file.addImage(new Uint8Array(await jpeg.arrayBuffer()), 'JPEG', 0, 0, target.width, target.height);
                    saveBlob(file.output('blob'), `${baseName}.pdf`);
                } else {
                    saveBlob(await imageFile(canvas), `${baseName}.${format}`);
                }
            } else if (kind === 'pdf' && pdf) {
                if (pagesMode === 'all' && pageCount > 1) {
                    const { default: JSZip } = await import('jszip');
                    const zip = new JSZip();
                    for (let n = 1; n <= pageCount; n++) {
                        zip.file(`${baseName} - page ${n}.${format}`, await imageFile(await renderPage(n)));
                    }
                    saveBlob(await zip.generateAsync({ type: 'blob' }), `${baseName}.zip`);
                } else {
                    const suffix = pageCount > 1 ? ` - page ${pageNumber}` : '';
                    saveBlob(await imageFile(await renderPage(pageNumber)), `${baseName}${suffix}.${format}`);
                }
            }
        } catch {
            setError('The file could not be converted. Please try again, or download it as it is.');
        } finally {
            setWorking(false);
        }
    };

    const converting = format !== 'original';
    const formats: [Format, string][] = kind === 'pdf'
        ? [['original', 'PDF (as it is)'], ['jpg', 'Image: JPG'], ['png', 'Image: PNG']]
        : kind === 'image'
            ? [['original', `${extensionOf(doc).toUpperCase()} (as it is)`], ['pdf', 'Convert to PDF'], ['jpg', 'Image: JPG'], ['png', 'Image: PNG']]
            : [['original', 'As it is']];

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog" aria-modal="true" onClick={onClose}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-truncate" title={doc.document_name}>Download: {doc.document_name}</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger py-2">{error}</div>}
                        <div className="row g-3">
                            {/* See it first */}
                            <div className="col-md-6">
                                <div className="border rounded d-flex align-items-center justify-content-center p-2" style={{ minHeight: 280, maxHeight: 460, overflow: 'auto', background: '#f5f6f8' }}>
                                    {kind === 'other' ? (
                                        <span className="text-muted small">No preview for this file type</span>
                                    ) : loading ? (
                                        <span className="text-muted small">Loading...</span>
                                    ) : (
                                        <canvas ref={previewRef} style={{ maxWidth: '100%', height: 'auto' }} />
                                    )}
                                </div>
                                {pageCount > 1 && (
                                    <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
                                        <button type="button" className="btn btn-sm btn-light" disabled={pageNumber <= 1} onClick={() => setPageNumber((n) => n - 1)}>
                                            <i className="fa fa-chevron-left"></i>
                                        </button>
                                        <small>Page {pageNumber} of {pageCount}</small>
                                        <button type="button" className="btn btn-sm btn-light" disabled={pageNumber >= pageCount} onClick={() => setPageNumber((n) => n + 1)}>
                                            <i className="fa fa-chevron-right"></i>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6">
                                {/* Its size */}
                                <table className="table table-sm mb-3">
                                    <tbody>
                                        <tr><td className="text-muted">Type</td><td className="fw-semibold">{extensionOf(doc).toUpperCase()}</td></tr>
                                        {natural && kind === 'image' && (
                                            <tr><td className="text-muted">Dimensions</td><td className="fw-semibold">{natural.width} × {natural.height} px</td></tr>
                                        )}
                                        {natural && kind === 'pdf' && (
                                            <tr>
                                                <td className="text-muted">Page size</td>
                                                <td className="fw-semibold">
                                                    {Math.round(natural.width * 0.3528)} × {Math.round(natural.height * 0.3528)} mm
                                                    <small className="text-muted d-block fw-normal">{Math.round(natural.width)} × {Math.round(natural.height)} pt</small>
                                                </td>
                                            </tr>
                                        )}
                                        {pageCount > 0 && <tr><td className="text-muted">Pages</td><td className="fw-semibold">{pageCount}</td></tr>}
                                        {fileSize != null && <tr><td className="text-muted">File size</td><td className="fw-semibold">{formatBytes(fileSize)}</td></tr>}
                                    </tbody>
                                </table>

                                {/* How to download it */}
                                <label className="form-label small mb-1">Download as</label>
                                <select className="form-select form-select-sm mb-3" value={format} onChange={(e) => setFormat(e.target.value as Format)} disabled={loading}>
                                    {formats.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                </select>

                                {converting && kind === 'pdf' && pageCount > 1 && (
                                    <div className="mb-3">
                                        <label className="form-label small mb-1">Pages</label>
                                        <select className="form-select form-select-sm" value={pagesMode} onChange={(e) => setPagesMode(e.target.value as 'this' | 'all')}>
                                            <option value="this">This page (page {pageNumber})</option>
                                            <option value="all">All {pageCount} pages (ZIP file)</option>
                                        </select>
                                    </div>
                                )}

                                {converting && (
                                    <>
                                        <label className="form-label small mb-1">Resize (pixels) <span className="text-muted">— leave empty to keep the size</span></label>
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <input type="number" min={1} max={10000} className="form-control form-control-sm" placeholder={defaultSize ? String(defaultSize.width) : 'Width'} aria-label="Width" value={width} onChange={(e) => changeWidth(e.target.value)} />
                                            <span>×</span>
                                            <input type="number" min={1} max={10000} className="form-control form-control-sm" placeholder={defaultSize ? String(defaultSize.height) : 'Height'} aria-label="Height" value={height} onChange={(e) => changeHeight(e.target.value)} />
                                        </div>
                                        <div className="form-check mb-3">
                                            <input className="form-check-input" type="checkbox" id="keep-ratio" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} />
                                            <label className="form-check-label small" htmlFor="keep-ratio">Keep proportions</label>
                                        </div>
                                        {(format === 'jpg' || format === 'pdf') && (
                                            <>
                                                <label className="form-label small mb-1">Max file size (KB) <span className="text-muted">— optional</span></label>
                                                <input type="number" min={5} className="form-control form-control-sm" placeholder="e.g. 200" aria-label="Max file size in KB" value={maxKb} onChange={(e) => setMaxKb(e.target.value)} />
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <a href={doc.file_path} target="_blank" rel="noreferrer" className="btn btn-outline-secondary me-auto">
                            <i className="fa fa-up-right-from-square me-1"></i>Open in new tab
                        </a>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={download} disabled={working || (loading && kind !== 'other')}>
                            <i className="fa fa-download me-1"></i>{working ? 'Working...' : 'Download'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
