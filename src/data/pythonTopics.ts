import { ProgrammingTopic } from './javaTopics';

export const PYTHON_TOPICS: ProgrammingTopic[] = [
  // ===================== BEGINNER (1 to 15) =====================
  {
    id: 'py-intro',
    number: 1,
    title: 'Python Introduction',
    level: 'Beginner',
    summary: 'History, philosophy (Zen of Python), interpreted nature, dynamic typing, and ecosystem overview.',
    explanation: [
      'Python is a high-level, general-purpose programming language designed by Guido van Rossum with an emphasis on human readability.',
      'It is dynamically typed and garbage collected, widely used in Web Development, Data Science, AI/ML, and Automation.',
      'The "Zen of Python" (import this) highlights: Simple is better than complex; Readability counts.',
    ],
    syntax: `print("Hello, StudentTools!")
# Run with: python3 main.py`,
    exampleCode: `print("Welcome to Python on StudentTools!")
import sys
print(f"Python Version: {sys.version.split()[0]}")`,
    expectedOutput: `Welcome to Python on StudentTools!
Python Version: 3.12.2`,
    practiceQuestions: [
      {
        problem: 'Print your name, college, and target tech role using 3 separate print statements.',
        hint: 'Call print() three times.',
        solution: `print("Name: Sneha Patel")
print("College: IIT Bombay")
print("Target Role: Backend Engineer")`,
        output: `Name: Sneha Patel\nCollege: IIT Bombay\nTarget Role: Backend Engineer`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What does it mean that Python is an interpreted language?',
        answer: 'Python source code (.py) is compiled into bytecode (.pyc) and executed line-by-line by the Python Virtual Machine (PVM) at runtime, without a separate ahead-of-time linking step.',
      },
    ],
  },
  {
    id: 'py-installation',
    number: 2,
    title: 'Installation',
    level: 'Beginner',
    summary: 'Installing Python 3, pip package manager, verifying PATH on Windows, macOS, Linux, and python --version.',
    explanation: [
      'Download the official Python installer from python.org and check "Add Python to PATH".',
      'pip is the standard package manager used to install third-party libraries from PyPI (Python Package Index).',
      'Virtual environments (venv) keep project dependencies isolated.',
    ],
    syntax: `python3 --version
pip --version
pip install requests`,
    exampleCode: `import sys
import os

print(f"Executable Path: {sys.executable}")
print(f"Platform: {sys.platform}")`,
    expectedOutput: `Executable Path: /usr/bin/python3
Platform: linux`,
    practiceQuestions: [
      {
        problem: 'Check if the math module is installed and print the value of pi to 4 decimal places.',
        hint: 'import math and use f"{math.pi:.4f}".',
        solution: `import math
print(f"Pi: {math.pi:.4f}")`,
        output: `Pi: 3.1416`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is pip in Python?',
        answer: 'pip stands for "Pip Installs Packages", the official package installer that downloads, configures, and manages third-party Python modules from PyPI.',
      },
    ],
  },
  {
    id: 'py-variables',
    number: 3,
    title: 'Variables',
    level: 'Beginner',
    summary: 'Dynamic typing, variable assignment, multiple assignment, naming conventions (snake_case), and id() function.',
    explanation: [
      'Variables are created automatically upon value assignment; no type declaration is required.',
      'Python variables are references pointing to objects in memory.',
      'Naming convention: snake_case for variables and functions (PEP 8).',
    ],
    syntax: `score = 98
student_name = "Kavya"
a, b, c = 1, 2, 3`,
    exampleCode: `student_name = "Rohan"
sem = 6
cgpa = 9.35

print(f"Student: {student_name} | Sem: {sem} | CGPA: {cgpa}")
print(f"Memory ID of sem: {id(sem)}")`,
    expectedOutput: `Student: Rohan | Sem: 6 | CGPA: 9.35
Memory ID of sem: 139745829374096`,
    practiceQuestions: [
      {
        problem: 'Swap two variables x = 100 and y = 200 in Python in a single line without a temporary variable.',
        hint: 'Use tuple unpacking: x, y = y, x.',
        solution: `x, y = 100, 200
x, y = y, x
print(f"x={x}, y={y}")`,
        output: `x=200, y=100`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Are variables in Python pass-by-value or pass-by-reference?',
        answer: 'Python uses "Pass-by-Object-Reference" (call-by-sharing). If you pass an immutable object (int, str), changes inside do not affect the caller. If you mutate a mutable object (list, dict), the caller sees the changes.',
      },
    ],
  },
  {
    id: 'py-data-types',
    number: 4,
    title: 'Data Types',
    level: 'Beginner',
    summary: 'int, float, complex, str, bool, NoneType, and type inspection with type() and isinstance().',
    explanation: [
      'Built-in numeric types: int (arbitrary precision in Python 3), float (64-bit IEEE 754), complex (real + imag*j).',
      'Text type: str (Unicode). Boolean: bool (True, False). Special: None (NoneType).',
      'Use type(var) or isinstance(var, type) to inspect object types.',
    ],
    syntax: `count = 42          # int
gpa = 9.25          # float
is_active = True    # bool
notes = None        # NoneType`,
    exampleCode: `val = 45.67
print(f"Value: {val} | Type: {type(val).__name__}")
print(f"Is float? {isinstance(val, float)}")`,
    expectedOutput: `Value: 45.67 | Type: float
Is float? True`,
    practiceQuestions: [
      {
        problem: 'Check the boolean evaluation (truthiness) of 0, empty string "", and non-empty list [1].',
        hint: 'Use bool(val).',
        solution: `print(bool(0), bool(""), bool([1]))`,
        output: `False False True`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Can Python integers overflow like 32-bit integers in Java or C++?',
        answer: 'No. Python 3 integers have arbitrary precision (limited only by available host memory). You can calculate 2**1000 without overflow.',
      },
    ],
  },
  {
    id: 'py-io',
    number: 5,
    title: 'Input / Output',
    level: 'Beginner',
    summary: 'input() function, type conversion (int(), float()), print() arguments (sep, end), and f-string formatting.',
    explanation: [
      'input("Prompt: ") reads a line of user input as a string.',
      'Always cast with int() or float() if numeric input is needed.',
      'print() supports sep=" " (separator) and end="\\n" (terminator).',
      'f-strings (f"Hello {name}") provide fast, expressive string interpolation.',
    ],
    syntax: `name = input("Enter name: ")
age = int(input("Enter age: "))
print(f"Student: {name}, Age: {age}")
print("A", "B", "C", sep="-", end="!\\n")`,
    exampleCode: `marks = 480
total = 500
pct = (marks / total) * 100
print(f"Marks: {marks}/{total} | Percentage: {pct:.2f}%")
print("Pomodoro", "CGPA", "Resume", sep=" -> ")`,
    expectedOutput: `Marks: 480/500 | Percentage: 96.00%
Pomodoro -> CGPA -> Resume`,
    practiceQuestions: [
      {
        problem: 'Print numbers 1 to 5 on a single line separated by commas using print() and sep/end.',
        hint: 'Use print(*range(1, 6), sep=", ").',
        solution: `print(*range(1, 6), sep=", ")`,
        output: `1, 2, 3, 4, 5`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why are f-strings faster than %-formatting or .format() in Python?',
        answer: 'f-strings are evaluated at runtime directly as optimized bytecode expressions (BUILD_STRING opcode) rather than parsing a format string template.',
      },
    ],
  },
  {
    id: 'py-operators',
    number: 6,
    title: 'Operators',
    level: 'Beginner',
    summary: 'Arithmetic (// floor, ** pow), comparison, logical (and, or, not), identity (is), and membership (in).',
    explanation: [
      'Floor division // rounds down to the nearest integer. Exponentiation ** raises to power.',
      'Logical operators use plain English words: and, or, not (not &&, ||, !).',
      'is checks memory identity (same object address); in checks membership inside a sequence.',
    ],
    syntax: `quotient = 17 // 5  # 3
power = 2 ** 8      # 256
is_present = "Java" in ["Java", "Python"]`,
    exampleCode: `a, b = 25, 4
print(f"Division: {a / b} | Floor: {a // b} | Mod: {a % b}")
print(f"Power 2^5: {2 ** 5}")
print(f"Logical: {(a > 10) and (b < 10)}")`,
    expectedOutput: `Division: 6.25 | Floor: 6 | Mod: 1
Power 2^5: 32
Logical: True`,
    practiceQuestions: [
      {
        problem: 'Check if character "a" is present in string "StudentTools" case-insensitively.',
        hint: 'Use "a" in "StudentTools".lower().',
        solution: `s = "StudentTools"
print("a in string:", "a" in s.lower())`,
        output: `a in string: False`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between "==" and "is" in Python?',
        answer: '"==" checks equality of value (whether two objects hold equal contents). "is" checks object identity (whether both variables point to the exact same memory location, id(a) == id(b)).',
      },
    ],
  },
  {
    id: 'py-conditionals',
    number: 7,
    title: 'If / Elif / Else',
    level: 'Beginner',
    summary: 'Branching logic, indentation rules (4 spaces), nested conditions, and ternary expressions.',
    explanation: [
      'Python uses indentation (4 spaces) instead of curly braces {} to define code blocks.',
      'elif is the shorthand keyword for else-if.',
      'One-line ternary expression: value_if_true if condition else value_if_false.',
    ],
    syntax: `if score >= 90:
    grade = "O"
elif score >= 80:
    grade = "A+"
else:
    grade = "Pass"

status = "Adult" if age >= 18 else "Minor"`,
    exampleCode: `attendance = 82.5
status = "Eligible for Exam" if attendance >= 75 else "Shortage Alert"
print(f"Attendance: {attendance}% -> {status}")`,
    expectedOutput: `Attendance: 82.5% -> Eligible for Exam`,
    practiceQuestions: [
      {
        problem: 'Write a program to find the largest of three numbers a=24, b=58, c=33.',
        hint: 'Use if-elif-else comparisons.',
        solution: `a, b, c = 24, 58, 33
if a >= b and a >= c:
    largest = a
elif b >= a and b >= c:
    largest = b
else:
    largest = c
print("Largest:", largest)`,
        output: `Largest: 58`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What values evaluate to False (Falsy) in a Python if condition?',
        answer: 'None, False, numeric zeros (0, 0.0, 0j), empty sequences ("", (), [], range(0)), and empty mappings ({}, set()). Everything else evaluates to True.',
      },
    ],
  },
  {
    id: 'py-for-loop',
    number: 8,
    title: 'For Loop',
    level: 'Beginner',
    summary: 'range(start, stop, step), iterating sequences, enumerate(), zip(), break, and continue.',
    explanation: [
      'for item in iterable iterates directly over items in lists, strings, ranges, or tuples.',
      'range(start, stop, step) generates arithmetic progressions lazily.',
      'enumerate(iterable) provides both index and item simultaneously.',
    ],
    syntax: `for i in range(1, 5):
    print(i)

for idx, tool in enumerate(["CGPA", "Timer"]):
    print(idx, tool)`,
    exampleCode: `tools = ["Pomodoro", "Scale Converter", "Resume Builder"]
for i, tool in enumerate(tools, start=1):
    print(f"#{i}. {tool}")`,
    expectedOutput: `#1. Pomodoro\n#2. Scale Converter\n#3. Resume Builder`,
    practiceQuestions: [
      {
        problem: 'Calculate the sum of all even numbers from 2 to 10 using range().',
        hint: 'sum(range(2, 11, 2))',
        solution: `print("Sum:", sum(range(2, 11, 2)))`,
        output: `Sum: 30`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What does the for...else clause do in Python?',
        answer: 'The else block following a for loop executes ONLY if the loop completed normally without encountering a break statement.',
      },
    ],
  },
  {
    id: 'py-while-loop',
    number: 9,
    title: 'While Loop',
    level: 'Beginner',
    summary: 'Condition-driven loops, infinite loops (while True), break, continue, and loop safeguards.',
    explanation: [
      'while condition: repeats until condition becomes false.',
      'Commonly used when the number of iterations depends on runtime events or sensor reads.',
      'Always ensure loop variables are updated inside the block to avoid freezing.',
    ],
    syntax: `while count > 0:
    print(count)
    count -= 1`,
    exampleCode: `seconds = 3
while seconds > 0:
    print(f"Timer countdown: {seconds}s")
    seconds -= 1
print("Focus Session Started!")`,
    expectedOutput: `Timer countdown: 3s\nTimer countdown: 2s\nTimer countdown: 1s\nFocus Session Started!`,
    practiceQuestions: [
      {
        problem: 'Find the sum of digits of 5432 using a while loop.',
        hint: 'Extract with n % 10 and divide with n //= 10.',
        solution: `n = 5432
total = 0
while n > 0:
    total += n % 10
    n //= 10
print("Sum of digits:", total)`,
        output: `Sum of digits: 14`,
      },
    ],
    interviewQuestions: [
      {
        question: 'How do you safely break out of an infinite loop in Python?',
        answer: 'Using the break statement inside an if condition, or handling a KeyboardInterrupt exception if controlled via console.',
      },
    ],
  },
  {
    id: 'py-strings',
    number: 10,
    title: 'Strings',
    level: 'Beginner',
    summary: 'String indexing, slicing ([start:stop:step]), immutability, split(), join(), strip(), and methods.',
    explanation: [
      'Strings are immutable sequences of Unicode characters.',
      'Slicing s[start:stop:step]: s[::-1] reverses a string in O(n).',
      'Key methods: upper(), lower(), strip(), split(), replace(), startswith(), and join().',
    ],
    syntax: `s = "StudentTools"
sliced = s[0:7]      # "Student"
reversed_s = s[::-1] # "slooTtnedutS"`,
    exampleCode: `portal = "  StudentTools Portal  "
clean = portal.strip()
parts = clean.split()
print("Cleaned:", clean)
print("Joined with '-':", "-".join(parts))`,
    expectedOutput: `Cleaned: StudentTools Portal\nJoined with '-': StudentTools-Portal`,
    practiceQuestions: [
      {
        problem: 'Check if string "madam" is a palindrome using slice syntax.',
        hint: 's == s[::-1]',
        solution: `s = "madam"
print(f"{s} is palindrome: {s == s[::-1]}")`,
        output: `madam is palindrome: True`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why are strings immutable in Python?',
        answer: 'Immutability allows strings to be used as hashable dictionary keys, shared safely across threads, and cached in memory for efficiency.',
      },
    ],
  },
  {
    id: 'py-lists',
    number: 11,
    title: 'Lists',
    level: 'Beginner',
    summary: 'Mutable dynamic arrays, append, extend, insert, pop, remove, sort, and slice operations.',
    explanation: [
      'Lists are ordered, mutable collections enclosed in brackets [].',
      'Can store elements of mixed data types.',
      'O(1) append and pop from end; O(n) insert or delete from beginning/middle.',
    ],
    syntax: `nums = [10, 20, 30]
nums.append(40)
popped = nums.pop()
nums.sort(reverse=True)`,
    exampleCode: `tools = ["CGPA", "Pomodoro"]
tools.append("Resume")
tools.extend(["Notes", "Timer"])
print("Tools List:", tools)
print("Count of tools:", len(tools))`,
    expectedOutput: `Tools List: ['CGPA', 'Pomodoro', 'Resume', 'Notes', 'Timer']\nCount of tools: 5`,
    practiceQuestions: [
      {
        problem: 'Remove the second element from list [100, 200, 300, 400] and print the modified list.',
        hint: 'Use del lst[1] or lst.pop(1).',
        solution: `lst = [100, 200, 300, 400]
lst.pop(1)
print(lst)`,
        output: `[100, 300, 400]`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the time complexity of append() vs insert(0, val) in a Python list?',
        answer: 'append() is O(1) amortized because items are placed at the pre-allocated end. insert(0, val) is O(n) because all subsequent elements must be shifted in memory.',
      },
    ],
  },
  {
    id: 'py-tuples',
    number: 12,
    title: 'Tuples',
    level: 'Beginner',
    summary: 'Immutable sequences (), tuple packing/unpacking, namedtuples, and usage as dictionary keys.',
    explanation: [
      'Tuples are immutable sequences enclosed in parentheses ().',
      'Once created, elements cannot be modified, added, or removed.',
      'Because they are immutable, tuples are hashable and can be used as dictionary keys.',
    ],
    syntax: `point = (10, 20)
x, y = point  # unpacking
single = (42,) # comma required for 1-element tuple`,
    exampleCode: `grade_scale = ("O", "A+", "A", "B+", "B", "C", "F")
print("Top Grade:", grade_scale[0])
print("Scale Length:", len(grade_scale))`,
    expectedOutput: `Top Grade: O\nScale Length: 7`,
    practiceQuestions: [
      {
        problem: 'Unpack student tuple ("Priya", 9.4, "CSE") into name, gpa, and branch variables.',
        hint: 'name, gpa, branch = student_tuple',
        solution: `student = ("Priya", 9.4, "CSE")
name, gpa, branch = student
print(f"{name} ({branch}) has GPA {gpa}")`,
        output: `Priya (CSE) has GPA 9.4`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why would you choose a tuple over a list in Python?',
        answer: 'Tuples use less memory, protect data integrity from accidental mutation, provide faster iteration, and can serve as dictionary keys.',
      },
    ],
  },
  {
    id: 'py-sets',
    number: 13,
    title: 'Sets',
    level: 'Beginner',
    summary: 'Unordered collections of unique hashable elements, set union (|), intersection (&), and difference (-).',
    explanation: [
      'Sets are mutable, unordered collections with NO duplicate items, enclosed in {}.',
      'Supported mathematical operations: Union (|), Intersection (&), Difference (-), Symmetric Difference (^).',
      'O(1) average lookup time via hash table.',
    ],
    syntax: `s = {1, 2, 3, 3}  # {1, 2, 3}
s.add(4)
union = s1 | s2
intersection = s1 & s2`,
    exampleCode: `java_students = {"Aarav", "Sneha", "Rohan"}
python_students = {"Sneha", "Kavya", "Rohan"}

both = java_students & python_students
print("Students in both tracks:", sorted(list(both)))`,
    expectedOutput: `Students in both tracks: ['Rohan', 'Sneha']`,
    practiceQuestions: [
      {
        problem: 'Deduplicate list [1, 2, 2, 3, 4, 4, 5] using set() and sort it back into a list.',
        hint: 'sorted(list(set(nums)))',
        solution: `nums = [1, 2, 2, 3, 4, 4, 5]
print(sorted(list(set(nums))))`,
        output: `[1, 2, 3, 4, 5]`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Can you store a list inside a set in Python? Why or why not?',
        answer: 'No. Elements in a set must be hashable (immutable). Lists are mutable and unhashable, raising a TypeError: unhashable type: list.',
      },
    ],
  },
  {
    id: 'py-dictionaries',
    number: 14,
    title: 'Dictionaries',
    level: 'Beginner',
    summary: 'Key-value mappings, get(), keys(), values(), items(), dictionary comprehensions, and update().',
    explanation: [
      'Dictionaries are mutable key-value stores enclosed in {key: value}.',
      'Keys must be immutable and hashable (strings, numbers, tuples).',
      'get(key, default) avoids KeyError when a key is absent.',
    ],
    syntax: `student = {"name": "Aarav", "cgpa": 9.4}
score = student.get("cgpa", 0.0)
for k, v in student.items():
    print(k, v)`,
    exampleCode: `tool_categories = {
    "CGPA Calculator": "Academic",
    "Pomodoro Timer": "Utility",
    "Resume Builder": "Career"
}
for tool, cat in tool_categories.items():
    print(f"• {tool} [{cat}]")`,
    expectedOutput: `• CGPA Calculator [Academic]\n• Pomodoro Timer [Utility]\n• Resume Builder [Career]`,
    practiceQuestions: [
      {
        problem: 'Count the frequency of characters in "student" using a dictionary.',
        hint: 'for ch in s: counts[ch] = counts.get(ch, 0) + 1',
        solution: `s = "student"
counts = {}
for ch in s: counts[ch] = counts.get(ch, 0) + 1
print(counts["t"])`,
        output: `2`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Are dictionaries in Python ordered?',
        answer: 'Yes! Since Python 3.7+, dictionaries are guaranteed to maintain insertion order as part of the official language specification.',
      },
    ],
  },
  {
    id: 'py-functions',
    number: 15,
    title: 'Functions',
    level: 'Beginner',
    summary: 'def keyword, parameters, default arguments, *args, **kwargs, return values, and docstrings.',
    explanation: [
      'Functions encapsulate reusable code blocks with def func_name(params):.',
      '*args collects variable positional arguments into a tuple.',
      '**kwargs collects variable keyword arguments into a dictionary.',
      'Functions in Python are first-class citizens (can be passed as arguments or returned).',
    ],
    syntax: `def calculate_cgpa(marks, total=500):
    """Calculates percentage and estimated CGPA."""
    pct = (marks / total) * 100
    return round(pct / 9.5, 2)`,
    exampleCode: `def format_student(name, *subjects, **metadata):
    print(f"Student: {name}")
    print(f"Subjects: {', '.join(subjects)}")
    print(f"College: {metadata.get('college', 'Unknown')}")

format_student("Aarav", "DSA", "DBMS", "OS", college="NIT Warangal")`,
    expectedOutput: `Student: Aarav
Subjects: DSA, DBMS, OS
College: NIT Warangal`,
    practiceQuestions: [
      {
        problem: 'Write a function sum_all(*numbers) that returns the sum of any quantity of numbers passed.',
        hint: 'Use return sum(numbers).',
        solution: `def sum_all(*nums):
    return sum(nums)
print("Sum:", sum_all(10, 20, 30, 40))`,
        output: `Sum: 100`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why should you never use a mutable default argument (like def f(x=[])) in Python?',
        answer: 'Default argument expressions are evaluated once when the function is defined, not on each call. A mutable list is shared across all subsequent invocations, creating unintended state leaks.',
      },
    ],
  },

  // ===================== INTERMEDIATE (16 to 27) =====================
  {
    id: 'py-lambda',
    number: 16,
    title: 'Lambda',
    level: 'Intermediate',
    summary: 'Anonymous inline functions (lambda x: ...), combined with map(), filter(), and sorted().',
    explanation: [
      'A lambda function is a small anonymous function containing a single expression.',
      'Syntax: lambda arguments: expression.',
      'Frequently used as key functions in sort() or with functional map() and filter().',
    ],
    syntax: `square = lambda x: x ** 2
sorted_students = sorted(students, key=lambda s: s["cgpa"], reverse=True)`,
    exampleCode: `students = [
    {"name": "Sneha", "cgpa": 9.8},
    {"name": "Aarav", "cgpa": 9.2},
    {"name": "Rohan", "cgpa": 9.5}
]
students.sort(key=lambda s: s["cgpa"], reverse=True)
for s in students:
    print(f"{s['name']}: {s['cgpa']}")`,
    expectedOutput: `Sneha: 9.8\nRohan: 9.5\nAarav: 9.2`,
    practiceQuestions: [
      {
        problem: 'Use filter() and a lambda to extract numbers greater than 10 from [4, 15, 8, 22, 9].',
        hint: 'list(filter(lambda x: x > 10, nums))',
        solution: `nums = [4, 15, 8, 22, 9]
filtered = list(filter(lambda x: x > 10, nums))
print(filtered)`,
        output: `[15, 22]`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the limitation of a lambda function in Python compared to def?',
        answer: 'Lambdas are syntactically restricted to a single expression. They cannot contain statements, assignments, loops, or complex annotations.',
      },
    ],
  },
  {
    id: 'py-modules',
    number: 17,
    title: 'Modules',
    level: 'Intermediate',
    summary: 'Creating modules, import, from ... import ..., as alias, __name__ == "__main__", and built-ins.',
    explanation: [
      'A module is simply a Python file (.py) containing functions, classes, and variables.',
      'import module loads the file into sys.modules.',
      'if __name__ == "__main__": executes code only when run directly as a script, not when imported.',
    ],
    syntax: `import math as m
from datetime import datetime
if __name__ == "__main__":
    # script entrypoint`,
    exampleCode: `import math

def calculate_discount(price, pct):
    return price - (price * pct / 100)

if __name__ == "__main__":
    print(f"Discounted: {calculate_discount(1000, 15)}")
    print(f"Ceil of 8.2: {math.ceil(8.2)}")`,
    expectedOutput: `Discounted: 850.0\nCeil of 8.2: 9`,
    practiceQuestions: [
      {
        problem: 'Import the random module and generate a random integer between 1 and 6.',
        hint: 'Use random.randint(1, 6).',
        solution: `import random
# seeded for reproducibility in test
random.seed(42)
print("Roll:", random.randint(1, 6))`,
        output: `Roll: 6`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the purpose of the __name__ variable in Python?',
        answer: '__name__ is a built-in variable set to "__main__" if the file is being run as the top-level script, or to the module name if it was imported by another file.',
      },
    ],
  },
  {
    id: 'py-packages',
    number: 18,
    title: 'Packages',
    level: 'Intermediate',
    summary: 'Directory structures, __init__.py files, relative vs absolute imports, and namespace packages.',
    explanation: [
      'A package is a folder containing multiple Python modules.',
      'Historically required an __init__.py file (now optional in Python 3.3+ as namespace packages).',
      'Supports modular code distribution and packaging with pyproject.toml or setup.py.',
    ],
    syntax: `# Directory:
# my_tools/
#   __init__.py
#   calculators.py
#   converters.py
from my_tools.calculators import calculate_cgpa`,
    exampleCode: `import os
package_structure = [
    "student_tools/",
    "  __init__.py",
    "  calculators.py",
    "  interview.py"
]
print("\\n".join(package_structure))`,
    expectedOutput: `student_tools/
  __init__.py
  calculators.py
  interview.py`,
    practiceQuestions: [
      {
        problem: 'Show what code is placed in __init__.py to export a function directly from the package.',
        hint: 'from .calculators import calculate_cgpa',
        solution: `print("In __init__.py: from .calculators import calculate_cgpa")`,
        output: `In __init__.py: from .calculators import calculate_cgpa`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between an absolute import and a relative import in Python packages?',
        answer: 'Absolute imports use the full path from the project root (e.g. from app.models import User). Relative imports use leading dots to indicate parent/current folder (e.g. from .utils import helper).',
      },
    ],
  },
  {
    id: 'py-exception-handling',
    number: 19,
    title: 'Exception Handling',
    level: 'Intermediate',
    summary: 'try, except, else, finally, raise, custom exception classes, and exception chaining.',
    explanation: [
      'Errors detected during execution are called exceptions (e.g. ZeroDivisionError, FileNotFoundError).',
      'except catches specific exceptions. Avoid bare except:.',
      'else runs if no exception occurred; finally runs unconditionally.',
    ],
    syntax: `try:
    res = 10 / divisor
except ZeroDivisionError as e:
    print("Cannot divide by zero")
else:
    print("Success:", res)
finally:
    print("Cleanup done")`,
    exampleCode: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Division by zero is undefined"
    finally:
        pass

print("10 / 2 =", safe_divide(10, 2))
print("10 / 0 =", safe_divide(10, 0))`,
    expectedOutput: `10 / 2 = 5.0\n10 / 0 = Division by zero is undefined`,
    practiceQuestions: [
      {
        problem: 'Create a custom InvalidScoreException and raise it when score > 100.',
        hint: 'class InvalidScoreException(Exception): pass',
        solution: `class InvalidScoreException(Exception): pass
def validate(score):
    if score > 100: raise InvalidScoreException("Score cannot exceed 100")
try:
    validate(105)
except InvalidScoreException as e:
    print("Error:", e)`,
        output: `Error: Score cannot exceed 100`,
      },
    ],
    interviewQuestions: [
      {
        question: 'When does the "else" block execute in a try...except...else...finally statement?',
        answer: 'The else block executes only if the try block completes successfully without raising any exceptions.',
      },
    ],
  },
  {
    id: 'py-file-handling',
    number: 20,
    title: 'File Handling',
    level: 'Intermediate',
    summary: 'Reading/writing files, context manager (with open()), file modes (r, w, a, r+), and pathlib.',
    explanation: [
      'Always use with open("file.txt", "r") as f: context manager to ensure automatic file closing.',
      'Modes: "r" (read), "w" (overwrite), "a" (append), "b" (binary).',
      'pathlib.Path provides an object-oriented API for filesystem paths.',
    ],
    syntax: `with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("Student study notes\\n")

with open("notes.txt", "r") as f:
    content = f.read()`,
    exampleCode: `import tempfile

with tempfile.NamedTemporaryFile(mode="w+", delete=True) as tmp:
    tmp.write("StudentTools Python Guide\\nModule #20")
    tmp.seek(0)
    lines = tmp.readlines()
    print("Lines read:", len(lines))
    print("First line:", lines[0].strip())`,
    expectedOutput: `Lines read: 2\nFirst line: StudentTools Python Guide`,
    practiceQuestions: [
      {
        problem: 'Explain the difference between read(), readline(), and readlines().',
        hint: 'Entire file as string vs single line vs list of lines.',
        solution: `print("read() returns all as string; readline() returns 1 line; readlines() returns list of lines.")`,
        output: `read() returns all as string; readline() returns 1 line; readlines() returns list of lines.`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why is using the "with" statement (context manager) mandatory when opening files?',
        answer: 'It guarantees that the file descriptor is closed properly even if an exception is raised, preventing resource leaks.',
      },
    ],
  },
  {
    id: 'py-list-comprehension',
    number: 21,
    title: 'List Comprehension',
    level: 'Intermediate',
    summary: '[expr for item in iterable if condition], set comprehensions, and dict comprehensions.',
    explanation: [
      'List comprehensions provide an elegant, concise syntax for creating new lists from iterables.',
      'Syntax: [expression for item in iterable if condition].',
      'Significantly faster than manual for-loop with append() because it runs at C-speed in bytecode.',
    ],
    syntax: `squares = [x**2 for x in range(5)]
evens = [x for x in range(10) if x % 2 == 0]
gpa_map = {name: gpa for name, gpa in zip(names, gpas)}`,
    exampleCode: `scores = [85, 92, 78, 96, 64]
distinctions = [s for s in scores if s >= 80]
print("Distinctions:", distinctions)

# Dict comprehension
tools = ["Timer", "Notes", "Resume"]
tool_lengths = {t: len(t) for t in tools}
print("Lengths:", tool_lengths)`,
    expectedOutput: `Distinctions: [85, 92, 96]\nLengths: {'Timer': 5, 'Notes': 5, 'Resume': 6}`,
    practiceQuestions: [
      {
        problem: 'Flatten a 2D matrix [[1, 2], [3, 4], [5, 6]] into [1, 2, 3, 4, 5, 6] using list comprehension.',
        hint: '[x for row in matrix for x in row]',
        solution: `matrix = [[1, 2], [3, 4], [5, 6]]
flat = [x for row in matrix for x in row]
print("Flat:", flat)`,
        output: `Flat: [1, 2, 3, 4, 5, 6]`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between a list comprehension and a generator expression?',
        answer: 'A list comprehension [...] constructs the entire list in memory immediately. A generator expression (...) computes elements lazily on demand, using O(1) memory.',
      },
    ],
  },
  {
    id: 'py-oop',
    number: 22,
    title: 'OOP',
    level: 'Intermediate',
    summary: 'The 4 pillars in Python: Encapsulation, Abstraction, Inheritance, and Polymorphism with Duck Typing.',
    explanation: [
      'Python is fully object-oriented; everything (including functions, modules, and classes) is an object.',
      'Encapsulation bundles data and methods; private variables use leading double underscores (__var).',
      'Polymorphism is powered by "Duck Typing": if an object has the required method, Python calls it.',
    ],
    syntax: `class Duck:
    def speak(self): return "Quack"
class Human:
    def speak(self): return "Hello"

def announce(speaker):
    print(speaker.speak()) # Duck Typing`,
    exampleCode: `class Student:
    def __init__(self, name, cgpa):
        self.name = name
        self.cgpa = cgpa

    def status(self):
        return f"{self.name} has CGPA {self.cgpa}"

s1 = Student("Aarav", 9.45)
print(s1.status())`,
    expectedOutput: `Aarav has CGPA 9.45`,
    practiceQuestions: [
      {
        problem: 'Demonstrate Duck Typing with two classes Dog and Cat having speak() methods called through a single function.',
        hint: 'Pass both objects to def make_speak(animal): animal.speak().',
        solution: `class Dog:
    def sound(self): return "Woof"
class Cat:
    def sound(self): return "Meow"
def play(a): print(a.sound())
play(Dog()); play(Cat())`,
        output: `Woof\nMeow`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is Duck Typing in Python?',
        answer: 'Duck typing means an object’s suitability is determined by the presence of specific methods and properties at runtime rather than its explicit class inheritance ("If it walks like a duck and quacks like a duck, it is a duck").',
      },
    ],
  },
  {
    id: 'py-classes-objects',
    number: 23,
    title: 'Classes and Objects',
    level: 'Intermediate',
    summary: 'class keyword, self parameter, instance variables vs class variables, and methods.',
    explanation: [
      'A class defines attributes and methods; an object is an instantiated instance.',
      'self represents the instance calling the method and must be the first parameter.',
      'Class variables are shared across all instances; instance variables belong to self.',
    ],
    syntax: `class Tool:
    platform = "StudentTools" # Class variable
    def __init__(self, name):
        self.name = name      # Instance variable`,
    exampleCode: `class Course:
    institution = "NIT"

    def __init__(self, title, code):
        self.title = title
        self.code = code

c = Course("Operating Systems", "CS302")
print(f"{c.institution} - {c.code}: {c.title}")`,
    expectedOutput: `NIT - CS302: Operating Systems`,
    practiceQuestions: [
      {
        problem: 'Create a BankAccount class with deposit(amt) and get_balance() methods.',
        hint: 'Initialize self.balance = 0 in __init__.',
        solution: `class BankAccount:
    def __init__(self): self.balance = 0
    def deposit(self, amt): self.balance += amt
    def get_balance(self): return self.balance
acc = BankAccount()
acc.deposit(500)
print("Balance:", acc.get_balance())`,
        output: `Balance: 500`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the role of the self parameter in Python class methods?',
        answer: 'self explicitly references the instance object on which the method is called, allowing access to instance attributes and other methods.',
      },
    ],
  },
  {
    id: 'py-constructors',
    number: 24,
    title: 'Constructors',
    level: 'Intermediate',
    summary: '__init__() initialization, __new__() object creation, and __del__() destructors.',
    explanation: [
      '__init__() is the initializer called immediately after an object is created.',
      '__new__() is the actual constructor responsible for returning a new instance (used in Singletons).',
      '__str__() and __repr__() define string representations of objects.',
    ],
    syntax: `class Profile:
    def __init__(self, name, tier="Free"):
        self.name = name
        self.tier = tier
    def __str__(self):
        return f"{self.name} [{self.tier}]"`,
    exampleCode: `class StudentUser:
    def __init__(self, username, email):
        self.username = username
        self.email = email

    def __repr__(self):
        return f"StudentUser('{self.username}', '{self.email}')"

u = StudentUser("aarav_s", "aarav@student.edu")
print(repr(u))`,
    expectedOutput: `StudentUser('aarav_s', 'aarav@student.edu')`,
    practiceQuestions: [
      {
        problem: 'Implement __str__ in a Point(x, y) class so print(Point(3, 4)) outputs "Point(3, 4)".',
        hint: 'def __str__(self): return f"Point({self.x}, {self.y})"',
        solution: `class Point:
    def __init__(self, x, y): self.x, self.y = x, y
    def __str__(self): return f"Point({self.x}, {self.y})"
print(Point(3, 4))`,
        output: `Point(3, 4)`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between __new__ and __init__ in Python?',
        answer: '__new__ creates and returns the raw object instance in memory; __init__ takes that instance as self and initializes its attributes.',
      },
    ],
  },
  {
    id: 'py-inheritance',
    number: 25,
    title: 'Inheritance',
    level: 'Intermediate',
    summary: 'Single, multiple, and multilevel inheritance, super() proxy, and Method Resolution Order (MRO).',
    explanation: [
      'A child class inherits attributes and methods from one or more parent classes.',
      'super() accesses parent class methods without naming the parent explicitly.',
      'Python supports multiple inheritance; ambiguity is resolved via C3 Linearization (MRO).',
    ],
    syntax: `class Child(Parent1, Parent2):
    def __init__(self):
        super().__init__()`,
    exampleCode: `class BaseTool:
    def info(self): return "Base Student Tool"

class Pomodoro(BaseTool):
    def info(self):
        return f"{super().info()} -> 25min Focus Timer"

p = Pomodoro()
print(p.info())
print("MRO:", [c.__name__ for c in Pomodoro.mro()])`,
    expectedOutput: `Base Student Tool -> 25min Focus Timer\nMRO: ['Pomodoro', 'BaseTool', 'object']`,
    practiceQuestions: [
      {
        problem: 'Implement two parent classes Logger and Notifier inherited by an AppNotification child class.',
        hint: 'class AppNotification(Logger, Notifier): pass',
        solution: `class Logger:
    def log(self): return "Logged"
class Notifier:
    def notify(self): return "Alerted"
class AppNotif(Logger, Notifier): pass
a = AppNotif()
print(a.log(), a.notify())`,
        output: `Logged Alerted`,
      },
    ],
    interviewQuestions: [
      {
        question: 'How does Python resolve the Diamond Problem in multiple inheritance?',
        answer: 'Python uses the C3 Linearization algorithm to calculate a consistent Method Resolution Order (MRO), accessible via Class.mro().',
      },
    ],
  },
  {
    id: 'py-polymorphism',
    number: 26,
    title: 'Polymorphism',
    level: 'Intermediate',
    summary: 'Method overriding, operator overloading with dunder methods (__add__, __len__, __eq__).',
    explanation: [
      'Subclasses can override methods of parent classes to provide custom behavior.',
      'Operator overloading allows standard operators (+, -, ==, len()) to work with custom classes.',
      'Dunder methods: __add__ for +, __len__ for len(), __eq__ for ==.',
    ],
    syntax: `class Vector:
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)`,
    exampleCode: `class GradePoint:
    def __init__(self, pts): self.pts = pts
    def __add__(self, other): return GradePoint(self.pts + other.pts)
    def __repr__(self): return f"Points({self.pts})"

p1 = GradePoint(9.0)
p2 = GradePoint(8.5)
total = p1 + p2
print("Combined:", total)`,
    expectedOutput: `Combined: Points(17.5)`,
    practiceQuestions: [
      {
        problem: 'Implement __len__ in a CoursePlaylist class to return the count of lessons in a list.',
        hint: 'def __len__(self): return len(self.lessons)',
        solution: `class Playlist:
    def __init__(self, lessons): self.lessons = lessons
    def __len__(self): return len(self.lessons)
pl = Playlist(["Intro", "Variables", "OOP"])
print("Lesson count:", len(pl))`,
        output: `Lesson count: 3`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the purpose of magic (dunder) methods in Python?',
        answer: 'Dunder (double underscore) methods allow user-defined classes to hook into Python’s built-in syntax (e.g. operators, iteration, indexing, context managers).',
      },
    ],
  },
  {
    id: 'py-encapsulation',
    number: 27,
    title: 'Encapsulation',
    level: 'Intermediate',
    summary: 'Public, protected (_var), private (__var) naming, name mangling, and @property decorators.',
    explanation: [
      'Public variables have no prefix (var).',
      'Protected variables use a single leading underscore (_var) as a convention for internal use.',
      'Private variables use double leading underscores (__var), which triggers Name Mangling (_Class__var).',
      '@property and @attr.setter provide clean Pythonic getter and setter syntax.',
    ],
    syntax: `class Account:
    def __init__(self):
        self._protected = 1
        self.__private = 2
    @property
    def balance(self): return self.__private`,
    exampleCode: `class StudentRecord:
    def __init__(self, name, cgpa):
        self.name = name
        self.__cgpa = cgpa

    @property
    def cgpa(self):
        return self.__cgpa

    @cgpa.setter
    def cgpa(self, val):
        if 0.0 <= val <= 10.0:
            self.__cgpa = val

s = StudentRecord("Sneha", 9.4)
s.cgpa = 9.85
print(f"{s.name} CGPA: {s.cgpa}")`,
    expectedOutput: `Sneha CGPA: 9.85`,
    practiceQuestions: [
      {
        problem: 'Create a Temperature class with a celsius property that rejects temperatures below -273.15.',
        hint: 'Use @property and @celsius.setter with validation.',
        solution: `class Temp:
    def __init__(self, c=0): self._c = c
    @property
    def celsius(self): return self._c
    @celsius.setter
    def celsius(self, v):
        if v >= -273.15: self._c = v
t = Temp(25)
t.celsius = -300
print("Temp:", t.celsius)`,
        output: `Temp: 25`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Does Python have true private variables like Java or C++?',
        answer: 'No. Python achieves privacy via name mangling (_ClassName__var). A programmer can still access the variable if desired, adhering to the Python philosophy: "We are all consenting adults here".',
      },
    ],
  },

  // ===================== ADVANCED (28 to 35) =====================
  {
    id: 'py-iterators',
    number: 28,
    title: 'Iterators',
    level: 'Advanced',
    summary: 'Iteration protocol, __iter__(), __next__(), StopIteration exception, and custom iterators.',
    explanation: [
      'An iterable is any object capable of returning its members one at a time (implements __iter__()).',
      'An iterator is an object with a state that yields next elements via __next__().',
      'When elements are exhausted, __next__() must raise StopIteration.',
    ],
    syntax: `it = iter([10, 20])
print(next(it)) # 10
print(next(it)) # 20
# next(it) raises StopIteration`,
    exampleCode: `class Countdown:
    def __init__(self, start): self.cur = start
    def __iter__(self): return self
    def __next__(self):
        if self.cur <= 0: raise StopIteration
        val = self.cur
        self.cur -= 1
        return val

print(list(Countdown(3)))`,
    expectedOutput: `[3, 2, 1]`,
    practiceQuestions: [
      {
        problem: 'Use iter() with a sentinel function to read numbers until a 0 is generated.',
        hint: 'iter(callable, sentinel)',
        solution: `nums = [10, 20, 30, 0, 40]
it = iter(nums.pop, 0)
print(list(it))`,
        output: `[40, 0]`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between an iterable and an iterator in Python?',
        answer: 'An iterable is any object from which you can obtain an iterator via iter(obj). An iterator maintains internal state and yields elements one-by-one via next(iterator).',
      },
    ],
  },
  {
    id: 'py-generators',
    number: 29,
    title: 'Generators',
    level: 'Advanced',
    summary: 'yield keyword, generator functions, generator expressions, state suspension, and memory benefits.',
    explanation: [
      'A generator function uses yield instead of return to produce a sequence of values lazily.',
      'When yield is encountered, function state is suspended and resumed on the next call.',
      'Uses O(1) memory, making it ideal for streaming massive files or infinite series.',
    ],
    syntax: `def count_up(n):
    for i in range(1, n + 1):
        yield i

gen = (x**2 for x in range(1000000)) # Generator Expression`,
    exampleCode: `def fibonacci_gen(limit):
    a, b = 0, 1
    for _ in range(limit):
        yield a
        a, b = b, a + b

print(list(fibonacci_gen(6)))`,
    expectedOutput: `[0, 1, 1, 2, 3, 5]`,
    practiceQuestions: [
      {
        problem: 'Create a generator that yields even numbers up to 10.',
        hint: 'Loop range(2, n + 1, 2) and yield.',
        solution: `def evens(n):
    for i in range(2, n + 1, 2): yield i
print(list(evens(10)))`,
        output: `[2, 4, 6, 8, 10]`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why are generators preferred for processing multi-gigabyte log files?',
        answer: 'Generators stream lines one by one into memory rather than loading the entire file into a giant list, preventing Out-Of-Memory (OOM) crashes.',
      },
    ],
  },
  {
    id: 'py-decorators',
    number: 30,
    title: 'Decorators',
    level: 'Advanced',
    summary: 'Higher-order functions, @wrapper syntax, functools.wraps, timing, logging, and auth decorators.',
    explanation: [
      'A decorator wraps a function to extend or alter its behavior without modifying its source code.',
      'Decorators take a function as an argument and return a modified callable wrapper.',
      'Use @functools.wraps(func) to preserve the original function docstring and name.',
    ],
    syntax: `import functools
def my_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # pre-action
        result = func(*args, **kwargs)
        # post-action
        return result
    return wrapper`,
    exampleCode: `import time

def timer(func):
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        res = func(*args, **kwargs)
        t1 = time.perf_counter()
        print(f"[{func.__name__}] executed")
        return res
    return wrapper

@timer
def calculate_cgpa():
    return 9.45

print("Result:", calculate_cgpa())`,
    expectedOutput: `[calculate_cgpa] executed\nResult: 9.45`,
    practiceQuestions: [
      {
        problem: 'Write a decorator @shout that converts the return string of any function to uppercase.',
        hint: 'def wrapper(*args): return func(*args).upper()',
        solution: `def shout(func):
    def wrapper(): return func().upper()
    return wrapper
@shout
def greet(): return "welcome student"
print(greet())`,
        output: `WELCOME STUDENT`,
      },
    ],
    interviewQuestions: [
      {
        question: 'How do you create a decorator that accepts parameters (e.g. @repeat(num=3))?',
        answer: 'Define a 3-level nested function: an outer function accepting the decorator parameters, which returns the actual decorator, which in turn returns the function wrapper.',
      },
    ],
  },
  {
    id: 'py-regex',
    number: 31,
    title: 'Regular Expressions',
    level: 'Advanced',
    summary: 're module (search, match, findall, sub), metacharacters, character classes, and email/phone validation.',
    explanation: [
      'The re module provides Perl-style regular expression pattern matching in Python.',
      're.search() searches anywhere in string; re.match() matches only from the start.',
      're.findall() returns all matches as a list; re.sub() replaces matched patterns.',
    ],
    syntax: `import re
match = re.search(r'\\d+', text)
emails = re.findall(r'[\\w.-]+@[\\w.-]+', text)`,
    exampleCode: `import re

email = "aarav.sharma@studenttools.edu"
pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$"
is_valid = bool(re.match(pattern, email))
print(f"Email '{email}' valid: {is_valid}")`,
    expectedOutput: `Email 'aarav.sharma@studenttools.edu' valid: True`,
    practiceQuestions: [
      {
        problem: 'Extract all numbers from "B.Tech Sem 6 CGPA 9.25 Credits 24" using re.findall.',
        hint: 're.findall(r"\\d+(?:\\.\\d+)?", text)',
        solution: `import re
text = "B.Tech Sem 6 CGPA 9.25 Credits 24"
print(re.findall(r"\\d+(?:\\.\\d+)?", text))`,
        output: `['6', '9.25', '24']`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the purpose of raw strings r"..." in Python regular expressions?',
        answer: 'Raw strings treat backslashes as literal characters, preventing Python string escape sequences (e.g. \\n, \\t) from interfering with regex metacharacters (e.g. \\d, \\s).',
      },
    ],
  },
  {
    id: 'py-venv',
    number: 32,
    title: 'Virtual Environments',
    level: 'Advanced',
    summary: 'venv, requirements.txt, pip freeze, isolating dependency versions, and poetry/pipenv.',
    explanation: [
      'Virtual environments isolate Python interpreters and libraries per project.',
      'Prevents dependency conflicts between projects (e.g. Django 4 vs Django 5).',
      'requirements.txt locks exact package versions for reproducible deployments.',
    ],
    syntax: `python3 -m venv venv
source venv/bin/activate       # Mac/Linux
venv\\Scripts\\activate          # Windows
pip freeze > requirements.txt`,
    exampleCode: `import sys

is_venv = sys.prefix != sys.base_prefix
print(f"Running inside Virtual Environment: {is_venv}")
print(f"Prefix: {sys.prefix}")`,
    expectedOutput: `Running inside Virtual Environment: True
Prefix: /usr`,
    practiceQuestions: [
      {
        problem: 'What command reinstalls all exact pinned dependencies from a requirements.txt file?',
        hint: 'pip install -r requirements.txt',
        solution: `print("Command: pip install -r requirements.txt")`,
        output: `Command: pip install -r requirements.txt`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why should the venv folder never be committed to Git version control?',
        answer: 'Virtual environments are platform-specific (binaries and symlinks differ across OSs) and large. Only requirements.txt or pyproject.toml should be committed.',
      },
    ],
  },
  {
    id: 'py-apis',
    number: 33,
    title: 'APIs',
    level: 'Advanced',
    summary: 'Consuming REST APIs with requests / urllib, JSON parsing, query params, headers, and status codes.',
    explanation: [
      'REST APIs transmit JSON payloads over standard HTTP methods (GET, POST, PUT, DELETE).',
      'requests library makes HTTP calls intuitive (requests.get(url, headers=headers)).',
      'response.json() deserializes JSON text directly into Python dictionaries and lists.',
    ],
    syntax: `import requests
res = requests.get("https://api.example.com/data")
if res.status_code == 200:
    data = res.json()`,
    exampleCode: `import json

mock_response = '{"portal": "StudentTools", "status": "active", "tools_count": 14}'
data = json.loads(mock_response)
print("Portal:", data["portal"])
print("Status:", data["status"])
print("Active Tools:", data["tools_count"])`,
    expectedOutput: `Portal: StudentTools\nStatus: active\nActive Tools: 14`,
    practiceQuestions: [
      {
        problem: 'Serialize a Python dictionary into a formatted JSON string with 2-space indentation.',
        hint: 'Use json.dumps(data, indent=2).',
        solution: `import json
data = {"user": "Aarav", "points": 95}
print(json.dumps(data, indent=2))`,
        output: `{\n  "user": "Aarav",\n  "points": 95\n}`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between json.load() and json.loads() in Python?',
        answer: 'json.load() reads and deserializes JSON from an open file-like stream; json.loads() deserializes directly from a memory string ("loads" = "load string").',
      },
    ],
  },
  {
    id: 'py-db-connectivity',
    number: 34,
    title: 'Database connectivity',
    level: 'Advanced',
    summary: 'sqlite3, cursor execution, parameterized queries, commit, rollback, and ORM introduction (SQLAlchemy).',
    explanation: [
      'Python includes built-in sqlite3 database support requiring zero external setup.',
      'cursor.execute("SELECT ... WHERE id = ?", (val,)) uses tuple parameters to block SQL injection.',
      'Transactions must be explicitly finalized with conn.commit().',
    ],
    syntax: `import sqlite3
conn = sqlite3.connect("student.db")
cursor = conn.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS notes (id INT, text TEXT)")
conn.commit()`,
    exampleCode: `import sqlite3

conn = sqlite3.connect(":memory:") # In-memory database
cur = conn.cursor()
cur.execute("CREATE TABLE users (id INT, name TEXT, cgpa REAL)")
cur.execute("INSERT INTO users VALUES (?, ?, ?)", (101, "Aarav", 9.45))
conn.commit()

cur.execute("SELECT name, cgpa FROM users WHERE id = ?", (101,))
row = cur.fetchone()
print(f"Loaded Student from SQLite: {row[0]} -> {row[1]} CGPA")
conn.close()`,
    expectedOutput: `Loaded Student from SQLite: Aarav -> 9.45 CGPA`,
    practiceQuestions: [
      {
        problem: 'Why should you never format raw SQL with f-strings (e.g. f"SELECT * WHERE name=\'{user_input}\'")?',
        hint: 'Explain SQL Injection vulnerability.',
        solution: `print("String formatting allows attackers to inject malicious SQL commands (SQL Injection). Always use parameterized queries (?).")`,
        output: `String formatting allows attackers to inject malicious SQL commands (SQL Injection). Always use parameterized queries (?).`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is an ORM (like SQLAlchemy or Django ORM) and why is it used in Python backends?',
        answer: 'An Object-Relational Mapper maps database tables to Python classes and rows to object instances, allowing developers to query and manipulate data using Python code rather than raw SQL.',
      },
    ],
  },
  {
    id: 'py-advanced-projects',
    number: 35,
    title: 'Advanced Python projects',
    level: 'Advanced',
    summary: 'Full-stack FastAPI/Flask web apps, data processing with Pandas, automation bots, and production best practices.',
    explanation: [
      'Advanced Python integrates web frameworks (FastAPI, Flask, Django) with background workers (Celery, asyncio).',
      'Follow clean architecture: separate business logic, database access layers, and API route controllers.',
      'Enforce testing with pytest, type hints with mypy, and automated CI/CD linting.',
    ],
    syntax: `# FastAPI Endpoint Architecture
from fastapi import FastAPI
app = FastAPI()

@app.get("/api/health")
def health():
    return {"status": "ok", "platform": "StudentTools"}`,
    exampleCode: `class StudentToolsArchitecture:
    def __init__(self):
        self.modules = ["Calculators", "AI Tutor", "Firestore Sync", "Coding Practice"]

    def audit(self):
        return {
            "platform": "StudentTools Pro",
            "active_services": len(self.modules),
            "production_ready": True
        }

system = StudentToolsArchitecture()
print("System Architecture Status:", system.audit())`,
    expectedOutput: `System Architecture Status: {'platform': 'StudentTools Pro', 'active_services': 4, 'production_ready': True}`,
    practiceQuestions: [
      {
        problem: 'Outline the 3 main layers in a clean Python backend architecture.',
        hint: 'Presentation/Controller layer, Service/Business logic layer, Repository/Data layer.',
        solution: `print("1. Controller/API Layer -> 2. Service/Business Logic -> 3. Repository/Data Persistence")`,
        output: `1. Controller/API Layer -> 2. Service/Business Logic -> 3. Repository/Data Persistence`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the Global Interpreter Lock (GIL) in CPython and how can CPU-bound tasks bypass it?',
        answer: 'The GIL allows only one thread to execute Python bytecode at a time. For CPU-bound tasks, use the multiprocessing module (which spawns separate OS processes with independent GILs) or offload computation to C extensions/NumPy.',
      },
    ],
  },
];
