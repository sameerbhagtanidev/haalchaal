export const LOGIN_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Login Code</title>
    </head>
    <body
        style="
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        "
    >
        <div
            style="
                background: linear-gradient(to right, #ff9100, #ff7300);
                padding: 20px;
                text-align: center;
            "
        >
            <h1 style="color: white; margin: 0">Your HaalChaal Code</h1>
        </div>

        <div
            style="
                background-color: #fafafa;
                padding: 20px;
                border-radius: 0 0 6px 6px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
            "
        >
            <p>Hello,</p>

            <p>
                Use the login code below to securely access your HaalChaal account:
            </p>

            <div style="text-align: center; margin: 32px 0">
                <span
                    style="
                        font-size: 34px;
                        font-weight: bold;
                        letter-spacing: 6px;
                        color: #ff9100;
                    "
                >
                    {loginToken}
                </span>
            </div>

            <p>
                This code is valid for <strong>15 minutes</strong>.
                If you didn’t request it, you can safely ignore this email.
            </p>

            <p>
                Regards,<br />
                <strong>Team HaalChaal</strong>
            </p>
        </div>

        <div
            style="
                text-align: center;
                margin-top: 20px;
                color: #888;
                font-size: 0.8em;
            "
        >
            <p>This is an automated message. Please do not reply.</p>
        </div>
    </body>
</html>
`;
