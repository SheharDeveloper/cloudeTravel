/**
 * A visa's description is rich text written in the admin editor, so it can
 * carry long unbroken lines, fixed-width inline styles, images and tables.
 * This keeps all of it inside the box it is shown in.
 */
const css = `
.vr-description { max-width: 100%; overflow-wrap: anywhere; word-break: break-word; }
.vr-description * { max-width: 100%; box-sizing: border-box; white-space: normal !important; overflow-wrap: anywhere; }
.vr-description img, .vr-description video, .vr-description iframe { max-width: 100% !important; height: auto !important; }
.vr-description table { display: block; overflow-x: auto; width: auto !important; }
.vr-description pre { white-space: pre-wrap !important; }
`;

export default function VisaDescription({ html }: { html: string }) {
    return (
        <>
            <style>{css}</style>
            <div className="vr-description" dangerouslySetInnerHTML={{ __html: html }} />
        </>
    );
}
