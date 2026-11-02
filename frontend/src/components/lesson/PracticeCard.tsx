import { useState, useEffect, useCallback } from 'react';
import type { PracticeBlock } from '../../types/lesson';
import CodeEditor from './CodeEditor';
import { renderMarkdown } from '../../utils/renderContent';
import { authFetch } from '../../authClient';
import type { PracticeExerciseConfig } from '../../types/lesson';
import { Target, Lightbulb, HelpCircle, ListChecks, Wand2, SendHorizonal } from 'lucide-react';
import { generateProgressiveHint } from '../../utils/logicValidation';
import { scanForInput } from '../../utils/prescanner';
import DragDropPracticeExercise from './DragDropPracticeExercise';

// ── BharatCode Socratic Diagnostician ─────────────────────────────────────
interface DiagnosisResult {
  success: boolean;
  rootCause?: string;
  evidence?: string;
  conceptClue?: string;
  guidingQuestion?: string;
  nextStep?: string;
  isMockMode?: boolean;
  isConfigured?: boolean;
  error?: string;
  errorType?: string;
}
import ExpandUniverse from './ExpandUniverse';
import AIConversationExercise from './AIConversationExercise';
import PathBuilderExercise from './PathBuilderExercise';
import GraphTraversalExercise from './GraphTraversalExercise';
import InvestigationExercise from './InvestigationExercise';
import SearchProblemBuilder from './SearchProblemBuilder';
import BFSDFSGame from './BFSDFSGame';
import WarehouseAIGame from './WarehouseAIGame';
import PropLogicGame from './PropLogicGame';
import KnowledgeBaseGame from './KnowledgeBaseGame';
import InferenceGame from './InferenceGame';
import ConfidenceChallenge from './ConfidenceChallenge';
import CaseFileInvestigation from './CaseFileInvestigation';
import DecisionPipeline from './DecisionPipeline';
import HillClimbExercise from './HillClimbExercise';
import PizzaOptimization from './PizzaOptimization';
import LostAndFoundSorting from './LostAndFoundSorting';
import MLWorkflow from './MLWorkflow';
import FaceBuilder from './FaceBuilder';
import NeuralNetworkBuilder from './NeuralNetworkBuilder';
import SearchEnginePipeline from './SearchEnginePipeline';
import PredictNextWord from './PredictNextWord';
import FairOrUnfair from './FairOrUnfair';
import AIApprovalChecklist from './AIApprovalChecklist';
import NeuronCalculator from './NeuronCalculator';
import FactoryPlanner from './FactoryPlanner';
import StudyDayPlanner from './StudyDayPlanner';
import SmoothieForwardPass from './SmoothieForwardPass';
import ClusteringAlgorithmMatch from './ClusteringAlgorithmMatch';


interface PracticeCardProps {
  block: PracticeBlock;
  courseSlug: string;
  lectureNumber: number;
  sectionId: string;
  onAttempt?: () => void;
  onComplete?: () => void;
}

const SAVE_PREFIX = 'lms:practice:';

function AIPracticeCard({ block, courseSlug, lectureNumber, sectionId, onAttempt, onComplete }: PracticeCardProps) {
  const [config, setConfig] = useState<PracticeExerciseConfig | null>(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [, setLastCode] = useState('');

  const SEARCH_PROBLEM_BUILDER_CONFIG: PracticeExerciseConfig = {
    title: 'Build the Search Problem',
    learningGoal: 'Learn how to define the four building blocks of a search problem before an AI can solve it',
    challenge: 'Help a delivery robot understand its mission by defining Start State, Goal State, Allowed Actions, and Path Cost',
    promptHint: 'Think about what information an AI needs before it can start searching',
    successCriteria: ['Define all four parts of the search problem'],
    systemInstruction: '',
    type: 'search_problem_builder',
    searchProblemBuilderConfig: {
      slides: [
        {
          title: 'Your Mission',
          body: 'Before an AI can find the best path, someone must first describe the problem.\n\nToday you will become that person.\nYou will define a search problem that an AI can solve.',
        },
        {
          title: 'What You Will Build',
          body: 'Every search problem has four parts.\n\n\u2022 Where do we begin?\n\u2022 Where do we want to go?\n\u2022 What actions are allowed?\n\u2022 How do we measure the best path?\n\nYour job is to identify all four.',
        },
        {
          title: 'Ready?',
          body: 'Imagine a delivery robot inside a hospital.\nIt has never visited the building before.\nIt only knows the map.\n\nHelp it understand the problem before it starts searching.',
        },
      ],
      scenarioText: 'A delivery robot must deliver medicine to Room 202.\n\nThe robot starts outside the hospital at the entrance.\n\nClick the map to help the robot understand its mission.',
      locations: [
        { id: 'entrance', label: 'Hospital Entrance', x: 250, y: 25 },
        { id: 'reception', label: 'Reception', x: 250, y: 75 },
        { id: 'hallway', label: 'Hallway', x: 250, y: 125 },
        { id: 'pharmacy', label: 'Pharmacy', x: 110, y: 125 },
        { id: 'elevator', label: 'Elevator', x: 390, y: 125 },
        { id: 'lab', label: 'Laboratory', x: 250, y: 195 },
        { id: 'room101', label: 'Room 101', x: 110, y: 195 },
        { id: 'room102', label: 'Room 102', x: 110, y: 260 },
        { id: 'room201', label: 'Room 201', x: 390, y: 195 },
        { id: 'room202', label: 'Room 202', x: 390, y: 260 },
        { id: 'er', label: 'Emergency Room', x: 250, y: 260 },
      ],
      edges: [
        ['entrance', 'reception'],
        ['reception', 'hallway'],
        ['hallway', 'pharmacy'],
        ['hallway', 'elevator'],
        ['hallway', 'lab'],
        ['pharmacy', 'room101'],
        ['pharmacy', 'room102'],
        ['lab', 'er'],
        ['elevator', 'room201'],
        ['elevator', 'room202'],
      ],
      startState: {
        correctId: 'entrance',
        errorMessage: 'The robot begins outside. Where is it positioned on the map?',
      },
      goalState: {
        correctId: 'room202',
        errorMessage: 'The goal is where the delivery must end. Where does the robot need to deliver medicine?',
      },
      actions: {
        options: [
          { id: 'up', label: 'Move Up', correct: true },
          { id: 'down', label: 'Move Down', correct: true },
          { id: 'left', label: 'Move Left', correct: true },
          { id: 'right', label: 'Move Right', correct: true },
          { id: 'elevator', label: 'Use Elevator', correct: false, feedback: 'Moving between floors is useful, but the robot can already navigate the entire hospital using just the four movement directions.' },
          { id: 'jump', label: 'Jump Through Walls', correct: false, feedback: 'The robot cannot jump through walls because walls are solid obstacles in this environment.' },
          { id: 'teleport', label: 'Teleport', correct: false, feedback: 'A search algorithm can only choose actions that are actually possible. Teleportation does not exist in this hospital.' },
          { id: 'fly', label: 'Fly', correct: false, feedback: 'The robot is a ground-based delivery robot. It cannot fly.' },
        ],
      },
      pathCost: {
        options: [
          { id: 'distance', label: 'Number of steps', correct: true, feedback: '' },
          { id: 'time', label: 'Time in seconds', correct: false, feedback: 'Time depends on speed, not just the route. A search algorithm needs a cost it can calculate from the map itself.' },
          { id: 'battery', label: 'Battery percentage', correct: false, feedback: 'Battery depends on many factors beyond the map. Search algorithms use costs that are determined purely by the problem structure.' },
          { id: 'all', label: 'All of the Above', correct: false, feedback: 'Only one of these can be calculated purely from the map without guessing future conditions.' },
        ],
      },
      validationSteps: [
        { label: 'Checking Start State...' },
        { label: 'Checking Goal State...' },
        { label: 'Checking Allowed Actions...' },
        { label: 'Checking Path Cost...' },
      ],
      completionTitle: 'Excellent Work',
      completionMessage: 'You have successfully described a search problem.\n\nEvery search algorithm begins with these four pieces of information.\nWithout them, the AI would not know where to begin, where to finish, what it is allowed to do, or how to compare different paths.',
      closingMessage: 'In the next lesson, you will learn how AI explores this search problem using BFS and DFS.',
    },
  };

  const BFSDFS_GAME_CONFIG: PracticeExerciseConfig = {
    title: 'Treasure Hunt Expedition',
    learningGoal: 'Understand how BFS and DFS explore graphs differently',
    challenge: 'Predict which explorer reaches the treasure first across 3 expeditions',
    promptHint: 'BFS explores level by level; DFS goes deep into one branch',
    successCriteria: ['Complete all 3 rounds'],
    systemInstruction: '',
    type: 'bfs_dfs_game',
    bfsdfsGameConfig: {
      slides: [
        {
          title: 'Treasure Hunt Expedition',
          body: 'Two explorers are searching for hidden treasure.\n\nAlthough they start from the same location, they use different search strategies.\n\nYour mission is to predict which explorer reaches the treasure first.',
        },
        {
          title: 'Know Your Explorers',
          body: 'Explorer Blue\n\u2022 Uses Breadth-First Search\n\u2022 Explores nearby locations first\n\u2022 Guarantees the shortest path\n\nExplorer Orange\n\u2022 Uses Depth-First Search\n\u2022 Explores one path deeply\n\u2022 Backtracks only when necessary',
        },
        {
          title: 'How To Play',
          body: 'For every expedition:\n\n\u2022 Study the map.\n\u2022 Predict which explorer reaches the treasure first.\n\u2022 Watch both explorers search.\n\u2022 Compare their exploration styles.\n\nThe goal is to understand how each search strategy behaves.',
        },
      ],
      nodes: [
        { id: 'A', label: 'A', x: 80, y: 60 },
        { id: 'B', label: 'B', x: 210, y: 60 },
        { id: 'C', label: 'C', x: 340, y: 60 },
        { id: 'D', label: 'D', x: 80, y: 160 },
        { id: 'E', label: 'E', x: 210, y: 160 },
        { id: 'F', label: 'F', x: 340, y: 160 },
        { id: 'G', label: 'G', x: 80, y: 260 },
        { id: 'H', label: 'H', x: 210, y: 260 },
        { id: 'I', label: 'I', x: 340, y: 260 },
      ],
      edges: [
        ['A', 'B'], ['B', 'C'],
        ['D', 'E'], ['E', 'F'],
        ['G', 'H'], ['H', 'I'],
        ['A', 'D'], ['D', 'G'],
        ['B', 'E'], ['E', 'H'],
        ['C', 'F'], ['F', 'I'],
      ],
      rounds: [
        {
          id: 'nearby',
          mission: 'The treasure is hidden nearby.',
          treasureNode: 'C',
          startNode: 'A',
          bfsOrder: ['A', 'B', 'D', 'C'],
          dfsOrder: ['A', 'D', 'G', 'H', 'I', 'F', 'C', 'E', 'B'],
          winner: 'bfs',
          explanation: 'The treasure was close, so BFS found it quickly by exploring nearby nodes first. DFS wasted steps diving deep into a long branch before reaching it.',
        },
        {
          id: 'deep',
          mission: 'The treasure is hidden deep inside.',
          treasureNode: 'I',
          startNode: 'A',
          bfsOrder: ['A', 'B', 'D', 'C', 'E', 'G', 'F', 'H', 'I'],
          dfsOrder: ['A', 'D', 'G', 'H', 'I'],
          winner: 'dfs',
          explanation: 'DFS dove straight down one branch and hit the treasure fast. BFS spread out in all directions and took much longer to reach the same depth.',
        },
        {
          id: 'tricky',
          mission: 'The treasure is hidden behind several misleading paths.',
          treasureNode: 'E',
          startNode: 'A',
          bfsOrder: ['A', 'B', 'D', 'C', 'E'],
          dfsOrder: ['A', 'D', 'G', 'H', 'I', 'F', 'C', 'E', 'B'],
          winner: 'bfs',
          explanation: 'DFS went deep into a dead-end branch and had to backtrack. BFS explored level by level and found the treasure without any wasted steps.',
        },
      ],
      completionTitle: 'Excellent Work',
      completionMessage: 'Today you watched two search algorithms solve the same problem.\n\nYou discovered:\n\n\u2713 BFS explores level by level.\n\u2713 DFS explores one branch completely.\n\u2713 BFS guarantees the shortest path.\n\u2713 DFS uses less memory but may explore unnecessary paths.\n\nEvery future search algorithm builds on these ideas.',
      closingMessage: 'In the next lecture, you will apply these concepts to real search problems.',
    },
  };

  const WAREHOUSE_AI_GAME_CONFIG: PracticeExerciseConfig = {
    title: 'Amazon Warehouse AI — Build the Smartest Route',
    learningGoal: 'Understand why A* makes better decisions than Greedy Best-First Search',
    challenge: 'Guide the warehouse robot through 5 pickup decisions using A* Search',
    promptHint: 'A* chooses the order with the lowest f = g + h, not just the nearest',
    successCriteria: ['Complete all 5 warehouse decisions'],
    systemInstruction: '',
    type: 'warehouse_ai_game',
    warehouseAIGameConfig: {
      slides: [
        {
          title: 'Amazon Warehouse Robot',
          body: "Thousands of customer orders arrive every minute. A warehouse robot must collect them in the right order — every extra step wastes time and battery.\n\nWhich order should it pick first? Second? That's an AI problem.",
        },
        {
          title: 'Two ways to decide',
          body: "Greedy picks whichever order looks closest to being done — smallest estimated effort remaining.\n\nA* checks two things: how far it travelled to get here, AND how much effort is still left. It picks the order where the total is smallest.",
        },
        {
          title: "What you'll do",
          body: "First, watch Greedy navigate on its own — and see where it goes wrong.\n\nThen make 3 decisions yourself as A*. You'll pick between two orders each time.\n\nAt the end, compare the routes side by side.",
        },
      ],
      orderPositions: [
        { id: 'A', label: 'Order A', x: 280, y: 45 },
        { id: 'B', label: 'Order B', x: 455, y: 100 },
        { id: 'C', label: 'Order C', x: 455, y: 220 },
        { id: 'D', label: 'Order D', x: 105, y: 100 },
        { id: 'E', label: 'Order E', x: 105, y: 220 },
      ],
      steps: [
        {
          robotX: 280, robotY: 160,
          availableOrders: [
            { id: 'A', g: 4, h: 6 },
            { id: 'B', g: 3, h: 7 },
            { id: 'C', g: 5, h: 4 },
            { id: 'D', g: 6, h: 4 },
            { id: 'E', g: 7, h: 3 },
          ],
          correctOrderId: 'C',
          greedyOrderId: 'E',
          explanation: 'C has the lowest total cost — f = 5 + 4 = 9. Greedy chose E because h = 3 looked closest to finishing, but ignored the travel cost to get there. A* always balances the full picture.',
        },
        {
          robotX: 455, robotY: 220,
          availableOrders: [
            { id: 'A', g: 6, h: 3 },
            { id: 'B', g: 3, h: 5 },
            { id: 'D', g: 5, h: 6 },
            { id: 'E', g: 4, h: 7 },
          ],
          correctOrderId: 'B',
          greedyOrderId: 'A',
          explanation: 'B is the smart pick — f = 3 + 5 = 8. Greedy chose A because h = 3 was the smallest, but A\'s total cost is 9. Being close to the finish does not matter if the path there is long.',
        },
        {
          robotX: 455, robotY: 100,
          availableOrders: [
            { id: 'A', g: 6, h: 2 },
            { id: 'D', g: 3, h: 4 },
            { id: 'E', g: 5, h: 5 },
          ],
          correctOrderId: 'D',
          greedyOrderId: 'A',
          explanation: 'D wins with f = 3 + 4 = 7. Greedy picked A because h = 2 looks almost done, but A is far away with g = 6. A* never gets tricked by a small h — it checks how far you already had to travel.',
        },
        {
          robotX: 105, robotY: 100,
          availableOrders: [
            { id: 'A', g: 5, h: 2 },
            { id: 'E', g: 2, h: 4 },
          ],
          correctOrderId: 'E',
          greedyOrderId: 'A',
          explanation: 'E is right next door — f = 2 + 4 = 6 beats A\'s f = 7. A looks almost done with h = 2, but the travel cost reveals the truth. A* picks E.',
        },
        {
          robotX: 105, robotY: 220,
          availableOrders: [
            { id: 'A', g: 3, h: 0 },
          ],
          correctOrderId: 'A',
          greedyOrderId: 'A',
          explanation: 'One final pickup — Order A with f = 3 + 0 = 3. Mission complete. Every decision followed A* logic: always balance distance travelled with estimated distance remaining.',
        },
      ],
      completionTitle: 'Mission Complete',
      completionMessage: 'You successfully guided the warehouse robot using A* Search.\n\nToday you discovered:\n✓ Greedy chooses what looks closest — smallest h(n).\n✓ A* balances current cost and future estimate — f = g + h.\n✓ Small smart decisions create better overall routes.',
      closingMessage: 'This is why modern warehouse robots, GPS navigation systems, and game AI rely on A* Search.',
    },
  };

  const PROP_LOGIC_CONFIG: PracticeExerciseConfig = {
    title: 'Build the Security Logic',
    learningGoal: 'Understand propositional logic: AND, OR, NOT',
    challenge: 'Configure the AI security system using logical operators',
    promptHint: '',
    successCriteria: ['Complete all 5 logic scenarios'],
    systemInstruction: '',
    type: 'prop_logic_game',
    propLogicGameConfig: {
      slides: [
        {
          title: 'Step 1 of 3 — You are building an AI',
          body: 'A museum break-in happened tonight.\nYou will build an AI that figures out what happened.\n\nFirst it needs a logic engine.',
        },
        {
          title: 'The AI only understands TRUE and FALSE',
          body: 'Every decision is a condition: TRUE or FALSE.\nYou wire them together with:\n\nAND — both must be TRUE\nOR — one is enough\nNOT — flips the value',
        },
        {
          title: 'Fill in 5 missing operators',
          body: 'Each scenario has a gap.\nPick AND, OR, or NOT.\nWatch the result change instantly.',
        },
      ],
      completionTitle: 'Step 1 Done — Logic Engine Built',
      completionMessage: 'The AI can now evaluate TRUE/FALSE conditions.\n\nNext: give it knowledge about tonight\'s break-in.',
    },
  };

  const KB_GAME_CONFIG: PracticeExerciseConfig = {
    title: 'Build the Knowledge Base',
    learningGoal: 'Understand how AI stores facts and rules',
    challenge: 'Add facts and create IF-THEN rules to help the AI reason',
    promptHint: '',
    successCriteria: ['Add all facts', 'Build all rules'],
    systemInstruction: '',
    type: 'kb_game',
    kbGameConfig: {
      slides: [
        {
          title: 'Step 2 of 3 — Give the AI knowledge',
          body: 'The AI has a logic engine from Step 1.\nNow it needs to know what actually happened at the museum tonight.',
        },
        {
          title: 'A Knowledge Base = Facts + Rules',
          body: 'Facts: observations about the world (TRUE or FALSE)\nRules: IF [fact] THEN [conclusion]\n\nTogether they let the AI reason automatically.',
        },
        {
          title: 'You build it. The AI uses it in Step 3.',
          body: 'Add 5 facts about tonight\'s break-in.\nThen teach the AI 5 IF-THEN rules.\nStep 3 uses everything you store here.',
        },
      ],
      completionTitle: 'Step 2 Done — Knowledge Base Built',
      completionMessage: 'The AI now knows what happened and how to reason about it.\n\nNext: watch it figure out what you never told it.',
    },
  };

  const INFERENCE_GAME_CONFIG: PracticeExerciseConfig = {
    title: 'Run the AI',
    learningGoal: 'Understand how AI uses inference to derive new facts',
    challenge: 'Run inference and watch the AI reason step by step',
    promptHint: '',
    successCriteria: ['Run the inference engine'],
    systemInstruction: '',
    type: 'inference_game',
    inferenceGameConfig: {
      slides: [
        {
          title: 'Step 3 of 3 — Let the AI think',
          body: 'You built the logic engine (Step 1).\nYou filled the Knowledge Base (Step 2).\n\nNow watch the AI figure out what happened.',
        },
        {
          title: 'Inference = reasoning from what you know',
          body: 'The AI was never told "Alert Security".\nBut it will conclude it — by applying rules to facts.\n\nEvery new conclusion becomes a fact others can use.',
        },
        {
          title: 'Press Run. Then tap any result to see why.',
          body: 'Each step shows what the AI applied and what it derived.\nThis is how real AI reasoning engines work.',
        },
      ],
      completionTitle: 'Step 3 Done — Case Solved',
      completionMessage: 'The AI derived facts it was never told — using only your logic and knowledge.\n\nThis is how reasoning AI works:\nLogic + Knowledge + Inference.',
    },
  };

  const CONFIDENCE_CHALLENGE_CONFIG: PracticeExerciseConfig = {
    title: 'Confidence Challenge',
    learningGoal: 'Calibrate your intuitive sense of probability using everyday scenarios',
    challenge: 'For each scenario, set your confidence level from 0 (impossible) to 1 (certain)',
    promptHint: 'Think about the total number of equally likely outcomes',
    successCriteria: ['Complete all 6 scenarios'],
    systemInstruction: '',
    type: 'confidence_challenge',
    confidenceChallengeConfig: {
      slides: [
        {
          title: 'How Likely Is It?',
          body: 'Probability measures how likely something is — from 0 (impossible) to 1 (certain).',
        },
        {
          title: 'Reading the Scale',
          body: 'Move the slider to match your confidence level.',
        },
        {
          title: 'Ready to Begin',
          body: '6 scenarios — trust your gut, then learn the math.',
        },
      ],
      scenarios: [
        {
          id: 'coin-flip',
          title: 'The Coin Toss',
          situation: 'You flip a fair coin. It will land on heads.',
          expectedMin: 0.45,
          expectedMax: 0.55,
          explanation: '2 sides, 1/2 = 0.50.',
        },
        {
          id: 'die-roll',
          title: 'Roll the Die',
          situation: 'You roll a standard 6-sided die. It shows a 3.',
          expectedMin: 0.12,
          expectedMax: 0.22,
          explanation: '1 out of 6 sides = 1/6 ≈ 0.167.',
        },
        {
          id: 'card-draw',
          title: 'Draw a Card',
          situation: 'You draw a single card from a standard 52-card deck. It is a heart.',
          expectedMin: 0.20,
          expectedMax: 0.30,
          explanation: '13 hearts out of 52 = 1/4 = 0.25.',
        },
        {
          id: 'dice-doubles',
          title: 'Dice Doubles',
          situation: 'You roll two standard 6-sided dice. Both land on the same number.',
          expectedMin: 0.12,
          expectedMax: 0.22,
          explanation: '6 doubles out of 36 outcomes = 1/6 ≈ 0.167.',
        },
        {
          id: 'at-least-heart',
          title: 'At Least One Heart',
          situation: 'You draw 2 cards from a deck without replacing the first. At least one of them is a heart.',
          expectedMin: 0.38,
          expectedMax: 0.50,
          explanation: 'Zero hearts: (39/52)x(38/51) ≈ 0.559. At least one: 1 − 0.559 = 0.441.',
        },
        {
          id: 'forecast',
          title: 'Weather Forecast',
          situation: 'The forecast says there is a 70% chance of sunshine tomorrow. It will be sunny.',
          expectedMin: 0.64,
          expectedMax: 0.76,
          explanation: 'Forecast says 70%, so 0.70.',
        },
      ],
      completionTitle: 'Intuition Calibrated',
      completionMessage: 'You completed the Confidence Challenge!\n\nYour intuitive sense of probability is getting sharper. Understanding likelihood is the foundation of probability theory — you will use these skills throughout the rest of the course.',
      closeThreshold: 0.1,
      farThreshold: 0.3,
    },
  };

  const CASE_FILE_CONFIG: PracticeExerciseConfig = {
    title: 'Case File Investigation',
    learningGoal: 'Observe how belief changes as new evidence becomes available',
    challenge: 'For each piece of evidence, predict whether belief should increase, decrease, or stay similar',
    promptHint: 'Think about whether the new evidence strengthens or weakens the current hypothesis',
    successCriteria: ['Examine all 4 pieces of evidence'],
    systemInstruction: '',
    type: 'case_file_investigation',
    caseFileInvestigationConfig: {
      slides: [
        {
          title: 'A Case Begins',
          body: 'You are going on a flight. Your luggage is being checked by airport security.',
        },
        {
          title: 'How To Play',
          body: 'Read each piece of evidence, then predict whether belief should increase, decrease, or stay about the same.',
        },
        {
          title: 'Today\'s Goal',
          body: 'Observe how belief changes as new evidence becomes available — the idea behind Bayes Theorem.',
        },
      ],
      caseTitle: 'Airport Security Inspection',
      initialBelief: 0.20,
      status: 'Package appears normal.',
      evidences: [
        {
          id: 'xray',
          title: 'X-Ray Scan',
          evidence: 'A dense metal object is detected inside the package.',
          question: 'What should happen to the belief?',
          correct: 'increase',
          newBelief: 0.55,
          explanation: 'The X-ray provides new evidence that makes the package appear more suspicious. The belief increases, but it is still not certain.',
        },
        {
          id: 'passenger-history',
          title: 'Passenger History',
          evidence: 'The passenger has travelled frequently for many years without any security issues.',
          question: 'What should happen now?',
          correct: 'decrease',
          newBelief: 0.35,
          explanation: 'Positive travel history reduces suspicion. New evidence can lower belief as well as increase it.',
        },
        {
          id: 'manual-inspection',
          title: 'Manual Inspection',
          evidence: 'Inspectors discover a hidden compartment inside the package.',
          question: 'What happens now?',
          correct: 'increase',
          newBelief: 0.88,
          explanation: 'This new evidence strongly increases belief because hidden compartments are unusual.',
        },
        {
          id: 'final-inspection',
          title: 'Final Inspection',
          evidence: 'The hidden compartment contains a folded camera tripod. No prohibited items are found.',
          question: 'What should happen now?',
          correct: 'decrease',
          newBelief: 0.02,
          explanation: 'The final inspection explains the previous observations. The package is no longer considered suspicious.',
        },
      ],
      completionTitle: 'Case Closed',
      completionMessage: 'Throughout this investigation, the belief changed every time new evidence appeared.',
      takeaways: [
        'Probability is updated when new evidence becomes available.',
        'Early conclusions can change.',
        'AI does not guess once. It continuously updates its belief.',
        'This is the foundation of Conditional Probability and Bayes Theorem.',
      ],
    },
  };

  const DECISION_PIPELINE_CONFIG: PracticeExerciseConfig = {
    title: 'Decision Pipeline',
    learningGoal: 'Understand how probability is used to make decisions step by step',
    challenge: 'Complete each stage of the decision pipeline from initial belief to final decision',
    promptHint: 'Think about each step in sequence — belief, evidence, update, decision',
    successCriteria: ['Complete all 4 pipeline stages'],
    systemInstruction: '',
    type: 'decision_pipeline',
    decisionPipelineConfig: {
      slides: [
        {
          title: 'Probability In Action',
          body: 'An email arrives in your inbox. Should the system deliver it or mark it as spam? That is a probability decision.',
        },
        {
          title: 'The Decision Process',
          body: 'Four steps:\n\n1. Start with a belief\n2. Observe evidence\n3. Update confidence\n4. Make a decision',
        },
        {
          title: 'Today\'s Goal',
          body: 'Walk through each stage of the decision pipeline from start to finish on a real spam detection scenario.',
        },
      ],
      scenarioTitle: 'Incoming Email',
      priorBeliefPercent: 30,
      priorBeliefCard: 'The email looks normal at first glance.',
      priorBeliefExplanation: 'Before analysing any content, the system starts with a baseline belief based on general statistics about emails.',
      evidences: [
        { id: 'sender', label: 'Unknown Sender', description: 'The sender address is not in your contacts.' },
        { id: 'subject', label: 'Urgent Subject', description: 'The subject line uses urgent language.' },
        { id: 'link', label: 'Suspicious Link', description: 'The email contains a link to an unfamiliar domain.' },
      ],
      evidenceExplanation: 'Each piece of evidence adds information that helps the system refine its belief.',
      updatedConfidence: 85,
      updatedConfidenceExplanation: 'The additional evidence makes it much more likely that the email is spam. The belief has been updated.',
      options: [
        { label: 'Deliver to Inbox', value: 'inbox' },
        { label: 'Move to Spam', value: 'spam' },
      ],
      correctOption: 'spam',
      decisionExplanation: 'The updated belief is now high enough to classify the email as spam. The system can now make a confident decision.',
      summaryText: 'This is how probability works in practice.\n\nEvery AI decision follows the same process you just completed: start with a belief, observe evidence, update confidence, make a decision.\n\nSpam filters, fraud detection, medical diagnosis, and recommendation systems all use this same pipeline. The math behind it is Bayes Theorem — but the logic is just common sense: every new clue changes what we believe.',
    },
  };

  const HILL_CLIMB_CONFIG: PracticeExerciseConfig = {
    title: 'Hill Climbing on a Landscape',
    learningGoal: 'Understand how Hill Climbing searches for better solutions one step at a time',
    challenge: 'Climb the landscape by always moving to a higher adjacent position',
    promptHint: 'You can only move to an adjacent index with a higher value',
    successCriteria: ['Climb until no higher neighbour exists', 'Compare local vs global optimum'],
    systemInstruction: '',
    type: 'hill_climb',
    hillClimbConfig: {
      slides: [
        {
          title: 'Climb The Landscape',
          body: 'Hill Climbing finds peaks by always moving to a higher adjacent position. Today your landscape is [1, 3, 6, 9, 7, 4, 2].',
        },
        {
          title: 'How To Play',
          body: 'Click a starting position. Then click adjacent positions that have a higher value. Keep climbing until no higher neighbour exists.',
        },
        {
          title: 'Today\'s Goal',
          body: 'Visit each position by moving to higher neighbours only. Afterwards, discover whether you found the highest peak in the landscape.',
        },
      ],
      landscape: [1, 3, 6, 9, 7, 4, 2],
      scenarioText: 'You are a hiker traversing a mountain range. Each position below shows the elevation. Start at any position, then move to adjacent higher ground. Hill Climbing always goes uphill.',
      completionTitle: 'Exercise Complete',
      completionMessage: 'Hill Climbing always moves to a better neighbour. It stops when every neighbour is worse.',
      takeaways: [
        'Hill Climbing always moves to a better neighbour',
        'It only considers adjacent positions',
        'It may stop at a Local Optimum',
        'The Local Optimum is not always the Global Optimum',
      ],
    },
  };

  const PIZZA_OPTIMIZATION_CONFIG: PracticeExerciseConfig = {
    title: 'Build the Perfect Pizza',
    learningGoal: 'Understand how optimization works through repeated improvements',
    challenge: 'Improve your pizza one topping at a time by watching the score change',
    promptHint: 'Add toppings and watch how each one affects the score',
    successCriteria: ['Improve your pizza step by step'],
    systemInstruction: '',
    type: 'pizza_optimization',
    pizzaOptimizationConfig: {
      slides: [
        {
          title: 'Build The Perfect Pizza',
          body: 'Imagine you own a pizza shop.\n\nYour goal is to create the highest-rated pizza by improving it one topping at a time.',
        },
        {
          title: 'How It Works',
          body: 'Click toppings to add them to your pizza.\n\nEvery topping changes the Pizza Score.\nSome toppings improve the score.\nSome reduce it.\n\nWatch how every decision affects the final result.',
        },
        {
          title: 'Today\'s Goal',
          body: 'Keep improving your pizza until you believe no better combination can be made.',
        },
      ],
      toppings: [
        { id: 'cheese', name: 'Cheese', score: 12, color: '#fef08a' },
        { id: 'pepperoni', name: 'Pepperoni', score: 10, color: '#e11d48' },
        { id: 'mushrooms', name: 'Mushrooms', score: 8, color: '#78716c' },
        { id: 'olives', name: 'Olives', score: 6, color: '#166534' },
        { id: 'capsicum', name: 'Capsicum', score: 5, color: '#22c55e' },
        { id: 'tomatoes', name: 'Tomatoes', score: 4, color: '#dc2626' },
        { id: 'corn', name: 'Corn', score: 3, color: '#eab308' },
        { id: 'jalapenos', name: 'Jalapeños', score: 4, color: '#65a30d' },
        { id: 'onions', name: 'Onions', score: 2, color: '#e2e8f0' },
        { id: 'pineapple', name: 'Pineapple', score: -10, color: '#facc15' },
      ],
      baseScore: 50,
      completionTitle: 'Optimization Complete',
      completionMessages: {
        high: 'Excellent. You gradually improved your pizza by making better choices.',
        medium: 'Good attempt. Some topping combinations could further improve the pizza.',
        low: 'Some choices reduced the overall quality. Try experimenting with different combinations.',
      },
      takeaways: [
        'Optimization begins with a starting solution.',
        'Every change affects the overall result.',
        'Good optimization keeps improving the solution.',
        'Eventually no further improvement is found.',
        'This is the same idea used in optimization algorithms like Hill Climbing.',
      ],
    },
  };

  const LOST_AND_FOUND_CONFIG: PracticeExerciseConfig = {
    title: 'Lost & Found Sorting',
    learningGoal: 'Understand that Supervised Learning learns from labelled examples',
    challenge: 'Sort lost items into categories, then classify new items using what you learned',
    promptHint: 'Observe which items belong together and use those patterns for new items',
    successCriteria: ['Sort all items into categories', 'Classify new unseen items'],
    systemInstruction: '',
    type: 'lost_and_found',
    lostAndFoundConfig: {
      slides: [
        {
          title: 'Finding Order',
          body: 'Imagine a college Lost & Found room.\n\nItems arrive throughout the day and need to be organised into the correct category.',
        },
        {
          title: 'How To Play',
          body: 'Drag each item from the stack and drop it into the correct category.\n\nOnce everything is organised, a new item will arrive.\nUse the patterns you observed to decide where it belongs.',
        },
        {
          title: 'Today\'s Goal',
          body: 'Organise the labelled examples first.\n\nThen use those examples to classify a completely new item.',
        },
      ],
      categories: [
        { id: 'electronics', label: 'Electronics' },
        { id: 'personal', label: 'Personal Items' },
        { id: 'stationery', label: 'Stationery' },
      ],
      round1Items: [
        { id: 'laptop', label: 'Laptop', categoryId: 'electronics' },
        { id: 'phone', label: 'Mobile Phone', categoryId: 'electronics' },
        { id: 'headphones', label: 'Headphones', categoryId: 'electronics' },
        { id: 'calculator', label: 'Calculator', categoryId: 'electronics' },
        { id: 'wallet', label: 'Wallet', categoryId: 'personal' },
        { id: 'student-id', label: 'Student ID Card', categoryId: 'personal' },
        { id: 'umbrella', label: 'Umbrella', categoryId: 'personal' },
        { id: 'water-bottle', label: 'Water Bottle', categoryId: 'personal' },
        { id: 'notebook', label: 'Notebook', categoryId: 'stationery' },
        { id: 'pen', label: 'Pen', categoryId: 'stationery' },
      ],
      newItems: [
        { id: 'smart-watch', label: 'Smart Watch', categoryId: 'electronics' },
        { id: 'notebook-diary', label: 'Notebook Diary', categoryId: 'stationery' },
        { id: 'power-bank', label: 'Power Bank', categoryId: 'electronics' },
      ],
      completionTitle: 'Exercise Complete',
      completionMessage: 'You first organised labelled examples. Then you used those examples to classify new items.',
      takeaways: [
        'Supervised Learning begins with labelled examples.',
        'Similar items are grouped together.',
        'New unseen items can be classified using what has already been learned.',
        'This process is called Classification.',
      ],
    },
  };

  const ML_WORKFLOW_CONFIG: PracticeExerciseConfig = {
    title: 'Build the ML Pipeline',
    learningGoal: 'Understand the Machine Learning workflow from data to predictions',
    challenge: 'Arrange the ML workflow cards in the correct order',
    promptHint: 'Think about which step should happen first and which should happen next',
    successCriteria: ['Place all 5 steps in the correct order'],
    systemInstruction: '',
    type: 'ml_workflow',
    mlWorkflowConfig: {
      slides: [
        {
          title: 'Building a Machine Learning System',
          body: 'Machine Learning follows a structured workflow with distinct stages, each depending on the one before it.',
        },
        {
          title: 'Understanding the Workflow',
          body: 'Each stage feeds into the next. Think about what you need before the next step can begin.',
        },
      ],
      steps: [
        { id: 'collect-data', label: 'Collect Data', explanation: 'Gather labelled examples.' },
        { id: 'clean-data', label: 'Clean Data', explanation: 'Remove errors and prepare the data.' },
        { id: 'train-model', label: 'Train Model', explanation: 'Learn patterns from the data.' },
        { id: 'test-model', label: 'Test Model', explanation: 'Measure how well the model performs on unseen examples.' },
        { id: 'predict', label: 'Make Predictions', explanation: 'Use the trained model on real-world data.' },
      ],
      completionTitle: 'Workflow Complete',
      completionMessage: 'You successfully arranged the Machine Learning pipeline.',
      takeaways: [
        'Every ML project starts with data.',
        'Clean data leads to better learning.',
        'Models learn during training.',
        'Testing measures performance on unseen data.',
        'Predictions are only made after the model has been trained and tested.',
      ],
    },
  };

  const NEURAL_NETWORK_BUILDER_CONFIG: PracticeExerciseConfig = {
    title: 'Build the Neural Network',
    learningGoal: 'Understand how a neural network is built and trained',
    challenge: 'Assemble a neural network layer by layer, then train and test it on new data.',
    promptHint: 'Follow each step: place the input, connect the layers, train the network, then test it.',
    successCriteria: ['Place the input', 'Connect all layers', 'Train the network', 'Test the model'],
    systemInstruction: '',
    type: 'neural_network_builder',
    neuralNetworkConfig: {
      slides: [
        {
          title: 'How Neural Networks Learn',
          body: 'Neural Networks learn by passing information through connected layers.',
        },
        {
          title: 'Assemble Your Network',
          body: 'Today you will assemble a simple neural network.\nThen watch it learn.',
        },
        {
          title: 'Test What It Learned',
          body: 'Finally,\ntest the trained network using new unseen data.',
        },
      ],
      completionTitle: 'Neural Network Learned',
      completionMessage: 'You built and trained a neural network from scratch. Like the lecture showed, a neural network is not magic — it is layers of connected neurons that learn by gradually adjusting weights through training.',
      takeaways: [
        'Inputs (training images) enter the network through the input layer — one image at a time.',
        'Hidden layers transform inputs by applying weights and passing signals forward.',
        'Training is the key: thousands of examples gradually adjust weights to reduce loss.',
        'A trained network can generalise — it correctly classifies images it has never seen.',
        'Neural Networks improve with more data and more training — just like the step-by-step process you experienced.',
      ],
    },
  };

  const SEARCH_ENGINE_PIPELINE_CONFIG: PracticeExerciseConfig = {
    title: 'Inside a Search Engine',
    learningGoal: 'Understand how search engines process human language step by step',
    challenge: 'Explore what happens behind the scenes when you search: from raw query to meaningful results',
    promptHint: 'Choose a query and follow how the search engine processes it step by step',
    successCriteria: ['Complete the search pipeline'],
    systemInstruction: '',
    type: 'search_engine_pipeline',
    searchEnginePipelineConfig: {
      slides: [
        {
          title: 'How Search Engines Understand You',
          body: 'When you type a query, the computer does not understand the full sentence.\n\nIt processes your words step by step.',
        },
        {
          title: 'How To Explore',
          body: 'Type or choose a query.\n\nWatch the search engine break it into tokens, extract keywords, detect your intent, and return results.',
        },
        {
          title: "Today's Goal",
          body: 'Discover what happens between pressing Search and receiving results.',
        },
      ],
      completionTitle: 'Search Complete',
      completionMessage: 'You explored how a search engine processes language before returning results.',
      takeaways: [
        'NLP allows computers to work with human language.',
        'Tokenization breaks sentences into smaller pieces.',
        'Keywords help identify the important parts of a query.',
        'AI uses processed language to understand user intent.',
        'Bag of Words counts word frequency to represent text.',
      ],
    },
  };

  const PREDICT_NEXT_WORD_CONFIG: PracticeExerciseConfig = {
    title: 'Predict the Next Word',
    learningGoal: 'Understand how language models predict words and measure similarity',
    challenge: 'Predict the next word and compare how words relate using embeddings',
    promptHint: 'Complete the sentences and explore how "bank" means different things in different contexts',
    successCriteria: ['Complete all prediction rounds and word similarity exercise'],
    systemInstruction: '',
    type: 'predict_next_word',
    predictNextWordConfig: {
      slides: [
        {
          title: 'How Language Models Predict',
          body: 'Language models do not understand words — they understand patterns.\n\nGiven a sequence of words, the model calculates which word is most likely to come next.',
        },
        {
          title: 'Context is Everything',
          body: 'The same word can mean different things in different contexts.\n\nLanguage models use surrounding words to decide what comes next.',
        },
        {
          title: 'Words Have Mathematical Meaning',
          body: 'Word embeddings turn words into numbers.\n\nWords with similar meanings are positioned close together in mathematical space.',
        },
      ],
      completionTitle: 'Prediction Complete',
      completionMessage: 'You explored how language models predict words, how context affects meaning, and how word embeddings measure similarity.',
      takeaways: [
        'Language models predict the most likely next word based on context.',
        'Context dramatically changes a word\'s meaning.',
        'Word embeddings represent words as numbers in a high-dimensional space.',
        'Similar words are mathematically closer together in embedding space.',
        'These techniques power everything from search to translation.',
      ],
    },
  };

  const AI_APPROVAL_CHECKLIST_CONFIG: PracticeExerciseConfig = {
    title: 'AI Approval Checklist',
    learningGoal: 'Understand why AI systems need ethical review before deployment',
    challenge: 'Complete an AI ethics review and decide whether the system should be approved',
    promptHint: 'Think about whether each item meets ethical AI standards',
    successCriteria: ['Place all review cards correctly and make the final decision'],
    systemInstruction: '',
    type: 'ai_approval_checklist',
    aiApprovalChecklistConfig: {
      slides: [
        {
          title: 'Before AI Goes Live',
          body: 'Powerful AI systems should never be released without careful review.\n\nEvery system should be checked for fairness, transparency and responsibility.',
        },
        {
          title: "Today's Goal",
          body: 'Complete a professional AI ethics review before approving an AI system for public use.',
        },
      ],
      systemName: 'AI Hiring Assistant',
      systemPurpose: 'Automatically shortlist job applicants.',
      cards: [
        {
          id: 'c1',
          text: 'Training data collected from only one company.',
          expected: 'needs',
          explanation: 'Limited training data may introduce bias and unfair decisions.',
        },
        {
          id: 'c2',
          text: 'Every recommendation is reviewed by a human before making the final hiring decision.',
          expected: 'ready',
          explanation: 'Human oversight helps verify important AI decisions.',
        },
        {
          id: 'c3',
          text: 'Applicants are informed that AI is being used during the hiring process.',
          expected: 'ready',
          explanation: 'Users should know when AI is involved in important decisions.',
        },
        {
          id: 'c4',
          text: 'No one is responsible if the AI makes an incorrect decision.',
          expected: 'needs',
          explanation: 'Every AI system must have clear accountability.',
        },
        {
          id: 'c5',
          text: 'Users can report unfair or harmful AI decisions.',
          expected: 'ready',
          explanation: 'Reporting mechanisms help improve AI systems and reduce harm.',
        },
        {
          id: 'c6',
          text: 'The AI was never tested before deployment.',
          expected: 'needs',
          explanation: 'AI outputs should always be verified before being used.',
        },
        {
          id: 'c7',
          text: 'The development team regularly checks the model for bias.',
          expected: 'ready',
          explanation: 'Regular monitoring helps maintain fairness over time.',
        },
        {
          id: 'c8',
          text: 'The AI stores personal information that is not required for hiring.',
          expected: 'needs',
          explanation: 'AI should collect only the information necessary for its purpose.',
        },
      ],
      dashboardItems: [
        { label: 'Fair Training Data', cardIds: ['c1'] },
        { label: 'Verification', cardIds: ['c6'] },
        { label: 'Transparency', cardIds: ['c3'] },
        { label: 'Accountability', cardIds: ['c4'] },
        { label: 'Privacy', cardIds: ['c8'] },
        { label: 'Safety Monitoring', cardIds: ['c2', 'c5', 'c7'] },
      ],
      completionTitle: 'Ethical Review Complete',
      completionMessage: 'You completed an AI ethics review before deployment.',
      takeaways: [
        'Always verify AI outputs.',
        'Use diverse and representative training data.',
        'Be transparent when AI is involved.',
        'Assign clear accountability.',
        'Report and improve harmful AI behaviour.',
        'Responsible AI is fair, transparent and trustworthy.',
      ],
    },
  };

  const FAIR_OR_UNFAIR_CONFIG: PracticeExerciseConfig = {
    title: 'Fair or Unfair?',
    learningGoal: 'Understand how AI systems make fair decisions using only relevant data',
    challenge: 'Choose fair AI decisions and spot unnecessary data requests',
    promptHint: 'Think about what information is actually relevant to the decision or function',
    successCriteria: ['Complete all bias and privacy scenarios'],
    systemInstruction: '',
    type: 'fair_or_unfair',
    fairOrUnfairConfig: {
      slides: [
        {
          title: 'Responsible AI',
          body: 'AI systems make important decisions every day.\n\nThose decisions should be fair and should respect people\'s privacy.',
        },
        {
          title: 'How To Play',
          body: 'Review each situation carefully.\n\nChoose the fairest decision based only on relevant information.',
        },
        {
          title: "Today's Goal",
          body: 'Identify unfair AI decisions and recognise when applications request unnecessary personal information.',
        },
      ],
      biasScenarios: [
        {
          name: 'Candidate A',
          details: [
            { label: 'Experience', value: '5 Years' },
            { label: 'Skills', value: 'Python, SQL, Machine Learning' },
            { label: 'Education', value: 'B.Tech' },
            { label: 'Gender', value: 'Female' },
          ],
          question: 'Should Gender influence the hiring decision?',
          correctAnswer: false,
          explanation: 'Hiring decisions should be based on skills and qualifications, not gender.',
        },
        {
          name: 'Candidate B',
          details: [
            { label: 'Experience', value: '8 Years' },
            { label: 'Skills', value: 'React, Node.js, AWS' },
            { label: 'Age', value: '56' },
          ],
          question: 'Should Age automatically reduce this candidate\'s chances?',
          correctAnswer: false,
          explanation: 'Age alone should not determine whether someone is suitable for a job.',
        },
        {
          name: 'Candidate C',
          details: [
            { label: 'Experience', value: '3 Years' },
            { label: 'Skills', value: 'TensorFlow, Python' },
            { label: 'Location', value: 'Hyderabad' },
          ],
          question: 'Should Location alone determine whether the candidate is rejected?',
          correctAnswer: false,
          explanation: 'Location may affect logistics, but it should not unfairly eliminate qualified candidates without a valid reason.',
        },
      ],
      privacyScenarios: [
        {
          appName: 'Weather Forecast',
          permissions: ['Location', 'Camera', 'Contacts', 'Microphone', 'Photo Gallery', 'Calendar'],
          requiredPermissions: ['Location'],
          explanation: 'A weather app needs your location to provide accurate forecasts. It does not need your contacts or photo gallery.',
        },
        {
          appName: 'Flashlight',
          permissions: ['Camera', 'Location', 'Contacts', 'Microphone', 'Storage'],
          requiredPermissions: ['Camera'],
          explanation: 'A flashlight app only needs access to the camera flash. It does not need contacts or location.',
        },
        {
          appName: 'Music Player',
          permissions: ['Music Files', 'Contacts', 'Location', 'Camera'],
          requiredPermissions: ['Music Files'],
          explanation: 'Applications should request only the information needed to perform their function.',
        },
      ],
      completionTitle: 'Responsible AI Complete',
      completionMessage: 'Today you explored two important challenges in Artificial Intelligence.',
      takeaways: [
        'AI should make fair decisions using relevant information.',
        'Sensitive personal information should not create unfair bias.',
        'Applications should request only the permissions they genuinely need.',
        'Responsible AI is fair, transparent and privacy-conscious.',
      ],
    },
  };

  const INVESTIGATION_CONFIG: PracticeExerciseConfig = {
    title: 'AI Detective — Discover the AI Behind Everyday Apps',
    learningGoal: 'Recognize which AI techniques power everyday applications',
    challenge: 'Investigate 5 real-world apps and identify the AI technique behind each one',
    promptHint: 'Think about what each app is trying to achieve — then match it to the right AI concept',
    successCriteria: ['Complete all 5 investigations'],
    systemInstruction: '',
    type: 'investigation',
    investigationConfig: {
      slides: [
        {
          title: 'Become an AI Detective',
          body: 'Every app hides AI. Your job? Spot it.',
        },
        {
          title: 'How To Play',
          body: 'Read the case. Pick the AI. Learn why.',
        },
        {
          title: 'Today\'s Mission',
          body: 'Face Unlock \u2022 Google Maps \u2022 Spam Filter \u2022 Netflix \u2022 ChatGPT',
        },
      ],
      questions: [
        {
          category: 'Face Unlock',
          scenario: 'You pick up your phone. It recognizes your face instantly and unlocks.',
          question: 'Which AI technique makes this possible?',
          options: ['Search', 'Optimization', 'Neural Networks', 'Knowledge'],
          correct: 'Neural Networks',
          explanation: 'Your phone does not compare a single stored image. Instead, it learns facial patterns from thousands of examples and checks whether your face matches those learned patterns.',
        },
        {
          category: 'Google Maps',
          scenario: 'Google Maps finds the fastest route to your college in less than a second.',
          question: 'Which AI techniques work together here?',
          options: ['Machine Learning', 'Search + Optimization', 'Language Models', 'Knowledge'],
          correct: 'Search + Optimization',
          explanation: 'Search explores many possible routes. Optimization chooses the best route using distance, traffic, and travel time.',
        },
        {
          category: 'Spam Filter',
          scenario: 'Your inbox automatically hides spam emails before you even see them.',
          question: 'Which AI technique is responsible?',
          options: ['Search', 'Machine Learning', 'Neural Networks', 'Language Models'],
          correct: 'Machine Learning',
          explanation: 'The spam filter learned patterns from millions of labelled emails instead of following fixed rules.',
        },
        {
          category: 'Netflix',
          scenario: 'Netflix recommends movies that you are likely to enjoy.',
          question: 'Which AI techniques make these recommendations possible?',
          options: ['Search', 'Optimization', 'Machine Learning + Probability', 'Language Models'],
          correct: 'Machine Learning + Probability',
          explanation: 'Netflix studies viewing behaviour and predicts which content you are most likely to enjoy.',
        },
        {
          category: 'ChatGPT',
          scenario: 'You ask ChatGPT a question. It understands your request and generates an answer.',
          question: 'Which AI technique powers ChatGPT?',
          options: ['Optimization', 'Search', 'Language Models', 'Probability'],
          correct: 'Language Models',
          explanation: 'ChatGPT uses Large Language Models trained on billions of sentences to understand and generate language.',
        },
      ],
      completionSummary: [
        { label: 'Face Unlock', value: 'Neural Networks' },
        { label: 'Google Maps', value: 'Search + Optimization' },
        { label: 'Spam Filter', value: 'Machine Learning' },
        { label: 'Netflix', value: 'Machine Learning + Probability' },
        { label: 'ChatGPT', value: 'Language Models' },
      ],
      completionTitle: 'Mission Complete',
      completionMessage: 'Today you discovered the AI behind the apps you already use every day.\n\nThese are the exact topics you\'ll explore throughout this course. Every future lecture will explain one of the AI techniques you discovered today.',
    },
  };

  const NEURON_CALCULATOR_CONFIG: PracticeExerciseConfig = {
    title: 'Compute a Neuron Output',
    learningGoal: 'Understand how a neuron computes output from inputs, weights, bias, and activation',
    challenge: 'Calculate neuron outputs step by step using weights and activation functions',
    promptHint: 'First compute the weighted sum Σ(input × weight) + bias, then apply ReLU',
    successCriteria: ['Complete all neuron calculations'],
    systemInstruction: '',
    type: 'neuron_calculator',
    neuronCalculatorConfig: {
      problems: [
        { inputs: [1.0, 0.5, 0.2], weights: [0.4, -0.3, 0.1], bias: 0.1, weightedSum: 0.35, activated: 0.35, activation: 'relu' },
        { inputs: [0.8, -0.5, 0.3], weights: [0.6, 0.2, -0.4], bias: -0.2, weightedSum: 0.36, activated: 0.36, activation: 'relu' },
        { inputs: [-1.0, 0.7, 0.1], weights: [0.5, 0.3, 0.8], bias: 0.0, weightedSum: -0.21, activated: 0, activation: 'relu' },
      ],
    },
  };

  const STUDY_DAY_PLANNER_CONFIG: PracticeExerciseConfig = {
    title: 'Organize Your Study Day',
    learningGoal: 'Understand how state spaces and optimization combine to find the best schedule',
    challenge: 'Build a study schedule that maximizes marks within a 5-hour time constraint',
    promptHint: 'Add tasks to your schedule, then use optimization to find the best combination',
    successCriteria: ['Add tasks to build a schedule', 'Find the optimal schedule'],
    systemInstruction: '',
    type: 'study_day_planner',
    studyDayPlannerConfig: {},
  };

  const FACTORY_PLANNER_CONFIG: PracticeExerciseConfig = {
    title: 'Factory Production Planner',
    learningGoal: 'Understand how linear programming maximizes profit under resource constraints',
    challenge: 'Adjust production levels for two products to find the highest profit within labor and material limits',
    promptHint: 'Product A uses more labor, Product B uses more materials. Find the right balance.',
    successCriteria: ['Find a feasible solution', 'Discover the optimal profit'],
    systemInstruction: '',
    type: 'factory_planner',
  };

  const SMOOTHIE_FORWARD_PASS_CONFIG: PracticeExerciseConfig = {
    title: 'Build the Perfect Smoothie',
    learningGoal: 'Understand how a neural network performs a forward pass and why activation functions are needed',
    challenge: 'Blend ingredients using inputs, weights, a weighted sum, and an activation function to hit a target sweetness score',
    promptHint: 'The weighted sum is Σ(input × weight); the blender mode is the activation function that turns it into a score',
    successCriteria: ['Reach a sweetness score of 9/10', 'Complete the final challenge by adjusting only two ingredients'],
    systemInstruction: '',
    type: 'smoothie_forward_pass',
    smoothieForwardPassConfig: {
      targetScore: 9,
      ingredients: [
        { key: 'mango', emoji: '🥭', label: 'Mango', defaultInput: 70, defaultWeight: 0.8 },
        { key: 'strawberry', emoji: '🍓', label: 'Strawberry', defaultInput: 40, defaultWeight: 0.4 },
        { key: 'milk', emoji: '🥛', label: 'Milk', defaultInput: 60, defaultWeight: 0.2 },
        { key: 'honey', emoji: '🍯', label: 'Honey', defaultInput: 50, defaultWeight: 1.0 },
      ],
      blenderModes: [
        { key: 'relu', emoji: '⚡', label: 'Quick Blend', subtitle: 'ReLU', description: 'Works well for positive mixtures.' },
        { key: 'sigmoid', emoji: '🥤', label: 'Smooth Blend', subtitle: 'Sigmoid', description: 'Converts any mixture into a score between 0 and 10.' },
        { key: 'tanh', emoji: '🌊', label: 'Creamy Blend', subtitle: 'Tanh', description: 'Balances strong and weak flavours.' },
      ],
      finalChallenge: {
        targetScore: 7,
        lockedKeys: ['mango', 'honey'],
      },
    },
  };

  const CLUSTERING_MATCH_CONFIG: PracticeExerciseConfig = {
    title: 'Match the Clustering Algorithm',
    learningGoal: 'Recognise which unsupervised clustering algorithm fits a given dataset and constraints',
    challenge: 'Read each scenario and pick K-Means, Hierarchical, or DBSCAN based on shape, structure, and noise',
    promptHint: 'Ask: do I know K upfront? Are clusters round and even-sized? Is there noise or an irregular shape?',
    successCriteria: ['Match all scenarios to the correct clustering algorithm'],
    systemInstruction: '',
    type: 'clustering_match',
    clusteringMatchConfig: {
      scenarios: [
        {
          id: 'delivery-zones',
          emoji: '📍',
          title: 'Delivery Zone Planning',
          description: 'You have GPS coordinates for 500 delivery stops and want to group them into exactly 6 compact, roughly equal-sized zones for 6 drivers.',
          correctAlgorithm: 'kmeans',
          explanation: 'You know the number of groups in advance (6 drivers) and want round, evenly-sized regions — the classic case K-Means is built for.',
        },
        {
          id: 'species-taxonomy',
          emoji: '🧬',
          title: 'Species Classification',
          description: 'Biologists want to organise newly discovered organisms into a full tree of nested groups — species within genus within family — without deciding the number of groups beforehand.',
          correctAlgorithm: 'hierarchical',
          explanation: 'No fixed K is chosen upfront, and the goal is a nested tree of relationships at every level of granularity — exactly what hierarchical clustering produces (a dendrogram).',
        },
        {
          id: 'fraud-detection',
          emoji: '🕵️',
          title: 'Unusual Transaction Detection',
          description: 'A bank wants to find dense clusters of normal spending behaviour in transaction data, while automatically flagging isolated, unusual transactions as outliers.',
          correctAlgorithm: 'dbscan',
          explanation: 'DBSCAN finds dense regions of any shape and explicitly labels sparse, isolated points as noise — ideal for outlier/anomaly detection.',
        },
        {
          id: 'galaxy-shapes',
          emoji: '🌌',
          title: 'Galaxy Cluster Mapping',
          description: 'Astronomers are mapping galaxies that form long, curved, irregularly-shaped filaments in space — not neat round blobs — and don’t know how many filaments exist.',
          correctAlgorithm: 'dbscan',
          explanation: 'The clusters are irregular and elongated, not round, and the count isn’t known ahead of time — K-Means assumes round clusters and a fixed K, so it would fail here.',
        },
        {
          id: 'customer-segments',
          emoji: '🛍️',
          title: 'Marketing Segments',
          description: 'A retailer wants to split customers into a specific number of segments (say, 4) for 4 targeted email campaigns, based on purchase frequency and spend.',
          correctAlgorithm: 'kmeans',
          explanation: 'A specific target number of segments is required for a fixed number of campaigns — K-Means is the fast, straightforward fit when K is already decided.',
        },
      ],
    },
  };

  useEffect(() => {
    // AI Detective: always use inline config for fundamentals-of-ai lecture 1 (number 0) section 3 practice
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 1 && block.title === 'AI Conversation Practice') {
      setConfig(INVESTIGATION_CONFIG);
      return;
    }
    // Build the Search Problem: inline config for fundamentals-of-ai lecture 2 (number 1) section 1 practice
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 2 && block.title === 'Modeling a Search Problem') {
      setConfig(SEARCH_PROBLEM_BUILDER_CONFIG);
      return;
    }
    // Treasure Hunt Expedition: inline config for fundamentals-of-ai lecture 2 (number 1) section 2 practice
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 2 && block.title === 'Implementing BFS Traversal') {
      setConfig(BFSDFS_GAME_CONFIG);
      return;
    }
    // Warehouse AI Game: inline config for fundamentals-of-ai lecture 2 (number 1) section 3 practice
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 2 && sectionId === 'heuristic-search' && block.title === 'Practice Exercise') {
      setConfig(WAREHOUSE_AI_GAME_CONFIG);
      return;
    }
    // AI 3.1 Propositional Logic (lecture 2, section propositional-logic)
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 3 && block.title === 'Evaluating Logic Expressions') {
      setConfig(PROP_LOGIC_CONFIG);
      return;
    }
    // AI 3.2 Knowledge Base (lecture 2, section knowledge-base)
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 3 && block.title === 'Building a Knowledge Base') {
      setConfig(KB_GAME_CONFIG);
      return;
    }
    // AI 3.3 Inference (lecture 2, section first-order-logic)
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 3 && sectionId === 'first-order-logic' && block.title === 'Practice Exercise') {
      setConfig(INFERENCE_GAME_CONFIG);
      return;
    }
    // Confidence Challenge: inline config for fundamentals-of-ai lecture 4 (number 3) section prob-basics
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 4 && block.title === 'Calculating Simple Probabilities') {
      setConfig(CONFIDENCE_CHALLENGE_CONFIG);
      return;
    }
    // Case File Investigation: inline config for fundamentals-of-ai lecture 4 (number 3) section bayes-theorem
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 4 && block.title === 'Applying Bayes Theorem') {
      setConfig(CASE_FILE_CONFIG);
      return;
    }
    // Decision Pipeline: inline config for fundamentals-of-ai lecture 4 (number 3) section bayesian-networks
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 4 && sectionId === 'bayesian-networks' && block.title === 'Practice Exercise') {
      setConfig(DECISION_PIPELINE_CONFIG);
      return;
    }
    // Hill Climb: inline config for fundamentals-of-ai lecture 5 (number 4) section what-is-optimization
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 5 && block.title === 'Hill Climbing on a Landscape') {
      setConfig(HILL_CLIMB_CONFIG);
      return;
    }
    // Pizza Optimization: inline config for fundamentals-of-ai lecture 5 (number 4) section constraint-satisfaction
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 5 && sectionId === 'constraint-satisfaction' && block.title === 'Practice Exercise') {
      setConfig(PIZZA_OPTIMIZATION_CONFIG);
      return;
    }
    // Lost & Found Sorting: inline config for fundamentals-of-ai lecture 6 (number 5) section supervised-learning
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 6 && sectionId === 'supervised-learning' && block.title === 'Classifying ML Problems') {
      setConfig(LOST_AND_FOUND_CONFIG);
      return;
    }
    // ML Workflow: inline config for fundamentals-of-ai lecture 6 (number 5) section overfitting-generalisation
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 6 && sectionId === 'overfitting-generalisation' && block.title === 'Practice Exercise') {
      setConfig(ML_WORKFLOW_CONFIG);
      return;
    }
    // Neural Network Builder: fundamentals-of-ai lecture 7 (number 6) section training-backpropagation
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 7 && sectionId === 'training-backpropagation' && block.title === 'Practice Exercise') {
      setConfig(NEURAL_NETWORK_BUILDER_CONFIG);
      return;
    }
    // Search Engine Pipeline: fundamentals-of-ai lecture 8 (number 7) section text-processing
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 8 && sectionId === 'text-processing' && block.title === 'Tokenizing Text & Bag of Words') {
      setConfig(SEARCH_ENGINE_PIPELINE_CONFIG);
      return;
    }
    // AI Approval Checklist: fundamentals-of-ai lecture 9 (number 8) section responsible-ai
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 9 && sectionId === 'responsible-ai' && block.title === 'Practice Exercise') {
      setConfig(AI_APPROVAL_CHECKLIST_CONFIG);
      return;
    }
    // Fair or Unfair: fundamentals-of-ai lecture 9 (number 8) section algorithmic-bias
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 9 && sectionId === 'algorithmic-bias' && block.title === 'Detecting Bias in Training Data') {
      setConfig(FAIR_OR_UNFAIR_CONFIG);
      return;
    }
    // Predict Next Word: fundamentals-of-ai lecture 8 (number 7) section word-embeddings
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 8 && sectionId === 'word-embeddings' && block.title === 'Computing Word Similarity') {
      setConfig(PREDICT_NEXT_WORD_CONFIG);
      return;
    }
    // Neuron Calculator: fundamentals-of-ai lecture 6 (number 6) section neurons-architecture
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 7 && sectionId === 'neurons-architecture' && block.title === 'Computing a Neuron Output') {
      setConfig(NEURON_CALCULATOR_CONFIG);
      return;
    }
    // Build the Perfect Smoothie: inline config for fundamentals-of-ai lecture 7 (number 6) section activation-functions
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 7 && sectionId === 'activation-functions') {
      setConfig(SMOOTHIE_FORWARD_PASS_CONFIG);
      return;
    }
    // Study Day Planner: fundamentals-of-ai lecture 4 section what-is-optimization
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 5 && sectionId === 'what-is-optimization' && block.title === 'Organize Your Study Day') {
      setConfig(STUDY_DAY_PLANNER_CONFIG);
      return;
    }
    // Factory Planner: fundamentals-of-ai lecture 4 section linear-programming
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 5 && sectionId === 'linear-programming' && block.title === 'Factory Production Planner') {
      setConfig(FACTORY_PLANNER_CONFIG);
      return;
    }
    // Match the Clustering Algorithm: inline config for fundamentals-of-ai lecture 5 section unsupervised-learning
    if (courseSlug === 'fundamentals-of-ai' && lectureNumber === 6 && sectionId === 'unsupervised-learning') {
      setConfig(CLUSTERING_MATCH_CONFIG);
      return;
    }
    async function loadConfig() {
      try {
        const url = sectionId
          ? `/practice-exercises/config/${courseSlug}/${lectureNumber}?sectionId=${encodeURIComponent(sectionId)}`
          : `/practice-exercises/config/${courseSlug}/${lectureNumber}`;
        const data = await authFetch<{ exercise: PracticeExerciseConfig | null }>(url);
        setConfig(data.exercise ?? null);
      } catch {
        setConfig(null);
      }
    }
    loadConfig();
  }, [courseSlug, lectureNumber, sectionId, block.title]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);
    onAttempt?.();
    try {
      const data = await authFetch<{ generatedOutput: string }>('/practice-exercises/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: `${courseSlug}_${lectureNumber}`,
          prompt: prompt.trim(),
          exerciseType: 'ai-practice',
          exerciseTitle: block.title,
          exerciseDescription: block.instructions,
          systemInstruction: config
            ? config.systemInstruction
            : `Answer the student's question about ${block.title}. Be direct and concise - 2-4 sentences max. No paragraphs.`,
        }),
      });
      setResponse(data.generatedOutput);
    } catch {
      setError('AI generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleComplete = () => {
    setDone(true);
    onComplete?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };



  const isDragDrop = config?.type === 'drag_drop' && config?.dragDropConfig;
  const isHierarchyExpand = config?.type === 'hierarchy_expand' && config?.hierarchyExpandConfig;
  const isAIConversation = config?.type === 'ai_conversation' && config?.aiConversationConfig;
  const isPathBuilder = config?.type === 'path_builder' && config?.pathBuilderConfig;
  const isBFSDFS = config?.type === 'bfs_dfs' && config?.bfsdfsConfig;
  const isInvestigation = config?.type === 'investigation' && config?.investigationConfig;
  const isSearchProblemBuilder = config?.type === 'search_problem_builder' && config?.searchProblemBuilderConfig;
  const isBFSDFSGame = config?.type === 'bfs_dfs_game' && config?.bfsdfsGameConfig;
  const isWarehouseAIGame = config?.type === 'warehouse_ai_game' && config?.warehouseAIGameConfig;
  const isPropLogicGame = config?.type === 'prop_logic_game' && config?.propLogicGameConfig;
  const isKBGame = config?.type === 'kb_game' && config?.kbGameConfig;
  const isInferenceGame = config?.type === 'inference_game' && config?.inferenceGameConfig;
  const isConfidenceChallenge = config?.type === 'confidence_challenge' && config?.confidenceChallengeConfig;
  const isCaseFile = config?.type === 'case_file_investigation' && config?.caseFileInvestigationConfig;
  const isDecisionPipeline = config?.type === 'decision_pipeline' && config?.decisionPipelineConfig;
  const isHillClimb = config?.type === 'hill_climb' && config?.hillClimbConfig;
  const isPizzaOptimization = config?.type === 'pizza_optimization' && config?.pizzaOptimizationConfig;
  const isLostAndFound = config?.type === 'lost_and_found' && config?.lostAndFoundConfig;
  const isMLWorkflow = config?.type === 'ml_workflow' && config?.mlWorkflowConfig;
  const isFaceBuilder = config?.type === 'face_builder' && config?.faceBuilderConfig;
  const isNeuralNetworkBuilder = config?.type === 'neural_network_builder' && config?.neuralNetworkConfig;
  const isSearchEnginePipeline = config?.type === 'search_engine_pipeline' && config?.searchEnginePipelineConfig;
  const isPredictNextWord = config?.type === 'predict_next_word' && config?.predictNextWordConfig;
  const isFairOrUnfair = config?.type === 'fair_or_unfair' && config?.fairOrUnfairConfig;
  const isAIApprovalChecklist = config?.type === 'ai_approval_checklist' && config?.aiApprovalChecklistConfig;
  const isNeuronCalculator = config?.type === 'neuron_calculator' && config?.neuronCalculatorConfig;
  const isStudyDayPlanner = config?.type === 'study_day_planner' && config?.studyDayPlannerConfig;
  const isFactoryPlanner = config?.type === 'factory_planner';
  const isSmoothieForwardPass = config?.type === 'smoothie_forward_pass' && config?.smoothieForwardPassConfig;
  const isClusteringMatch = config?.type === 'clustering_match' && config?.clusteringMatchConfig;

  // Fallback: render code-based practice when no interactive config exists
  if (!config) {
    if (!block.starterCode) return null;
    if (!open) {
      return (
        <div className="ai-card-surface rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)]/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-[var(--brand-primary)] uppercase tracking-wider mb-1">Practice Exercise</p>
              <p className="text-sm font-medium text-[var(--text-primary)] mb-1">{block.title}</p>
              <button
                onClick={() => setOpen(true)}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white px-4 py-2 rounded-lg bg-[var(--brand-primary)]/80 hover:bg-[var(--brand-primary)] hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-[280ms]"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Open Editor
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="ai-card-surface rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs font-semibold text-[var(--brand-primary)] uppercase tracking-wider">Practice Exercise</p>
          <button onClick={() => setOpen(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Instructions</p>
            <p className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(block.instructions) }} />
          </div>
          <CodeEditor
            initialCode={block.starterCode}
            language="python"
            height="200px"
            solution={block.solution}
            onRun={(code) => { setLastCode(code); onAttempt?.(); }}
            onSubmit={(code) => { setLastCode(code); onAttempt?.(); onComplete?.(); }}
            showResetButton
            onReset={() => setLastCode('')}
          />
          {block.hint && (
            <div className="p-3 rounded-xl bg-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/20">
              <p className="text-xs font-semibold text-[var(--brand-primary)] uppercase tracking-wider mb-1">Hint</p>
              <p className="text-sm text-[var(--text-secondary)]">{block.hint}</p>
            </div>
          )}
          {block.solution && (
            <div>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-xs font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-primary-dark)] transition-colors"
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
              {showSolution && (
                <pre className="mt-2 p-3 rounded-xl bg-slate-900 text-green-400 text-sm font-mono overflow-x-auto">{block.solution}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // All exercises show a "Start Practice" gate first (including drag-drop)
  if (!open) {
    return (
      <div className="ai-card-surface rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)]/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[var(--brand-primary)] uppercase tracking-wider mb-1">
              {isHierarchyExpand ? 'Interactive Discovery' : isDragDrop ? 'Drag & Drop Exercise' : isAIConversation ? 'AI Conversation Exercise' : isPathBuilder ? 'Path Builder Exercise' : isBFSDFS ? 'BFS & DFS Exploration' : isInvestigation ? 'AI Detective Investigation' : isSearchProblemBuilder ? 'Build the Search Problem' : isBFSDFSGame ? 'Treasure Hunt Expedition' : isWarehouseAIGame ? 'Amazon Warehouse AI' : isPropLogicGame ? 'Security Logic Exercise' : isKBGame ? 'Knowledge Base Builder' : isInferenceGame ? 'Inference Engine' : isConfidenceChallenge ? 'Confidence Challenge' : isCaseFile ? 'Case File Investigation' : isDecisionPipeline ? 'Decision Pipeline' : isHillClimb ? 'Hill Climbing Exercise' : isPizzaOptimization ? 'Optimization in Action' : isLostAndFound ? 'Lost & Found Sorting' : isMLWorkflow ? 'Build the ML Pipeline' : isFaceBuilder ? 'Build a Face' : isNeuralNetworkBuilder ? 'Neural Network Builder' : isSearchEnginePipeline ? 'Inside a Search Engine' : isPredictNextWord ? 'Predict the Next Word' : isFairOrUnfair ? 'Fair or Unfair?' : isAIApprovalChecklist ? 'AI Approval Checklist' : isSmoothieForwardPass ? 'Forward Pass Exercise' : isClusteringMatch ? 'Clustering Algorithm Match' : 'Practice Exercise'}
            </p>
            <p className="text-sm font-medium text-slate-200 mb-1">{config?.title || block.title}</p>
            <button
              onClick={() => setOpen(true)}
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white px-4 py-2 rounded-lg bg-[var(--brand-primary)]/80 hover:bg-[var(--brand-primary)] hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-[280ms]"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Start Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Hierarchy expand exercises render inline
  if (config && isHierarchyExpand) {
    return (
      <ExpandUniverse
        config={config.hierarchyExpandConfig!}
        learningGoal={config.learningGoal}
        challenge={config.challenge}
        promptHint={config.promptHint}
        onComplete={() => { setOpen(false); onComplete?.(); }}
      />
    );
  }

  // Drag-drop exercises render inline
  if (config && isDragDrop) {
    return (
      <DragDropPracticeExercise
        config={config.dragDropConfig!}
        challenge={config.challenge}
        learningGoal={config.learningGoal}
        promptHint={config.promptHint}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  // AI Conversation exercises render inline
  if (config && isAIConversation) {
    return (
      <AIConversationExercise
        config={config.aiConversationConfig!}
        title={config.title}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  // Path Builder exercises render inline
  if (config && isPathBuilder) {
    return (
      <PathBuilderExercise
        config={config.pathBuilderConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  // BFS/DFS graph traversal exercises render inline
  if (config && isBFSDFS) {
    return (
      <GraphTraversalExercise
        config={config.bfsdfsConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  // Investigation exercises render inline
  if (config && isInvestigation) {
    return (
      <InvestigationExercise
        config={config.investigationConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  // Search Problem Builder exercises render inline
  if (config && isSearchProblemBuilder) {
    return (
      <SearchProblemBuilder
        config={config.searchProblemBuilderConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  // BFS vs DFS Treasure Hunt exercises render inline
  if (config && isBFSDFSGame) {
    return (
      <BFSDFSGame
        config={config.bfsdfsGameConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  // Warehouse AI Game renders inline
  if (config && isWarehouseAIGame) {
    return (
      <WarehouseAIGame
        config={config.warehouseAIGameConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isPropLogicGame) {
    return (
      <PropLogicGame
        config={config.propLogicGameConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isKBGame) {
    return (
      <KnowledgeBaseGame
        config={config.kbGameConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isInferenceGame) {
    return (
      <InferenceGame
        config={config.inferenceGameConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isConfidenceChallenge) {
    return (
      <ConfidenceChallenge
        config={config.confidenceChallengeConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isCaseFile) {
    return (
      <CaseFileInvestigation
        config={config.caseFileInvestigationConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isDecisionPipeline) {
    return (
      <DecisionPipeline
        config={config.decisionPipelineConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isHillClimb) {
    return (
      <HillClimbExercise
        config={config.hillClimbConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isPizzaOptimization) {
    return (
      <PizzaOptimization
        config={config.pizzaOptimizationConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isLostAndFound) {
    return (
      <LostAndFoundSorting
        config={config.lostAndFoundConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isMLWorkflow) {
    return (
      <MLWorkflow
        config={config.mlWorkflowConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isNeuralNetworkBuilder) {
    return (
      <NeuralNetworkBuilder
        config={config.neuralNetworkConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isSearchEnginePipeline) {
    return (
      <SearchEnginePipeline
        config={config.searchEnginePipelineConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isPredictNextWord) {
    return (
      <PredictNextWord
        config={config.predictNextWordConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isFairOrUnfair) {
    return (
      <FairOrUnfair
        config={config.fairOrUnfairConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isAIApprovalChecklist) {
    return (
      <AIApprovalChecklist
        config={config.aiApprovalChecklistConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  if (config && isSmoothieForwardPass) {
    return (
      <SmoothieForwardPass
        config={config.smoothieForwardPassConfig!}
        onAttempt={onAttempt}
        onComplete={() => { onComplete?.(); }}
      />
    );
  }

  if (config && isClusteringMatch) {
    return (
      <ClusteringAlgorithmMatch
        config={config.clusteringMatchConfig!}
        onAttempt={onAttempt}
        onComplete={() => { onComplete?.(); }}
      />
    );
  }

  if (config && isNeuronCalculator) {
    return (
      <div className="ai-card-surface rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)]/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[var(--brand-primary)] uppercase tracking-wider mb-1">Interactive Exercise</p>
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">{config.title}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/20 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[var(--brand-primary)] uppercase tracking-wider mb-1">What You'll Do</p>
            <p className="text-sm text-slate-700 leading-relaxed">{config.challenge}</p>
          </div>
        </div>
        <NeuronCalculator
          config={config.neuronCalculatorConfig!}
          onComplete={() => { onComplete?.(); }}
        />
      </div>
    );
  }

  if (config && isStudyDayPlanner) {
    return (
      <div className="ai-card-surface rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <StudyDayPlanner />
      </div>
    );
  }

  if (config && isFactoryPlanner) {
    return (
      <div className="ai-card-surface rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <FactoryPlanner />
      </div>
    );
  }

  if (config && isFaceBuilder) {
    return (
      <FaceBuilder
        config={config.faceBuilderConfig!}
        onComplete={() => { setOpen(false); onComplete?.(); }}
        onAttempt={onAttempt}
      />
    );
  }

  return (
    <div className={`ai-card-surface rounded-2xl border overflow-hidden shadow-sm ${
      done ? 'border-green-500/20 bg-white' : 'border-slate-200 bg-white'
    }`}>
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${done ? 'text-[var(--success)]' : 'text-[var(--brand-primary)]'}`}>
            Practice Exercise {done && '— Completed'}
          </p>
          <p className="text-sm font-medium text-slate-900 mt-0.5">{config?.title || block.title}</p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-slate-300 hover:text-slate-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-5 space-y-5">
        {(
          <>
            {config && (
              <>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/20">
                  <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Target size={16} className="text-[var(--brand-primary)]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--brand-primary)] uppercase tracking-wider mb-1">What You'll Learn</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{config.learningGoal}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--brand-primary)]/[0.06] border border-[var(--brand-primary)]/10">
                  <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lightbulb size={16} className="text-[var(--brand-primary)]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--brand-primary)] uppercase tracking-wider mb-1">Your Challenge</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{config.challenge}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--brand-primary)]/[0.06] border border-[var(--brand-primary)]/10">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle size={14} className="text-[var(--brand-primary)]" />
                    <p className="text-[11px] font-semibold text-[var(--brand-primary)] uppercase tracking-wider">Prompt Hint</p>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{config.promptHint}</p>
                </div>
              </>
            )}

            <div>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question for the AI here..."
                rows={2}
                disabled={done}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-primary)]/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {!done && (
              <button
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[var(--brand-primary)]/20 hover:scale-[1.03] hover:-translate-y-0.5 duration-[280ms]"
              >
                {generating ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
                ) : (
                  <><Wand2 size={16} /> Generate with AI</>
                )}
              </button>
            )}

            {response && (
              <div>
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">AI Response</p>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
            )}

            {response && (
              <div className="space-y-4">
                {config && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ListChecks size={16} className="text-[var(--success)]" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[var(--success)] uppercase tracking-wider mb-1">Success Criteria</p>
                      <ul className="space-y-1">
                        {config.successCriteria.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="mt-0.5">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {!done && (
                  <button
                    onClick={handleComplete}
                    className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] transition-all shadow-lg shadow-[var(--brand-primary)]/20 hover:scale-[1.03] hover:-translate-y-0.5 duration-[280ms]"
                  >
                    <SendHorizonal size={16} /> Mark Complete
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function PracticeCard({ block, courseSlug, lectureNumber, sectionId, onAttempt, onComplete }: PracticeCardProps) {
  if (courseSlug === 'fundamentals-of-ai') {
    return <AIPracticeCard block={block} courseSlug={courseSlug} lectureNumber={lectureNumber} sectionId={sectionId} onAttempt={onAttempt} onComplete={onComplete} />;
  }

  const saveKey = `${SAVE_PREFIX}${lectureNumber}:${block.title}`;
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [passed, setPassed] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [toast, setToast] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [lastCode, setLastCode] = useState('');

  const [submissionResult, setSubmissionResult] = useState<{ passed: boolean; expected: string; actual: string } | null>(null);

  // BharatCode Socratic Diagnostician state
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null);
  const [currentHintLevel, setCurrentHintLevel] = useState(1);

  const [savedCode, setSavedCode] = useState<string | null>(null);
  useEffect(() => {
    async function loadDraft() {
      try {
        const data = await authFetch<{ code?: string }>(`/drafts/${encodeURIComponent(block.title)}?type=practice`);
        if (data && data.code) setSavedCode(data.code);
      } catch (err) {
        console.error('Failed to load practice draft', err);
      }
    }
    loadDraft();
  }, [block.title]);

  const saveCode = useCallback((code: string) => {
    authFetch('/drafts', {
      method: 'POST',
      body: JSON.stringify({
        lectureId: block.title,
        type: 'practice',
        code
      })
    })
    .then(() => {
      localStorage.removeItem(saveKey);
    })
    .catch(err => console.error('Failed to save practice draft', err));
  }, [block.title, saveKey]);

  const handleRun = (code: string, _output: string, _error: string | null) => {
    onAttempt?.();
    setAttempts(a => a + 1);
    setShowHint(true);
    setHintLevel(a => Math.min(a + 1, 3));
    setLastCode(code);
    saveCode(code);
  };

  const handleSubmit = (_code: string, output: string, error: string | null, dynamicExpected?: string) => {
    onAttempt?.();
    setAttempts(a => a + 1);
    // Track the submitted code so diagnosis always references the latest attempt
    setLastCode(_code);
    // Clear any previous diagnosis on each new submission
    setDiagnosis(null);
    setDiagnosisError(null);
    const expected = dynamicExpected ?? block.expectedOutput;
    let passed = false;
    if (!error && expected && output !== null) {
      passed = output.trim() === expected.trim();
      setSubmissionResult({ passed, expected, actual: output });
    }
    if (passed) {
      setPassed(true);
      onComplete?.();
      // Record successful submission for hint outcome tracking
      authFetch('/practice-exercises/record-submission', {
        method: 'POST',
        body: JSON.stringify({
          problemId: `practice:${block.title}`,
          passed: true,
        }),
      }).catch(err => console.error('Failed to record submission:', err));
    }
    saveCode(_code);
    setToast(true);
  };

  // ── BharatCode Socratic Diagnostician ───────────────────────────────────
  const handleDiagnose = async (hintLevel: number = 1) => {
    if (!submissionResult || submissionResult.passed) return;
    setDiagnosisLoading(true);
    setDiagnosis(null);
    setDiagnosisError(null);
    try {
      // Map the single PracticeCard submissionResult into the failingTests array
      // expected by POST /api/practice-exercises/diagnose
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35_000); // 35s frontend timeout (slightly longer than backend 30s)

      const result = await authFetch<DiagnosisResult>('/practice-exercises/diagnose', {
        method: 'POST',
        body: JSON.stringify({
          problemId: `practice:${block.title}`,
          problemTitle: block.title,
          problemDescription: block.instructions,
          studentCode: lastCode,
          failingTests: [{
            label: 'Output Check',
            expected: submissionResult.expected,
            actual: submissionResult.actual,
          }],
          hintLevel,
        }),
      });

      clearTimeout(timeoutId);

      if (result.success) {
        setDiagnosis(result);
        setCurrentHintLevel(hintLevel);
      } else {
        const errorType = result.errorType === 'timeout' ? '(timeout)' : result.errorType ? `(${result.errorType})` : '';
        setDiagnosisError(`${result.error ?? 'The AI tutor returned an unexpected response.'} ${errorType}`.trim());
      }
    } catch (err) {
      console.error('[BharatCode] Diagnosis failed:', err);
      setDiagnosisError('Could not reach the AI tutor right now. Please try again.');
    } finally {
      setDiagnosisLoading(false);
    }
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(false), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleReset = () => {
    setSavedCode(null);
    saveCode('');
    try { localStorage.removeItem(saveKey); } catch {}
    setAttempts(0);
    setPassed(false);
    setShowHint(false);
    setSubmissionResult(null);
    setHintLevel(0);
    setShowSolution(false);
    setLastCode('');
    setDiagnosis(null);
    setDiagnosisError(null);
    setCurrentHintLevel(1);
  };

  if (!open) {
    return (
      <div className="ai-card-surface rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)]/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[var(--brand-primary)] uppercase tracking-wider mb-1">Practice Exercise</p>
            <p className="text-sm font-medium text-slate-900 mb-1">{block.title}</p>
            <p className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(block.instructions) }} />
            <button
              onClick={() => setOpen(true)}
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white px-4 py-2 rounded-lg bg-[var(--brand-primary)]/80 hover:bg-[var(--brand-primary)] hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-[280ms]"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Open Editor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ai-card-surface rounded-2xl border overflow-hidden shadow-sm ${
      passed ? 'border-green-500/20 bg-white' : 'border-slate-200 bg-white'
    }`}>
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-lg">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-slate-700">✓ Submitted</span>
          </div>
        </div>
      )}

      <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${passed ? 'text-[var(--success)]' : 'text-[var(--brand-primary)]'}`}>
            Practice Exercise {passed && '— Completed'}
          </p>
          <p className="text-sm font-medium text-slate-900 mt-0.5">{block.title}</p>
        </div>
        <div className="flex items-center gap-2">
          {attempts > 0 && (
            <span className="text-[10px] text-slate-300">Attempts: {attempts}</span>
          )}
          <button
            onClick={() => setOpen(false)}
          className="text-slate-300 hover:text-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Instructions</p>
          <p className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(block.instructions) }} />
        </div>

        {block.expectedOutput && !scanForInput(block.solution).hasInput && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Expected Output</p>
            <pre className="text-sm text-[var(--success)] font-mono" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>{block.expectedOutput}</pre>
          </div>
        )}

        <CodeEditor
          initialCode={savedCode ?? block.starterCode}
          language="python"
          height="200px"
          showSaveButton
          showSubmitButton
          expectedOutput={block.expectedOutput}
          solution={block.solution}
          onRun={handleRun}
          onSubmit={handleSubmit}
          onSave={saveCode}
          showResetButton
          onReset={handleReset}
        />

        {submissionResult && (
          <div className={`rounded-xl border p-4 ${
            submissionResult.passed
              ? 'border-green-500/30 bg-green-50'
              : 'border-red-500/30 bg-red-50'
          }`}>
            {submissionResult.passed ? (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-[var(--success)]">✓ Correct Output</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm font-semibold text-red-700">Output Mismatch</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-1">Expected</p>
                    <pre className="text-sm font-mono text-[var(--success)] whitespace-pre-wrap">{submissionResult.expected}</pre>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-1">Your Output</p>
                    <pre className="text-sm font-mono text-red-600 whitespace-pre-wrap">{submissionResult.actual}</pre>
                  </div>
                </div>
                {generateHint(submissionResult.expected, submissionResult.actual) && (
                  <div className="p-3 rounded-lg bg-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/20">
                    <p className="text-[10px] font-semibold text-[var(--brand-primary)] uppercase tracking-wider mb-1">Hint</p>
                    <p className="text-sm text-[var(--text-secondary)]">{generateHint(submissionResult.expected, submissionResult.actual)}</p>
                  </div>
                )}

                {/* ── BharatCode Socratic Diagnostician ── */}
                <div className="space-y-2 pt-1">
                  {/* Ask button — only shown when no active request and no result yet */}
                  {!diagnosisLoading && !diagnosis && (
                    <button
                      id="bharatcode-diagnose-practice"
                      onClick={() => handleDiagnose(1)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-violet-500/30 bg-violet-900/15 hover:bg-violet-900/30 text-xs font-semibold text-violet-300 hover:text-violet-200 transition-all duration-200 group"
                    >
                      <svg className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Ask BharatCode AI — Get a Hint
                    </button>
                  )}

                  {/* Loading spinner */}
                  {diagnosisLoading && (
                    <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-violet-500/20 bg-violet-900/10">
                      <svg className="w-4 h-4 text-violet-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span className="text-xs text-violet-300 font-medium">Analysing your code with BharatCode AI...</span>
                    </div>
                  )}

                  {/* Error state */}
                  {diagnosisError && !diagnosisLoading && (
                    <div className="p-3 rounded-xl border border-red-700/30 bg-red-900/10 space-y-1.5">
                      <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">AI Tutor Unavailable</p>
                      <p className="text-xs text-red-300">{diagnosisError}</p>
                      <button onClick={() => handleDiagnose()} className="text-[10px] font-semibold text-violet-400 hover:text-violet-300 underline transition-colors">Try again</button>
                    </div>
                  )}

                  {/* Result drawer */}
                  {diagnosis && diagnosis.success && !diagnosisLoading && (
                    <div className="rounded-xl border border-violet-500/25 bg-violet-900/10 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-violet-500/20 bg-violet-900/20">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">BharatCode AI Diagnosis</span>
                          {diagnosis.isMockMode && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-700/60 text-slate-400 border border-slate-600/30 font-medium">DEMO</span>
                          )}
                        </div>
                        <button
                          onClick={() => { setDiagnosis(null); setDiagnosisError(null); }}
                          className="text-slate-500 hover:text-slate-300 transition-colors"
                          aria-label="Close diagnosis"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex gap-3 items-start">
                          <span className="text-base shrink-0" aria-hidden="true">🔍</span>
                          <div>
                            <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider mb-0.5">Root Cause</p>
                            <p className="text-xs text-slate-200 leading-relaxed">{diagnosis.rootCause}</p>
                          </div>
                        </div>
                        {diagnosis.evidence && (
                          <div className="flex gap-3 items-start">
                            <span className="text-base shrink-0" aria-hidden="true">📊</span>
                            <div>
                              <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider mb-0.5">Evidence</p>
                              <p className="text-xs text-slate-200 leading-relaxed">{diagnosis.evidence}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex gap-3 items-start">
                          <span className="text-base shrink-0" aria-hidden="true">📚</span>
                          <div>
                            <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider mb-0.5">Concept to Revisit</p>
                            <p className="text-xs text-slate-200 leading-relaxed">{diagnosis.conceptClue}</p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start">
                          <span className="text-base shrink-0" aria-hidden="true">❓</span>
                          <div>
                            <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider mb-0.5">Think About This</p>
                            <p className="text-xs text-violet-100 leading-relaxed font-medium italic">{diagnosis.guidingQuestion}</p>
                          </div>
                        </div>
                        {diagnosis.nextStep && (
                          <div className="flex gap-3 items-start">
                            <span className="text-base shrink-0" aria-hidden="true">🚀</span>
                            <div>
                              <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider mb-0.5">Next Step</p>
                              <p className="text-xs text-slate-200 leading-relaxed">{diagnosis.nextStep}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-violet-500/15 bg-violet-900/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleDiagnose(1)} className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors font-medium">↻ Refresh hint</button>
                          {currentHintLevel < 3 && (
                            <button
                              onClick={() => handleDiagnose(currentHintLevel + 1)}
                              disabled={diagnosisLoading}
                              className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              I still need help →
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-500 font-medium">Level {currentHintLevel}/3</span>
                          <p className="text-[9px] text-slate-500 font-medium">💡 VIDYAVERSE · Powered by BharatCode Qwen 3.8</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* ── End BharatCode Socratic Diagnostician ── */}
              </div>
            )}
          </div>
        )}

        {showHint && hintLevel > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb size={14} className="text-[var(--brand-primary)]" />
              <p className="text-xs font-semibold text-[var(--brand-primary)] uppercase tracking-wider">
                Hint {hintLevel}/{3}
              </p>
            </div>
            {hintLevel >= 1 && (
              <div className="p-3 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30">
                <p className="text-sm text-[var(--text-secondary)]">
                  {hintLevel === 1
                    ? (() => {
                        const progHint = generateProgressiveHint(lastCode, block.solution, block.hint, 0);
                        if (!progHint && block.hint) {
                          const sentences = block.hint.split(/(?<=[.!])\s+/);
                          return sentences[0] || block.hint;
                        }
                        return progHint || block.hint;
                      })()
                    : hintLevel === 2
                    ? block.hint
                    : generateProgressiveHint(lastCode, block.solution, block.hint, 2) || block.hint}
                </p>
              </div>
            )}
            {hintLevel >= 3 && !showSolution && (
              <button
                onClick={() => setShowSolution(true)}
                className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 px-4 py-2 rounded-lg bg-emerald-900/30 border border-emerald-700/40 hover:bg-emerald-900/50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Show Solution
              </button>
            )}
            {showSolution && (
              <div className="p-3 rounded-xl bg-emerald-900/20 border border-emerald-700/30">
                <p className="text-xs font-semibold text-emerald-400 mb-1">Solution</p>
                <pre className="text-sm text-emerald-300 font-mono whitespace-pre-wrap">{block.solution}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function generateHint(expected: string, actual: string): string {
  const exp = expected.trimEnd();
  const act = actual.trimEnd();

  if (exp === act) return '';

  // Check for whitespace differences
  const expNorm = exp.replace(/\s+/g, ' ').trim();
  const actNorm = act.replace(/\s+/g, ' ').trim();
  if (expNorm === actNorm && exp !== act) {
    return 'Check your spacing and line breaks — the text matches but whitespace differs.';
  }

  // Check for line count difference
  const expLines = exp.split('\n');
  const actLines = act.split('\n');
  if (expLines.length !== actLines.length) {
    const diff = Math.abs(expLines.length - actLines.length);
    const more = actLines.length > expLines.length;
    return `Expected ${expLines.length} line${expLines.length === 1 ? '' : 's'} but got ${actLines.length}. You have ${more ? `${diff} extra line${diff === 1 ? '' : 's'}` : `${diff} fewer line${diff === 1 ? '' : 's'}`}.`;
  }

  // Find first differing character
  const maxLen = Math.max(exp.length, act.length);
  for (let i = 0; i < maxLen; i++) {
    if (exp[i] !== act[i]) {
      const expChar = exp[i] ?? '(end)';
      const actChar = act[i] ?? '(end)';
      const desc: Record<string, string> = {
        ' ': 'space',
        '\n': 'newline',
        ',': 'comma',
        '.': 'period',
        '!': 'exclamation mark',
        "'": 'single quote',
        '"': 'double quote',
        '\t': 'tab',
      };
      const expDesc = desc[expChar] ?? `"${expChar}"`;
      const actDesc = desc[actChar] ?? `"${actChar}"`;
      return `Character ${i + 1} differs: expected ${expDesc} but found ${actDesc}.`;
    }
  }

  return '';
}
