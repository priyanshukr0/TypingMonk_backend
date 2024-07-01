const emailTemplate = (otp) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        /* Reset styles */
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #444;
        }

        /* Container styles */
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
        }

        /* Header styles */
        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header h1 {
            color: #333;
            margin-bottom: 10px;
        }

        /* Content styles */
        .content {
            margin-bottom: 30px;
        }

        /* Button styles */
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }

        /* Footer styles */
        .footer {
            text-align: right;
            color: #f97316;
            font-weight: bold; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>OTP Verification</h1>
        </div>
        <div class="content">
            <p>Hello there!</p>
            <p>Your One-Time Password (OTP) for verification is:</p>
            <h2 style="text-align: center; color: #007bff;">${otp}</h2>
            <p>Please use this OTP to verify your account.</p>
            <p>If you didn't request this OTP, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>TypingMonk</p>
        </div>
    </div>
</body>
</html>

    `
}
module.exports = emailTemplate;