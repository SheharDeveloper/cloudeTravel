<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Please sign your booking</title>
</head>
<body style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    @php($booking = $signature->booking)
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;">
        <tr>
            <td style="background:#26a9e0;padding:20px 28px;color:#ffffff;">
                <div style="font-size:20px;font-weight:bold;">{{ $brand['name'] }}</div>
                <div style="font-size:13px;opacity:.9;margin-top:4px;">Document Signing</div>
            </td>
        </tr>
        <tr>
            <td style="padding:28px;">
                <p style="margin:0 0 14px;font-size:15px;">Dear {{ $signature->signer_name ?: 'Customer' }},</p>
                <p style="margin:0 0 14px;font-size:15px;line-height:1.5;">
                    Your booking <strong>{{ $booking->invoice_number }}</strong>
                    @if(! empty($booking->details['visa_name'])) for <strong>{{ $booking->details['visa_name'] }}</strong>@endif
                    is ready. Please review the invoice and sign it online.
                </p>
                <p style="margin:24px 0;text-align:center;">
                    <a href="{{ $url }}" style="display:inline-block;padding:13px 28px;background:#26a9e0;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;">Review &amp; Sign</a>
                </p>
                <p style="margin:0 0 6px;font-size:13px;color:#6b7280;">
                    Please sign by <strong>{{ $signature->expires_at?->format('d M Y') }}</strong>. If the button doesn't work, open this link:
                </p>
                <p style="margin:0;font-size:12px;word-break:break-all;"><a href="{{ $url }}" style="color:#26a9e0;">{{ $url }}</a></p>
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
