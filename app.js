// Import necessary modules for the application
const express = require('express'); // Express framework for creating web server
const mongoose = require('mongoose'); // Mongoose for interacting with MongoDB
const session = require('express-session'); // Express session for managing user sessions
const MongoStore = require('connect-mongo'); // Connect-mongo for storing sessions in MongoDB
const passport = require('passport'); // Passport.js for authentication
const path = require('path'); // Path module for handling file paths

// Initialize Express application
const app = express();

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/backend_mongo_3_db', {
  useNewUrlParser: true, // Use new URL string parser (deprecated in newer versions but safe to include)
  useUnifiedTopology: true // Use new Server Discover and Monitoring engine
});
mongoose.connection.on('connected', () => {
  console.log('Successfully connected to MongoDB'); // Log successful connection
});

// Configure Pug as the template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies (API requests)
app.use(express.json());

// Configure Session Middleware
app.use(session({
  secret: 'playground_secret', // Secret used to sign the session ID cookie
  resave: false, // Don't save session if unmodified
  saveUninitialized: true, // Save uninitialized sessions
  store: MongoStore.create({ // Store session data in MongoDB using connect-mongo
    mongoUrl: 'mongodb://localhost:27017/backend_mongo_3_db', // MongoDB connection URL
  }),
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Integrate Passport with express-session

// Setup Passport Local Strategy and serialization (defined in strategies/local.js)
const localStrategy = require('./strategies/local'); // Import local strategy configuration
passport.use(localStrategy); // Register the local strategy with Passport

// Passport serialization: deciding what user data to store in the session
passport.serializeUser((user, done) => {
  // Store only the essential user data (like shortId, email, name) in the session
  done(null, { shortId: user.shortId, email: user.email, name: user.name });
});

// Passport deserialization: retrieving full user data from the session when needed
passport.deserializeUser((obj, done) => {
  // The 'obj' is what was serialized into the session. We pass it back as the req.user object.
  done(null, obj);
});

// Global middleware to make the logged-in user available in all pug templates
app.use((req, res, next) => {
  res.locals.user = req.user; // Expose req.user to templates as 'user' variable
  next(); // Continue to the next middleware or route handler
});

// Setup Routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');
const aggregationRouter = require('./routes/aggregation');

// Mount Routers
app.use('/', indexRouter); // Main index routes
app.use('/', authRouter); // Auth routes (login, join, logout)
app.use('/posts', postsRouter); // Post management routes
app.use('/users', usersRouter); // User specific routes
app.use('/api', apiRouter); // API routes for CSR comments
app.use('/aggregation', aggregationRouter); // Aggregation demonstration routes

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
