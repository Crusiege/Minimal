const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Post = require('./models/Post');

dotenv.config();

// Sample data
const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password123',
    bio: 'A passionate writer and developer who loves creating minimal, elegant solutions.'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'Password123',
    bio: 'Designer and content creator focused on user experience and storytelling.'
  },
  {
    name: 'Alex Wilson',
    email: 'alex@example.com',
    password: 'Password123',
    bio: 'Tech enthusiast sharing insights about modern web development and design patterns.'
  }
];

const posts = [
  {
    title: 'Getting Started with MERN Stack',
    content: `The MERN stack is a popular choice for building modern web applications. It consists of MongoDB, Express.js, React, and Node.js. In this post, we'll explore how to build a complete blog application using these technologies.

The beauty of the MERN stack lies in its simplicity and the fact that you can use JavaScript throughout your entire application. This reduces context switching and allows for faster development.

MongoDB provides a flexible, document-based database that scales easily. Express.js gives us a minimal web framework for Node.js, while React handles our frontend with its component-based architecture. Node.js ties it all together with its event-driven, non-blocking I/O model.

When starting a MERN project, it's important to plan your application structure carefully. Consider how your data will flow between components, how you'll handle authentication, and what your API endpoints will look like.

Authentication is typically handled using JSON Web Tokens (JWT), which provide a secure way to transmit information between parties. This approach works well with the stateless nature of REST APIs.

For state management in React, you can start with local component state and React hooks. As your application grows, you might consider using Context API or libraries like Redux for more complex state management needs.`,
    tags: ['MERN', 'JavaScript', 'Web Development', 'React', 'Node.js'],
    status: 'published'
  },
  {
    title: 'The Art of Minimal Design',
    content: `Minimalism in design is not about having less for the sake of having less. It's about having just enough to communicate effectively and create a pleasant user experience.

When we talk about minimal design, we're discussing the careful curation of elements to achieve maximum impact with minimal complexity. This philosophy extends beyond visual design into user experience, functionality, and even code architecture.

The key principles of minimal design include:

1. **Focus on content**: Remove any elements that don't serve the primary purpose of your design.

2. **White space is your friend**: Don't feel the need to fill every pixel. White space helps create breathing room and guides the user's attention.

3. **Typography matters**: Choose fonts that are readable and convey the right tone. Often, fewer font choices lead to better cohesion.

4. **Color with purpose**: Use color strategically to guide attention and create hierarchy, not just for decoration.

5. **Progressive disclosure**: Show users what they need when they need it, rather than overwhelming them with all options at once.

Minimal design requires discipline. It's easy to add features and elements, but it takes careful consideration to know what to leave out. Every element should earn its place on the page.

This approach to design often results in faster loading times, better usability, and a more focused user experience. It's particularly effective for content-focused applications like blogs, where the primary goal is to deliver information clearly and efficiently.`,
    tags: ['Design', 'Minimalism', 'UX', 'Typography'],
    status: 'published'
  },
  {
    title: 'Building Modern APIs with Node.js',
    content: `Creating robust APIs is fundamental to modern web development. Node.js, with its non-blocking I/O and vast ecosystem, provides an excellent platform for building scalable APIs.

When designing an API, consider these best practices:

**RESTful Principles**: Design your endpoints to be predictable and follow REST conventions. Use appropriate HTTP methods (GET, POST, PUT, DELETE) and status codes.

**Error Handling**: Implement comprehensive error handling that provides meaningful messages to clients while not exposing sensitive server information.

**Authentication & Authorization**: Secure your endpoints appropriately. Not all endpoints need authentication, but those that do should implement it consistently.

**Input Validation**: Always validate and sanitize input data. Use libraries like express-validator to make this process easier and more consistent.

**Documentation**: Good API documentation is crucial. Tools like Swagger can help you maintain up-to-date documentation that stays in sync with your code.

**Testing**: Implement thorough testing for your API endpoints. This includes unit tests, integration tests, and load testing.

**Monitoring**: Set up logging and monitoring to track API performance and catch issues before they impact users.

The Express.js framework provides a minimal yet powerful foundation for building APIs. Its middleware system allows you to compose functionality in a modular way, making your code more maintainable and testable.

Remember that a well-designed API is not just about the technical implementation—it's about creating an interface that developers will find intuitive and pleasant to work with.`,
    tags: ['Node.js', 'API', 'Express', 'Backend', 'REST'],
    status: 'published'
  },
  {
    title: 'React Hooks: A Game Changer',
    content: `React Hooks revolutionized how we write React components by allowing us to use state and other React features without writing class components.

The introduction of hooks in React 16.8 brought several advantages:

**Simpler Code**: Hooks eliminate much of the boilerplate code associated with class components. No more binding methods or worrying about the correct value of 'this'.

**Better Code Reuse**: Custom hooks allow you to extract component logic into reusable functions. This makes it easier to share stateful logic between components.

**Easier Testing**: Functional components with hooks are generally easier to test than class components.

**Performance**: Hooks can lead to better performance optimization opportunities, especially when combined with React.memo and useMemo.

Some essential hooks to master:

- **useState**: For managing local component state
- **useEffect**: For side effects like API calls, subscriptions, or manual DOM manipulation
- **useContext**: For consuming React context
- **useReducer**: For more complex state management scenarios
- **useMemo** and **useCallback**: For performance optimization

When using hooks, remember the rules: only call hooks at the top level of your function components, and only call hooks from React functions.

Custom hooks are particularly powerful for extracting and reusing stateful logic. They're just functions that use other hooks and can help you avoid code duplication across components.

The React team continues to explore new hooks and patterns, making React development more intuitive and powerful with each release.`,
    tags: ['React', 'Hooks', 'JavaScript', 'Frontend'],
    status: 'published'
  },
  {
    title: 'The Future of Web Development',
    content: `Web development is constantly evolving, with new technologies, frameworks, and paradigms emerging regularly. Looking ahead, several trends are shaping the future of how we build for the web.

**JAMstack Architecture**: The combination of JavaScript, APIs, and Markup is gaining popularity for its performance, security, and scalability benefits. Static site generators like Next.js, Gatsby, and Nuxt.js are making it easier to build fast, SEO-friendly applications.

**Serverless Computing**: Functions as a Service (FaaS) platforms allow developers to run code without managing servers. This trend is changing how we think about backend architecture and deployment.

**Progressive Web Apps**: PWAs continue to blur the line between web and native applications, offering offline functionality, push notifications, and native-like experiences through web technologies.

**WebAssembly**: WASM is opening doors for running high-performance code in browsers, bringing languages like Rust, C++, and Go to web development.

**AI and Machine Learning**: Integration of AI capabilities directly into web applications is becoming more accessible through APIs and browser-based ML libraries.

**Enhanced Developer Experience**: Tools for development, testing, and deployment continue to improve, making developers more productive and reducing the barrier to entry for new developers.

**Micro-frontends**: Large applications are being broken down into smaller, manageable pieces that can be developed and deployed independently.

**Sustainability**: There's growing awareness of the environmental impact of web development, leading to focus on performance optimization and efficient resource usage.

The key to staying relevant as a web developer is to focus on fundamentals while remaining curious about new technologies. Not every trend will stick, but understanding the underlying problems they solve helps you make better architectural decisions.`,
    tags: ['Web Development', 'Future', 'Technology', 'Trends'],
    status: 'published'
  }
];

// Import data
const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/minimal-blog');
    
    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();
    
    console.log('Existing data cleared...');
    
    // Create users
    const createdUsers = await User.create(users);
    console.log('Users imported...');
    
    // Assign random authors to posts and add some likes
    const postsWithAuthors = posts.map((post, index) => ({
      ...post,
      author: createdUsers[index % createdUsers.length]._id,
      likes: createdUsers.slice(0, Math.floor(Math.random() * createdUsers.length)).map(user => user._id),
      views: Math.floor(Math.random() * 500) + 10
    }));
    
    // Create posts
    await Post.create(postsWithAuthors);
    console.log('Posts imported...');
    
    console.log('✅ Data imported successfully!');
    console.log('\n📚 Sample accounts created:');
    console.log('Email: john@example.com | Password: Password123');
    console.log('Email: jane@example.com | Password: Password123');
    console.log('Email: alex@example.com | Password: Password123');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/minimal-blog');
    
    await User.deleteMany();
    await Post.deleteMany();
    
    console.log('✅ Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
} 