// ============================================================================
// PROFESSORVIRUS — CODING QUESTIONS SEED DATA & MONGODB SYNC
// 12 Authentic Placement Problems with CLEAN starter templates (NO solutions)
// ============================================================================

export const SEED_CODING_QUESTIONS = [
  // 1. Two Sum (Easy)
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
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your code here
        pass`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your code here
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
    // Write your code here
    return [];
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`,
      c: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Write your code here
    *returnSize = 0;
    return NULL;
}`,
      csharp: `using System;

public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        // Write your code here
        return new int[0];
    }
}`,
      go: `package main

func twoSum(nums []int, target int) []int {
    // Write your code here
    return []int{}
}`,
      rust: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        // Write your code here
        vec![]
    }
}`,
      kotlin: `class Solution {
    fun twoSum(nums: IntArray, target: Int): IntArray {
        // Write your code here
        return intArrayOf()
    }
}`,
      swift: `class Solution {
    func twoSum(_ nums: [Int], _ target: Int) -> [Int] {
        // Write your code here
        return []
    }
}`,
      php: `class Solution {
    /**
     * @param Integer[] $nums
     * @param Integer $target
     * @return Integer[]
     */
    function twoSum($nums, $target) {
        // Write your code here
        return [];
    }
}`
    },
    visibleTestCases: [
      { id: 1, input: 'nums = [2, 7, 11, 15]\ntarget = 9', expected: '[0, 1]' },
      { id: 2, input: 'nums = [3, 2, 4]\ntarget = 6', expected: '[1, 2]' },
      { id: 3, input: 'nums = [3, 3]\ntarget = 6', expected: '[0, 1]' }
    ],
    hiddenTestCases: [
      { id: 4, input: 'nums = [-1, -2, -3, -4, -5]\ntarget = -8', expected: '[2, 4]' },
      { id: 5, input: 'nums = [1000000000, 500000000, -500000000]\ntarget = 0', expected: '[1, 2]' }
    ],
    solution: `// Optimal solution uses Hash Map for O(N) time and O(N) space.`,
    explanation: `Store seen numbers in hash map mapping value -> index. For each number, check if target - num exists in map.`
  },

  // 2. Valid Parentheses (Easy)
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
    inputFormat: 'A string s containing only brackets.',
    outputFormat: 'Boolean (true or false).',
    examples: [
      { num: 1, input: 's = "()"', output: 'true', explanation: 'Matching pair of parentheses.' },
      { num: 2, input: 's = "()[]{}"', output: 'true', explanation: 'All brackets are properly closed in order.' },
      { num: 3, input: 's = "(]"', output: 'false', explanation: 'Bracket types do not match.' }
    ],
    constraints: [
      '1 <= s.length <= 10⁴',
      "s consists of parentheses only '()[]{}'."
    ],
    supportedLanguages: ['python', 'javascript', 'typescript', 'cpp', 'java', 'c', 'csharp', 'go', 'rust', 'kotlin', 'swift', 'php'],
    starterCodes: {
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your code here
        pass`,
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Write your code here
}`,
      typescript: `function isValid(s: string): boolean {
    // Write your code here
    return false;
}`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your code here
        return false;
    }
};`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}`,
      c: `#include <stdbool.h>

bool isValid(char* s) {
    // Write your code here
    return false;
}`,
      csharp: `public class Solution {
    public bool IsValid(string s) {
        // Write your code here
        return false;
    }
}`,
      go: `func isValid(s string) bool {
    // Write your code here
    return false
}`,
      rust: `impl Solution {
    pub fn is_valid(s: String) -> bool {
        // Write your code here
        false
    }
}`,
      kotlin: `class Solution {
    fun isValid(s: String): Boolean {
        // Write your code here
        return false
    }
}`,
      swift: `class Solution {
    func isValid(_ s: String) -> Bool {
        // Write your code here
        return false
    }
}`,
      php: `class Solution {
    /**
     * @param String $s
     * @return Boolean
     */
    function isValid($s) {
        // Write your code here
        return false;
    }
}`
    },
    visibleTestCases: [
      { id: 1, input: 's = "()"', expected: 'true' },
      { id: 2, input: 's = "()[]{}"', expected: 'true' },
      { id: 3, input: 's = "(]"', expected: 'false' }
    ],
    hiddenTestCases: [
      { id: 4, input: 's = "([)]"', expected: 'false' },
      { id: 5, input: 's = "{[]}"', expected: 'true' }
    ],
    solution: `// Use a stack to track open brackets and match closing brackets.`,
    explanation: `Push opening brackets; on closing bracket, check stack top and pop if matching.`
  },

  // 3. Longest Substring Without Repeating Characters (Medium)
  {
    questionId: 'CODE-003',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    subject: 'DSA & Problem Solving',
    topic: 'Sliding Window, Hash Table, Strings',
    timeLimit: '60 Minutes',
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    inputFormat: 'A single string s.',
    outputFormat: 'An integer representing the length of the longest substring.',
    examples: [
      { num: 1, input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { num: 2, input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { num: 3, input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with length 3 ("pwke" is a subsequence, not substring).' }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10⁴',
      's consists of English letters, digits, symbols and spaces.'
    ],
    supportedLanguages: ['python', 'javascript', 'typescript', 'cpp', 'java', 'c', 'csharp', 'go', 'rust', 'kotlin', 'swift', 'php'],
    starterCodes: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your code here
        pass`,
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
    // Write your code here
}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
    // Write your code here
    return 0;
}`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your code here
        return 0;
    }
};`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }
}`,
      c: `int lengthOfLongestSubstring(char* s) {
    // Write your code here
    return 0;
}`,
      csharp: `public class Solution {
    public int LengthOfLongestSubstring(string s) {
        // Write your code here
        return 0;
    }
}`,
      go: `func lengthOfLongestSubstring(s string) int {
    // Write your code here
    return 0
}`,
      rust: `impl Solution {
    pub fn length_of_longest_substring(s: String) -> i32 {
        // Write your code here
        0
    }
}`,
      kotlin: `class Solution {
    fun lengthOfLongestSubstring(s: String): Int {
        // Write your code here
        return 0
    }
}`,
      swift: `class Solution {
    func lengthOfLongestSubstring(_ s: String) -> Int {
        // Write your code here
        return 0
    }
}`,
      php: `class Solution {
    function lengthOfLongestSubstring($s) {
        // Write your code here
        return 0;
    }
}`
    },
    visibleTestCases: [
      { id: 1, input: 's = "abcabcbb"', expected: '3' },
      { id: 2, input: 's = "bbbbb"', expected: '1' },
      { id: 3, input: 's = "pwwkew"', expected: '3' }
    ],
    hiddenTestCases: [
      { id: 4, input: 's = ""', expected: '0' },
      { id: 5, input: 's = "au"', expected: '2' }
    ],
    solution: `// Sliding window with hash set tracking character positions.`,
    explanation: `Expand right pointer; if duplicate found, advance left pointer until window is valid.`
  },

  // 4. Merge Sorted Array (Easy)
  {
    questionId: 'CODE-004',
    title: 'Merge Sorted Array',
    difficulty: 'Easy',
    subject: 'DSA & Problem Solving',
    topic: 'Two Pointers, Sorting, Arrays',
    timeLimit: '60 Minutes',
    description: `You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.

Merge nums1 and nums2 into a single array sorted in non-decreasing order. The final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of m + n.`,
    inputFormat: 'nums1 = [int], m = int, nums2 = [int], n = int',
    outputFormat: 'Modified nums1 array in non-decreasing order.',
    examples: [
      {
        num: 1,
        input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3',
        output: '[1,2,2,3,5,6]',
        explanation: 'The arrays we are merging are [1,2,3] and [2,5,6]. The result of the merge is [1,2,2,3,5,6].'
      },
      {
        num: 2,
        input: 'nums1 = [1], m = 1, nums2 = [], n = 0',
        output: '[1]',
        explanation: 'The arrays we are merging are [1] and []. The result of the merge is [1].'
      }
    ],
    constraints: [
      'nums1.length == m + n',
      'nums2.length == n',
      '0 <= m, n <= 200',
      '-10⁹ <= nums1[i], nums2[j] <= 10⁹'
    ],
    supportedLanguages: ['python', 'javascript', 'typescript', 'cpp', 'java', 'c', 'csharp', 'go', 'rust', 'kotlin', 'swift', 'php'],
    starterCodes: {
      python: `class Solution:
    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        # Write your code here
        pass`,
      javascript: `/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
function merge(nums1, m, nums2, n) {
    // Write your code here
}`,
      typescript: `function merge(nums1: number[], m: number, nums2: number[], n: number): void {
    // Write your code here
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        // Write your code here
    }
};`,
      java: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        // Write your code here
    }
}`,
      c: `void merge(int* nums1, int nums1Size, int m, int* nums2, int nums2Size, int n) {
    // Write your code here
}`,
      csharp: `public class Solution {
    public void Merge(int[] nums1, int m, int[] nums2, int n) {
        // Write your code here
    }
}`,
      go: `func merge(nums1 []int, m int, nums2 []int, n int) {
    // Write your code here
}`,
      rust: `impl Solution {
    pub fn merge(nums1: &mut Vec<i32>, m: i32, nums2: &mut Vec<i32>, n: i32) {
        // Write your code here
    }
}`,
      kotlin: `class Solution {
    fun merge(nums1: IntArray, m: Int, nums2: IntArray, n: Int): Unit {
        // Write your code here
    }
}`,
      swift: `class Solution {
    func merge(_ nums1: inout [Int], _ m: Int, _ nums2: [Int], _ n: Int) {
        // Write your code here
    }
}`,
      php: `class Solution {
    function merge(&$nums1, $m, $nums2, $n) {
        // Write your code here
    }
}`
    },
    visibleTestCases: [
      { id: 1, input: 'nums1 = [1,2,3,0,0,0], m = 3\nnums2 = [2,5,6], n = 3', expected: '[1,2,2,3,5,6]' },
      { id: 2, input: 'nums1 = [1], m = 1\nnums2 = [], n = 0', expected: '[1]' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'nums1 = [0], m = 0\nnums2 = [1], n = 1', expected: '[1]' }
    ],
    solution: `// Three pointer approach filling nums1 from back to front.`,
    explanation: `Compare elements at m-1 and n-1, write largest to m+n-1.`
  },

  // 5. Binary Search (Easy)
  {
    questionId: 'CODE-005',
    title: 'Binary Search',
    difficulty: 'Easy',
    subject: 'DSA & Problem Solving',
    topic: 'Binary Search, Arrays',
    timeLimit: '60 Minutes',
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.`,
    inputFormat: 'nums = [sorted integers], target = integer',
    outputFormat: 'Index integer or -1.',
    examples: [
      { num: 1, input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' },
      { num: 2, input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1' }
    ],
    constraints: [
      '1 <= nums.length <= 10⁴',
      '-10⁴ < nums[i], target < 10⁴',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.'
    ],
    supportedLanguages: ['python', 'javascript', 'typescript', 'cpp', 'java', 'c', 'csharp', 'go', 'rust', 'kotlin', 'swift', 'php'],
    starterCodes: {
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # Write your code here
        pass`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
    // Write your code here
}`,
      typescript: `function search(nums: number[], target: number): number {
    // Write your code here
    return -1;
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your code here
        return -1;
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your code here
        return -1;
    }
}`,
      c: `int search(int* nums, int numsSize, int target) {
    // Write your code here
    return -1;
}`,
      csharp: `public class Solution {
    public int Search(int[] nums, int target) {
        // Write your code here
        return -1;
    }
}`,
      go: `func search(nums []int, target int) int {
    // Write your code here
    return -1
}`,
      rust: `impl Solution {
    pub fn search(nums: Vec<i32>, target: i32) -> i32 {
        // Write your code here
        -1
    }
}`,
      kotlin: `class Solution {
    fun search(nums: IntArray, target: Int): Int {
        // Write your code here
        return -1
    }
}`,
      swift: `class Solution {
    func search(_ nums: [Int], _ target: Int) -> Int {
        // Write your code here
        return -1
    }
}`,
      php: `class Solution {
    function search($nums, $target) {
        // Write your code here
        return -1;
    }
}`
    },
    visibleTestCases: [
      { id: 1, input: 'nums = [-1,0,3,5,9,12]\ntarget = 9', expected: '4' },
      { id: 2, input: 'nums = [-1,0,3,5,9,12]\ntarget = 2', expected: '-1' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'nums = [5]\ntarget = 5', expected: '0' },
      { id: 4, input: 'nums = [1,3,5,7,9]\ntarget = 1', expected: '0' }
    ],
    solution: `// Standard binary search using left and right pointers.`,
    explanation: `Calculate mid = left + (right - left)/2; adjust boundaries based on comparison with target.`
  },

  // 6. Maximum Subarray (Kadane's Algorithm) (Medium)
  {
    questionId: 'CODE-006',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    subject: 'DSA & Problem Solving',
    topic: 'Arrays, Dynamic Programming, Kadane',
    timeLimit: '60 Minutes',
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
    inputFormat: 'nums = [integers]',
    outputFormat: 'Integer representing the maximum subarray sum.',
    examples: [
      { num: 1, input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { num: 2, input: 'nums = [1]', output: '1', explanation: 'The subarray [1] has the largest sum 1.' },
      { num: 3, input: 'nums = [5,4,-1,7,8]', output: '23', explanation: 'The subarray [5,4,-1,7,8] has the largest sum 23.' }
    ],
    constraints: [
      '1 <= nums.length <= 10⁵',
      '-10⁴ <= nums[i] <= 10⁴'
    ],
    supportedLanguages: ['python', 'javascript', 'typescript', 'cpp', 'java', 'c', 'csharp', 'go', 'rust', 'kotlin', 'swift', 'php'],
    starterCodes: {
      python: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        # Write your code here
        pass`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
    // Write your code here
}`,
      typescript: `function maxSubArray(nums: number[]): number {
    // Write your code here
    return 0;
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your code here
        return 0;
    }
};`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your code here
        return 0;
    }
}`,
      c: `int maxSubArray(int* nums, int numsSize) {
    // Write your code here
    return 0;
}`,
      csharp: `public class Solution {
    public int MaxSubArray(int[] nums) {
        // Write your code here
        return 0;
    }
}`,
      go: `func maxSubArray(nums []int) int {
    // Write your code here
    return 0
}`,
      rust: `impl Solution {
    pub fn max_sub_array(nums: Vec<i32>,) -> i32 {
        // Write your code here
        0
    }
}`,
      kotlin: `class Solution {
    fun maxSubArray(nums: IntArray): Int {
        // Write your code here
        return 0
    }
}`,
      swift: `class Solution {
    func maxSubArray(_ nums: [Int]) -> Int {
        // Write your code here
        return 0
    }
}`,
      php: `class Solution {
    function maxSubArray($nums) {
        // Write your code here
        return 0;
    }
}`
    },
    visibleTestCases: [
      { id: 1, input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
      { id: 2, input: 'nums = [1]', expected: '1' },
      { id: 3, input: 'nums = [5,4,-1,7,8]', expected: '23' }
    ],
    hiddenTestCases: [
      { id: 4, input: 'nums = [-1]', expected: '-1' },
      { id: 5, input: 'nums = [-2, -1]', expected: '-1' }
    ],
    solution: `// Kadane's algorithm running in O(N) time and O(1) space.`,
    explanation: `Track current_sum and max_sum. If current_sum becomes negative, reset it to current element.`
  },

  // 7. Container With Most Water (Medium)
  {
    questionId: 'CODE-007',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    subject: 'DSA & Problem Solving',
    topic: 'Two Pointers, Greedy, Arrays',
    timeLimit: '60 Minutes',
    description: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.`,
    inputFormat: 'height = [array of positive integers]',
    outputFormat: 'Integer representing maximum water volume.',
    examples: [
      { num: 1, input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The vertical lines are [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.' },
      { num: 2, input: 'height = [1,1]', output: '1', explanation: 'Max area is 1 * 1 = 1.' }
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10⁵',
      '0 <= height[i] <= 10⁴'
    ],
    supportedLanguages: ['python', 'javascript', 'typescript', 'cpp', 'java', 'c', 'csharp', 'go', 'rust', 'kotlin', 'swift', 'php'],
    starterCodes: {
      python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        # Write your code here
        pass`,
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
    // Write your code here
}`,
      typescript: `function maxArea(height: number[]): number {
    // Write your code here
    return 0;
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        // Write your code here
        return 0;
    }
};`,
      java: `class Solution {
    public int maxArea(int[] height) {
        // Write your code here
        return 0;
    }
}`,
      c: `int maxArea(int* height, int heightSize) {
    // Write your code here
    return 0;
}`,
      csharp: `public class Solution {
    public int MaxArea(int[] height) {
        // Write your code here
        return 0;
    }
}`,
      go: `func maxArea(height []int) int {
    // Write your code here
    return 0
}`,
      rust: `impl Solution {
    pub fn max_area(height: Vec<i32>) -> i32 {
        // Write your code here
        0
    }
}`,
      kotlin: `class Solution {
    fun maxArea(height: IntArray): Int {
        // Write your code here
        return 0
    }
}`,
      swift: `class Solution {
    func maxArea(_ height: [Int]) -> Int {
        // Write your code here
        return 0
    }
}`,
      php: `class Solution {
    function maxArea($height) {
        // Write your code here
        return 0;
    }
}`
    },
    visibleTestCases: [
      { id: 1, input: 'height = [1,8,6,2,5,4,8,3,7]', expected: '49' },
      { id: 2, input: 'height = [1,1]', expected: '1' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'height = [4,3,2,1,4]', expected: '16' },
      { id: 4, input: 'height = [1,2,1]', expected: '2' }
    ],
    solution: `// Two-pointer greedy approach starting at ends.`,
    explanation: `Area = width * min(height[l], height[r]). Move the pointer pointing to the shorter line.`
  },

  // 8. Climbing Stairs (Easy)
  {
    questionId: 'CODE-008',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    subject: 'DSA & Problem Solving',
    topic: 'Dynamic Programming, Memoization',
    timeLimit: '60 Minutes',
    description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    inputFormat: 'n = positive integer',
    outputFormat: 'Integer number of distinct ways.',
    examples: [
      { num: 1, input: 'n = 2', output: '2', explanation: 'There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps.' },
      { num: 2, input: 'n = 3', output: '3', explanation: 'There are three ways: 1. 1+1+1, 2. 1+2, 3. 2+1.' }
    ],
    constraints: [
      '1 <= n <= 45'
    ],
    supportedLanguages: ['python', 'javascript', 'typescript', 'cpp', 'java', 'c', 'csharp', 'go', 'rust', 'kotlin', 'swift', 'php'],
    starterCodes: {
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        # Write your code here
        pass`,
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
    // Write your code here
}`,
      typescript: `function climbStairs(n: number): number {
    // Write your code here
    return 0;
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Write your code here
        return 0;
    }
};`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Write your code here
        return 0;
    }
}`,
      c: `int climbStairs(int n) {
    // Write your code here
    return 0;
}`,
      csharp: `public class Solution {
    public int ClimbStairs(int n) {
        // Write your code here
        return 0;
    }
}`,
      go: `func climbStairs(n int) int {
    // Write your code here
    return 0
}`,
      rust: `impl Solution {
    pub fn climb_stairs(n: i32) -> i32 {
        // Write your code here
        0
    }
}`,
      kotlin: `class Solution {
    fun climbStairs(n: Int): Int {
        // Write your code here
        return 0
    }
}`,
      swift: `class Solution {
    func climbStairs(_ n: Int) -> Int {
        // Write your code here
        return 0
    }
}`,
      php: `class Solution {
    function climbStairs($n) {
        // Write your code here
        return 0;
    }
}`
    },
    visibleTestCases: [
      { id: 1, input: 'n = 2', expected: '2' },
      { id: 2, input: 'n = 3', expected: '3' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'n = 4', expected: '5' },
      { id: 4, input: 'n = 5', expected: '8' }
    ],
    solution: `// Fibonacci relationship: ways(n) = ways(n-1) + ways(n-2).`,
    explanation: `Compute iteratively in O(N) time with O(1) space.`
  }
];
