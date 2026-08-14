<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Domain Inactive</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .error-container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
            padding: 60px 40px;
            text-align: center;
        }

        .error-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 30px;
            background: #ffe0e0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
        }

        h1 {
            font-size: 32px;
            color: #333;
            margin-bottom: 15px;
            font-weight: 700;
        }

        .error-code {
            font-size: 14px;
            color: #f5576c;
            font-weight: 600;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        p {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .domain-info {
            background: #f5f5f5;
            border-left: 4px solid #f5576c;
            padding: 20px;
            margin: 30px 0;
            text-align: left;
            border-radius: 5px;
        }

        .domain-info p {
            margin: 0;
            font-family: "Monaco", "Courier New", monospace;
            font-size: 14px;
            color: #333;
        }

        .status-badge {
            display: inline-block;
            background: #ffe0e0;
            color: #f5576c;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 13px;
            margin: 15px 0;
            text-transform: uppercase;
        }

        .actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            padding: 12px 30px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-primary {
            background: #f5576c;
            color: white;
        }

        .btn-primary:hover {
            background: #e63a5c;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(245, 87, 108, 0.3);
        }

        .btn-secondary {
            background: #e0e0e0;
            color: #333;
        }

        .btn-secondary:hover {
            background: #d0d0d0;
        }

        .help-text {
            margin-top: 30px;
            font-size: 13px;
            color: #999;
            line-height: 1.8;
        }

        .warning-box {
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }

        .warning-box strong {
            color: #856404;
        }

        .warning-box p {
            color: #856404;
            margin: 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-icon">⏸️</div>
        <p class="error-code">Error 503</p>
        <h1>Domain Inactive</h1>
        <p>This domain has been suspended or is temporarily inactive.</p>

        <div class="domain-info">
            <p><strong>Domain:</strong></p>
            <p>{{ Request::getHost() }}</p>
        </div>

        <div class="status-badge">Inactive</div>

        <div class="warning-box">
            <p><strong>⚠️ Account Status:</strong></p>
            <p>The tenant account associated with this domain is currently inactive. Please contact the account administrator to reactivate it.</p>
        </div>

        <p>If you need access to your account or have questions about the suspension, please reach out to our support team.</p>


        <div class="help-text">
            <p><strong>Need assistance?</strong></p>
            <p>Contact support at <a href="mailto:{{ config('app.admin_email') }}">{{ config('app.admin_email') }}</a></p>
        </div>
    </div>
</body>
</html>
