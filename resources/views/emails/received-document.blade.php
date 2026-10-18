<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your document</title>
</head>
<body style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    @php($client = $document->client)
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;">
        <tr>
            <td style="background:#26a9e0;padding:20px 28px;color:#ffffff;">
                <div style="font-size:20px;font-weight:bold;">{{ $brand['name'] }}</div>
                <div style="font-size:13px;opacity:.9;margin-top:4px;">Client Documents</div>
            </td>
        </tr>
        <tr>
            <td style="padding:28px;">
                <p style="margin:0 0 14px;font-size:15px;">Dear {{ $client->name ?: 'Customer' }},</p>
                @if($document->isReturned())
                    <p style="margin:0 0 14px;font-size:15px;line-height:1.5;">
                        Your document <strong>{{ $document->document_name }}</strong> was returned to you on
                        <strong>{{ $document->returned_at->format('d M Y, h:i A') }}</strong>.
                    </p>
                    @if($document->return_remarks)
                        <p style="margin:0 0 14px;font-size:14px;color:#4b5563;"><strong>Message:</strong> {{ $document->return_remarks }}</p>
                    @endif
                @else
                    <p style="margin:0 0 14px;font-size:15px;line-height:1.5;">
                        We received your document <strong>{{ $document->document_name }}</strong> on
                        <strong>{{ $document->received_at->format('d M Y, h:i A') }}</strong>. We are keeping it safe and will let you know when it is ready to be returned.
                    </p>
                @endif
                @if($document->remarks)
                    <p style="margin:0 0 14px;font-size:14px;color:#4b5563;"><strong>Remarks:</strong> {{ $document->remarks }}</p>
                @endif
                <p style="margin:0;font-size:13px;color:#6b7280;">Client ID: {{ $client->cid }}</p>
            </td>
        </tr>
        <tr>
            <td style="padding:16px 28px;background:#f9fafb;font-size:12px;color:#6b7280;">
                {{ $brand['name'] }}
                @if($brand['phone']) · {{ $brand['phone'] }}@endif
                @if($brand['email']) · {{ $brand['email'] }}@endif
            </td>
        </tr>
    </table>
</body>
</html>
