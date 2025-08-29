
-- Insert sample questions for immediate functionality
INSERT INTO questions (question, options, correct_answer, explanation, difficulty, subject) VALUES 
(
  'What is React?',
  '["A JavaScript library for building user interfaces", "A database management system", "A CSS framework", "A web server"]',
  0,
  'React is a JavaScript library developed by Facebook for building user interfaces, particularly for web applications. It allows developers to create reusable UI components.',
  'Easy',
  'React'
),
(
  'Which hook is used for managing state in functional components?',
  '["useEffect", "useState", "useContext", "useReducer"]',
  1,
  'useState is the primary hook for managing local state in React functional components. It returns a state variable and a function to update it.',
  'Easy',
  'React'
),
(
  'What does SQL stand for?',
  '["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"]',
  0,
  'SQL stands for Structured Query Language. It is a domain-specific language used for managing and querying relational databases.',
  'Easy',
  'SQL'
),
(
  'Which SQL command is used to retrieve data from a database?',
  '["INSERT", "UPDATE", "DELETE", "SELECT"]',
  3,
  'SELECT is the SQL command used to retrieve data from one or more tables in a database. It is the most commonly used SQL command for querying data.',
  'Easy',
  'SQL'
),
(
  'What is the purpose of the Virtual DOM in React?',
  '["To store component state", "To optimize rendering performance", "To handle routing", "To manage API calls"]',
  1,
  'The Virtual DOM is a JavaScript representation of the real DOM that React uses to optimize rendering by comparing changes and updating only the parts that have changed.',
  'Medium',
  'React'
),
(
  'What is a JOIN in SQL?',
  '["A way to combine rows from two or more tables", "A method to delete records", "A function to calculate totals", "A command to create tables"]',
  0,
  'A JOIN in SQL is used to combine rows from two or more tables based on a related column between them, allowing you to query data from multiple tables simultaneously.',
  'Medium',
  'SQL'
),
(
  'What is the difference between let and var in JavaScript?',
  '["No difference", "let has block scope, var has function scope", "var is newer than let", "let is faster than var"]',
  1,
  'let has block scope (only available within the block where it is declared), while var has function scope (available throughout the entire function). let also prevents redeclaration in the same scope.',
  'Medium',
  'JavaScript'
),
(
  'What is a closure in JavaScript?',
  '["A way to close browser windows", "A function that has access to outer scope variables", "A method to hide code", "A type of loop"]',
  1,
  'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has finished executing. This is a powerful feature in JavaScript.',
  'Hard',
  'JavaScript'
),
(
  'What is the purpose of useEffect in React?',
  '["To manage component state", "To handle side effects and lifecycle events", "To create components", "To style components"]',
  1,
  'useEffect is a React hook that lets you perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM. It combines componentDidMount, componentDidUpdate, and componentWillUnmount.',
  'Medium',
  'React'
),
(
  'What does CSS stand for?',
  '["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"]',
  1,
  'CSS stands for Cascading Style Sheets. It is a stylesheet language used to describe the presentation and formatting of HTML documents.',
  'Easy',
  'CSS'
);
