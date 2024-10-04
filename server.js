// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const slugify = require('slugify');
const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));  // To serve static files (e.g., CSS and JS)
app.set('view engine', 'ejs');  // Set EJS as the templating engine

// Temporary storage for user data (use a database in production)
let userPages = {};

// Serve the static HTML file for user input
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/plugins/index.html');  // Corrected path
});

// Handle form submission and create the custom URL
app.post('/submit', (req, res) => {
  const username = req.body.username;
  const userParagraph = req.body.userParagraph;

  // Generate a slug from the username (e.g., "John Doe" -> "john-doe")
  const userSlug = slugify(username, { lower: true });

  // Save the user's data (temporarily in memory)
  userPages[userSlug] = { username, userParagraph };

  // Redirect to the custom page
  res.redirect(`/page/${userSlug}`);
});

// Serve the dynamic custom page
app.get('/page/:userSlug', (req, res) => {
  const userSlug = req.params.userSlug;
  const userData = userPages[userSlug];

  if (userData) {
    // Render the custom page using EJS
    res.render('customPage', { username: userData.username, userParagraph: userData.userParagraph });
  } else {
    res.status(404).send('Page not found.');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
// console.log(userParagraph);