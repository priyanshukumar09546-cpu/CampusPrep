// ============================================================================
// PROFESSORVIRUS — CODING ROUND CLEAN CLIENT FALLBACK (NO SOLUTIONS)
// Provides clean starter templates and question schemas if network offline.
// NEVER CONTAINS SOLUTIONS OR HIDDEN TEST CASES.
// ============================================================================

export const FALLBACK_CODING_QUESTIONS = [
  {
    questionId: 'CODE-001',
    title: 'Two Sum',
    difficulty: 'Easy',
    subject: 'DSA & Problem Solving',
    topic: 'Arrays, Hashing',
    timeLimit: '60 Minutes',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    inputFormat: 'Line 1: Array of integers nums. Line 2: Integer target.',
    outputFormat: 'Array of two indices [index1, index2].',
    examples: [
      {
        num: 1,
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 = 9, we return [0, 1].'
      },
      {
        num: 2,
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 2 + 4 = 6, we return [1, 2].'
      },
      {
        num: 3,
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 3 + 3 = 6, we return [0, 1].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10⁴',
      '-10⁹ <= nums[i] <= 10⁹',
      '-10⁹ <= target <= 10⁹',
      'Only one valid answer exists.'
    ],
    supportedLanguages: ['python', 'javascript', 'typescript', 'cpp', 'java', 'c', 'csharp', 'go', 'rust', 'kotlin', 'swift', 'php'],
    starterCodes: {
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your code here\n        pass`,
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    // Write your code here\n}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n    // Write your code here\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}`,
      c: `/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return 0;\n}`,
      csharp: `public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[0];\n    }\n}`,
      go: `func twoSum(nums []int, target int) []int {\n    // Write your code here\n    return []int{}\n}`,
      rust: `impl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        // Write your code here\n        vec![]\n    }\n}`,
      kotlin: `class Solution {\n    fun twoSum(nums: IntArray, target: Int): IntArray {\n        // Write your code here\n        return intArrayOf()\n    }\n}`,
      swift: `class Solution {\n    func twoSum(_ nums: [Int], _ target: Int) -> [Int] {\n        // Write your code here\n        return []\n    }\n}`,
      php: `class Solution {\n    function twoSum($nums, $target) {\n        // Write your code here\n    }\n}`
    },
    visibleTestCases: [
      { id: 1, input: 'nums = [2, 7, 11, 15], target = 9', expected: '[0, 1]' },
      { id: 2, input: 'nums = [3, 2, 4], target = 6', expected: '[1, 2]' },
      { id: 3, input: 'nums = [3, 3], target = 6', expected: '[0, 1]' }
    ]
  },
  {
    questionId: 'CODE-002',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    subject: 'DSA & Problem Solving',
    topic: 'Stack, Strings',
    timeLimit: '60 Minutes',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    inputFormat: 'A single string s.',
    outputFormat: 'Boolean true or false.',
    examples: [
      { num: 1, input: 's = "()"', output: 'true' },
      { num: 2, input: 's = "()[]{}"', output: 'true' },
      { num: 3, input: 's = "(]"', output: 'false' }
    ],
    constraints: [
      '1 <= s.length <= 10⁴',
      's consists of parentheses only \'()[]{}\'.'
    ],
    supportedLanguages: ['python', 'javascript', 'typescript', 'cpp', 'java', 'c', 'csharp', 'go', 'rust', 'kotlin', 'swift', 'php'],
    starterCodes: {
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write your code here\n        pass`,
      javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n    // Write your code here\n}`,
      typescript: `function isValid(s: string): boolean {\n    // Write your code here\n}`,
      cpp: `#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n    }\n};`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}`,
      c: `#include <stdbool.h>\n\nbool isValid(char* s) {\n    // Write your code here\n    return false;\n}`,
      csharp: `public class Solution {\n    public bool IsValid(string s) {\n        // Write your code here\n        return false;\n    }\n}`,
      go: `func isValid(s string) bool {\n    // Write your code here\n    return false\n}`,
      rust: `impl Solution {\n    pub fn is_valid(s: String) -> bool {\n        // Write your code here\n        false\n    }\n}`,
      kotlin: `class Solution {\n    fun isValid(s: String): Boolean {\n        // Write your code here\n        return false\n    }\n}`,
      swift: `class Solution {\n    func isValid(_ s: String) -> Bool {\n        // Write your code here\n        return false\n    }\n}`,
      php: `class Solution {\n    function isValid($s) {\n        // Write your code here\n    }\n}`
    },
    visibleTestCases: [
      { id: 1, input: 's = "()"', expected: 'true' },
      { id: 2, input: 's = "()[]{}"', expected: 'true' },
      { id: 3, input: 's = "(]"', expected: 'false' }
    ]
  }
];
