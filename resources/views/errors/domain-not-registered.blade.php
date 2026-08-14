<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Domain Not Registered</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            padding: 50px 40px;
            text-align: center;
        }

        .error-icon {
            font-size: 60px;
            margin-bottom: 20px;
        }

        h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 10px;
        }

        .error-code {
            color: #667eea;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
        }

        .message {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .domain {
            background: #f5f5f5;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            color: #333;
            word-break: break-all;
        }

        .contact-section {
            background: #f0f4ff;
            border-radius: 5px;
            padding: 20px;
            margin-top: 30px;
        }

        .contact-section h3 {
            color: #667eea;
            font-size: 14px;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .contact-section p {
            color: #555;
            font-size: 14px;
            line-height: 1.6;
        }

        .contact-email {
            color: #667eea;
            font-weight: 600;
            text-decoration: none;
        }

        .contact-email:hover {
            text-decoration: underline;
        }

        .home-link {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
            font-weight: 600;
            transition: background 0.3s;
        }

        .home-link:hover {
            background: #764ba2;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">🔒</div>

        <div class="error-code">Error 404</div>

        <h1>Domain Not Registered</h1>

        <div class="message">
            The domain you are trying to access is not registered in our system.
        </div>

        <div class="domain">
            {{ Request::getHost() }}
        </div>

        <div class="contact-section">
            <h3>Need Help?</h3>
            <p>
                If you believe this is a mistake or need to register this domain,
                please contact our support team:
            </p>
            <p style="margin-top: 10px;">
                <a href="mailto:{{ config('app.admin_email') }}" class="contact-email">
                    {{ config('app.admin_email') }}
                </a>
            </p>
        </div>
 </div>
</body>
</html>
