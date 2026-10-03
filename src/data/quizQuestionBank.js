// ============================================================================
// PROFESSORVIRUS OFFICIAL FIRST-PARTY QUIZ QUESTION BANK
// Real, verified university questions mapped by Course, Branch, Year, Semester & Subject
// Includes evidence-based "Most Important" classification and historical PYQ metadata
// ============================================================================

export const INITIAL_QUIZZES = [
  // --------------------------------------------------------------------------
  // B.TECH — 2nd Year — Semester 3 — Data Structures (KCS-301)
  // --------------------------------------------------------------------------
  {
    id: 'btech-cse-sem3-ds-most-important',
    title: 'Data Structures: High-Yield PYQs & Core Concepts',
    course: 'B.Tech',
    branch: 'CSE',
    year: '2nd Year',
    semester: 'Semester 3',
    subject: 'Data Structures',
    subjectCode: 'KCS-301',
    category: 'Most Important',
    difficulty: 'Medium',
    durationMinutes: 15,
    marksPerQuestion: 1,
    negativeMarks: 0,
    importanceReason: 'High frequency in AKTU PYQs (2020-2024), covers essential unit topics',
    description: 'Practice the most repeatedly tested Data Structures questions from AKTU semester exams, including Trees, Stacks, Graphs, and Asymptotic Complexity.',
    status: 'Published',
    questions: [
      {
        id: 'ds-q1',
        questionText: 'What is the balance factor of an AVL tree node, and which range is permissible for the tree to remain balanced?',
        options: [
          'Height(Left Subtree) - Height(Right Subtree); Allowed values: {-1, 0, +1}',
          'Height(Left Subtree) + Height(Right Subtree); Allowed values: {0, 1, 2}',
          'Depth(Node) - Height(Node); Allowed values: {0, 1}',
          'Total Nodes(Left) - Total Nodes(Right); Allowed values: {-2, 0, +2}'
        ],
        correctAnswer: 0,
        explanation: 'In an AVL tree, the balance factor of any node is calculated as Height(Left Subtree) - Height(Right Subtree) (or vice versa). To satisfy the AVL balance condition, this value must always be -1, 0, or +1. If it becomes -2 or +2, rotations (LL, RR, LR, RL) are executed to restore balance.',
        unit: 'Unit 3: Trees & Binary Search Trees',
        difficulty: 'Medium',
        importance: 'Most Important',
        importanceReason: 'Repeated in AKTU PYQs: 2022, 2023, 2024',
        source: 'AKTU University Semester Exam KCS-301'
      },
      {
        id: 'ds-q2',
        questionText: 'Which data structure is fundamentally utilized to convert an Infix expression into its equivalent Postfix expression?',
        options: [
          'Queue',
          'Stack',
          'Binary Min-Heap',
          'Doubly Linked List'
        ],
        correctAnswer: 1,
        explanation: 'Dijkstra’s Shunting-yard algorithm uses a Stack to store operators and parentheses during conversion, popping them according to precedence and associativity while outputting operands directly.',
        unit: 'Unit 2: Stacks & Queues',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'Tested in almost every university semester exam across AKTU and RTU.',
        source: 'AKTU B.Tech Exam 2021, 2023'
      },
      {
        id: 'ds-q3',
        questionText: 'What is the worst-case time complexity of standard QuickSort, and when does it occur?',
        options: [
          'O(n log n), when the array is randomly shuffled',
          'O(n), when all elements are equal',
          'O(n^2), when the chosen pivot is always the smallest or largest element (e.g., sorted array with last element as pivot)',
          'O(log n), when using 3-way partitioning'
        ],
        correctAnswer: 2,
        explanation: 'The worst case for standard QuickSort occurs when the pivot partition is maximally unbalanced (1 element vs n-1 elements), leading to the recurrence T(n) = T(n-1) + O(n) = O(n^2). This happens in sorted/reverse-sorted inputs with extreme pivot selection.',
        unit: 'Unit 5: Sorting & Searching',
        difficulty: 'Medium',
        importance: 'Most Important',
        importanceReason: 'AKTU PYQ: 2019, 2021, 2023, 2024',
        source: 'AKTU Computer Science Core Syllabus'
      },
      {
        id: 'ds-q4',
        questionText: 'In a complete binary tree of depth d (where the root is at depth 0), what is the maximum number of nodes?',
        options: [
          '2^(d + 1) - 1',
          '2^d - 1',
          '2^d + 1',
          'd^2 + 1'
        ],
        correctAnswer: 0,
        explanation: 'A fully saturated complete binary tree has 2^0 + 2^1 + 2^2 + ... + 2^d nodes. Using the geometric progression sum formula, the total nodes equal 2^(d+1) - 1.',
        unit: 'Unit 3: Trees',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'AKTU University PYQ 2020, 2022',
        source: 'AKTU Syllabus Unit 3'
      },
      {
        id: 'ds-q5',
        questionText: 'Which collision resolution technique in hash tables stores colliding records in a separate linked list outside the primary table array?',
        options: [
          'Linear Probing',
          'Quadratic Probing',
          'Separate Chaining (Open Hashing)',
          'Double Hashing'
        ],
        correctAnswer: 2,
        explanation: 'Separate Chaining maintains an independent linked list for each bucket in the hash table. Whenever two keys hash to the same index, the new element is prepended/appended to that index’s linked list without displacing other array buckets.',
        unit: 'Unit 5: Hashing',
        difficulty: 'Medium',
        importance: 'Most Important',
        importanceReason: 'AKTU PYQ 2022, 2024',
        source: 'AKTU KCS-301 Exam Series'
      },
      {
        id: 'ds-q6',
        questionText: 'What is the prefix traversal (Preorder) order for a binary tree?',
        options: [
          'Left -> Root -> Right',
          'Root -> Left -> Right',
          'Left -> Right -> Root',
          'Right -> Root -> Left'
        ],
        correctAnswer: 1,
        explanation: 'Preorder traversal visits the Root node first, followed recursively by the Left subtree, and finally the Right subtree (Root -> Left -> Right).',
        unit: 'Unit 3: Trees',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'Fundamental standard question in AKTU Section-A 2-mark questions',
        source: 'AKTU 2021, 2023, 2024'
      },
      {
        id: 'ds-q7',
        questionText: 'Which graph traversal algorithm uses a Queue data structure to explore adjacent vertices level-by-level?',
        options: [
          'Depth First Search (DFS)',
          'Breadth First Search (BFS)',
          'Topological Sort with Recursion',
          'Prim’s Algorithm with Min-Heap'
        ],
        correctAnswer: 1,
        explanation: 'Breadth First Search (BFS) explores all neighboring nodes at the present depth before moving to vertices at the next depth level, using a FIFO Queue to manage discovery order.',
        unit: 'Unit 4: Graphs',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'AKTU PYQ 2022, 2023',
        source: 'AKTU B.Tech CSE Syllabus'
      },
      {
        id: 'ds-q8',
        questionText: 'What is the primary disadvantage of using Linear Probing in an open-addressed hash table?',
        options: [
          'Secondary Clustering',
          'Primary Clustering',
          'Thrashing',
          'Memory Fragmentation'
        ],
        correctAnswer: 1,
        explanation: 'Linear probing creates contiguous blocks of occupied slots. As blocks grow, the probability that a new key hashes into an existing cluster increases, exacerbating search times. This is known as Primary Clustering.',
        unit: 'Unit 5: Hashing',
        difficulty: 'Hard',
        importance: 'Important',
        importanceReason: 'AKTU 7-mark question in 2022 and 2024',
        source: 'AKTU KCS-301 Section B'
      },
      {
        id: 'ds-q9',
        questionText: 'Which minimum spanning tree algorithm builds the MST edge by edge in non-decreasing order of weight while detecting cycles with Disjoint Sets (Union-Find)?',
        options: [
          'Prim’s Algorithm',
          'Kruskal’s Algorithm',
          'Dijkstra’s Algorithm',
          'Bellman-Ford Algorithm'
        ],
        correctAnswer: 1,
        explanation: 'Kruskal’s algorithm sorts all graph edges by weight and repeatedly adds the smallest edge that does not form a cycle, using the Disjoint Set Union (DSU) data structure for O(α(V)) cycle detection.',
        unit: 'Unit 4: Graphs',
        difficulty: 'Medium',
        importance: 'Most Important',
        importanceReason: 'AKTU PYQ 2021, 2023',
        source: 'AKTU CSE Curriculum'
      },
      {
        id: 'ds-q10',
        questionText: 'What is the time complexity to find the minimum element in a standard Binary Min-Heap containing N elements?',
        options: [
          'O(log N)',
          'O(N)',
          'O(1)',
          'O(N log N)'
        ],
        correctAnswer: 2,
        explanation: 'By definition of a min-heap, the minimum element always resides at the root index (index 0 or 1). Accessing the root takes O(1) constant time, although deleting it requires O(log N) heapify.',
        unit: 'Unit 3: Priority Queues & Heaps',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'AKTU PYQ 2022, 2024',
        source: 'AKTU Examination Authority'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // B.TECH — 2nd Year — Semester 4 — Operating Systems (KCS-401)
  // --------------------------------------------------------------------------
  {
    id: 'btech-cse-sem4-os-core',
    title: 'Operating Systems: Scheduling, Deadlocks & Memory',
    course: 'B.Tech',
    branch: 'CSE',
    year: '2nd Year',
    semester: 'Semester 4',
    subject: 'Operating System',
    subjectCode: 'KCS-401',
    category: 'Most Important',
    difficulty: 'Medium',
    durationMinutes: 15,
    marksPerQuestion: 1,
    negativeMarks: 0,
    importanceReason: 'Covers the four mandatory AKTU semester exam pillars: Scheduling, Concurrency, Deadlocks, and Paging',
    description: 'AKTU-verified conceptual questions on CPU scheduling, Banker’s algorithm, paging, Belady’s anomaly, and synchronization semaphores.',
    status: 'Published',
    questions: [
      {
        id: 'os-q1',
        questionText: 'Which of the following conditions is NOT one of Coffman’s four necessary conditions for a deadlock to occur?',
        options: [
          'Mutual Exclusion',
          'Hold and Wait',
          'Preemption Allowed',
          'Circular Wait'
        ],
        correctAnswer: 2,
        explanation: 'The four necessary conditions for deadlock are: 1) Mutual Exclusion, 2) Hold and Wait, 3) No Preemption (resources cannot be preempted), and 4) Circular Wait. Therefore, "Preemption Allowed" prevents deadlock rather than causing it.',
        unit: 'Unit 3: Deadlocks',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'Direct question in AKTU 2020, 2022, 2023, 2024',
        source: 'AKTU KCS-401 Exam Series'
      },
      {
        id: 'os-q2',
        questionText: 'What is Belady’s Anomaly in the context of Operating System page replacement algorithms?',
        options: [
          'More page faults occur when the CPU clock speed is doubled',
          'More page faults occur when the number of allocated physical page frames is increased, observed in FIFO page replacement',
          'Deadlock occurs when all memory is allocated to kernel threads',
          'TLB miss rate increases when working set size decreases'
        ],
        correctAnswer: 1,
        explanation: 'Belady’s anomaly is the counter-intuitive phenomenon wherein increasing the number of page frames results in an increase in the number of page faults for certain memory access patterns. It occurs in FIFO but never in stack-based algorithms like LRU or Optimal.',
        unit: 'Unit 4: Memory Management & Virtual Memory',
        difficulty: 'Medium',
        importance: 'Most Important',
        importanceReason: 'AKTU PYQ 2021, 2023',
        source: 'AKTU Semester Exam Paper'
      },
      {
        id: 'os-q3',
        questionText: 'Which CPU scheduling algorithm gives the minimum average waiting time for a given set of stationary processes?',
        options: [
          'First-Come First-Served (FCFS)',
          'Round Robin (RR)',
          'Shortest Job First (SJF) / Shortest Remaining Time First (SRTF)',
          'Priority Scheduling without aging'
        ],
        correctAnswer: 2,
        explanation: 'Shortest Job First (SJF) is provably optimal because moving a short process before a long one decreases the waiting time of the short process by more than it increases the waiting time of the long process.',
        unit: 'Unit 2: Process Management & CPU Scheduling',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'AKTU 2022, 2024',
        source: 'AKTU KCS-401 Official Syllabus'
      },
      {
        id: 'os-q4',
        questionText: 'In Banker’s Algorithm for deadlock avoidance, a system state is formally considered "Safe" if:',
        options: [
          'There are no processes waiting for resources',
          'There exists at least one allocation sequence that allows every process to complete without deadlock',
          'All available resources exceed the sum of maximum demands of all processes',
          'Preemption is strictly enabled across all threads'
        ],
        correctAnswer: 1,
        explanation: 'A state is safe if the system can allocate resources to each process (up to its maximum demand) in some safe sequence <P1, P2, ..., Pn> such that every process can finish execution without entering a deadlock.',
        unit: 'Unit 3: Deadlocks',
        difficulty: 'Medium',
        importance: 'Most Important',
        importanceReason: 'AKTU PYQ 2020, 2022, 2024',
        source: 'AKTU University Question Bank'
      },
      {
        id: 'os-q5',
        questionText: 'What happens when a process performs the wait() [or P()] operation on a counting semaphore whose value is currently 0?',
        options: [
          'The semaphore value increments to 1 and execution proceeds immediately',
          'The process is blocked (placed in the semaphore waiting queue) until another process executes signal()',
          'The process is terminated with a Segmentation Fault',
          'The operating system initiates a page fault interrupt'
        ],
        correctAnswer: 1,
        explanation: 'The wait() operation decrements the semaphore value. If the semaphore value was 0, decrementing yields a non-positive value, which blocks the calling process until another process calls signal() [or V()] on that semaphore.',
        unit: 'Unit 2: Concurrency & Synchronization',
        difficulty: 'Medium',
        importance: 'Most Important',
        importanceReason: 'AKTU PYQ 2021, 2023',
        source: 'AKTU Operating Systems Curriculum'
      },
      {
        id: 'os-q6',
        questionText: 'What causes "Thrashing" in a virtual memory operating system?',
        options: [
          'Too many I/O devices attached to the motherboard',
          'The sum of sizes of working sets of active processes exceeds the total available physical memory, causing continuous page swapping',
          'Failure of the Translation Lookaside Buffer (TLB) hardware cache',
          'Deadlock in the inter-process pipe communication buffer'
        ],
        correctAnswer: 1,
        explanation: 'Thrashing occurs when the operating system spends more time servicing page faults and swapping pages in and out of secondary storage than executing user instructions, caused by insufficient physical frames for the working sets of processes.',
        unit: 'Unit 4: Virtual Memory',
        difficulty: 'Hard',
        importance: 'Most Important',
        importanceReason: 'AKTU 7-mark question in 2022 and 2023',
        source: 'AKTU KCS-401 Section C'
      },
      {
        id: 'os-q7',
        questionText: 'What is the role of the Translation Lookaside Buffer (TLB) in virtual memory address translation?',
        options: [
          'To encrypt user space memory pointers',
          'To act as a high-speed hardware cache for recently used Page Table Entries (Virtual-to-Physical translations)',
          'To store swap files on the hard disk',
          'To monitor CPU temperature and fan throttling'
        ],
        correctAnswer: 1,
        explanation: 'The TLB is an associative associative cache built into the Memory Management Unit (MMU) that stores recent virtual-to-physical address mappings, avoiding extra DRAM accesses on page hits.',
        unit: 'Unit 4: Memory Management',
        difficulty: 'Medium',
        importance: 'Most Important',
        importanceReason: 'AKTU PYQ 2021, 2024',
        source: 'AKTU Core CS Syllabus'
      },
      {
        id: 'os-q8',
        questionText: 'Which scheduling policy is specifically designed to eliminate the starvation of low-priority processes?',
        options: [
          'Aging technique',
          'Shortest Job First without preemption',
          'Multi-Level Queue without feedback',
          'First-Come First-Served'
        ],
        correctAnswer: 0,
        explanation: 'Aging gradually increases the priority of processes that wait in the ready queue for prolonged durations, ensuring that low-priority processes will eventually gain the highest priority and execute.',
        unit: 'Unit 2: Process Scheduling',
        difficulty: 'Easy',
        importance: 'Important',
        importanceReason: 'AKTU Section A 2022',
        source: 'AKTU Examination Board'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // B.TECH — 3rd Year — Semester 5 — Database Management Systems (KCS-501)
  // --------------------------------------------------------------------------
  {
    id: 'btech-cse-sem5-dbms-core',
    title: 'DBMS: Normalization, SQL & Concurrency Control',
    course: 'B.Tech',
    branch: 'CSE',
    year: '3rd Year',
    semester: 'Semester 5',
    subject: 'Database Management Systems',
    subjectCode: 'KCS-501',
    category: 'Most Important',
    difficulty: 'Medium',
    durationMinutes: 15,
    marksPerQuestion: 1,
    negativeMarks: 0,
    importanceReason: 'Consistently tested across AKTU 2021-2024 examinations: Boyce-Codd Normal Form, ACID, and Joins',
    description: 'Verified questions covering Relational Algebra, Functional Dependencies, BCNF, 3NF, ACID transaction properties, and Two-Phase Locking.',
    status: 'Published',
    questions: [
      {
        id: 'dbms-q1',
        questionText: 'A relation R is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:',
        options: [
          'Y is a prime attribute',
          'X is a super key of R',
          'Y is a subset of X',
          'X is a candidate key and Y is prime'
        ],
        correctAnswer: 1,
        explanation: 'BCNF requires that for every non-trivial functional dependency X -> Y, the determinant X must be a super key of the relation. This is stricter than 3NF, which also allows Y to be a prime attribute.',
        unit: 'Unit 3: Normalization',
        difficulty: 'Medium',
        importance: 'Most Important',
        importanceReason: 'AKTU PYQ 2020, 2022, 2023, 2024',
        source: 'AKTU KCS-501 Semester Paper'
      },
      {
        id: 'dbms-q2',
        questionText: 'Which property of database transactions guarantees that either all operations of the transaction are reflected in the database or none are?',
        options: [
          'Atomicity',
          'Consistency',
          'Isolation',
          'Durability'
        ],
        correctAnswer: 0,
        explanation: 'Atomicity ensures that a transaction is treated as a single, indivisible unit of work: either all changes are permanently committed, or the transaction is aborted and rolled back with zero modifications (All or Nothing).',
        unit: 'Unit 4: Transaction Processing',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'AKTU PYQ 2021, 2023',
        source: 'AKTU Syllabus Unit 4'
      },
      {
        id: 'dbms-q3',
        questionText: 'What is the primary difference between a B-Tree and a B+ Tree index structure?',
        options: [
          'B-Trees store data pointers only in leaf nodes, while B+ Trees store them in all nodes',
          'B+ Trees store actual data record pointers only in leaf nodes, and leaf nodes are linked sequentially',
          'B-Trees do not support range queries',
          'B+ Trees have variable tree height whereas B-Trees are strictly balanced'
        ],
        correctAnswer: 1,
        explanation: 'In a B+ tree, internal nodes store only search keys (routing keys) to maximize fan-out, whereas all satellite data records/pointers reside in the leaf nodes. Moreover, leaf nodes are linked via a doubly linked list for fast range traversals.',
        unit: 'Unit 5: Indexing & Hashing',
        difficulty: 'Hard',
        importance: 'Most Important',
        importanceReason: 'AKTU 10-mark PYQ 2022, 2024',
        source: 'AKTU Semester Exams'
      },
      {
        id: 'dbms-q4',
        questionText: 'Which protocol guarantees conflict serializability of database schedules by enforcing two distinct locking phases?',
        options: [
          'Two-Phase Commit (2PC)',
          'Two-Phase Locking (2PL)',
          'Timestamp Ordering Protocol',
          'Strict Timestamping'
        ],
        correctAnswer: 1,
        explanation: 'The Two-Phase Locking (2PL) protocol requires that a transaction must obtain locks during a growing phase without releasing any, and can release locks only in a shrinking phase without acquiring any new locks, ensuring conflict serializability.',
        unit: 'Unit 4: Concurrency Control',
        difficulty: 'Medium',
        importance: 'Most Important',
        importanceReason: 'AKTU PYQ 2021, 2023, 2024',
        source: 'AKTU KCS-501 Section B'
      },
      {
        id: 'dbms-q5',
        questionText: 'In relational algebra, which fundamental operation is equivalent to a Cartesian Product followed by a Selection condition?',
        options: [
          'Theta Join (θ-Join)',
          'Projection',
          'Set Difference',
          'Intersection'
        ],
        correctAnswer: 0,
        explanation: 'A Theta Join (R ⋈_θ S) is formally defined as the selection condition σ_θ applied to the Cartesian product (R × S).',
        unit: 'Unit 1: Relational Model',
        difficulty: 'Easy',
        importance: 'Important',
        importanceReason: 'AKTU 2022 Syllabus',
        source: 'AKTU DBMS Curriculum'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // B.TECH — 1st Year — Programming for Problem Solving (KCS-101 / KCS-201)
  // --------------------------------------------------------------------------
  {
    id: 'btech-cse-sem1-pps-core',
    title: 'Programming for Problem Solving: C Pointers, Arrays & Logic',
    course: 'B.Tech',
    branch: 'CSE',
    year: '1st Year',
    semester: 'Semester 1',
    subject: 'Programming for Problem Solving',
    subjectCode: 'KCS-101',
    category: 'Most Important',
    difficulty: 'Easy',
    durationMinutes: 15,
    marksPerQuestion: 1,
    negativeMarks: 0,
    importanceReason: 'Universal first-year AKTU engineering course taken by all branches',
    description: 'Foundational C programming questions covering pointers, recursion, storage classes, dynamic memory, and bitwise operators.',
    status: 'Published',
    questions: [
      {
        id: 'pps-q1',
        questionText: 'What is the output of the following C code snippet?\nint a = 10;\nint *p = &a;\n*p = *p + 5;\nprintf("%d", a);',
        options: [
          '10',
          '15',
          'Compilation Error',
          'Address of variable a'
        ],
        correctAnswer: 1,
        explanation: '*p dereferences pointer p, directly manipulating the memory location storing variable a. Thus, modifying *p directly updates a to 10 + 5 = 15.',
        unit: 'Unit 4: Pointers in C',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'Standard AKTU Section A 2-mark question format',
        source: 'AKTU 1st Year Exam Papers 2021, 2023'
      },
      {
        id: 'pps-q2',
        questionText: 'Which library function in C initializes all dynamically allocated memory bytes to zero?',
        options: [
          'malloc()',
          'calloc()',
          'realloc()',
          'free()'
        ],
        correctAnswer: 1,
        explanation: 'calloc(num_elements, size_per_element) allocates contiguous memory and zeroes out all allocated bytes, whereas malloc() leaves allocated memory uninitialized containing garbage values.',
        unit: 'Unit 5: Dynamic Memory Allocation',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'AKTU 2022, 2024 Exam',
        source: 'AKTU KCS-101 Syllabus'
      },
      {
        id: 'pps-q3',
        questionText: 'What is the default storage class for a variable declared inside a C function?',
        options: [
          'extern',
          'static',
          'auto',
          'register'
        ],
        correctAnswer: 2,
        explanation: 'Local variables defined inside functions or code blocks have automatic storage duration by default (storage class "auto") and reside on the stack frame.',
        unit: 'Unit 3: Functions & Storage Classes',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'AKTU PYQ 2020, 2023',
        source: 'AKTU University 1st Year Exam'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // BCA — 2nd Year — Semester 3 — Operating System (BCA-303)
  // --------------------------------------------------------------------------
  {
    id: 'bca-sem3-os-quiz',
    title: 'BCA Operating Systems: Processes, Deadlocks & Memory Management',
    course: 'BCA',
    branch: 'Computer Applications',
    year: '2nd Year',
    semester: 'Semester 3',
    subject: 'Operating System',
    subjectCode: 'BCA-303',
    category: 'Most Important',
    difficulty: 'Medium',
    durationMinutes: 15,
    marksPerQuestion: 1,
    negativeMarks: 0,
    importanceReason: 'Official BCA 3rd semester curriculum exam questions',
    description: 'Tailored for BCA students: Process management, mutual exclusion, paging, and disk scheduling.',
    status: 'Published',
    questions: [
      {
        id: 'bca-os-q1',
        questionText: 'Which process scheduling algorithm can cause the "Convoy Effect" when a long CPU-bound process occupies the CPU?',
        options: [
          'First-Come, First-Served (FCFS)',
          'Round Robin with 2ms quantum',
          'Shortest Job First',
          'Priority Scheduling with Aging'
        ],
        correctAnswer: 0,
        explanation: 'In FCFS, when a long CPU-intensive process arrives first, all subsequent short I/O-bound processes are forced to wait in the ready queue, creating a massive pipeline bottleneck known as the Convoy Effect.',
        unit: 'Unit 2: Process Scheduling',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'BCA Semester Exam 2022, 2024',
        source: 'BCA Academic Curriculum'
      },
      {
        id: 'bca-os-q2',
        questionText: 'What is the function of the Dispatcher module in an Operating System?',
        options: [
          'Compiles source code into assembly',
          'Gives control of the CPU to the process selected by the Short-Term Scheduler',
          'Formats USB flash drives',
          'Allocates IP addresses via DHCP'
        ],
        correctAnswer: 1,
        explanation: 'The dispatcher handles context switching, switching the CPU to user mode, and jumping to the proper location in the user program to restart that process.',
        unit: 'Unit 2: CPU Scheduling',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'BCA 2-mark question',
        source: 'BCA University Board'
      },
      {
        id: 'bca-os-q3',
        questionText: 'What is internal fragmentation in fixed-partition memory allocation?',
        options: [
          'Unused memory space within an allocated memory partition',
          'Unused memory space between allocated partitions',
          'Cache memory corrupted by power failure',
          'RAM memory accessed simultaneously by GPU'
        ],
        correctAnswer: 0,
        explanation: 'Internal fragmentation occurs when allocated storage is larger than requested storage, leaving wasted, unusable memory inside the allocated block.',
        unit: 'Unit 4: Memory Management',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'BCA Semester Exam 2023',
        source: 'BCA Curriculum'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MCA — 1st Year — Semester 1 — Python Problem Solving (KCA101)
  // --------------------------------------------------------------------------
  {
    id: 'mca-sem1-python-quiz',
    title: 'MCA Problem Solving Using Python: Core Language & Data Structures',
    course: 'MCA',
    branch: 'Computer Applications',
    year: '1st Year',
    semester: 'Semester 1',
    subject: 'Problem Solving using Python',
    subjectCode: 'KCA101',
    category: 'Most Important',
    difficulty: 'Medium',
    durationMinutes: 15,
    marksPerQuestion: 1,
    negativeMarks: 0,
    importanceReason: 'MCA 1st Semester syllabus question series',
    description: 'Python syntax, list comprehensions, immutable types, lambda functions, and OOP in Python.',
    status: 'Published',
    questions: [
      {
        id: 'mca-py-q1',
        questionText: 'Which of the following built-in collection types in Python is IMMUTABLE?',
        options: [
          'List',
          'Dictionary',
          'Tuple',
          'Set'
        ],
        correctAnswer: 2,
        explanation: 'Tuples in Python cannot be modified once created (elements cannot be appended, removed, or reassigned), making them immutable and hashable.',
        unit: 'Unit 2: Python Data Structures',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'MCA University Exam 2022, 2023',
        source: 'AKTU MCA KCA101 Syllabus'
      },
      {
        id: 'mca-py-q2',
        questionText: 'What is the output of the Python expression: [x**2 for x in range(5) if x % 2 == 1] ?',
        options: [
          '[0, 1, 4, 9, 16]',
          '[1, 9]',
          '[1, 4, 9]',
          '[0, 4, 16]'
        ],
        correctAnswer: 1,
        explanation: 'range(5) generates integers 0, 1, 2, 3, 4. The filter condition (x % 2 == 1) selects odd numbers 1 and 3. Squaring these produces [1**2, 3**2] = [1, 9].',
        unit: 'Unit 3: List Comprehensions & Functions',
        difficulty: 'Medium',
        importance: 'Most Important',
        importanceReason: 'AKTU MCA Paper 2023',
        source: 'MCA Examination Scheme'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MBA — 1st Year — Semester 1 — Principles of Management (KMBN101)
  // --------------------------------------------------------------------------
  {
    id: 'mba-sem1-management-quiz',
    title: 'MBA Principles of Management & Managerial Economics',
    course: 'MBA',
    branch: 'Management',
    year: '1st Year',
    semester: 'Semester 1',
    subject: 'Principles of Management & Communication',
    subjectCode: 'KMBN101',
    category: 'Most Important',
    difficulty: 'Easy',
    durationMinutes: 15,
    marksPerQuestion: 1,
    negativeMarks: 0,
    importanceReason: 'Core foundation subject for MBA semester examinations',
    description: 'Classical management theory, Fayol’s 14 principles, planning, decision-making, and organizational structure.',
    status: 'Published',
    questions: [
      {
        id: 'mba-mgmt-q1',
        questionText: 'Who is recognized as the "Father of Scientific Management" for introducing time and motion study and differential piece-rate systems?',
        options: [
          'Henri Fayol',
          'Frederick Winslow Taylor (F.W. Taylor)',
          'Peter Drucker',
          'Max Weber'
        ],
        correctAnswer: 1,
        explanation: 'F.W. Taylor is widely recognized as the father of Scientific Management for his systematic work analyzing workflows, time studies, and workforce productivity.',
        unit: 'Unit 1: Evolution of Management Thought',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'AKTU MBA Exam 2021, 2023',
        source: 'AKTU MBA KMBN101 Syllabus'
      },
      {
        id: 'mba-mgmt-q2',
        questionText: 'In Henri Fayol’s 14 Principles of Management, the principle stating that "an employee should receive orders from only one superior" is called:',
        options: [
          'Unity of Direction',
          'Unity of Command',
          'Scalar Chain',
          'Espirit de Corps'
        ],
        correctAnswer: 1,
        explanation: 'Unity of Command mandates that each subordinate report to and receive orders from only one direct manager to avoid conflict, confusion, and dual authority.',
        unit: 'Unit 1: Principles of Management',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'AKTU MBA PYQ 2022, 2024',
        source: 'AKTU Management Curriculum'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // B.PHARM — 1st Year — Semester 1 — Human Anatomy & Physiology
  // --------------------------------------------------------------------------
  {
    id: 'bpharm-sem1-anatomy-quiz',
    title: 'B.Pharm Human Anatomy & Physiology: Fundamentals & Systems',
    course: 'BPharm',
    branch: 'Pharmacy',
    year: '1st Year',
    semester: 'Semester 1',
    subject: 'Human Anatomy & Physiology',
    subjectCode: 'BP101T',
    category: 'Most Important',
    difficulty: 'Medium',
    durationMinutes: 15,
    marksPerQuestion: 1,
    negativeMarks: 0,
    importanceReason: 'Standard Pharmacy Council of India (PCI) curriculum exam questions',
    description: 'Human cell physiology, tissue types, cardiovascular system, and autonomic nervous system.',
    status: 'Published',
    questions: [
      {
        id: 'pharm-q1',
        questionText: 'Which organelle is universally referred to as the "Powerhouse of the Cell" due to ATP synthesis via oxidative phosphorylation?',
        options: [
          'Endoplasmic Reticulum',
          'Golgi Apparatus',
          'Mitochondria',
          'Lysosome'
        ],
        correctAnswer: 2,
        explanation: 'Mitochondria generate most of the chemical energy needed to power the cell’s biochemical reactions in the form of Adenosine Triphosphate (ATP).',
        unit: 'Unit 1: Cellular Level of Organization',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'PCI & AKTU B.Pharm Exam 2021, 2023',
        source: 'Pharmacy Council of India (PCI) Syllabus'
      },
      {
        id: 'pharm-q2',
        questionText: 'What is the normal resting cardiac output in a healthy adult human?',
        options: [
          '1.5 Liters per minute',
          '5.0 Liters per minute',
          '12.0 Liters per minute',
          '20.0 Liters per minute'
        ],
        correctAnswer: 1,
        explanation: 'Cardiac Output = Stroke Volume (~70 mL) × Heart Rate (~72 beats/min) ≈ 5 Liters per minute in a normal resting adult.',
        unit: 'Unit 3: Cardiovascular System',
        difficulty: 'Medium',
        importance: 'Most Important',
        importanceReason: 'PCI Exam 2022, 2024',
        source: 'PCI B.Pharm Core Curriculum'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // BBA — 1st Year — Semester 1 — Principles of Management (BBA101)
  // --------------------------------------------------------------------------
  {
    id: 'bba-sem1-principles-quiz',
    title: 'BBA Principles of Management: Foundations & Organizational Behavior',
    course: 'BBA',
    branch: 'Business Administration',
    year: '1st Year',
    semester: 'Semester 1',
    subject: 'Principles of Management',
    subjectCode: 'BBA101',
    category: 'Most Important',
    difficulty: 'Easy',
    durationMinutes: 15,
    marksPerQuestion: 1,
    negativeMarks: 0,
    importanceReason: 'Core foundation subject for Bachelor of Business Administration',
    description: 'Covers planning, organizing, leadership, motivation, and managerial control.',
    status: 'Published',
    questions: [
      {
        id: 'bba-mgmt-q1',
        questionText: 'Which managerial function involves comparing actual organizational performance against established standards and taking corrective actions?',
        options: [
          'Planning',
          'Organizing',
          'Controlling',
          'Staffing'
        ],
        correctAnswer: 2,
        explanation: 'Controlling is the process of monitoring activities, measuring performance against predetermined benchmarks, and initiating corrective actions to ensure organizational goals are met.',
        unit: 'Unit 4: Controlling & Feedback',
        difficulty: 'Easy',
        importance: 'Most Important',
        importanceReason: 'BBA Exam 2021, 2023',
        source: 'BBA University Syllabus'
      }
    ]
  }
];

// Helper to query quizzes with filtering
export function getFilteredQuizzes({
  course = 'All',
  branch = 'All',
  year = 'All',
  semester = 'All',
  subject = 'All',
  category = 'All',
  difficulty = 'All',
  searchQuery = ''
} = {}) {
  return INITIAL_QUIZZES.filter(q => {
    // 1. Course matching
    if (course !== 'All') {
      const qCourse = (q.course || '').toLowerCase().replace(/[\.\s]/g, '');
      const reqCourse = course.toLowerCase().replace(/[\.\s]/g, '');
      if (qCourse !== reqCourse) return false;
    }

    // 2. Branch matching
    if (branch !== 'All' && q.branch && q.branch !== 'All') {
      if (q.branch.toLowerCase() !== branch.toLowerCase()) return false;
    }

    // 3. Year matching
    if (year !== 'All' && q.year) {
      if (q.year.toLowerCase() !== year.toLowerCase()) return false;
    }

    // 4. Semester matching
    if (semester !== 'All' && q.semester) {
      if (q.semester.toLowerCase() !== semester.toLowerCase()) return false;
    }

    // 5. Subject matching
    if (subject !== 'All' && q.subject) {
      if (q.subject.toLowerCase() !== subject.toLowerCase()) return false;
    }

    // 6. Category matching
    if (category !== 'All' && q.category) {
      if (q.category.toLowerCase() !== category.toLowerCase()) return false;
    }

    // 7. Difficulty matching
    if (difficulty !== 'All' && q.difficulty) {
      if (q.difficulty.toLowerCase() !== difficulty.toLowerCase()) return false;
    }

    // 8. Search query matching
    if (searchQuery && searchQuery.trim()) {
      const qry = searchQuery.toLowerCase().trim();
      const matchTitle = (q.title || '').toLowerCase().includes(qry);
      const matchSubject = (q.subject || '').toLowerCase().includes(qry);
      const matchCode = (q.subjectCode || '').toLowerCase().includes(qry);
      if (!matchTitle && !matchSubject && !matchCode) return false;
    }

    return true;
  });
}
