export type CodingCategory = 'java' | 'python' | 'sql' | 'javascript';
export type CodingDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface CodingProblem {
  id: string;
  title: string;
  category: CodingCategory;
  difficulty: CodingDifficulty;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  exampleInput: string;
  exampleOutput: string;
  expectedResult: string;
  hint: string;
  solutionExplanation: string;
  starterCode: string;
  solutionCode: string;
}

export const CODING_PROBLEMS: CodingProblem[] = [
  // ================= JAVA PROBLEMS =================
  {
    id: 'java-p1',
    title: 'Two Sum',
    category: 'java',
    difficulty: 'Easy',
    problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Each input has exactly one solution, and you may not use the same element twice.',
    inputFormat: 'nums = [2, 7, 11, 15], target = 9',
    outputFormat: '[0, 1]',
    exampleInput: 'nums = [2, 7, 11, 15], target = 9',
    exampleOutput: '[0, 1]',
    expectedResult: '[0, 1] because nums[0] + nums[1] == 2 + 7 == 9',
    hint: 'Use a HashMap to store values and their indices. For each element num, check if (target - num) is already in the map.',
    solutionExplanation: 'A brute-force double loop takes O(n²). Using a HashMap allows checking the complement in O(1) time, achieving O(n) linear time complexity with O(n) space.',
    starterCode: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
    solutionCode: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
  },
  {
    id: 'java-p2',
    title: 'Valid Parentheses',
    category: 'java',
    difficulty: 'Medium',
    problemStatement: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. Brackets must close in the correct order and open brackets must be closed by the same type.',
    inputFormat: 's = "{[()]}"',
    outputFormat: 'true',
    exampleInput: 's = "{[()]}"',
    exampleOutput: 'true',
    expectedResult: 'true',
    hint: 'Use a Stack. Push opening brackets. When a closing bracket arrives, verify that the popped bracket matches.',
    solutionExplanation: 'Push matching closing brackets onto a stack when seeing an open bracket. When encountering a closing character, pop from the stack and verify equality. At the end, stack must be empty.',
    starterCode: `import java.util.*;

class Solution {
    public boolean isValid(String s) {
        // Your code here
        return false;
    }
}`,
    solutionCode: `import java.util.*;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
  },
  {
    id: 'java-p3',
    title: 'Merge K Sorted Lists',
    category: 'java',
    difficulty: 'Hard',
    problemStatement: 'You are given an array of k linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    inputFormat: 'k sorted lists [[1,4,5],[1,3,4],[2,6]]',
    outputFormat: '[1,1,2,3,4,4,5,6]',
    exampleInput: 'lists = [[1,4,5],[1,3,4],[2,6]]',
    exampleOutput: '[1,1,2,3,4,4,5,6]',
    expectedResult: 'A single continuous sorted list',
    hint: 'Use a Min-Heap (PriorityQueue) holding the current head node of each of the k lists.',
    solutionExplanation: 'Maintain a PriorityQueue of size k ordered by node value. Poll the minimum element and insert its next node into the heap. Total time complexity is O(N log k) where N is total nodes.',
    starterCode: `import java.util.*;

class Solution {
    public int[] mergeKSortedArrays(int[][] arrays) {
        // Return single sorted merged array
        return new int[]{};
    }
}`,
    solutionCode: `import java.util.*;

class Solution {
    public int[] mergeKSortedArrays(int[][] arrays) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int[] arr : arrays) {
            for (int val : arr) minHeap.add(val);
        }
        int[] result = new int[minHeap.size()];
        int idx = 0;
        while (!minHeap.isEmpty()) {
            result[idx++] = minHeap.poll();
        }
        return result;
    }
}`,
  },

  // ================= PYTHON PROBLEMS =================
  {
    id: 'py-p1',
    title: 'Valid Palindrome',
    category: 'python',
    difficulty: 'Easy',
    problemStatement: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    inputFormat: 's = "A man, a plan, a canal: Panama"',
    outputFormat: 'True',
    exampleInput: 's = "A man, a plan, a canal: Panama"',
    exampleOutput: 'True',
    expectedResult: 'True (amanaplanacanalpanama is a palindrome)',
    hint: 'Filter string with c.isalnum() and check if filtered == filtered[::-1].',
    solutionExplanation: 'Clean the input using a list comprehension with char.isalnum() and char.lower(), then compare the string to its reverse in O(n) time.',
    starterCode: `def is_palindrome(s: str) -> bool:
    # Your code here
    return False`,
    solutionCode: `def is_palindrome(s: str) -> bool:
    cleaned = "".join(ch.lower() for ch in s if ch.isalnum())
    return cleaned == cleaned[::-1]`,
  },
  {
    id: 'py-p2',
    title: 'Group Anagrams',
    category: 'python',
    difficulty: 'Medium',
    problemStatement: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    inputFormat: 'strs = ["eat","tea","tan","ate","nat","bat"]',
    outputFormat: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
    exampleInput: 'strs = ["eat","tea","tan","ate","nat","bat"]',
    exampleOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
    expectedResult: 'Lists of grouped words matching sorted letter signatures',
    hint: 'Use the tuple of sorted characters or a 26-element character count tuple as a dictionary key.',
    solutionExplanation: 'Words that are anagrams produce the exact same sorted string (e.g., tuple(sorted("eat")) == ("a", "e", "t")). Use collections.defaultdict(list) grouping words by this key in O(N * K log K).',
    starterCode: `from typing import List

def group_anagrams(strs: List[str]) -> List[List[str]]:
    # Your code here
    return []`,
    solutionCode: `from collections import defaultdict
from typing import List

def group_anagrams(strs: List[str]) -> List[List[str]]:
    groups = defaultdict(list)
    for word in strs:
        key = "".join(sorted(word))
        groups[key].append(word)
    return list(groups.values())`,
  },
  {
    id: 'py-p3',
    title: 'Trapping Rain Water',
    category: 'python',
    difficulty: 'Hard',
    problemStatement: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    inputFormat: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
    outputFormat: '6',
    exampleInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
    exampleOutput: '6',
    expectedResult: '6 units of trapped water',
    hint: 'Use two pointers from left and right maintaining left_max and right_max.',
    solutionExplanation: 'With two pointers l and r, water trapped at position i is min(max_left, max_right) - height[i]. Advance the pointer with the smaller boundary inward in O(n) time and O(1) space.',
    starterCode: `from typing import List

def trap(height: List[int]) -> int:
    # Your code here
    return 0`,
    solutionCode: `from typing import List

def trap(height: List[int]) -> int:
    if not height: return 0
    l, r = 0, len(height) - 1
    left_max, right_max = height[l], height[r]
    water = 0
    while l < r:
        if left_max < right_max:
            l += 1
            left_max = max(left_max, height[l])
            water += left_max - height[l]
        else:
            r -= 1
            right_max = max(right_max, height[r])
            water += right_max - height[r]
    return water`,
  },

  // ================= SQL PROBLEMS =================
  {
    id: 'sql-p1',
    title: 'Find Second Highest Salary',
    category: 'sql',
    difficulty: 'Easy',
    problemStatement: 'Write an SQL query to report the second highest salary from the Employee table. If there is no second highest salary, return null.',
    inputFormat: 'Table Employee (id INT, salary INT) with salaries [100, 200, 300]',
    outputFormat: '200',
    exampleInput: 'Salaries: 100, 200, 300',
    exampleOutput: 'SecondHighestSalary = 200',
    expectedResult: '200',
    hint: 'Use MAX(salary) where salary < (SELECT MAX(salary)).',
    solutionExplanation: 'Using subquery with MAX() automatically returns NULL if only 1 distinct salary exists in the table.',
    starterCode: `-- Write your SQL query below:
SELECT ... FROM Employee;`,
    solutionCode: `SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);`,
  },
  {
    id: 'sql-p2',
    title: 'Department Top 3 Salaries',
    category: 'sql',
    difficulty: 'Medium',
    problemStatement: 'Find employees who earn the top three unique salaries in each department.',
    inputFormat: 'Employee table and Department table',
    outputFormat: 'Department, Employee, Salary',
    exampleInput: 'IT Department with salaries 90000, 85000, 85000, 70000, 60000',
    exampleOutput: 'Salaries 90000, 85000, 70000 included',
    expectedResult: 'Rows with DENSE_RANK() <= 3 within each department partition',
    hint: 'Use DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC).',
    solutionExplanation: 'DENSE_RANK() ensures ties receive the same rank without skipping subsequent ranks, correctly finding unique top 3 salary tiers.',
    starterCode: `-- Use DENSE_RANK() in a CTE or subquery:
WITH RankedSalaries AS (
    SELECT ...
)
SELECT ... FROM RankedSalaries;`,
    solutionCode: `WITH RankedSalaries AS (
    SELECT d.name AS Department, e.name AS Employee, e.salary,
           DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS ranking
    FROM Employee e
    JOIN Department d ON e.departmentId = d.id
)
SELECT Department, Employee, salary AS Salary
FROM RankedSalaries
WHERE ranking <= 3;`,
  },
  {
    id: 'sql-p3',
    title: 'Consecutive Available Seats',
    category: 'sql',
    difficulty: 'Hard',
    problemStatement: 'Find all consecutive seat IDs that are free (free = 1) in a movie theater cinema table, ordered by seat_id.',
    inputFormat: 'Cinema (seat_id INT, free BOOL)',
    outputFormat: 'seat_id',
    exampleInput: 'Seats 1:free, 2:occupied, 3:free, 4:free, 5:free',
    exampleOutput: '3, 4, 5',
    expectedResult: 'Consecutive free seats (3, 4, 5)',
    hint: 'Self-join the cinema table on ABS(c1.seat_id - c2.seat_id) = 1 AND c1.free = 1 AND c2.free = 1.',
    solutionExplanation: 'Joining cinema c1 with cinema c2 where absolute difference in seat_id is 1 and both are free identifies any seat adjacent to another free seat.',
    starterCode: `SELECT DISTINCT c1.seat_id
FROM Cinema c1
-- Join logic here
ORDER BY c1.seat_id;`,
    solutionCode: `SELECT DISTINCT c1.seat_id
FROM Cinema c1
JOIN Cinema c2 ON ABS(c1.seat_id - c2.seat_id) = 1
WHERE c1.free = 1 AND c2.free = 1
ORDER BY c1.seat_id;`,
  },

  // ================= JAVASCRIPT PROBLEMS =================
  {
    id: 'js-p1',
    title: 'Array Chunking',
    category: 'javascript',
    difficulty: 'Easy',
    problemStatement: 'Given an array arr and a chunk size size, return a chunked array. A chunked array contains the original elements in sub-arrays of maximum length size.',
    inputFormat: 'arr = [1, 2, 3, 4, 5], size = 2',
    outputFormat: '[[1, 2], [3, 4], [5]]',
    exampleInput: 'arr = [1, 2, 3, 4, 5], size = 2',
    exampleOutput: '[[1, 2], [3, 4], [5]]',
    expectedResult: '[[1, 2], [3, 4], [5]]',
    hint: 'Loop with i += size and slice chunks using arr.slice(i, i + size).',
    solutionExplanation: 'Using a step loop with arr.slice() avoids mutating the original array and constructs sub-arrays in O(n) time.',
    starterCode: `function chunk(arr, size) {
    // Your code here
    return [];
}`,
    solutionCode: `function chunk(arr, size) {
    const chunked = [];
    for (let i = 0; i < arr.length; i += size) {
        chunked.push(arr.slice(i, i + size));
    }
    return chunked;
}`,
  },
  {
    id: 'js-p2',
    title: 'Debounce Function',
    category: 'javascript',
    difficulty: 'Medium',
    problemStatement: 'Given a function fn and a time in milliseconds t, return a debounced version of that function. A debounced function will delay the execution of fn by t milliseconds until no further calls are made.',
    inputFormat: 'fn = log(), t = 50ms',
    outputFormat: 'Function executes after 50ms of quiet time',
    exampleInput: 'Multiple rapid calls within 30ms window',
    exampleOutput: 'Only the final call executes after 50ms delay',
    expectedResult: 'A debounced closure wrapper with clearTimeout',
    hint: 'Maintain timerId in lexical scope, call clearTimeout(timerId) on each invocation.',
    solutionExplanation: 'A closure retains the timer identifier. Whenever the debounced wrapper is triggered, clearTimeout resets the countdown, postponing execution until t ms have elapsed without new invocations.',
    starterCode: `function debounce(fn, t) {
    let timer;
    return function(...args) {
        // Your code here
    };
}`,
    solutionCode: `function debounce(fn, t) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, t);
    };
}`,
  },
  {
    id: 'js-p3',
    title: 'Deep Clone Object',
    category: 'javascript',
    difficulty: 'Hard',
    problemStatement: 'Implement a function deepClone(obj) that deeply copies an object or array, correctly handling nested objects, arrays, Date objects, and circular references.',
    inputFormat: 'Nested object with arrays and circular link',
    outputFormat: 'Completely independent clone',
    exampleInput: '{ a: 1, b: { c: [2, 3] } }',
    exampleOutput: 'Identical value structure in distinct memory',
    expectedResult: 'Deep cloned object independent of mutations to original',
    hint: 'Use a WeakMap to track visited objects to prevent infinite loops from circular references.',
    solutionExplanation: 'Recursively clone keys and values. A WeakMap stores original objects mapped to cloned instances to safely resolve circular references.',
    starterCode: `function deepClone(obj, hash = new WeakMap()) {
    // Handle primitives, null, arrays, objects
    return obj;
}`,
    solutionCode: `function deepClone(obj, hash = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (hash.has(obj)) return hash.get(obj);

    const clone = Array.isArray(obj) ? [] : {};
    hash.set(obj, clone);

    for (const key of Object.keys(obj)) {
        clone[key] = deepClone(obj[key], hash);
    }
    return clone;
}`,
  },
];
