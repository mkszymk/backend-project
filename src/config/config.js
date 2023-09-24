//import dotenv from "dotenv";

//dotenv.config();

export default {
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  mongoUrl: process.env.MONGO_URL,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  persistence: process.env.PERSISTENCE,
  gmailUser: process.env.GMAIL_USER,
  gmailPassword: process.env.GMAIL_PASSWORD,
  jwtToken: process.env.JWT_TOKEN,
};
