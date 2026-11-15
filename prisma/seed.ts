import { PrismaClient, UserRole, TopicStatus, ContentStatus, ProblemDifficulty } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.info('🌱 Starting AkayTheory Development Database Seed...');

  // 1. Roles
  const roles = [
    { name: 'LEARNER', description: 'Standard platform learner' },
    { name: 'CONTENT_AUTHOR', description: 'Authors drafts and lesson exercises' },
    { name: 'CONTENT_REVIEWER', description: 'Reviews content for editorial standards' },
    { name: 'CONTENT_PUBLISHER', description: 'Approves and publishes content' },
    { name: 'CONTENT_ADMINISTRATOR', description: 'Curriculum administrator' },
    { name: 'SYSTEM_ADMINISTRATOR', description: 'Platform operations and security administrator' },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: {
        name: r.name,
        description: r.description,
        permissions: ['read:content'],
      },
    });
  }

  // 2. Default Test User
  const hashedPassword = await bcrypt.hash('AkayTheory2026!Secure', 10);
  const _testUser = await prisma.user.upsert({
    where: { email: 'learner@akaytheory.dev' },
    update: {},
    create: {
      email: 'learner@akaytheory.dev',
      username: 'akay_learner',
      displayName: 'Akay Learner',
      role: UserRole.LEARNER,
      isEmailVerified: true,
      passwordHash: hashedPassword,
    },
  });

  // 3. Dual-Domain Anchor Seed (DSA + System Design Foundations)
  const dsaDomain = await prisma.domain.upsert({
    where: { slug: 'data-structures-and-algorithms' },
    update: {},
    create: {
      slug: 'data-structures-and-algorithms',
      title: 'Data Structures & Algorithms',
      description: 'Master computational efficiency, data organization, and problem-solving techniques.',
      orderIndex: 1,
      iconName: 'Binary',
    },
  });

  const _sysDesignDomain = await prisma.domain.upsert({
    where: { slug: 'system-design-foundations' },
    update: {},
    create: {
      slug: 'system-design-foundations',
      title: 'System Design Foundations',
      description: 'Learn scalable architecture, caching, load balancing, and fault tolerance.',
      orderIndex: 2,
      iconName: 'Server',
    },
  });

  // 4. Categories & Topics
  const dsaCategory = await prisma.category.upsert({
    where: { slug: 'searching-and-sorting' },
    update: {},
    create: {
      domainId: dsaDomain.id,
      slug: 'searching-and-sorting',
      title: 'Searching & Sorting',
      description: 'Foundational logarithmic and linear search techniques.',
      orderIndex: 1,
    },
  });

  const binarySearchTopic = await prisma.topic.upsert({
    where: { slug: 'binary-search' },
    update: {},
    create: {
      categoryId: dsaCategory.id,
      slug: 'binary-search',
      title: 'Binary Search Algorithm',
      description: 'Efficiently locate an item in a sorted array in O(log n) time.',
      status: TopicStatus.PUBLISHED,
      orderIndex: 1,
      estimatedMinutes: 25,
    },
  });

  const twoPointersTopic = await prisma.topic.upsert({
    where: { slug: 'two-pointers' },
    update: {},
    create: {
      categoryId: dsaCategory.id,
      slug: 'two-pointers',
      title: 'Two Pointers Technique',
      description: 'Iterate with multiple pointers to reduce nested loop complexities.',
      status: TopicStatus.PUBLISHED,
      orderIndex: 2,
      estimatedMinutes: 30,
    },
  });

  // Prerequisite dependency: Binary Search -> Two Pointers
  await prisma.topicDependency.upsert({
    where: {
      prerequisiteTopicId_dependentTopicId: {
        prerequisiteTopicId: binarySearchTopic.id,
        dependentTopicId: twoPointersTopic.id,
      },
    },
    update: {},
    create: {
      prerequisiteTopicId: binarySearchTopic.id,
      dependentTopicId: twoPointersTopic.id,
      relationshipType: 'DIRECT_PREREQUISITE',
    },
  });

  // 5. Lesson & Sections
  const binarySearchLesson = await prisma.lesson.upsert({
    where: { slug: 'binary-search-foundations' },
    update: {},
    create: {
      topicId: binarySearchTopic.id,
      slug: 'binary-search-foundations',
      title: 'Binary Search: Intuition, Invariants & Implementation',
      status: ContentStatus.PUBLISHED,
      version: 1,
      publishedAt: new Date(),
    },
  });

  // Clear existing sections for clean re-seed
  await prisma.lessonSection.deleteMany({ where: { lessonId: binarySearchLesson.id } });

  await prisma.lessonSection.createMany({
    data: [
      {
        lessonId: binarySearchLesson.id,
        sectionType: 'OVERVIEW',
        title: 'Overview & Problem Statement',
        contentMarkdown:
          'Binary search operates on the principle of divide-and-conquer. Given a sorted array, each comparison halves the remaining search space.',
        orderIndex: 1,
      },
      {
        lessonId: binarySearchLesson.id,
        sectionType: 'CORE_CONCEPT',
        title: 'Loop Invariants and Midpoint Calculation',
        contentMarkdown:
          'To avoid integer overflow in strongly typed languages, compute mid using `left + (right - left) / 2` rather than `(left + right) / 2`.',
        orderIndex: 2,
      },
      {
        lessonId: binarySearchLesson.id,
        sectionType: 'COMPLEXITY_ANALYSIS',
        title: 'Time & Space Complexity',
        contentMarkdown:
          'Time Complexity: O(log n) because the search interval is halved on every iteration.\nSpace Complexity: O(1) iterative auxiliary memory.',
        orderIndex: 3,
      },
      {
        lessonId: binarySearchLesson.id,
        sectionType: 'THINK_BEFORE_REVEAL',
        title: 'Mental Model: Off-By-One Invariants',
        contentMarkdown:
          'When left <= right, the loop terminates when left > right. If array[mid] == target, return mid immediately. Otherwise if array[mid] < target, eliminate left half by left = mid + 1.',
        orderIndex: 4,
      },
    ],
  });

  // 6. Knowledge Check Quiz Questions (DATA-ENT-020 to 021)
  await prisma.question.deleteMany({ where: { lessonId: binarySearchLesson.id } });

  await prisma.question.create({
    data: {
      lessonId: binarySearchLesson.id,
      promptMarkdown:
        'What is the time complexity of searching an element using binary search in a sorted array of size n?',
      explanation:
        'Because binary search halves the search space on each comparison, it completes in logarithmic O(log n) time.',
      orderIndex: 1,
      options: {
        create: [
          { text: 'O(log n)', isCorrect: true, orderIndex: 1 },
          { text: 'O(n)', isCorrect: false, orderIndex: 2 },
          { text: 'O(n log n)', isCorrect: false, orderIndex: 3 },
          { text: 'O(1)', isCorrect: false, orderIndex: 4 },
        ],
      },
    },
  });

  const twoPointersLesson = await prisma.lesson.upsert({
    where: { slug: 'two-pointers-foundations' },
    update: {},
    create: {
      topicId: twoPointersTopic.id,
      slug: 'two-pointers-foundations',
      title: 'Two Pointers Technique: Traversal & Partitioning',
      status: ContentStatus.PUBLISHED,
      version: 1,
      publishedAt: new Date(),
    },
  });

  await prisma.lessonSection.deleteMany({ where: { lessonId: twoPointersLesson.id } });
  await prisma.lessonSection.createMany({
    data: [
      {
        lessonId: twoPointersLesson.id,
        sectionType: 'OVERVIEW',
        title: 'Two Pointers Concept',
        contentMarkdown:
          'The two-pointer technique uses two moving index variables to traverse an iterable simultaneously, often from opposite ends.',
        orderIndex: 1,
      },
      {
        lessonId: twoPointersLesson.id,
        sectionType: 'COMPLEXITY_ANALYSIS',
        title: 'Efficiency Gains',
        contentMarkdown:
          'Time Complexity: O(n) linear scan replacing O(n^2) nested loops.\nSpace Complexity: O(1) in-place pointers.',
        orderIndex: 2,
      },
    ],
  });

  // 7. Practice Problem
  await prisma.problem.upsert({
    where: { slug: 'search-in-sorted-array' },
    update: {},
    create: {
      topicId: binarySearchTopic.id,
      slug: 'search-in-sorted-array',
      title: 'Search in Sorted Array',
      difficulty: ProblemDifficulty.EASY,
      statementMarkdown: 'Given an array of integers `nums` sorted in ascending order, and an integer `target`, return the index of `target` or -1.',
      examplesJson: [
        { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' },
      ],
      constraintsJson: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All the integers in nums are unique.'],
      hintsJson: [
        'Notice that the array is sorted. What happens when you check the middle element?',
        'If nums[mid] < target, which half can you eliminate?',
      ],
      solutionMarkdown: '```typescript\nfunction search(nums: number[], target: number): number {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n```',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
    },
  });

  // 7. Seed Roadmaps (DATA-ENT-010 to 012)
  const dsaRoadmap = await prisma.roadmap.upsert({
    where: { slug: 'dsa-fundamentals' },
    update: {},
    create: {
      slug: 'dsa-fundamentals',
      title: 'Data Structures & Algorithms Fundamentals',
      description: 'Master algorithm patterns from foundational search techniques to advanced graph traversals.',
      domainId: dsaDomain.id,
      version: 1,
      isMaster: true,
    },
  });

  // Clear existing nodes/edges for idempotent re-seed
  await prisma.roadmapEdge.deleteMany({ where: { roadmapId: dsaRoadmap.id } });
  await prisma.roadmapNode.deleteMany({ where: { roadmapId: dsaRoadmap.id } });

  const node1 = await prisma.roadmapNode.create({
    data: {
      roadmapId: dsaRoadmap.id,
      topicId: binarySearchTopic.id,
      nodeType: 'TOPIC',
      title: 'Binary Search Algorithm',
      positionX: 250,
      positionY: 80,
      orderIndex: 1,
    },
  });

  const node2 = await prisma.roadmapNode.create({
    data: {
      roadmapId: dsaRoadmap.id,
      topicId: twoPointersTopic.id,
      nodeType: 'TOPIC',
      title: 'Two Pointers Technique',
      positionX: 250,
      positionY: 240,
      orderIndex: 2,
    },
  });

  await prisma.roadmapEdge.create({
    data: {
      roadmapId: dsaRoadmap.id,
      sourceNodeId: node1.id,
      targetNodeId: node2.id,
      edgeType: 'REQUIRED',
    },
  });

  console.info('✅ AkayTheory Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
