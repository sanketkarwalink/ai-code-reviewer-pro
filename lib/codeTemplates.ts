export const codeTemplates = {
  javascript: [
    {
      title: "Array Manipulation Function",
      description: "Function with potential edge case issues",
      code: `function findMaxValue(numbers) {
  let max = 0;
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  return max;
}`,
      expectedIssues: ["Edge case: empty array", "Edge case: all negative numbers", "No input validation"]
    },
    {
      title: "Async API Call",
      description: "Promise handling with potential issues",
      code: `async function fetchUserData(userId) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const data = await response.json();
  return data;
}`,
      expectedIssues: ["No error handling", "No response status check", "No input validation"]
    },
    {
      title: "Event Handler",
      description: "DOM manipulation with accessibility concerns",
      code: `function handleButtonClick() {
  const button = document.getElementById('submit-btn');
  button.onclick = function() {
    document.getElementById('result').innerHTML = 'Processing...';
    processForm();
  };
}`,
      expectedIssues: ["No null checks", "innerHTML security risk", "No accessibility attributes"]
    }
  ],
  python: [
    {
      title: "Data Processing Function",
      description: "List processing with edge cases",
      code: `def process_data(data):
    result = []
    for item in data:
        if item != None:
            result.append(item * 2)
    return result`,
      expectedIssues: ["No type hints", "Inefficient list building", "No input validation"]
    },
    {
      title: "File Reader",
      description: "File handling without proper error management",
      code: `def read_config_file(filename):
    file = open(filename, 'r')
    content = file.read()
    file.close()
    return content`,
      expectedIssues: ["No exception handling", "File not closed on error", "Should use context manager"]
    },
    {
      title: "Class Definition",
      description: "Simple class with potential improvements",
      code: `class Calculator:
    def __init__(self):
        self.history = []
    
    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result`,
      expectedIssues: ["No type hints", "No input validation", "No docstrings"]
    }
  ],
  java: [
    {
      title: "Array Search Method",
      description: "Linear search with potential optimizations",
      code: `public class ArrayUtils {
    public static int findElement(int[] array, int target) {
        for (int i = 0; i < array.length; i++) {
            if (array[i] == target) {
                return i;
            }
        }
        return -1;
    }
}`,
      expectedIssues: ["No null check", "Could use binary search if sorted", "No documentation"]
    }
  ],
  cpp: [
    {
      title: "Memory Management",
      description: "Dynamic allocation with potential leaks",
      code: `#include <iostream>
using namespace std;

int* createArray(int size) {
    int* arr = new int[size];
    for(int i = 0; i < size; i++) {
        arr[i] = i * 2;
    }
    return arr;
}`,
      expectedIssues: ["Memory leak potential", "No size validation", "Raw pointer usage"]
    }
  ]
};
