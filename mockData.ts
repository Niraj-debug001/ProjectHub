
import type { Mission } from '@/types';

// Helper function to get a future date for mock due dates
const getFutureDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const MOCK_MISSIONS: Mission[] = [
  {
    id: 'm-knowledge-park',
    name: 'Exploration of Knowledge Park',
    description: 'A mission to survey and gather data from various zones within Knowledge Park, focusing on technological advancements and research facilities.',
    status: 'active', // Ensure this is active and first for default display
    tasks: [
      { id: 'tkp-1', name: 'Perimeter scan of Zone A', completed: false, points: 30, dueDate: getFutureDate(2), timeSpentSeconds: 0, timerActive: false },
      { id: 'tkp-2', name: 'Data retrieval from central archive', completed: false, points: 70, dueDate: getFutureDate(5), timeSpentSeconds: 0, timerActive: false },
      { id: 'tkp-3', name: 'Analyze atmospheric conditions', completed: false, points: 40, dueDate: getFutureDate(7), timeSpentSeconds: 0, timerActive: false },
    ],
    createdAt: new Date('2024-11-01T10:00:00Z'),
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'm5',
    name: 'DSA Topic: Tree',
    description: 'Study and master Data Structures and Algorithms focusing on Tree data structures. Cover various types of trees, their properties, and applications.',
    status: 'pending',
    tasks: [
      { id: 't5-1', name: 'Understand Basic Tree Terminology (Root, Node, Leaf, Edge)', completed: false, points: 20, dueDate: getFutureDate(2), timeSpentSeconds: 0, timerActive: false },
      { id: 't5-2', name: 'Learn Binary Trees & Traversals (Inorder, Preorder, Postorder)', completed: false, points: 50, dueDate: getFutureDate(5), timeSpentSeconds: 0, timerActive: false },
      { id: 't5-3', name: 'Study Binary Search Trees (BSTs) - Operations & Properties', completed: false, points: 70, dueDate: getFutureDate(7), timeSpentSeconds: 0, timerActive: false },
      { id: 't5-4', name: 'Explore Self-Balancing Trees (e.g., AVL, Red-Black)', completed: false, points: 100, dueDate: getFutureDate(10), timeSpentSeconds: 0, timerActive: false },
      { id: 't5-5', name: 'Implement a Trie for string operations', completed: false, points: 80, dueDate: getFutureDate(12), timeSpentSeconds: 0, timerActive: false },
      { id: 't5-6', name: 'Practice Tree-based problems (e.g., DFS, BFS, Lowest Common Ancestor)', completed: false, points: 150, dueDate: getFutureDate(15), timeSpentSeconds: 0, timerActive: false },
    ],
    createdAt: new Date('2024-10-01T09:00:00Z'),
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'm6',
    name: 'Aptitude: Upstream and Downstream',
    description: 'Master concepts related to boat speeds in still water, stream speeds, and calculating upstream/downstream travel times and distances.',
    status: 'pending',
    tasks: [
      { id: 't6-1', name: 'Understand basic formulas: Speed, Distance, Time', completed: false, points: 10, dueDate: getFutureDate(1), timeSpentSeconds: 0, timerActive: false },
      { id: 't6-2', name: 'Define Upstream and Downstream speed formulas', completed: false, points: 20, dueDate: getFutureDate(2), timeSpentSeconds: 0, timerActive: false },
      { id: 't6-3', name: 'Solve 5 basic problems on calculating upstream/downstream speed', completed: false, points: 30, dueDate: getFutureDate(3), timeSpentSeconds: 0, timerActive: false },
      { id: 't6-4', name: 'Solve 5 problems involving finding speed of boat or stream', completed: false, points: 40, dueDate: getFutureDate(4), timeSpentSeconds: 0, timerActive: false },
      { id: 't6-5', name: 'Practice 3 complex word problems with varying conditions', completed: false, points: 50, dueDate: getFutureDate(5), timeSpentSeconds: 0, timerActive: false },
    ],
    createdAt: new Date('2024-10-05T10:00:00Z'),
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'm7',
    name: 'Logical Reasoning: Analogy',
    description: 'Develop skills in identifying relationships between pairs of words, numbers, or figures and finding analogous pairs.',
    status: 'pending', 
    tasks: [
      { id: 't7-1', name: 'Understand types of analogies (e.g., part to whole, cause/effect)', completed: true, points: 15, dueDate: getFutureDate(-2), timeSpentSeconds: 0, timerActive: false },
      { id: 't7-2', name: 'Solve 10 word-based analogy questions (verbal reasoning)', completed: false, points: 35, dueDate: getFutureDate(1), timeSpentSeconds: 0, timerActive: false },
      { id: 't7-3', name: 'Solve 10 number-based analogy questions (quantitative reasoning)', completed: false, points: 35, dueDate: getFutureDate(3), timeSpentSeconds: 0, timerActive: false },
      { id: 't7-4', name: 'Solve 5 figure-based analogy questions (non-verbal reasoning)', completed: false, points: 40, dueDate: getFutureDate(5), timeSpentSeconds: 0, timerActive: false },
      { id: 't7-5', name: 'Review common analogy patterns and tricks', completed: false, points: 25, dueDate: getFutureDate(7), timeSpentSeconds: 0, timerActive: false },
    ],
    createdAt: new Date('2024-10-10T11:00:00Z'),
    imageUrl: 'https://placehold.co/600x400.png',
  }
];
