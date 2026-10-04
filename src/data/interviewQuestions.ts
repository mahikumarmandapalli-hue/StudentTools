export type InterviewCategory =
  | 'java'
  | 'python'
  | 'sql'
  | 'html-css'
  | 'javascript'
  | 'fullstack';

export type InterviewDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ComprehensiveInterviewItem {
  id: string;
  category: InterviewCategory;
  level: InterviewDifficulty;
  question: string;
  answer: string;
  explanation: string;
  codeExample?: string;
}

export const INTERVIEW_QUESTIONS_DATABASE: ComprehensiveInterviewItem[] = [
  // ================= JAVA =================
  {
    id: 'java-q1',
    category: 'java',
    level: 'Beginner',
    question: 'What is the difference between JDK, JRE, and JVM?',
    answer: 'JVM executes Java bytecode. JRE = JVM + core standard class libraries. JDK = JRE + compiler (javac) and development debugging tools.',
    explanation: 'JVM is the abstract runtime engine. JRE is the package needed to run Java programs. JDK is required if you write and compile Java code.',
    codeExample: `javac Program.java  # Uses JDK compiler
java Program        # Uses JRE / JVM runner`,
  },
  {
    id: 'java-q2',
    category: 'java',
    level: 'Beginner',
    question: 'Why is String immutable in Java?',
    answer: 'For security, thread-safety, memory optimization via the String Constant Pool, and hashcode caching.',
    explanation: 'If strings were mutable, passing database connection strings or file paths could result in unauthorized security mutations from outside threads.',
    codeExample: `String s1 = "Java";
s1.concat(" Rules"); // Returns new String, s1 remains "Java"`,
  },
  {
    id: 'java-q3',
    category: 'java',
    level: 'Intermediate',
    question: 'What is the contract between hashCode() and equals()?',
    answer: 'If two objects are equal according to equals(), they MUST have the same hashCode(). If they have the same hashCode(), they are NOT guaranteed to be equal (hash collision).',
    explanation: 'Violating this contract breaks key-based lookups in HashSet and HashMap.',
    codeExample: `@Override
public boolean equals(Object o) { ... }
@Override
public int hashCode() { return Objects.hash(id, name); }`,
  },
  {
    id: 'java-q4',
    category: 'java',
    level: 'Intermediate',
    question: 'What is the difference between Comparable and Comparator in Java?',
    answer: 'Comparable defines the natural sorting order within the class via compareTo(). Comparator defines custom external sorting orders via compare().',
    explanation: 'Use Comparable when a class has one primary order. Use Comparator when you need multiple dynamic orders (e.g. sorting by name vs sorting by CGPA).',
  },
  {
    id: 'java-q5',
    category: 'java',
    level: 'Advanced',
    question: 'How does Garbage Collection work in JVM, and what are G1 and ZGC?',
    answer: 'JVM GC reclaims heap memory occupied by unreachable objects. It uses generational collection (Young vs Old Gen). G1GC is region-based; ZGC is a scalable low-latency collector with sub-millisecond pause times.',
    explanation: 'Objects start in Eden space, survive into Survivor spaces (S0/S1), and are promoted to Tenured Old Gen if they endure repeated minor GCs.',
  },
  {
    id: 'java-q6',
    category: 'java',
    level: 'Advanced',
    question: 'What are Virtual Threads (Project Loom) in Java 21+?',
    answer: 'Virtual threads are lightweight threads managed by the JVM rather than the OS, allowing millions of concurrent tasks with minimal memory footprint.',
    explanation: 'Traditional OS threads consume ~1MB of stack memory each. Virtual threads mount on a pool of carrier OS threads and unmount during blocking I/O, radically simplifying high-concurrency server architectures.',
    codeExample: `Thread.startVirtualThread(() -> {
    System.out.println("Lightweight concurrent task running!");
});`,
  },

  // ================= PYTHON =================
  {
    id: 'py-q1',
    category: 'python',
    level: 'Beginner',
    question: 'What is the difference between a List and a Tuple in Python?',
    answer: 'Lists are mutable (can modify elements in place, slower, higher memory). Tuples are immutable (cannot modify after creation, faster, lower memory, hashable).',
    explanation: 'Because tuples are immutable and hashable, they can be used as keys in dictionaries and elements in sets, whereas lists cannot.',
    codeExample: `my_list = [1, 2]; my_list[0] = 99  # OK
my_tuple = (1, 2); # my_tuple[0] = 99 raises TypeError`,
  },
  {
    id: 'py-q2',
    category: 'python',
    level: 'Beginner',
    question: 'What does PEP 8 define in Python?',
    answer: 'PEP 8 is the official Python Style Guide, establishing standard conventions for 4-space indentation, snake_case variable/function names, and PascalCase class names.',
    explanation: 'Adhering to PEP 8 ensures readability across international open source and enterprise Python teams.',
  },
  {
    id: 'py-q3',
    category: 'python',
    level: 'Intermediate',
    question: 'What are *args and **kwargs in Python functions?',
    answer: '*args captures variable non-keyword positional arguments as a tuple. **kwargs captures variable keyword arguments as a dictionary.',
    explanation: 'Allows building flexible wrapper functions, decorators, and generic API handlers.',
    codeExample: `def handle(*args, **kwargs):
    print("Args tuple:", args)
    print("Kwargs dict:", kwargs)`,
  },
  {
    id: 'py-q4',
    category: 'python',
    level: 'Intermediate',
    question: 'What is the difference between shallow copy and deep copy in Python?',
    answer: 'Shallow copy (copy.copy) creates a new container but references original nested child objects. Deep copy (copy.deepcopy) recursively clones all nested objects.',
    explanation: 'Modifying a nested list in a shallow copy mutates the original object as well.',
    codeExample: `import copy
deep = copy.deepcopy(original_matrix)`,
  },
  {
    id: 'py-q5',
    category: 'python',
    level: 'Advanced',
    question: 'What is the Global Interpreter Lock (GIL) and how does it affect multi-threading?',
    answer: 'The GIL is a mutex in CPython that permits only one native thread to execute Python bytecode at a time, preventing true CPU-bound parallelism.',
    explanation: 'For I/O-bound tasks, threading and asyncio work well because the GIL is released during I/O wait. For CPU-bound tasks, use the multiprocessing module.',
  },
  {
    id: 'py-q6',
    category: 'python',
    level: 'Advanced',
    question: 'Explain Python Metaclasses and what happens when a class is constructed.',
    answer: 'A metaclass is the "class of a class". In Python, class definitions are objects created by the default metaclass type.',
    explanation: 'Metaclasses allow intercepting and modifying class construction (__new__ and __init__ on type), widely used in ORMs like Django and Pydantic.',
    codeExample: `class Meta(type):
    def __new__(cls, name, bases, dct):
        return super().__new__(cls, name, bases, dct)`,
  },

  // ================= SQL =================
  {
    id: 'sql-q1',
    category: 'sql',
    level: 'Beginner',
    question: 'What is the difference between WHERE and HAVING in SQL?',
    answer: 'WHERE filters individual table rows BEFORE aggregation. HAVING filters grouped rows AFTER GROUP BY aggregation.',
    explanation: 'You cannot use aggregate functions (SUM, AVG, COUNT) directly in a WHERE clause without a subquery, but you can in HAVING.',
    codeExample: `SELECT dept, AVG(salary) 
FROM employees 
WHERE active = true 
GROUP BY dept 
HAVING AVG(salary) > 50000;`,
  },
  {
    id: 'sql-q2',
    category: 'sql',
    level: 'Beginner',
    question: 'What is the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN?',
    answer: 'INNER JOIN returns rows with matching keys in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right table (NULL if no match). RIGHT JOIN returns all rows from the right table.',
    explanation: 'LEFT JOIN is the most common outer join in reporting to keep primary records even when related child records are missing.',
  },
  {
    id: 'sql-q3',
    category: 'sql',
    level: 'Intermediate',
    question: 'What are the ACID properties in database transactions?',
    answer: 'Atomicity (all or nothing), Consistency (preserves schema constraints), Isolation (concurrent transactions do not interfere), Durability (committed changes persist through crashes).',
    explanation: 'ACID guarantees reliable processing of database operations, critical in banking and e-commerce.',
  },
  {
    id: 'sql-q4',
    category: 'sql',
    level: 'Intermediate',
    question: 'What is the difference between Clustered and Non-Clustered Indexes?',
    answer: 'A Clustered Index alters the physical storage order of rows on disk (only 1 per table, usually Primary Key). A Non-Clustered Index is a separate B-Tree structure storing key values and pointers to data rows.',
    explanation: 'Non-clustered indexes speed up arbitrary column lookups without rearranging physical disk rows.',
  },
  {
    id: 'sql-q5',
    category: 'sql',
    level: 'Advanced',
    question: 'What are SQL Window Functions and how do RANK(), DENSE_RANK(), and ROW_NUMBER() differ?',
    answer: 'Window functions perform calculations across a set of table rows related to the current row without collapsing rows like GROUP BY.',
    explanation: 'ROW_NUMBER() assigns consecutive integers (1, 2, 3, 4). RANK() leaves gaps after ties (1, 2, 2, 4). DENSE_RANK() leaves no gaps after ties (1, 2, 2, 3).',
    codeExample: `SELECT student_name, cgpa,
       DENSE_RANK() OVER (ORDER BY cgpa DESC) as class_rank
FROM students;`,
  },

  // ================= HTML/CSS =================
  {
    id: 'web-q1',
    category: 'html-css',
    level: 'Beginner',
    question: 'What is semantic HTML and why is it important?',
    answer: 'Semantic HTML uses tags that convey the meaning of content (<header>, <nav>, <main>, <article>, <section>, <footer>) rather than generic <div> tags.',
    explanation: 'Improves accessibility for screen readers (ARIA), enhances SEO crawling, and provides clean maintainable structure.',
  },
  {
    id: 'web-q2',
    category: 'html-css',
    level: 'Beginner',
    question: 'Explain the CSS Box Model.',
    answer: 'The CSS Box Model consists of four concentric layers: Content (text/image), Padding (inner space), Border (boundary line), and Margin (outer spacing around element).',
    explanation: 'Setting box-sizing: border-box includes padding and border within the declared width/height, preventing layout breakages.',
    codeExample: `* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}`,
  },
  {
    id: 'web-q3',
    category: 'html-css',
    level: 'Intermediate',
    question: 'What is the difference between CSS Flexbox and CSS Grid?',
    answer: 'Flexbox is one-dimensional (content flows in either a row OR a column). CSS Grid is two-dimensional (manages rows AND columns simultaneously).',
    explanation: 'Use Flexbox for navigation bars, button rows, and alignment inside cards. Use Grid for full page layouts and dashboard grids.',
  },
  {
    id: 'web-q4',
    category: 'html-css',
    level: 'Intermediate',
    question: 'How do responsive media queries work?',
    answer: 'Media queries apply CSS styles conditionally based on device viewport width, resolution, or orientation.',
    explanation: 'A mobile-first workflow uses min-width queries to layer desktop styles as screen real estate expands.',
    codeExample: `@media (min-width: 768px) {
    .container { grid-template-columns: repeat(2, 1fr); }
}`,
  },
  {
    id: 'web-q5',
    category: 'html-css',
    level: 'Advanced',
    question: 'What is CSS Specificity and the Cascade hierarchy?',
    answer: 'Specificity calculates which CSS rule applies when multiple selectors match. Hierarchy: Inline styles (1000) > IDs (100) > Classes/Attributes/Pseudo-classes (10) > Elements/Pseudo-elements (1).',
    explanation: '!important overrides normal cascade hierarchy but should be avoided in production stylesheets.',
  },

  // ================= JAVASCRIPT =================
  {
    id: 'js-q1',
    category: 'javascript',
    level: 'Beginner',
    question: 'What is the difference between var, let, and const?',
    answer: 'var is function-scoped and hoisted with undefined. let is block-scoped and temporal-dead-zone guarded. const is block-scoped and immutable to reassignment.',
    explanation: 'Modern JavaScript strictly prefers const by default and let when reassignment is needed. Avoid var.',
  },
  {
    id: 'js-q2',
    category: 'javascript',
    level: 'Beginner',
    question: 'What is the difference between == and === in JavaScript?',
    answer: '== performs type coercion before comparison ("5" == 5 is true). === checks strict equality of both type and value without coercion ("5" === 5 is false).',
    explanation: 'Always use === to avoid unexpected bugs caused by implicit coercion rules.',
  },
  {
    id: 'js-q3',
    category: 'javascript',
    level: 'Intermediate',
    question: 'What are Closures in JavaScript and where are they used?',
    answer: 'A closure is a function bundled together with references to its surrounding lexical environment, allowing inner functions to access outer scope variables even after the outer function has returned.',
    explanation: 'Closures power private state, factory functions, React hooks (useState), and event listener callbacks.',
    codeExample: `function createCounter() {
    let count = 0;
    return () => ++count;
}
const count = createCounter();
console.log(count()); // 1`,
  },
  {
    id: 'js-q4',
    category: 'javascript',
    level: 'Intermediate',
    question: 'Explain the JavaScript Event Loop, Call Stack, Microtask queue, and Macrotask queue.',
    answer: 'JavaScript is single-threaded. Synchronous code runs on the Call Stack. When asynchronous operations finish, Promises resolve to the Microtask Queue, while setTimeout/setInterval callbacks enter the Macrotask Queue.',
    explanation: 'The Event Loop checks the Call Stack; when empty, it drains ALL microtasks before picking the next macrotask.',
  },
  {
    id: 'js-q5',
    category: 'javascript',
    level: 'Advanced',
    question: 'What is the Prototype Chain and how does Prototypal Inheritance work in JavaScript?',
    answer: 'Every JavaScript object has an internal [[Prototype]] link (__proto__). When an attribute is accessed, JavaScript traverses up this prototype chain until it finds the property or reaches null.',
    explanation: 'ES6 class syntax is syntactic sugar over prototype chains (Class.prototype).',
  },

  // ================= FULL STACK =================
  {
    id: 'fs-q1',
    category: 'fullstack',
    level: 'Beginner',
    question: 'What is the difference between Client-Side Rendering (CSR) and Server-Side Rendering (SSR)?',
    answer: 'CSR sends minimal HTML with a JS bundle; the browser renders the DOM. SSR renders complete HTML on the server per request, sending ready-to-view HTML directly.',
    explanation: 'SSR provides faster First Contentful Paint (FCP) and superior SEO. CSR delivers rich app-like interactivity after initial hydration.',
  },
  {
    id: 'fs-q2',
    category: 'fullstack',
    level: 'Beginner',
    question: 'What is REST and what are standard HTTP status code ranges?',
    answer: 'Representational State Transfer (REST) is an architectural style for stateless web APIs. Status ranges: 2xx (Success), 3xx (Redirection), 4xx (Client Error), 5xx (Server Error).',
    explanation: 'Key codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Error.',
  },
  {
    id: 'fs-q3',
    category: 'fullstack',
    level: 'Intermediate',
    question: 'How do JWTs (JSON Web Tokens) work for stateless user authentication?',
    answer: 'A JWT consists of Header.Payload.Signature encoded in Base64URL. The server cryptographically signs the token with a secret key. Clients send it in the Authorization: Bearer <token> header.',
    explanation: 'Because the server verifies authenticity using its public or secret key without a database lookup, JWTs enable horizontal server scaling.',
  },
  {
    id: 'fs-q4',
    category: 'fullstack',
    level: 'Intermediate',
    question: 'What is CORS (Cross-Origin Resource Sharing) and how is it resolved?',
    answer: 'CORS is a browser security mechanism that blocks scripts from making HTTP requests to a different domain/port unless the server explicitly returns Access-Control-Allow-Origin headers.',
    explanation: 'Browsers send preflight OPTIONS requests for non-simple calls; the backend must configure CORS middleware to allow trusted client origins.',
  },
  {
    id: 'fs-q5',
    category: 'fullstack',
    level: 'Advanced',
    question: 'What are Microservices vs Monolithic architectures, and when should you transition?',
    answer: 'A Monolith bundles all business domains into a single codebase and deployment unit. Microservices split services into independently deployable, domain-bounded services communicating via REST or message queues (Kafka/RabbitMQ).',
    explanation: 'Start with a modular monolith for speed and simplicity; transition to microservices when autonomous team scaling, independent deployability, and fault isolation outweigh the distributed systems operational overhead.',
  },
];
