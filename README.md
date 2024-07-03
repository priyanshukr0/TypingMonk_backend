# TypingMonk Backend

This is the backend repository for the TypingMonk project, a typing test website. It handles all server-side logic and database interactions.

## Features

- User authentication and authorization
- Typing test data management
- API endpoints for frontend integration
- Scoring and performance tracking

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/priyanshukr0/TypingMonk_backend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd TypingMonk_backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the following **environment variables** in a `.env` file:

   ```plaintext
    # JWT Secret Key
    jwt_key='your_jwt_secret'

    # Mail Configuration
    MAIL_HOST='smtp.mailhost.com'
    MAIL_PASS='your_mail_password'
    MAIL_USER='your_email@example.com'

    # MongoDB URI(for DB connection)
    MONGODB_URI='your_mongodb_uri'

    # CORS Origin (example for local development)
    CORS_ORIGIN='http://localhost:5173'
   ```

## Usage

1. Start the server:
   ```bash
    npm run dev
   ```
2. The server will run on http://localhost:3000

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

## License

This project is licensed under the [MIT License](LICENCE) - see the LICENSE file for details.

## Contact

**Priyanshu Kumar**  
Email: 712priyanshu@gmail.com  
LinkedIn: [Priyanshu Kumar](https://www.linkedin.com/in/priyanshu-kumar-6bb395283/)  
X Profile: [priyanshu_dev0](https://x.com/priyanshu_dev0?t=OaHpHDNsV25cFO2kfgUIwA&s=09)
