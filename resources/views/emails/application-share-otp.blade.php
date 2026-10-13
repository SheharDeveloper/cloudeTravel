<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your OTP</title>
</head>
<body style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;">
        <tr>
            <td style="background:#26a9e0;padding:20px 28px;color:#ffffff;">
                <div style="font-size:20px;font-weight:bold;">{{ $brand['name'] }}</div>
                <div style="font-size:13px;opacity:.9;margin-top:4px;">Visa Application</div>
            </td>
        </tr>
        <tr>
            <td style="padding:28px;">
                <p style="margin:0 0 14px;font-size:15px;">Dear {{ trim($application->first_name . ' ' . $application->last_name) ?: 'Applicant' }},</p>
                <p style="margin:0 0 14px;font-size:15px;line-height:1.5;">
                    Use this OTP to open your visa application <strong>{{ $application->application_number }}</strong> and fill it in:
                </p>
                <p style="margin:24px 0;text-align:center;">
                    <span style="display:inline-block;padding:14px 28px;background:#f0f9ff;border:2px dashed #26a9e0;border-radius:8px;font-size:28px;font-weight:bold;letter-spacing:6px;color:#1f2937;">{{ $otp }}</span>
                </p>
                <p style="margin:0;font-size:13px;color:#6b7280;">
                    The OTP is valid for {{ $minutes }} minutes. If you didn't ask for it, you can ignore this email.
                </p>
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
