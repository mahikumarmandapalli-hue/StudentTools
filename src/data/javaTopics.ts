export type TopicLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface PracticeCodingItem {
  problem: string;
  hint: string;
  solution: string;
  output: string;
}

export interface TopicInterviewQA {
  question: string;
  answer: string;
}

export interface ProgrammingTopic {
  id: string;
  number: number;
  title: string;
  level: TopicLevel;
  summary: string;
  explanation: string[];
  syntax: string;
  exampleCode: string;
  expectedOutput: string;
  practiceQuestions: PracticeCodingItem[];
  interviewQuestions: TopicInterviewQA[];
}

export const JAVA_TOPICS: ProgrammingTopic[] = [
  // ===================== BEGINNER (1 to 15) =====================
  {
    id: 'java-intro',
    number: 1,
    title: 'Java Introduction',
    level: 'Beginner',
    summary: 'What is Java, JVM, JRE, JDK, Write Once Run Anywhere (WORA), and features of Java.',
    explanation: [
      'Java is a robust, class-based, object-oriented programming language designed for minimal implementation dependencies.',
      'Code is compiled into bytecode (.class) which runs on any platform with a Java Virtual Machine (JVM).',
      'Core characteristics: Platform-independent, secure, multi-threaded, robust, and strongly typed.',
    ],
    syntax: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, StudentTools!");
    }
}`,
    exampleCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to Java Programming on StudentTools!");
        System.out.println("Java version runtime: " + System.getProperty("java.version"));
    }
}`,
    expectedOutput: `Welcome to Java Programming on StudentTools!
Java version runtime: 21.0.2`,
    practiceQuestions: [
      {
        problem: 'Print your name, branch, and semester on 3 distinct lines in Java.',
        hint: 'Use 3 calls to System.out.println().',
        solution: `public class Practice1 {
    public static void main(String[] args) {
        System.out.println("Name: Priya");
        System.out.println("Branch: CSE");
        System.out.println("Semester: 6th");
    }
}`,
        output: `Name: Priya\nBranch: CSE\nSemester: 6th`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What does "Write Once, Run Anywhere" (WORA) mean?',
        answer: 'Java source code compiles into platform-neutral bytecode (.class file). This bytecode can execute on any operating system that has an installed JVM, without recompiling.',
      },
    ],
  },
  {
    id: 'java-jdk-install',
    number: 2,
    title: 'Installation / JDK',
    level: 'Beginner',
    summary: 'Setting up OpenJDK / Oracle JDK, JAVA_HOME environment variable, and the javac compiler.',
    explanation: [
      'JDK (Java Development Kit) contains the javac compiler, standard libraries, and runtime tools.',
      'JRE (Java Runtime Environment) provides the JVM and libraries to run Java apps.',
      'Configure JAVA_HOME to point to your JDK root folder and add %JAVA_HOME%/bin (or $JAVA_HOME/bin) to your PATH.',
    ],
    syntax: `javac -version    # Check Java compiler version
java -version     # Check Java runtime version
javac Main.java   # Compile to Main.class
java Main         # Run bytecode`,
    exampleCode: `public class EnvCheck {
    public static void main(String[] args) {
        System.out.println("Java Home: " + System.getProperty("java.home"));
        System.out.println("OS: " + System.getProperty("os.name"));
    }
}`,
    expectedOutput: `Java Home: /usr/lib/jvm/default-java
OS: Linux`,
    practiceQuestions: [
      {
        problem: 'Write a program to display the default file encoding and user country.',
        hint: 'Use System.getProperty("file.encoding") and System.getProperty("user.country").',
        solution: `public class SysProps {
    public static void main(String[] args) {
        System.out.println("Encoding: " + System.getProperty("file.encoding"));
        System.out.println("Country: " + System.getProperty("user.country"));
    }
}`,
        output: `Encoding: UTF-8\nCountry: US`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the role of JIT (Just-In-Time) compiler inside JVM?',
        answer: 'JIT compiles frequently executed bytecode instructions ("hot spots") into native machine code at runtime, significantly boosting performance over simple interpretation.',
      },
    ],
  },
  {
    id: 'java-variables',
    number: 3,
    title: 'Variables',
    level: 'Beginner',
    summary: 'Local, instance, and static variables, variable naming rules, and initialization.',
    explanation: [
      'A variable is a named storage location in memory with a declared type and identifier.',
      'Local variables exist inside methods or blocks and must be initialized before read.',
      'Instance variables belong to an object instance; static variables belong to the class itself.',
    ],
    syntax: `type variableName = initialValue;
int score = 95;
String studentName = "Aarav";`,
    exampleCode: `public class VariablesDemo {
    static int collegeCode = 101; // static
    int rollNo = 45;              // instance

    public static void main(String[] args) {
        int currentSem = 6;       // local
        System.out.println("College: " + collegeCode + " | Sem: " + currentSem);
    }
}`,
    expectedOutput: `College: 101 | Sem: 6`,
    practiceQuestions: [
      {
        problem: 'Declare two integer variables a = 15 and b = 25, swap them without a third variable.',
        hint: 'Use arithmetic addition and subtraction (a = a + b; b = a - b; a = a - b).',
        solution: `public class Swap {
    public static void main(String[] args) {
        int a = 15, b = 25;
        a = a + b;
        b = a - b;
        a = a - b;
        System.out.println("a=" + a + ", b=" + b);
    }
}`,
        output: `a=25, b=15`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Can a local variable be declared static in Java?',
        answer: 'No. Local variables live on the stack and only exist for the duration of the method call. The static keyword applies only to class-level fields.',
      },
    ],
  },
  {
    id: 'java-data-types',
    number: 4,
    title: 'Data Types',
    level: 'Beginner',
    summary: 'The 8 primitive types (byte, short, int, long, float, double, char, boolean) and non-primitives.',
    explanation: [
      'Java provides 8 primitive types: byte (1 byte), short (2 bytes), int (4 bytes), long (8 bytes), float (4 bytes), double (8 bytes), char (2 bytes Unicode), and boolean (true/false).',
      'Non-primitive (reference) types include String, Arrays, Classes, and Interfaces.',
      'Primitives store raw binary values directly in memory; reference types store heap object addresses.',
    ],
    syntax: `byte b = 127;
int i = 50000;
long l = 10000000000L;
float f = 3.14f;
double d = 8.95;
char ch = 'A';
boolean pass = true;`,
    exampleCode: `public class DataTypesDemo {
    public static void main(String[] args) {
        int credits = 24;
        double cgpa = 9.18;
        char grade = 'O';
        boolean eligible = true;
        System.out.println("Credits: " + credits + ", CGPA: " + cgpa + ", Grade: " + grade + ", Pass: " + eligible);
    }
}`,
    expectedOutput: `Credits: 24, CGPA: 9.18, Grade: O, Pass: true`,
    practiceQuestions: [
      {
        problem: 'Print the maximum and minimum values of an integer using wrapper classes.',
        hint: 'Use Integer.MIN_VALUE and Integer.MAX_VALUE.',
        solution: `public class Limits {
    public static void main(String[] args) {
        System.out.println("Min: " + Integer.MIN_VALUE);
        System.out.println("Max: " + Integer.MAX_VALUE);
    }
}`,
        output: `Min: -2147483648\nMax: 2147483647`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why does char in Java occupy 2 bytes instead of 1 byte like in C?',
        answer: 'Java uses Unicode (UTF-16 code units) to represent international characters, accents, and symbols globally, requiring 16 bits (2 bytes).',
      },
    ],
  },
  {
    id: 'java-operators',
    number: 5,
    title: 'Operators',
    level: 'Beginner',
    summary: 'Arithmetic, relational, logical, bitwise, assignment, and ternary operators.',
    explanation: [
      'Arithmetic: +, -, *, /, % (modulus).',
      'Relational: ==, !=, >, <, >=, <= (returns boolean).',
      'Logical: && (short-circuit AND), || (short-circuit OR), ! (NOT).',
      'Ternary: condition ? valueIfTrue : valueIfFalse.',
    ],
    syntax: `int sum = 10 + 20;
boolean isAdult = age >= 18;
String status = score >= 40 ? "Pass" : "Fail";`,
    exampleCode: `public class OperatorsDemo {
    public static void main(String[] args) {
        int a = 20, b = 7;
        System.out.println("Quotient: " + (a / b));
        System.out.println("Remainder: " + (a % b));
        System.out.println("Result: " + ((a > b) && (b > 0)));
        System.out.println("Grade: " + (a >= 18 ? "Eligible" : "Minor"));
    }
}`,
    expectedOutput: `Quotient: 2\nRemainder: 6\nResult: true\nGrade: Eligible`,
    practiceQuestions: [
      {
        problem: 'Use ternary operator to find the maximum of three numbers a=12, b=45, c=29.',
        hint: '(a > b && a > c) ? a : (b > c ? b : c)',
        solution: `public class MaxTernary {
    public static void main(String[] args) {
        int a = 12, b = 45, c = 29;
        int max = (a > b && a > c) ? a : (b > c ? b : c);
        System.out.println("Max: " + max);
    }
}`,
        output: `Max: 45`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between & and && in Java?',
        answer: '&& is a short-circuit logical operator: if the left operand is false, the right operand is not evaluated. & is bitwise AND or unconditional logical AND: both operands are always evaluated.',
      },
    ],
  },
  {
    id: 'java-type-casting',
    number: 6,
    title: 'Type Casting',
    level: 'Beginner',
    summary: 'Widening (implicit) and narrowing (explicit) type conversions with overflow awareness.',
    explanation: [
      'Widening casting (automatic): byte -> short -> char -> int -> long -> float -> double. Safe, no precision loss in integer scales.',
      'Narrowing casting (manual): double -> float -> long -> int -> char -> short -> byte. Requires explicit (type) syntax and can truncate or overflow.',
    ],
    syntax: `// Widening (Implicit)
int myInt = 9;
double myDouble = myInt; // Automatic

// Narrowing (Explicit)
double d = 9.78;
int i = (int) d; // Manual: truncates decimal to 9`,
    exampleCode: `public class CastingDemo {
    public static void main(String[] args) {
        double marks = 89.75;
        int rounded = (int) marks;
        char letter = 'A';
        int ascii = letter;
        System.out.println("Rounded: " + rounded + " | ASCII of 'A': " + ascii);
    }
}`,
    expectedOutput: `Rounded: 89 | ASCII of 'A': 65`,
    practiceQuestions: [
      {
        problem: 'Convert an integer 130 into a byte using explicit cast and explain the printed result.',
        hint: 'Byte range is -128 to 127. 130 wraps around by modulo 256.',
        solution: `public class Overflow {
    public static void main(String[] args) {
        int n = 130;
        byte b = (byte) n;
        System.out.println("Cast result: " + b);
    }
}`,
        output: `Cast result: -126`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What happens when you execute (byte)(128) in Java?',
        answer: 'Since byte range is -128 to 127, 128 overflows and wraps around in two’s complement representation to -128.',
      },
    ],
  },
  {
    id: 'java-input-output',
    number: 7,
    title: 'Input and Output',
    level: 'Beginner',
    summary: 'Console I/O using Scanner, System.out.print, println, printf formatting, and BufferedReader.',
    explanation: [
      'System.out provides print(), println(), and printf() for formatted printing (%d, %s, %.2f).',
      'java.util.Scanner reads user input from System.in (nextInt, nextDouble, nextLine).',
      'BufferedReader from java.io is faster for competitive programming and high-volume I/O.',
    ],
    syntax: `import java.util.Scanner;
Scanner sc = new Scanner(System.in);
String name = sc.nextLine();
int age = sc.nextInt();
System.out.printf("Student %s is %d years old%n", name, age);`,
    exampleCode: `public class PrintfDemo {
    public static void main(String[] args) {
        String student = "Sneha";
        double cgpa = 9.4567;
        int sem = 4;
        System.out.printf("Student: %-10s | Sem: %02d | CGPA: %.2f%n", student, sem, cgpa);
    }
}`,
    expectedOutput: `Student: Sneha      | Sem: 04 | CGPA: 9.46`,
    practiceQuestions: [
      {
        problem: 'Format a bill receipt with item "Laptop", price 65499.50, and discount 10% using printf.',
        hint: 'Use %s for item and %.2f for prices.',
        solution: `public class Receipt {
    public static void main(String[] args) {
        String item = "Laptop";
        double price = 65499.50;
        double disc = price * 0.10;
        double net = price - disc;
        System.out.printf("%s: Rs.%.2f (Net: Rs.%.2f)%n", item, price, net);
    }
}`,
        output: `Laptop: Rs.65499.50 (Net: Rs.58949.55)`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why is BufferedReader preferred over Scanner in large competitive coding problems?',
        answer: 'BufferedReader has a larger buffer (8KB vs 1KB) and parses raw strings without regex scanning overhead, making it significantly faster.',
      },
    ],
  },
  {
    id: 'java-conditionals',
    number: 8,
    title: 'If / If-Else / Else-If',
    level: 'Beginner',
    summary: 'Branching logic, nested if statements, and boundary condition evaluation.',
    explanation: [
      'if evaluates a boolean condition; if true, the inner block runs.',
      'else provides a fallback when the initial condition is false.',
      'else-if cascades multiple conditions sequentially until one matches.',
    ],
    syntax: `if (condition1) {
    // statement 1
} else if (condition2) {
    // statement 2
} else {
    // default statement
}`,
    exampleCode: `public class GradeClassifier {
    public static void main(String[] args) {
        int marks = 85;
        if (marks >= 90) {
            System.out.println("Grade O (Outstanding)");
        } else if (marks >= 80) {
            System.out.println("Grade A+ (Distinction)");
        } else if (marks >= 70) {
            System.out.println("Grade A (First Class)");
        } else {
            System.out.println("Pass");
        }
    }
}`,
    expectedOutput: `Grade A+ (Distinction)`,
    practiceQuestions: [
      {
        problem: 'Write a program to check if a given year (2024) is a Leap Year.',
        hint: '(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)',
        solution: `public class LeapYear {
    public static void main(String[] args) {
        int year = 2024;
        boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
        System.out.println(year + " is leap: " + isLeap);
    }
}`,
        output: `2024 is leap: true`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Can you use an integer expression inside an if condition in Java (e.g. if (1))?',
        answer: 'No. Unlike C/C++, Java strictly requires a boolean expression inside if statements. Passing an int causes a compilation error.',
      },
    ],
  },
  {
    id: 'java-switch',
    number: 9,
    title: 'Switch',
    level: 'Beginner',
    summary: 'Traditional switch-case, break, default, and modern Java 14+ switch expressions with yield.',
    explanation: [
      'switch selects code paths based on primitive integers, byte, short, char, String, or enums.',
      'Each case requires a break statement in traditional switch to prevent fall-through.',
      'Modern Java supports arrow syntax (case X ->) without manual break and with expression return.',
    ],
    syntax: `switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    default -> "Weekend";
}`,
    exampleCode: `public class SwitchDemo {
    public static void main(String[] args) {
        int sem = 3;
        String title = switch (sem) {
            case 1, 2 -> "First Year Foundation";
            case 3, 4 -> "Core Engineering";
            case 5, 6 -> "Advanced Electives";
            case 7, 8 -> "Capstone & Placement";
            default -> "Unknown";
        };
        System.out.println("Semester " + sem + ": " + title);
    }
}`,
    expectedOutput: `Semester 3: Core Engineering`,
    practiceQuestions: [
      {
        problem: 'Implement a simple calculator using switch for operator char op = \'*\', a = 12, b = 4.',
        hint: 'switch(op) { case \'+\': ... case \'*\': ... }',
        solution: `public class CalcSwitch {
    public static void main(String[] args) {
        char op = '*';
        int a = 12, b = 4;
        int res = switch (op) {
            case '+' -> a + b;
            case '-' -> a - b;
            case '*' -> a * b;
            case '/' -> a / b;
            default -> 0;
        };
        System.out.println("Result: " + res);
    }
}`,
        output: `Result: 48`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Which data types are allowed in a Java switch statement?',
        answer: 'byte, short, char, int, their respective Wrapper classes (Byte, Short, Character, Integer), String (since Java 7), and Enum types. float, double, and boolean are NOT allowed.',
      },
    ],
  },
  {
    id: 'java-for-loop',
    number: 10,
    title: 'For Loop',
    level: 'Beginner',
    summary: 'Standard for loop, enhanced for-each loop, nested loops, break, and continue.',
    explanation: [
      'for (init; condition; update) controls definite iteration where number of repeats is known.',
      'Enhanced for-each loop iterates directly over arrays and Iterable collections.',
      'break exits the loop immediately; continue skips to the next iteration.',
    ],
    syntax: `for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

for (String item : array) {
    System.out.println(item);
}`,
    exampleCode: `public class ForLoopDemo {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 5; i++) {
            sum += i;
        }
        System.out.println("Sum 1..5: " + sum);

        String[] tools = {"Pomodoro", "CGPA", "Resume"};
        for (String t : tools) {
            System.out.print(t + " ");
        }
        System.out.println();
    }
}`,
    expectedOutput: `Sum 1..5: 15\nPomodoro CGPA Resume `,
    practiceQuestions: [
      {
        problem: 'Print the first 5 terms of the Fibonacci series (0, 1, 1, 2, 3) using a for loop.',
        hint: 'Keep track of prev1 = 0 and prev2 = 1.',
        solution: `public class Fibo {
    public static void main(String[] args) {
        int a = 0, b = 1;
        for (int i = 0; i < 5; i++) {
            System.out.print(a + " ");
            int next = a + b;
            a = b;
            b = next;
        }
    }
}`,
        output: `0 1 1 2 3 `,
      },
    ],
    interviewQuestions: [
      {
        question: 'Can you create an infinite loop using for in Java?',
        answer: 'Yes: for (;;) { ... } is valid Java syntax for an infinite loop equivalent to while(true).',
      },
    ],
  },
  {
    id: 'java-while-loop',
    number: 11,
    title: 'While Loop',
    level: 'Beginner',
    summary: 'Pre-tested iteration when condition is tested prior to entering loop body.',
    explanation: [
      'while (condition) repeats execution as long as condition evaluates to true.',
      'If the condition is initially false, the loop body never executes.',
      'Always ensure the loop body updates the condition variables to avoid infinite loops.',
    ],
    syntax: `while (condition) {
    // statements
    // step counter update
}`,
    exampleCode: `public class WhileDemo {
    public static void main(String[] args) {
        int count = 1;
        while (count <= 3) {
            System.out.println("Session #" + count);
            count++;
        }
    }
}`,
    expectedOutput: `Session #1\nSession #2\nSession #3`,
    practiceQuestions: [
      {
        problem: 'Reverse the digits of integer n = 1234 using a while loop.',
        hint: 'Extract last digit with n % 10 and remove it with n /= 10.',
        solution: `public class ReverseNum {
    public static void main(String[] args) {
        int n = 1234, rev = 0;
        while (n != 0) {
            rev = rev * 10 + (n % 10);
            n /= 10;
        }
        System.out.println("Reversed: " + rev);
    }
}`,
        output: `Reversed: 4321`,
      },
    ],
    interviewQuestions: [
      {
        question: 'When should you prefer a while loop over a for loop?',
        answer: 'Use a while loop when the number of iterations is indefinite and depends on a dynamic condition (like reading a file stream until EOF or receiving socket packets).',
      },
    ],
  },
  {
    id: 'java-do-while-loop',
    number: 12,
    title: 'Do-While Loop',
    level: 'Beginner',
    summary: 'Post-tested iteration that executes at least once regardless of condition.',
    explanation: [
      'do-while executes the loop body first, and then tests the condition at the end.',
      'Guarantees at least 1 iteration, making it ideal for console menu-driven applications.',
      'A semicolon is mandatory after the closing while condition.',
    ],
    syntax: `do {
    // executed at least once
} while (condition);`,
    exampleCode: `public class DoWhileDemo {
    public static void main(String[] args) {
        int attempt = 1;
        do {
            System.out.println("Processing login attempt: " + attempt);
            attempt++;
        } while (attempt <= 2);
    }
}`,
    expectedOutput: `Processing login attempt: 1\nProcessing login attempt: 2`,
    practiceQuestions: [
      {
        problem: 'Write a do-while loop that prints numbers from 10 down to 7.',
        hint: 'Start with i = 10, decrement i--, loop while i >= 7.',
        solution: `public class Countdown {
    public static void main(String[] args) {
        int i = 10;
        do {
            System.out.print(i + " ");
            i--;
        } while (i >= 7);
    }
}`,
        output: `10 9 8 7 `,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the primary architectural difference between while and do-while?',
        answer: 'while is pre-tested (evaluates condition before entry); do-while is post-tested (evaluates condition after execution, guaranteeing at least one run).',
      },
    ],
  },
  {
    id: 'java-arrays',
    number: 13,
    title: 'Arrays',
    level: 'Beginner',
    summary: 'Fixed-size homogenous data structures, 1D and 2D arrays, and java.util.Arrays utilities.',
    explanation: [
      'An array stores multiple items of the same type at contiguous memory locations.',
      'Arrays in Java are objects stored in the heap with a public final length property.',
      'Indices start at 0 and end at length - 1. Accessing beyond throws ArrayIndexOutOfBoundsException.',
    ],
    syntax: `int[] scores = new int[5];
int[] primes = {2, 3, 5, 7, 11};
int length = primes.length;`,
    exampleCode: `import java.util.Arrays;

public class ArrayDemo {
    public static void main(String[] args) {
        int[] marks = {85, 92, 78, 96, 88};
        Arrays.sort(marks);
        System.out.println("Sorted: " + Arrays.toString(marks));
        System.out.println("Highest: " + marks[marks.length - 1]);
    }
}`,
    expectedOutput: `Sorted: [78, 85, 88, 92, 96]\nHighest: 96`,
    practiceQuestions: [
      {
        problem: 'Find the average of array elements: double[] gpas = {8.5, 9.0, 7.8, 8.7}.',
        hint: 'Sum elements with a loop and divide by gpas.length.',
        solution: `public class AvgGpa {
    public static void main(String[] args) {
        double[] gpas = {8.5, 9.0, 7.8, 8.7};
        double sum = 0;
        for (double g : gpas) sum += g;
        System.out.printf("Average: %.2f%n", sum / gpas.length);
    }
}`,
        output: `Average: 8.50`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why are arrays fixed in length in Java?',
        answer: 'Arrays are allocated in contiguous blocks of memory at initialization for O(1) index access speed. To dynamically resize, use ArrayList from the Collections framework.',
      },
    ],
  },
  {
    id: 'java-strings',
    number: 14,
    title: 'Strings',
    level: 'Beginner',
    summary: 'String immutability, String Constant Pool (SCP), StringBuilder, and core methods.',
    explanation: [
      'Strings are immutable objects in Java; any modification creates a new String instance.',
      'String literals are stored in the String Constant Pool (SCP) to conserve heap memory.',
      'Use StringBuilder for high-performance string concatenation in single-threaded loops.',
    ],
    syntax: `String s1 = "StudentTools";
String s2 = new String("StudentTools");
boolean equals = s1.equals(s2); // true (value equality)
boolean ref = (s1 == s2);       // false (different memory)`,
    exampleCode: `public class StringDemo {
    public static void main(String[] args) {
        String portal = "StudentTools";
        System.out.println("Upper: " + portal.toUpperCase());
        System.out.println("Substring: " + portal.substring(0, 7));
        System.out.println("Contains Tools: " + portal.contains("Tools"));
    }
}`,
    expectedOutput: `Upper: STUDENTTOOLS\nSubstring: Student\nContains Tools: true`,
    practiceQuestions: [
      {
        problem: 'Check if a string "radar" is a Palindrome.',
        hint: 'Compare char at left and right pointers moving inward.',
        solution: `public class Palindrome {
    public static void main(String[] args) {
        String s = "radar";
        String rev = new StringBuilder(s).reverse().toString();
        System.out.println(s + " is palindrome: " + s.equals(rev));
    }
}`,
        output: `radar is palindrome: true`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why is String immutable in Java?',
        answer: 'For security (network URLs/passwords cannot be tampered with), thread safety (shareable across threads without synchronization), and memory caching via String Constant Pool.',
      },
    ],
  },
  {
    id: 'java-methods',
    number: 15,
    title: 'Methods',
    level: 'Beginner',
    summary: 'Method signature, return types, pass-by-value semantics, parameters, and recursion.',
    explanation: [
      'A method is a reusable block of code that performs a specific task.',
      'Components: Access modifier, return type, method name, parameter list, and body.',
      'Java is strictly Pass-by-Value: method receives copies of primitive values or copies of object references.',
    ],
    syntax: `modifier returnType methodName(parameterList) {
    // method body
    return value;
}`,
    exampleCode: `public class MethodsDemo {
    static double calculatePercentage(int obtained, int total) {
        return ((double) obtained / total) * 100.0;
    }

    public static void main(String[] args) {
        double result = calculatePercentage(475, 500);
        System.out.printf("Percentage: %.2f%%%n", result);
    }
}`,
    expectedOutput: `Percentage: 95.00%`,
    practiceQuestions: [
      {
        problem: 'Write a recursive method to calculate the factorial of n = 5.',
        hint: 'Base case: if (n <= 1) return 1; recursive case: return n * fact(n - 1);',
        solution: `public class Fact {
    static int fact(int n) {
        return (n <= 1) ? 1 : n * fact(n - 1);
    }
    public static void main(String[] args) {
        System.out.println("5! = " + fact(5));
    }
}`,
        output: `5! = 120`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Does Java support pass-by-reference?',
        answer: 'No. Java is strictly Pass-by-Value. When passing an object, the value of the reference (pointer address) is passed by value.',
      },
    ],
  },

  // ===================== INTERMEDIATE (16 to 33) =====================
  {
    id: 'java-classes-objects',
    number: 16,
    title: 'Classes and Objects',
    level: 'Intermediate',
    summary: 'Blueprint vs instance, new keyword, state and behavior, and reference variables.',
    explanation: [
      'A Class is a blueprint or template that defines fields (state) and methods (behavior).',
      'An Object is a concrete runtime instance of a class allocated in the heap with new.',
      'Multiple object instances can exist simultaneously, each holding independent member data.',
    ],
    syntax: `class Student {
    String name;
    double cgpa;
    void study() { System.out.println(name + " is studying"); }
}
Student s1 = new Student();`,
    exampleCode: `class Course {
    String code;
    int credits;

    Course(String c, int cr) {
        code = c;
        credits = cr;
    }

    void display() {
        System.out.println("Course: " + code + " (" + credits + " Credits)");
    }
}

public class Main {
    public static void main(String[] args) {
        Course c1 = new Course("CS301", 4);
        c1.display();
    }
}`,
    expectedOutput: `Course: CS301 (4 Credits)`,
    practiceQuestions: [
      {
        problem: 'Create a Book class with title and price fields, and a method isAffordable() returning true if price < 500.',
        hint: 'Define class fields, constructor, and boolean helper method.',
        solution: `class Book {
    String title; double price;
    Book(String t, double p) { title = t; price = p; }
    boolean isAffordable() { return price < 500; }
}
public class BookTest {
    public static void main(String[] args) {
        Book b = new Book("DSA Guide", 420.0);
        System.out.println(b.title + " affordable: " + b.isAffordable());
    }
}`,
        output: `DSA Guide affordable: true`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Where are objects and local variables stored in Java memory architecture?',
        answer: 'Objects are always stored in the Heap memory; primitive local variables and reference pointers are stored on the Thread Stack.',
      },
    ],
  },
  {
    id: 'java-constructors',
    number: 17,
    title: 'Constructors',
    level: 'Intermediate',
    summary: 'Default, parameterized, and copy constructors, constructor chaining with this().',
    explanation: [
      'A constructor initializes a newly created object. It has the exact same name as the class and no return type.',
      'If no constructor is provided, Java injects an implicit no-argument default constructor.',
      'Constructors can be overloaded and chained using this(arguments).',
    ],
    syntax: `class User {
    User() { /* default */ }
    User(String name) { this.name = name; }
}`,
    exampleCode: `class UserProfile {
    String username;
    String tier;

    UserProfile(String u) {
        this(u, "Free"); // Constructor chaining
    }

    UserProfile(String u, String t) {
        this.username = u;
        this.tier = t;
    }

    void info() {
        System.out.println("User: " + username + " [" + tier + "]");
    }
}

public class ConstrDemo {
    public static void main(String[] args) {
        UserProfile p1 = new UserProfile("student42");
        p1.info();
    }
}`,
    expectedOutput: `User: student42 [Free]`,
    practiceQuestions: [
      {
        problem: 'Create a Rectangle class with width and height, providing both a square constructor (1 param) and rectangle constructor (2 params).',
        hint: 'Use this(side, side) in the square constructor.',
        solution: `class Rect {
    int w, h;
    Rect(int side) { this(side, side); }
    Rect(int w, int h) { this.w = w; this.h = h; }
    int area() { return w * h; }
}
public class TestRect {
    public static void main(String[] args) {
        System.out.println("Area: " + new Rect(5).area());
    }
}`,
        output: `Area: 25`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Can a constructor be declared final, static, or abstract?',
        answer: 'No. Constructors cannot be inherited (so final is invalid), they belong to instance creation (not static), and they must have an implementation body (cannot be abstract).',
      },
    ],
  },
  {
    id: 'java-this-keyword',
    number: 18,
    title: 'this',
    level: 'Intermediate',
    summary: 'Reference to current instance, disambiguating variable shadowing, passing this as argument.',
    explanation: [
      'this refers to the current invoking object instance.',
      'Used to resolve naming collisions between instance variables and constructor parameters.',
      'Can be used to invoke current class constructors: this() must be the first statement.',
    ],
    syntax: `class Account {
    int id;
    Account(int id) {
        this.id = id; // resolves shadowing
    }
}`,
    exampleCode: `public class ThisDemo {
    int count = 10;
    void update(int count) {
        this.count = count;
    }
    public static void main(String[] args) {
        ThisDemo d = new ThisDemo();
        d.update(50);
        System.out.println("Updated count: " + d.count);
    }
}`,
    expectedOutput: `Updated count: 50`,
    practiceQuestions: [
      {
        problem: 'Demonstrate returning the current object using return this; to enable method chaining.',
        hint: 'Method should return the class type and return this.',
        solution: `class Builder {
    int score = 0;
    Builder add(int n) { this.score += n; return this; }
}
public class ChainTest {
    public static void main(String[] args) {
        Builder b = new Builder().add(10).add(20);
        System.out.println("Score: " + b.score);
    }
}`,
        output: `Score: 30`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Can you use the "this" keyword inside a static method?',
        answer: 'No. Static methods belong to the class and are executed without an object context, whereas "this" requires a specific instance reference.',
      },
    ],
  },
  {
    id: 'java-super-keyword',
    number: 19,
    title: 'super',
    level: 'Intermediate',
    summary: 'Referencing parent class members, invoking parent constructors with super().',
    explanation: [
      'super refers to the immediate parent (superclass) object.',
      'super() invokes the parent class constructor and must be the first line in the child constructor.',
      'super.method() calls an overridden parent method.',
    ],
    syntax: `class Child extends Parent {
    Child() {
        super(); // call parent constructor
    }
    void show() {
        super.display(); // call parent method
    }
}`,
    exampleCode: `class Tool {
    String type = "Academic Tool";
    Tool() { System.out.println("Tool Initialized"); }
}

class Calculator extends Tool {
    Calculator() {
        super();
        System.out.println("Calculator Ready: " + super.type);
    }
}

public class SuperDemo {
    public static void main(String[] args) {
        new Calculator();
    }
}`,
    expectedOutput: `Tool Initialized\nCalculator Ready: Academic Tool`,
    practiceQuestions: [
      {
        problem: 'Create Animal with eat() and Dog with eat() that prints "eating meat" and calls super.eat().',
        hint: 'super.eat() inside Dog.eat()',
        solution: `class Animal { void eat() { System.out.println("Animal eats"); } }
class Dog extends Animal {
    void eat() { super.eat(); System.out.println("Dog eats bones"); }
}
public class SuperTest {
    public static void main(String[] args) { new Dog().eat(); }
}`,
        output: `Animal eats\nDog eats bones`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What happens if a parent class does not have a default constructor and child uses super()?',
        answer: 'A compilation error occurs unless the child constructor explicitly calls an existing parameterized parent constructor like super(arg).',
      },
    ],
  },
  {
    id: 'java-static-keyword',
    number: 20,
    title: 'static',
    level: 'Intermediate',
    summary: 'Class-level static variables, static methods, static blocks, and memory allocation in Metaspace.',
    explanation: [
      'static members belong to the class itself rather than any individual instance.',
      'A single copy of a static variable is shared among all instances.',
      'Static blocks execute once when the class is first loaded into memory by the ClassLoader.',
    ],
    syntax: `static int counter = 0;
static void helper() { /* class method */ }
static {
    // executes once at class loading
}`,
    exampleCode: `public class StaticDemo {
    static int userCount = 0;

    StaticDemo() {
        userCount++;
    }

    public static void main(String[] args) {
        new StaticDemo();
        new StaticDemo();
        System.out.println("Active Users: " + StaticDemo.userCount);
    }
}`,
    expectedOutput: `Active Users: 2`,
    practiceQuestions: [
      {
        problem: 'Create a MathUtils class with a static method cube(int n) and invoke it without creating an object.',
        hint: 'MathUtils.cube(4)',
        solution: `class MathUtils {
    static int cube(int n) { return n * n * n; }
}
public class TestStatic {
    public static void main(String[] args) {
        System.out.println("Cube of 4: " + MathUtils.cube(4));
    }
}`,
        output: `Cube of 4: 64`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why is main() method static in Java?',
        answer: 'So the JVM can invoke Main.main(args) directly at startup without needing to allocate an instance of the class first.',
      },
    ],
  },
  {
    id: 'java-final-keyword',
    number: 21,
    title: 'final',
    level: 'Intermediate',
    summary: 'Constants (final variables), non-overridable methods, and non-inheritable final classes.',
    explanation: [
      'final variable: Value cannot be reassigned once initialized (constant).',
      'final method: Cannot be overridden by any subclass.',
      'final class: Cannot be extended/subclassed (e.g. java.lang.String, Integer).',
    ],
    syntax: `final double PI = 3.14159;
final class SecureNode { /* cannot be extended */ }
final void execute() { /* cannot be overridden */ }`,
    exampleCode: `public class FinalDemo {
    public static void main(String[] args) {
        final int MAX_ATTEMPTS = 3;
        System.out.println("Max login attempts: " + MAX_ATTEMPTS);
    }
}`,
    expectedOutput: `Max login attempts: 3`,
    practiceQuestions: [
      {
        problem: 'Declare a blank final variable inside a class and initialize it inside the constructor.',
        hint: 'final int code; Constr(int c) { code = c; }',
        solution: `class Config {
    final int port;
    Config(int p) { this.port = p; }
}
public class BlankFinal {
    public static void main(String[] args) {
        System.out.println("Port: " + new Config(8080).port);
    }
}`,
        output: `Port: 8080`,
      },
    ],
    interviewQuestions: [
      {
        question: 'If an object reference is declared final, can its internal properties be modified?',
        answer: 'Yes! A final reference means you cannot point it to a different object address (ref = newObj is forbidden), but the internal fields of the referenced object can still be modified.',
      },
    ],
  },
  {
    id: 'java-encapsulation',
    number: 22,
    title: 'Encapsulation',
    level: 'Intermediate',
    summary: 'Data hiding with private fields, public getters and setters, and data validation.',
    explanation: [
      'Encapsulation bundles data (fields) and methods operating on that data into a single unit.',
      'Fields are kept private to protect internal state from direct external tampering.',
      'Public getters and setters provide controlled access and allow input validation.',
    ],
    syntax: `class Account {
    private double balance;
    public double getBalance() { return balance; }
    public void deposit(double amt) { if (amt > 0) balance += amt; }
}`,
    exampleCode: `class StudentRecord {
    private String name;
    private double cgpa;

    public void setCgpa(double c) {
        if (c >= 0.0 && c <= 10.0) {
            this.cgpa = c;
        }
    }

    public double getCgpa() {
        return this.cgpa;
    }
}

public class EncapsulationDemo {
    public static void main(String[] args) {
        StudentRecord s = new StudentRecord();
        s.setCgpa(9.45);
        System.out.println("Validated CGPA: " + s.getCgpa());
    }
}`,
    expectedOutput: `Validated CGPA: 9.45`,
    practiceQuestions: [
      {
        problem: 'Create an Employee class with private salary. Reject negative salary updates in setSalary().',
        hint: 'In setter: if (s > 0) salary = s; else print error.',
        solution: `class Employee {
    private int salary;
    public void setSalary(int s) { if (s > 0) this.salary = s; }
    public int getSalary() { return salary; }
}
public class EmpTest {
    public static void main(String[] args) {
        Employee e = new Employee(); e.setSalary(45000);
        System.out.println("Salary: " + e.getSalary());
    }
}`,
        output: `Salary: 45000`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the key advantage of encapsulation in enterprise software?',
        answer: 'Maintainability and decoupling: internal field implementations can change without breaking client code, and validation guarantees invariant integrity.',
      },
    ],
  },
  {
    id: 'java-inheritance',
    number: 23,
    title: 'Inheritance',
    level: 'Intermediate',
    summary: 'IS-A relationship, extends keyword, single, multilevel, and hierarchical inheritance.',
    explanation: [
      'Inheritance allows a subclass to acquire methods and fields of an existing superclass.',
      'Promotes code reusability and enables polymorphic behavior.',
      'Java supports single class inheritance (a class can only extend one direct superclass).',
    ],
    syntax: `class Animal { void breathe() {} }
class Bird extends Animal { void fly() {} }`,
    exampleCode: `class AcademicItem {
    String institute = "NIT";
}

class GradeCard extends AcademicItem {
    double gpa = 9.2;
    void printDetails() {
        System.out.println("Institute: " + institute + " | GPA: " + gpa);
    }
}

public class InheritDemo {
    public static void main(String[] args) {
        new GradeCard().printDetails();
    }
}`,
    expectedOutput: `Institute: NIT | GPA: 9.2`,
    practiceQuestions: [
      {
        problem: 'Build Vehicle -> Car -> ElectricCar (Multilevel inheritance) with a drive() method.',
        hint: 'Chain extends keywords.',
        solution: `class Vehicle { void start() { System.out.println("Engine started"); } }
class Car extends Vehicle {}
class ElectricCar extends Car {
    void drive() { start(); System.out.println("Driving silent EV"); }
}
public class MultiInherit {
    public static void main(String[] args) { new ElectricCar().drive(); }
}`,
        output: `Engine started\nDriving silent EV`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why does Java not support multiple class inheritance?',
        answer: 'To prevent the Diamond Problem ambiguity (where two parent classes define the same method signature, creating conflict on which parent method the child inherits).',
      },
    ],
  },
  {
    id: 'java-polymorphism',
    number: 24,
    title: 'Polymorphism',
    level: 'Intermediate',
    summary: 'Many forms: compile-time (overloading) vs runtime (dynamic method dispatch via overriding).',
    explanation: [
      'Polymorphism allows objects of different types to be treated through a common supertype interface.',
      'Compile-time polymorphism: Method Overloading (resolved by compiler based on arguments).',
      'Runtime polymorphism: Method Overriding (resolved at runtime based on actual object instance in heap).',
    ],
    syntax: `Parent obj = new Child();
obj.display(); // Calls Child's overridden method at runtime!`,
    exampleCode: `class Shape {
    void draw() { System.out.println("Drawing generic shape"); }
}

class Circle extends Shape {
    @Override
    void draw() { System.out.println("Drawing Circle with radius r"); }
}

public class PolyDemo {
    public static void main(String[] args) {
        Shape s = new Circle(); // Upcasting
        s.draw(); // Dynamic method dispatch
    }
}`,
    expectedOutput: `Drawing Circle with radius r`,
    practiceQuestions: [
      {
        problem: 'Create an array of Shape references containing Circle and Square, calling draw() in a loop.',
        hint: 'Shape[] shapes = { new Circle(), new Square() };',
        solution: `class Square extends Shape { void draw() { System.out.println("Drawing Square"); } }
public class PolyArray {
    public static void main(String[] args) {
        Shape[] arr = { new Circle(), new Square() };
        for (Shape s : arr) s.draw();
    }
}`,
        output: `Drawing Circle with radius r\nDrawing Square`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is Dynamic Method Dispatch in Java?',
        answer: 'The runtime mechanism where a call to an overridden method is resolved at runtime rather than compile time based on the actual object type pointed to by the reference.',
      },
    ],
  },
  {
    id: 'java-overloading',
    number: 25,
    title: 'Method Overloading',
    level: 'Intermediate',
    summary: 'Multiple methods with same name differing in parameter count, type, or order.',
    explanation: [
      'Methods in the same class share a name but have different parameter lists.',
      'Return type alone does NOT differentiate overloaded methods.',
      'Compiler selects the exact method based on argument signatures at compile time.',
    ],
    syntax: `int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }
int add(int a, int b, int c) { return a + b + c; }`,
    exampleCode: `public class OverloadDemo {
    static int area(int side) { return side * side; }
    static int area(int l, int b) { return l * b; }

    public static void main(String[] args) {
        System.out.println("Square Area: " + area(4));
        System.out.println("Rectangle Area: " + area(4, 8));
    }
}`,
    expectedOutput: `Square Area: 16\nRectangle Area: 32`,
    practiceQuestions: [
      {
        problem: 'Overload a printReceipt() method to accept either just totalAmount or totalAmount + discount.',
        hint: 'Define printReceipt(double amt) and printReceipt(double amt, double disc).',
        solution: `public class ReceiptOverload {
    static void printReceipt(double a) { System.out.println("Total: " + a); }
    static void printReceipt(double a, double d) { System.out.println("Net: " + (a - d)); }
    public static void main(String[] args) {
        printReceipt(100.0);
        printReceipt(100.0, 15.0);
    }
}`,
        output: `Total: 100.0\nNet: 85.0`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Can you overload methods by changing only the return type in Java?',
        answer: 'No. Changing only the return type causes a compile-time error because the compiler cannot determine which method to invoke if the return value is ignored by the caller.',
      },
    ],
  },
  {
    id: 'java-overriding',
    number: 26,
    title: 'Method Overriding',
    level: 'Intermediate',
    summary: 'Subclass redefining superclass method with identical signature, @Override annotation.',
    explanation: [
      'Subclass provides its own specific implementation of a method defined in its superclass.',
      'Must have identical method name, parameter list, and compatible (covariant) return type.',
      'The access modifier cannot be more restrictive than the parent method.',
    ],
    syntax: `class Parent {
    void greet() { System.out.println("Hello"); }
}
class Child extends Parent {
    @Override
    void greet() { System.out.println("Hi there!"); }
}`,
    exampleCode: `class Bank {
    double getInterestRate() { return 4.0; }
}

class SBI extends Bank {
    @Override
    double getInterestRate() { return 6.5; }
}

public class OverrideDemo {
    public static void main(String[] args) {
        Bank b = new SBI();
        System.out.println("Rate: " + b.getInterestRate() + "%");
    }
}`,
    expectedOutput: `Rate: 6.5%`,
    practiceQuestions: [
      {
        problem: 'Create a Notification class with send() and SMSNotification subclass that overrides send() to prepend "[SMS]: ".',
        hint: 'Use @Override on send().',
        solution: `class Notification { void send() { System.out.println("Generic Alert"); } }
class SMSNotification extends Notification {
    @Override void send() { System.out.println("[SMS]: OTP 4920"); }
}
public class NotifTest {
    public static void main(String[] args) { new SMSNotification().send(); }
}`,
        output: `[SMS]: OTP 4920`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Can static or private methods be overridden in Java?',
        answer: 'No. Private methods are not visible to subclasses, and static methods belong to the class (redefining them is "method hiding", not overriding).',
      },
    ],
  },
  {
    id: 'java-abstraction',
    number: 27,
    title: 'Abstraction',
    level: 'Intermediate',
    summary: 'Hiding internal complexity, abstract classes, abstract methods, and partial implementation.',
    explanation: [
      'Abstraction shows essential features while hiding background details.',
      'An abstract class cannot be instantiated directly and can contain both abstract and concrete methods.',
      'Subclasses MUST implement all inherited abstract methods unless the subclass is also abstract.',
    ],
    syntax: `abstract class Payment {
    abstract void process(double amount);
    void receipt() { System.out.println("Receipt generated"); }
}`,
    exampleCode: `abstract class CloudWorkspace {
    abstract void sync();
    void showStatus() { System.out.println("Connected to Firestore"); }
}

class StudentWorkspace extends CloudWorkspace {
    @Override
    void sync() { System.out.println("Syncing resume & notes to Firebase"); }
}

public class AbstractDemo {
    public static void main(String[] args) {
        CloudWorkspace ws = new StudentWorkspace();
        ws.showStatus();
        ws.sync();
    }
}`,
    expectedOutput: `Connected to Firestore\nSyncing resume & notes to Firebase`,
    practiceQuestions: [
      {
        problem: 'Define abstract class Vehicle with abstract int getWheels(). Implement Car (4 wheels) and Bike (2 wheels).',
        hint: 'Return wheel count from subclasses.',
        solution: `abstract class Vehicle { abstract int getWheels(); }
class Car extends Vehicle { int getWheels() { return 4; } }
class Bike extends Vehicle { int getWheels() { return 2; } }
public class WheelsTest {
    public static void main(String[] args) {
        System.out.println("Car: " + new Car().getWheels() + " | Bike: " + new Bike().getWheels());
    }
}`,
        output: `Car: 4 | Bike: 2`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Can an abstract class have a constructor?',
        answer: 'Yes! Even though you cannot instantiate an abstract class with new, its constructor is called during subclass object construction via super().',
      },
    ],
  },
  {
    id: 'java-interfaces',
    number: 28,
    title: 'Interfaces',
    level: 'Intermediate',
    summary: 'Contracts, implements keyword, multiple inheritance of type, default and static methods.',
    explanation: [
      'An interface defines a contract of abstract behavior that classes implement.',
      'All variables in an interface are implicitly public static final.',
      'Java 8 introduced default methods (with bodies) and static helper methods in interfaces.',
    ],
    syntax: `interface Exportable {
    void exportToPDF();
    default void log() { System.out.println("Logged export"); }
}
class Resume implements Exportable { ... }`,
    exampleCode: `interface Printable {
    void print();
}

interface Shareable {
    void share();
}

class ResumeDocument implements Printable, Shareable {
    public void print() { System.out.println("Printing Resume on A4 paper"); }
    public void share() { System.out.println("Sharing public preview link"); }
}

public class InterfaceDemo {
    public static void main(String[] args) {
        ResumeDocument doc = new ResumeDocument();
        doc.print();
        doc.share();
    }
}`,
    expectedOutput: `Printing Resume on A4 paper\nSharing public preview link`,
    practiceQuestions: [
      {
        problem: 'Create an interface Calculator with default method square(int x) returning x * x.',
        hint: 'default int square(int x) { return x * x; }',
        solution: `interface Calc { default int square(int x) { return x * x; } }
class MyCalc implements Calc {}
public class DefaultTest {
    public static void main(String[] args) {
        System.out.println("Square of 7: " + new MyCalc().square(7));
    }
}`,
        output: `Square of 7: 49`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is a Marker Interface in Java?',
        answer: 'An empty interface with no methods or constants (e.g. Serializable, Cloneable, Remote) used to convey metadata or special capability to the JVM or compiler.',
      },
    ],
  },
  {
    id: 'java-packages',
    number: 29,
    title: 'Packages',
    level: 'Intermediate',
    summary: 'Namespace management, import statements, package-private access, and standard library hierarchy.',
    explanation: [
      'Packages prevent naming collisions and group related classes into folders/modules.',
      'Defined using package com.example.tools; as the very first line of a .java file.',
      'Standard packages include java.lang (auto-imported), java.util, java.io, and java.net.',
    ],
    syntax: `package com.studenttools.calculator;
import java.util.List;
import java.util.*;`,
    exampleCode: `import java.util.Date;

public class PackageDemo {
    public static void main(String[] args) {
        Date now = new Date();
        System.out.println("Current System Time: " + now);
    }
}`,
    expectedOutput: `Current System Time: Fri Oct 02 07:00:00 UTC 2026`,
    practiceQuestions: [
      {
        problem: 'Show how to use two classes with the same name from different packages (e.g. java.util.Date and java.sql.Date) without ambiguity.',
        hint: 'Use the fully qualified package name for one of them.',
        solution: `public class Ambiguity {
    public static void main(String[] args) {
        java.util.Date d1 = new java.util.Date();
        java.sql.Date d2 = new java.sql.Date(System.currentTimeMillis());
        System.out.println("Both resolved without import conflict: " + (d1 != null && d2 != null));
    }
}`,
        output: `Both resolved without import conflict: true`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the default access modifier in Java when no modifier is specified?',
        answer: 'Package-private (default): visible only to classes within the exact same package.',
      },
    ],
  },
  {
    id: 'java-exceptions',
    number: 30,
    title: 'Exception Handling',
    level: 'Intermediate',
    summary: 'try, catch, finally, throw, throws, Checked vs Unchecked exceptions, try-with-resources.',
    explanation: [
      'An exception disrupts normal execution flow. Handled via try-catch blocks.',
      'Checked exceptions (e.g. IOException, SQLException) are verified at compile time.',
      'Unchecked (Runtime) exceptions (e.g. NullPointerException, ArithmeticException) occur at runtime.',
      'finally block always runs, ideal for releasing file or network handles.',
    ],
    syntax: `try {
    // risky code
} catch (ArithmeticException e) {
    // recovery logic
} finally {
    // cleanup
}`,
    exampleCode: `public class ExceptionDemo {
    public static void main(String[] args) {
        try {
            int a = 10, b = 0;
            int c = a / b;
            System.out.println(c);
        } catch (ArithmeticException e) {
            System.out.println("Caught Error: " + e.getMessage());
        } finally {
            System.out.println("Finally block always executes.");
        }
    }
}`,
    expectedOutput: `Caught Error: / by zero\nFinally block always executes.`,
    practiceQuestions: [
      {
        problem: 'Create a custom InvalidAgeException thrown when age < 18.',
        hint: 'class InvalidAgeException extends Exception { ... }',
        solution: `class InvalidAgeException extends Exception {
    InvalidAgeException(String s) { super(s); }
}
public class CustomEx {
    static void verify(int age) throws InvalidAgeException {
        if (age < 18) throw new InvalidAgeException("Must be 18+");
    }
    public static void main(String[] args) {
        try { verify(16); } catch(Exception e) { System.out.println(e.getMessage()); }
    }
}`,
        output: `Must be 18+`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Will the finally block execute if a return statement is encountered in the try block?',
        answer: 'Yes! The finally block executes right before the method returns to the caller, unless System.exit(0) is invoked.',
      },
    ],
  },
  {
    id: 'java-collections',
    number: 31,
    title: 'Collections',
    level: 'Intermediate',
    summary: 'List (ArrayList, LinkedList), Set (HashSet, TreeSet), and Map (HashMap, TreeMap).',
    explanation: [
      'The Collections Framework provides pre-built data structures in java.util.',
      'List: Ordered, allows duplicates (ArrayList is fast for indexing, LinkedList for node insertions).',
      'Set: No duplicates allowed (HashSet uses hashing O(1), TreeSet maintains sorted order O(log n)).',
      'Map: Key-value pairs (HashMap is O(1) average lookup, TreeMap is sorted by keys).',
    ],
    syntax: `List<String> list = new ArrayList<>();
Set<Integer> set = new HashSet<>();
Map<String, Double> map = new HashMap<>();`,
    exampleCode: `import java.util.*;

public class CollectionDemo {
    public static void main(String[] args) {
        Map<String, Double> studentScores = new HashMap<>();
        studentScores.put("Aarav", 9.4);
        studentScores.put("Sneha", 9.8);
        studentScores.put("Rohan", 8.9);

        System.out.println("Sneha's CGPA: " + studentScores.get("Sneha"));
        System.out.println("Total Students: " + studentScores.size());
    }
}`,
    expectedOutput: `Sneha's CGPA: 9.8\nTotal Students: 3`,
    practiceQuestions: [
      {
        problem: 'Remove duplicates from list [1, 2, 2, 3, 4, 4, 5] using a Set.',
        hint: 'Pass the list into new LinkedHashSet<>(list).',
        solution: `import java.util.*;
public class Dedup {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(1, 2, 2, 3, 4, 4, 5);
        Set<Integer> unique = new LinkedHashSet<>(nums);
        System.out.println("Unique: " + unique);
    }
}`,
        output: `Unique: [1, 2, 3, 4, 5]`,
      },
    ],
    interviewQuestions: [
      {
        question: 'How does HashMap handle hash collisions internally in Java 8+?',
        answer: 'HashMap uses separate chaining with linked lists for buckets. Once a bucket exceeds 8 entries (TREEIFY_THRESHOLD), it converts the list into a Red-Black Tree to improve lookup from O(n) to O(log n).',
      },
    ],
  },
  {
    id: 'java-generics',
    number: 32,
    title: 'Generics',
    level: 'Intermediate',
    summary: 'Type safety, parameterized classes and methods, bounded wildcards (? extends, ? super).',
    explanation: [
      'Generics enable compile-time type checking, eliminating ClassCastExceptions and manual casting.',
      'Type parameters (e.g. <T>, <K, V>) are replaced by Object or bounds via Type Erasure at compile time.',
      '? extends T allows covariance (read-only); ? super T allows contravariance (write-safe).',
    ],
    syntax: `class Box<T> {
    private T value;
    public void set(T v) { this.value = v; }
    public T get() { return value; }
}`,
    exampleCode: `class Pair<K, V> {
    K key;
    V value;
    Pair(K k, V v) { key = k; value = v; }
    void print() { System.out.println(key + " -> " + value); }
}

public class GenericsDemo {
    public static void main(String[] args) {
        Pair<String, Integer> item = new Pair<>("Rank", 1);
        item.print();
    }
}`,
    expectedOutput: `Rank -> 1`,
    practiceQuestions: [
      {
        problem: 'Write a generic method printArray(T[] array) that prints elements of any array type.',
        hint: 'public static <T> void printArray(T[] arr) { ... }',
        solution: `public class GenericMethod {
    static <T> void printArray(T[] arr) {
        for (T x : arr) System.out.print(x + " ");
        System.out.println();
    }
    public static void main(String[] args) {
        printArray(new String[]{"Java", "Python"});
    }
}`,
        output: `Java Python `,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is Type Erasure in Java Generics?',
        answer: 'The process where the Java compiler replaces generic type parameters with their bounds (or Object) during compilation, producing bytecode compatible with legacy JVMs without runtime type overhead.',
      },
    ],
  },
  {
    id: 'java-multithreading-core',
    number: 33,
    title: 'Multithreading',
    level: 'Intermediate',
    summary: 'Threads, extending Thread vs implementing Runnable, thread lifecycle, and start() vs run().',
    explanation: [
      'Multithreading executes multiple concurrent tasks simultaneously within a single process.',
      'Implementing Runnable is preferred over extending Thread because Java allows implementing multiple interfaces.',
      'start() spawns a new OS thread and invokes run(); calling run() directly executes on the caller thread.',
    ],
    syntax: `Thread t = new Thread(() -> {
    System.out.println("Running in: " + Thread.currentThread().getName());
});
t.start();`,
    exampleCode: `public class ThreadDemo {
    public static void main(String[] args) {
        Thread worker = new Thread(() -> {
            System.out.println("Background worker thread started!");
        });
        worker.start();
        System.out.println("Main thread continues...");
    }
}`,
    expectedOutput: `Main thread continues...\nBackground worker thread started!`,
    practiceQuestions: [
      {
        problem: 'Create two threads that print "Ping" and "Pong" with Thread.sleep(50).',
        hint: 'Use Thread.sleep() inside try-catch.',
        solution: `public class PingPong {
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> System.out.println("Ping"));
        Thread t2 = new Thread(() -> System.out.println("Pong"));
        t1.start(); t1.join();
        t2.start(); t2.join();
    }
}`,
        output: `Ping\nPong`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between synchronized method and synchronized block?',
        answer: 'A synchronized method locks the entire object instance (or Class object if static), whereas a synchronized block locks only the designated critical monitor object, minimizing thread contention.',
      },
    ],
  },

  // ===================== ADVANCED (34 to 41) =====================
  {
    id: 'java-streams',
    number: 34,
    title: 'Streams',
    level: 'Advanced',
    summary: 'Stream API pipeline: filter, map, sorted, collect, reduce, and parallel streams.',
    explanation: [
      'Stream API in java.util.stream provides declarative functional processing of sequences of elements.',
      'Intermediate operations (filter, map, sorted, distinct) are lazy and return a new Stream.',
      'Terminal operations (collect, forEach, reduce, count) trigger the pipeline and produce a result.',
    ],
    syntax: `List<String> result = list.stream()
    .filter(s -> s.startsWith("A"))
    .map(String::toUpperCase)
    .collect(Collectors.toList());`,
    exampleCode: `import java.util.*;
import java.util.stream.*;

public class StreamDemo {
    public static void main(String[] args) {
        List<Integer> marks = Arrays.asList(85, 92, 45, 78, 62, 95);
        List<Integer> topScores = marks.stream()
            .filter(m -> m >= 80)
            .sorted(Comparator.reverseOrder())
            .collect(Collectors.toList());
        System.out.println("Top Scores: " + topScores);
    }
}`,
    expectedOutput: `Top Scores: [95, 92, 85]`,
    practiceQuestions: [
      {
        problem: 'Compute the average of numbers [10, 20, 30, 40, 50] using stream().mapToInt().average().',
        hint: 'list.stream().mapToInt(Integer::intValue).average().orElse(0.0)',
        solution: `import java.util.*;
public class StreamAvg {
    public static void main(String[] args) {
        double avg = Arrays.asList(10, 20, 30, 40, 50).stream()
            .mapToInt(Integer::intValue).average().orElse(0.0);
        System.out.println("Average: " + avg);
    }
}`,
        output: `Average: 30.0`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why are Stream intermediate operations described as lazy?',
        answer: 'They do not execute until a terminal operation is invoked. This allows the JVM to fuse operations into a single pass and short-circuit when possible (like in findFirst or limit).',
      },
    ],
  },
  {
    id: 'java-lambdas',
    number: 35,
    title: 'Lambda Expressions',
    level: 'Advanced',
    summary: 'Anonymous functions, arrow syntax (->), target typing, and variable capture rules.',
    explanation: [
      'Lambda expressions provide concise implementation of Single Abstract Method (SAM) interfaces.',
      'Syntax: (parameters) -> { body }.',
      'Captured local variables must be effectively final (not modified after declaration).',
    ],
    syntax: `(a, b) -> a + b
s -> s.length()
() -> System.out.println("Ping")`,
    exampleCode: `import java.util.*;

public class LambdaDemo {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Rohan", "Sneha", "Aarav");
        names.sort((s1, s2) -> s1.compareTo(s2));
        System.out.println("Sorted: " + names);
    }
}`,
    expectedOutput: `Sorted: [Aarav, Rohan, Sneha]`,
    practiceQuestions: [
      {
        problem: 'Use a lambda expression with Runnable to print "Async Task Completed".',
        hint: 'new Thread(() -> System.out.println(...)).start()',
        solution: `public class LambdaThread {
    public static void main(String[] args) {
        new Thread(() -> System.out.println("Async Task Completed")).start();
    }
}`,
        output: `Async Task Completed`,
      },
    ],
    interviewQuestions: [
      {
        question: 'How do lambdas differ from anonymous inner classes under the hood in Java?',
        answer: 'Anonymous inner classes compile to separate .class files ($1.class) and allocate object instances on each run. Lambdas use invokedynamic bytecode and Metafactory, avoiding extra class loading and heap overhead.',
      },
    ],
  },
  {
    id: 'java-functional-interfaces',
    number: 36,
    title: 'Functional Interfaces',
    level: 'Advanced',
    summary: '@FunctionalInterface, Predicate<T>, Function<T, R>, Consumer<T>, Supplier<T>, and method references.',
    explanation: [
      'A Functional Interface has exactly one abstract method (Single Abstract Method - SAM).',
      'Predicate<T>: Evaluates condition -> boolean test(T t).',
      'Function<T, R>: Transforms input -> R apply(T t).',
      'Consumer<T>: Accepts input, no return -> void accept(T t).',
      'Supplier<T>: Supplies result, takes no input -> T get().',
    ],
    syntax: `Predicate<Integer> isAdult = age -> age >= 18;
Function<String, Integer> strLen = String::length;
Consumer<String> printer = System.out::println;
Supplier<Double> random = Math::random;`,
    exampleCode: `import java.util.function.*;

public class FunctionalInterfaceDemo {
    public static void main(String[] args) {
        Predicate<Double> isDistinction = cgpa -> cgpa >= 8.5;
        Function<Double, String> ranker = c -> isDistinction.test(c) ? "Distinction" : "Standard";
        System.out.println("CGPA 9.2: " + ranker.apply(9.2));
    }
}`,
    expectedOutput: `CGPA 9.2: Distinction`,
    practiceQuestions: [
      {
        problem: 'Chain two Predicates using .and(): check if number is both even AND greater than 10.',
        hint: 'p1.and(p2).test(val)',
        solution: `import java.util.function.Predicate;
public class PredChain {
    public static void main(String[] args) {
        Predicate<Integer> even = n -> n % 2 == 0;
        Predicate<Integer> gt10 = n -> n > 10;
        System.out.println("14 valid: " + even.and(gt10).test(14));
    }
}`,
        output: `14 valid: true`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Can a functional interface contain default or static methods?',
        answer: 'Yes! It can contain any number of default or static methods as long as it has exactly ONE abstract method.',
      },
    ],
  },
  {
    id: 'java-jdbc',
    number: 37,
    title: 'JDBC',
    level: 'Advanced',
    summary: 'Java Database Connectivity: DriverManager, Connection, PreparedStatement, ResultSet, and SQL injection prevention.',
    explanation: [
      'JDBC is standard Java API for connecting to relational databases (PostgreSQL, MySQL, Oracle).',
      'DriverManager.getConnection() establishes database sessions.',
      'PreparedStatement compiles queries with parameters (?) to prevent SQL Injection attacks.',
      'ResultSet navigates through queried table rows (rs.next(), rs.getString(), rs.getInt()).',
    ],
    syntax: `try (Connection conn = DriverManager.getConnection(url, user, pass);
     PreparedStatement ps = conn.prepareStatement("SELECT * FROM students WHERE id = ?")) {
    ps.setInt(1, 101);
    ResultSet rs = ps.executeQuery();
}`,
    exampleCode: `public class JdbcArchitecture {
    public static void main(String[] args) {
        System.out.println("1. Load Driver -> Class.forName(\"org.postgresql.Driver\")");
        System.out.println("2. Get Connection -> DriverManager.getConnection()");
        System.out.println("3. PreparedStatement -> conn.prepareStatement(query)");
        System.out.println("4. Process ResultSet -> while (rs.next()) { ... }");
        System.out.println("5. Close resources via try-with-resources");
    }
}`,
    expectedOutput: `1. Load Driver -> Class.forName("org.postgresql.Driver")
2. Get Connection -> DriverManager.getConnection()
3. PreparedStatement -> conn.prepareStatement(query)
4. Process ResultSet -> while (rs.next()) { ... }
5. Close resources via try-with-resources`,
    practiceQuestions: [
      {
        problem: 'Why is PreparedStatement safer and faster than Statement in JDBC?',
        hint: 'Mention precompilation and parameterized binding.',
        solution: `public class JdbcSec {
    public static void main(String[] args) {
        System.out.println("PreparedStatement precompiles SQL and treats input as literal data, preventing SQL injection.");
    }
}`,
        output: `PreparedStatement precompiles SQL and treats input as literal data, preventing SQL injection.`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is connection pooling (e.g. HikariCP) in enterprise Java applications?',
        answer: 'Opening a physical DB connection is expensive (TCP handshake, auth). Connection pools maintain a pool of warm, reusable connections, drastically increasing throughput.',
      },
    ],
  },
  {
    id: 'java-8-features',
    number: 38,
    title: 'Java 8+ features',
    level: 'Advanced',
    summary: 'Optional<T>, modern Date/Time API (java.time), Records (Java 16+), Pattern Matching, and Sealed Classes (Java 17+).',
    explanation: [
      'Optional<T> eliminates NullPointerException by wrapping nullable return values explicitly.',
      'java.time (LocalDate, LocalTime, Instant) replaced legacy mutable java.util.Date with thread-safe immutable classes.',
      'Records (record Student(String name, double cgpa) {}) auto-generate constructor, getters, equals, and hashCode.',
      'Sealed classes limit which subclasses can extend them (sealed class A permits B, C).',
    ],
    syntax: `Optional<String> opt = Optional.ofNullable(getValue());
opt.ifPresent(System.out::println);

// Java 16+ Record:
record StudentDto(String name, double cgpa) {}`,
    exampleCode: `import java.time.LocalDate;
import java.util.Optional;

public class ModernJavaDemo {
    record Student(String name, double cgpa) {}

    public static void main(String[] args) {
        Student s = new Student("Aarav", 9.4);
        LocalDate today = LocalDate.now();
        Optional<Student> opt = Optional.of(s);

        System.out.println("Date: " + today);
        System.out.println("Record: " + opt.get().name() + " -> " + opt.get().cgpa());
    }
}`,
    expectedOutput: `Date: 2026-10-02\nRecord: Aarav -> 9.4`,
    practiceQuestions: [
      {
        problem: 'Create an Optional containing null and provide a fallback value "Default Tool" using .orElse().',
        hint: 'Optional.ofNullable(null).orElse("Default Tool")',
        solution: `import java.util.Optional;
public class OptFallback {
    public static void main(String[] args) {
        String val = Optional.<String>ofNullable(null).orElse("Default Tool");
        System.out.println("Result: " + val);
    }
}`,
        output: `Result: Default Tool`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What are Java Records and why are they used in modern Spring / DTO architectures?',
        answer: 'Records are immutable data carriers. The compiler automatically produces private final fields, canonical constructor, accessors, equals(), hashCode(), and toString(), eliminating boilerplate.',
      },
    ],
  },
  {
    id: 'java-advanced-collections',
    number: 39,
    title: 'Advanced Collections',
    level: 'Advanced',
    summary: 'ConcurrentHashMap, CopyOnWriteArrayList, PriorityQueue (Heaps), and custom Comparators.',
    explanation: [
      'ConcurrentHashMap provides thread-safe key-value storage with bucket-level lock striping for high concurrency without blocking reads.',
      'CopyOnWriteArrayList creates a fresh copy of the backing array on every write, perfect for read-heavy observer lists.',
      'PriorityQueue implements a Min-Heap (or Max-Heap with Collections.reverseOrder()) for O(log n) top-K algorithms.',
    ],
    syntax: `ConcurrentHashMap<String, Integer> cmap = new ConcurrentHashMap<>();
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());`,
    exampleCode: `import java.util.*;

public class PriorityQueueDemo {
    public static void main(String[] args) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        pq.add(45);
        pq.add(10);
        pq.add(30);

        System.out.println("Smallest element extracted: " + pq.poll());
        System.out.println("Next smallest: " + pq.peek());
    }
}`,
    expectedOutput: `Smallest element extracted: 10\nNext smallest: 30`,
    practiceQuestions: [
      {
        problem: 'Sort a list of student names by length descending using a custom Comparator.',
        hint: 'Comparator.comparingInt(String::length).reversed()',
        solution: `import java.util.*;
public class CustomSort {
    public static void main(String[] args) {
        List<String> list = Arrays.asList("Java", "Multithreading", "Spring");
        list.sort(Comparator.comparingInt(String::length).reversed());
        System.out.println(list);
    }
}`,
        output: `[Multithreading, Spring, Java]`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why does ConcurrentHashMap not allow null keys or values unlike HashMap?',
        answer: 'To prevent ambiguity in multithreaded environments: in ConcurrentHashMap, map.get(k) returning null cannot reliably distinguish between "key not present" and "key mapped to null" across concurrent threads.',
      },
    ],
  },
  {
    id: 'java-multithreading-concepts',
    number: 40,
    title: 'Multithreading concepts',
    level: 'Advanced',
    summary: 'ExecutorService, Thread Pools, Callable, Future, CompletableFuture, and volatile visibility.',
    explanation: [
      'ExecutorService manages a pool of worker threads, decoupling task submission from thread management.',
      'Callable<V> returns a result and can throw checked exceptions (unlike Runnable).',
      'CompletableFuture enables non-blocking asynchronous programming with thenApply(), thenAccept(), and exceptionally().',
      'volatile keyword guarantees cross-core cache visibility without locking.',
    ],
    syntax: `ExecutorService executor = Executors.newFixedThreadPool(4);
Future<Integer> future = executor.submit(() -> 42);
CompletableFuture.supplyAsync(() -> "Hello")
    .thenAccept(System.out::println);`,
    exampleCode: `import java.util.concurrent.*;

public class ExecutorDemo {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newSingleThreadExecutor();
        Future<Integer> calc = pool.submit(() -> 10 + 20);
        System.out.println("Async Calculation Result: " + calc.get());
        pool.shutdown();
    }
}`,
    expectedOutput: `Async Calculation Result: 30`,
    practiceQuestions: [
      {
        problem: 'Use CompletableFuture to run a task that doubles a number 25 asynchronously.',
        hint: 'CompletableFuture.supplyAsync(() -> 25 * 2).thenAccept(...)',
        solution: `import java.util.concurrent.CompletableFuture;
public class AsyncDouble {
    public static void main(String[] args) {
        CompletableFuture.supplyAsync(() -> 25 * 2)
            .thenAccept(res -> System.out.println("Result: " + res))
            .join();
    }
}`,
        output: `Result: 50`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the purpose of the volatile keyword in Java memory model?',
        answer: 'volatile instructs the CPU and JVM to read and write the variable directly to main memory rather than CPU register caches, preventing stale thread visibility bugs.',
      },
    ],
  },
  {
    id: 'java-spring-intro',
    number: 41,
    title: 'Basic Spring / Spring Boot introduction',
    level: 'Advanced',
    summary: 'Inversion of Control (IoC), Dependency Injection (DI), @SpringBootApplication, and REST controllers.',
    explanation: [
      'Spring Boot is the standard enterprise framework for building production-ready Java microservices.',
      'Inversion of Control (IoC): The Spring container manages the lifecycle of your beans and wires dependencies automatically.',
      'Core annotations: @RestController (exposes JSON endpoints), @GetMapping / @PostMapping, and @Autowired (dependency injection).',
    ],
    syntax: `@RestController
@RequestMapping("/api/tools")
public class ToolController {
    @GetMapping("/status")
    public Map<String, String> status() {
        return Map.of("portal", "StudentTools", "status", "ONLINE");
    }
}`,
    exampleCode: `// Architecture representation of a Spring Boot Controller
class StudentToolsService {
    String getPortalInfo() {
        return "StudentTools Pro API — Spring Boot Microservice Ready";
    }
}

public class SpringIntroDemo {
    public static void main(String[] args) {
        StudentToolsService service = new StudentToolsService();
        System.out.println("Service injected: " + service.getPortalInfo());
        System.out.println("Ready to deploy REST APIs on port 8080");
    }
}`,
    expectedOutput: `Service injected: StudentTools Pro API — Spring Boot Microservice Ready\nReady to deploy REST APIs on port 8080`,
    practiceQuestions: [
      {
        problem: 'Explain the difference between @Controller and @RestController in Spring Boot.',
        hint: '@RestController is a combination of @Controller and @ResponseBody.',
        solution: `public class ControllerDiff {
    public static void main(String[] args) {
        System.out.println("@Controller returns view names (HTML/JSP), while @RestController writes serialized JSON/XML directly to the HTTP response body.");
    }
}`,
        output: `@Controller returns view names (HTML/JSP), while @RestController writes serialized JSON/XML directly to the HTTP response body.`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is Dependency Injection and why is it beneficial?',
        answer: 'Dependency Injection supplies an object’s dependencies from an external container rather than hardcoding new Dependency() inside classes. It promotes loose coupling, testability (easy mock injection), and modularity.',
      },
    ],
  },
];
