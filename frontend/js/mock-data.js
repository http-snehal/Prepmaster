/**
 * AI Interview Prep Platform — Mock Data Layer
 * 
 * This file serves as a temporary data layer until the backend APIs are ready.
 * It provides mock data for questions, users, dashboard stats, and mock responses.
 * 
 * Replace these exports with actual fetch() calls to your backend later.
 */

// ============================================
// Questions Database
// ============================================
export const mockQuestions = [
  // Technical Questions
  {
    id: "q_001",
    title: "Two Sum",
    type: "technical",
    category: "Arrays",
    difficulty: "Easy",
    companies: ["Google", "Amazon", "Meta", "Apple"],
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ],
    starterCode: {
      javascript: "function twoSum(nums, target) {\n  // Write your code here\n  \n}",
      python: "def two_sum(nums, target):\n    # Write your code here\n    pass",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}"
    }
  },
  {
    id: "q_002",
    title: "LRU Cache",
    type: "technical",
    category: "System Design Data Structures",
    difficulty: "Medium",
    companies: ["Amazon", "Microsoft", "Bloomberg"],
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size capacity.\n- `int get(int key)` Return the value of the key if the key exists, otherwise return -1.\n- `void put(int key, int value)` Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.",
    examples: [
      { input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]', output: '[null, null, null, 1, null, -1, null, -1, 3, 4]' }
    ],
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10000",
      "0 <= value <= 10^5",
      "At most 2 * 10^5 calls will be made to get and put."
    ],
    starterCode: {
      javascript: "class LRUCache {\n  constructor(capacity) {\n    \n  }\n  \n  get(key) {\n    \n  }\n  \n  put(key, value) {\n    \n  }\n}",
      python: "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n        \n    def get(self, key: int) -> int:\n        pass\n        \n    def put(self, key: int, value: int) -> None:\n        pass",
      java: "class LRUCache {\n    public LRUCache(int capacity) {\n        \n    }\n    \n    public int get(int key) {\n        return -1;\n    }\n    \n    public void put(int key, int value) {\n        \n    }\n}"
    }
  },
  {
    id: "q_003",
    title: "Merge Intervals",
    type: "technical",
    category: "Sorting",
    difficulty: "Medium",
    companies: ["Google", "Meta", "LinkedIn"],
    description: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" }
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    starterCode: {
      javascript: "function merge(intervals) {\n  \n}",
      python: "def merge(intervals):\n    pass",
      java: "class Solution {\n    public int[][] merge(int[][] intervals) {\n        \n    }\n}"
    }
  },
  
  // Behavioral / HR Questions
  {
    id: "q_101",
    title: "Tell me about yourself",
    type: "behavioral",
    category: "Introduction",
    difficulty: "Easy",
    companies: ["All Companies"],
    description: "Walk me through your resume and highlight the experiences most relevant to this role. Keep it concise (under 2 minutes) and structure it using the Past-Present-Future framework."
  },
  {
    id: "q_102",
    title: "A time you disagreed with a colleague",
    type: "behavioral",
    category: "Conflict Resolution",
    difficulty: "Medium",
    companies: ["Amazon", "Google", "Netflix"],
    description: "Tell me about a time you disagreed with a coworker or manager. How did you resolve the situation, and what was the outcome? We are looking for the STAR method (Situation, Task, Action, Result)."
  },
  {
    id: "q_103",
    title: "Proudest achievement",
    type: "behavioral",
    category: "Impact",
    difficulty: "Easy",
    companies: ["Meta", "Apple", "Stripe"],
    description: "Describe a project or accomplishment you are particularly proud of. What was your specific role, what were the challenges, and what impact did it have on the business?"
  }
];


// ============================================
// User & Dashboard Data
// ============================================
export const mockUser = {
  id: "u_12345",
  name: "Alex Developer",
  email: "alex@example.com",
  avatarUrl: null, // Will use initials 'AD'
  role: "Software Engineer",
  level: "Mid-Level",
  joinedAt: "2026-01-15T00:00:00.000Z",
  streak: 12,
  
  // Dashboard Stats
  stats: {
    totalSessions: 47,
    avgScore: 86,
    questionsSolved: 124,
    hoursPracticed: 32.5,
    recentScoreChange: "+3",
    recentSolvedChange: "+12",
    recentHoursChange: "+4.2"
  },
  
  // Progress Data for Charts
  progressData: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    technicalScores: [75, 78, 80, 79, 85, 88, 89],
    behavioralScores: [82, 85, 84, 88, 90, 92, 94]
  },
  
  // Skill Radar Data
  skills: [
    { name: "Algorithms", value: 85 },
    { name: "System Design", value: 65 },
    { name: "Communication", value: 92 },
    { name: "Problem Solving", value: 88 },
    { name: "Leadership", value: 75 }
  ],
  
  // Weak Areas
  weakAreas: [
    { topic: "Dynamic Programming", score: 45, recommendedQuestions: 15 },
    { topic: "System Design - Databases", score: 52, recommendedQuestions: 8 },
    { topic: "Graph Algorithms", score: 60, recommendedQuestions: 12 }
  ]
};


// ============================================
// Leaderboard Data
// ============================================
export const mockLeaderboard = [
  { rank: 1, name: "Sarah Chen", avatar: "SC", score: 14250, streak: 45, sessions: 180 },
  { rank: 2, name: "Marcus Johnson", avatar: "MJ", score: 13800, streak: 32, sessions: 156 },
  { rank: 3, name: "Elena Rodriguez", avatar: "ER", score: 13100, streak: 28, sessions: 142 },
  { rank: 4, name: "Alex Developer", avatar: "AD", score: 12450, streak: 12, sessions: 124, isCurrentUser: true },
  { rank: 5, name: "David Kim", avatar: "DK", score: 11900, streak: 18, sessions: 110 },
  { rank: 6, name: "Priya Patel", avatar: "PP", score: 10500, streak: 7, sessions: 98 },
  { rank: 7, name: "James Wilson", avatar: "JW", score: 9800, streak: 14, sessions: 85 },
  { rank: 8, name: "Wei Zhang", avatar: "WZ", score: 9200, streak: 5, sessions: 76 },
  { rank: 9, name: "Fatima Ali", avatar: "FA", score: 8750, streak: 21, sessions: 72 },
  { rank: 10, name: "Lucas Silva", avatar: "LS", score: 8100, streak: 3, sessions: 65 }
];


// ============================================
// Daily Challenge
// ============================================
export const mockDailyChallenge = {
  questionId: "q_003",
  title: "Merge Intervals",
  category: "Sorting / Arrays",
  difficulty: "Medium",
  points: 150,
  timeRemainingMs: 14 * 60 * 60 * 1000 + 35 * 60 * 1000, // 14h 35m
  completedBy: 4521
};


// ============================================
// Mock AI Feedback Templates
// ============================================

// Simulated API Call: Submit Behavioral Answer
export const mockSubmitBehavioralAnswer = async (transcript) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const wordCount = transcript.split(' ').length;
  let score = 85;
  let feedback = [];
  
  if (wordCount < 30) {
    score = 45;
    feedback.push({ type: 'error', text: 'Answer was too brief. Try to provide more detail using the STAR method.' });
  } else if (wordCount > 300) {
    score = 75;
    feedback.push({ type: 'warning', text: 'Answer was a bit long. Try to be more concise and stay under 2 minutes.' });
  } else {
    feedback.push({ type: 'success', text: 'Great length and pacing. Your answer was concise and clear.' });
  }
  
  if (transcript.toLowerCase().includes('result') || transcript.toLowerCase().includes('outcome')) {
    feedback.push({ type: 'success', text: 'Good job focusing on the results/impact of your actions.' });
  } else {
    feedback.push({ type: 'warning', text: 'Remember to explicitly state the business impact or result of your actions.' });
  }
  
  if (transcript.toLowerCase().includes('um') || transcript.toLowerCase().includes('like')) {
    score -= 5;
    feedback.push({ type: 'warning', text: 'Detected some filler words ("um", "like"). Practice pausing instead of using fillers.' });
  }
  
  return {
    score,
    feedback,
    metrics: {
      wpm: 120, // Words per minute
      clarity: 92,
      confidence: 88
    }
  };
};

// Simulated API Call: Submit Code
export const mockRunCode = async (code, language, questionId) => {
  // Simulate network/execution delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Dummy logic: if code is very short, it fails. If it has certain keywords, it passes.
  const isPass = code.length > 50 && !code.includes('return new int[]{}') && !code.includes('pass');
  
  return {
    status: isPass ? 'success' : 'error',
    executionTime: '45ms',
    memoryUsage: '38.2MB',
    testResults: [
      { id: 1, name: 'Example 1', passed: isPass, expected: '[0, 1]', actual: isPass ? '[0, 1]' : 'undefined' },
      { id: 2, name: 'Example 2', passed: isPass, expected: '[1, 2]', actual: isPass ? '[1, 2]' : 'Error' },
      { id: 3, name: 'Hidden Test 1', passed: isPass, expected: 'Hidden', actual: 'Hidden' }
    ]
  };
};

// Simulated API Call: Upload Resume
export const mockAnalyzeResume = async (file) => {
  // Simulate upload and processing time
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return {
    score: 72,
    sections: [
      {
        name: "Summary",
        score: 85,
        suggestions: [
          { type: 'success', text: 'Strong opening statement highlighting years of experience.' },
          { type: 'warning', text: 'Could include more specific domain expertise (e.g., FinTech, E-commerce).' }
        ]
      },
      {
        name: "Experience",
        score: 65,
        suggestions: [
          { type: 'error', text: 'Missing quantifiable metrics. Change "Improved performance" to "Improved load time by 40%".' },
          { type: 'warning', text: 'Use stronger action verbs. Replace "Helped with" with "Spearheaded" or "Orchestrated".' },
          { type: 'success', text: 'Good reverse-chronological formatting.' }
        ]
      },
      {
        name: "Skills",
        score: 90,
        suggestions: [
          { type: 'success', text: 'Comprehensive list of modern technologies.' },
          { type: 'warning', text: 'Group skills by category (Languages, Frameworks, Tools) for better readability.' }
        ]
      }
    ]
  };
};
