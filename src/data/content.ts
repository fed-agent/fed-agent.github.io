// content.ts - single source of truth for the FedAgent site.
// Faithful to the paper. User-visible copy avoids em-dashes and en-dashes by design.

export const paper = {
  name: 'FedAgent',
  title: 'Is Decentralized LLM Agent RL Robust to Heterogeneity?',
  subtitle: 'An Asymmetric Tale',
  tagline:
    'Federated RL for LLM agents is robust to task-level heterogeneity, yet provably non-robust to environment-level heterogeneity.',
};

export const links = {
  pdf: '/pdf/FedAgent.pdf',
  code: 'https://github.com/canyuchen/fedagent',
  arxiv: '', // filled once verified
};

export const authors = [
  { name: 'Canyu Chen', url: 'https://canyuchen.com/', affil: [1], equal: true },
  { name: 'Kangyu Zhu', url: 'https://scholar.google.com/citations?user=55J-zgwAAAAJ', affil: [3], equal: true },
  { name: 'Zhaorun Chen', url: 'https://billchan226.github.io/', affil: [4] },
  { name: 'Zhanhui Zhou', url: 'https://scholar.google.com/citations?user=SbACfYQAAAAJ', affil: [2] },
  { name: 'Shizhe Diao', url: 'https://shizhediao.github.io/', affil: [5] },
  { name: 'Yiping Lu', url: 'https://2prime.github.io/', affil: [1] },
  { name: 'Tian Li', url: 'https://litian96.github.io/', affil: [4] },
  { name: 'Manling Li', url: 'https://limanling.github.io/', affil: [1], equalAdvising: true },
  { name: 'Dawn Song', url: 'https://dawnsong.io/', affil: [2], equalAdvising: true },
];

export const affiliations = [
  { id: 1, name: 'Northwestern University' },
  { id: 2, name: 'UC Berkeley' },
  { id: 3, name: 'Brown University' },
  { id: 4, name: 'University of Chicago' },
  { id: 5, name: 'NVIDIA' },
];

// Verbatim abstract from the paper; key terms emphasized exactly as the paper does.
export const abstractHtml = `Training AI agents powered by Large Language Models (LLMs) typically requires centralized access to user data, raising privacy and scalability concerns. We explore <strong>FedAgent</strong> (<strong>Federated Agent Reinforcement Learning</strong>), a decentralized reinforcement learning paradigm that collaboratively trains LLM agents across distributed clients without sharing local data. The central reliability question is: <em>is FedAgent effective under uniform client distribution, and more importantly, is it robust to client heterogeneity?</em> For the former, we provide the first empirical evidence that FedAgent matches Centralized Agent Training and outperforms Local Agent Training. For the latter, we first formalize <strong>Agent Heterogeneity</strong> at two structurally distinct levels: <em>task-level</em> (what clients ask the agent to do) and <em>environment-level</em> (the dynamics in which the agent acts), anchored on the <strong>Input-Dynamics Asymmetry</strong> of task-augmented Markov Decision Processes (MDPs), referring to the architectural fact that tasks enter the policy through its input channel, while environments do not. Then, we theoretically establish an <strong>Asymmetric Robustness Mechanism</strong>: FedAgent is robust to task-level heterogeneity but non-robust to environment-level heterogeneity. We further identify three sufficient conditions under which FedAgent recovers robustness despite environment-level heterogeneity, and illustrate four possible training-curve patterns. On real-world agent benchmarks WebShop and ALFWorld, we empirically verify that FedAgent remains robust under extreme task-level heterogeneities and traces a stable-degrade-collapse spectrum under environment-level heterogeneities.`;

export const contributions = [
  {
    title: 'A two-level theory of agent heterogeneity',
    body: 'We formalize Agent Heterogeneity as task-level (preference, coverage, hardness) versus environment-level, grounded in the Input-Dynamics Asymmetry of task-augmented MDPs, and design partitions that isolate each form with a single knob.',
  },
  {
    title: 'The Asymmetric Robustness Mechanism',
    body: 'We prove FedAgent is robust to task-level heterogeneity (Theorems 1 and 1′), worst-case non-robust to environment-level heterogeneity (Theorems 2 and 2′), and recovers under three sufficient conditions, giving four distinct training-curve patterns.',
  },
  {
    title: 'Verification on real agent benchmarks',
    body: 'On WebShop and ALFWorld, FedAgent matches centralized training, stays robust under extreme task-level heterogeneity, and traces a stable to degrade to collapse spectrum under environment-level heterogeneity.',
  },
];

export const statHighlights = [
  {
    big: '76.6%',
    label: 'FedAgent on ALFWorld (7B)',
    sub: 'matches 77.1% centralized; far above the 14% to 42% local',
    tone: 'indigo',
  },
  {
    big: 'Robust',
    label: 'Task-level heterogeneity',
    sub: 'tracks the uniform baseline under extreme ω, ξ, ξ′',
    tone: 'green',
  },
  {
    big: 'Asymmetric',
    label: 'Environment-level heterogeneity',
    sub: 'a stable to degrade to collapse spectrum',
    tone: 'amber',
  },
  {
    big: 'Ω(R·H·δ)',
    label: 'Irreducible floor',
    sub: 'persists regardless of capacity, data, or compute',
    tone: 'red',
  },
];

// The Input-Dynamics Asymmetry, the conceptual spine of the paper.
export const asymmetry = {
  lead:
    'Everything follows from one architectural fact about how an agent perceives a task versus an environment.',
  fact:
    'A task τ enters the policy through its input channel, so the policy can read it and adapt. The transition kernel P does not: the policy senses the environment only through the states and rewards it produces. We call this the Input-Dynamics Asymmetry.',
  sides: [
    {
      tone: 'robust',
      kicker: 'Task is observable',
      title: 'Federating over tasks is safe',
      body: 'Because the task is an input, a single policy can serve every client’s task mixture at once. Averaging across clients simply trains on the union of their tasks, so heterogeneity in what clients ask for does not create a conflict.',
    },
    {
      tone: 'fragile',
      kicker: 'Environment is implicit',
      title: 'Federating over environments can break',
      body: 'Because the dynamics are not an input, conflicting environments force one shared policy to commit to an action that is right for some clients and wrong for others. No amount of averaging can satisfy both at once.',
    },
  ],
};

// Task-level heterogeneity: three isolated sub-types.
export const taskPartitions = [
  {
    name: 'Preference',
    question: 'What type of task?',
    knob: 'PreferencePartition(ω)',
    measure: 'Type marginal over task categories; dispersion Δ²_pref.',
    extreme: 'ω → 1 gives one category per client; ω → 0 is uniform.',
    fig: 'preference',
  },
  {
    name: 'Coverage',
    question: 'How many tasks?',
    knob: 'CoveragePartition(ξ)',
    measure: 'Per-client pool size; dispersion is the coefficient of variation.',
    extreme: 'Small ξ spreads pool sizes widely; large ξ is near-uniform.',
    fig: 'coverage',
  },
  {
    name: 'Hardness',
    question: 'How hard?',
    knob: 'HardnessPartition(ξ′)',
    measure: 'Per-client success-rate quota at a reference checkpoint; dispersion is its variance.',
    extreme: 'Small ξ′ splits easy from hard across clients; large ξ′ is near-uniform.',
    fig: 'hardness',
  },
];

// Environment-level heterogeneity: the transition kernel factors into four stages.
export const envPipeline = ['Content', 'Encoding', 'Matching', 'Rendering'];

// Ordered along the stable to collapse spectrum (GRPO severity). Pattern reconciled after fidelity check.
// Ordered along the four-stage pipeline (content, encoding, matching, rendering),
// which is also the stable to collapse spectrum. Colors match the result chart lines.
export const envVariants = [
  {
    name: 'Catalog Split',
    stage: 'Content',
    mechanism: 'Each client sees a different product subset, but the search, click, buy routine stays optimal for everyone.',
    grpo: 44,
    ppo: 59,
    pattern: 'B / C',
    color: '#2e7d32',
  },
  {
    name: 'Field-Subset Index',
    stage: 'Encoding',
    mechanism: 'Each client indexes a different subset of document fields, so the same query returns different rankings.',
    grpo: 15,
    ppo: 45,
    pattern: 'C',
    color: '#e0a93a',
  },
  {
    name: 'BM25 Reweighting',
    stage: 'Matching',
    mechanism: 'Per-client BM25 hyperparameters change which query wins, so query crafting must differ across clients.',
    grpo: 34,
    ppo: 47,
    pattern: 'C',
    color: '#3f8f7a',
  },
  {
    name: 'Lookalike Injection',
    stage: 'Content + Matching',
    mechanism: 'Decoy products fool the ranker and target one reward term, so one action helps some clients and hurts others.',
    grpo: 11,
    ppo: 40,
    pattern: 'D / C',
    color: '#e8662a',
  },
  {
    name: 'Rank Wrapper',
    stage: 'Rendering',
    mechanism: 'The result order is shuffled or inverted with no per-client signal, so nothing reveals the environment.',
    grpo: 12,
    ppo: 17,
    pattern: 'D',
    color: '#c0392b',
  },
];

export const theorems = [
  {
    tag: 'Theorem 1 / 1′',
    title: 'Task-level robustness',
    body: 'The federated objective collapses to the task-mixture expectation, and any realizable optimum is simultaneously optimal for every client. There is no client-versus-federation tradeoff at the global optimum.',
    formula:
      '\\sup_{\\theta} \\mathcal{J}_i(\\theta) - \\mathcal{J}_i(\\hat{\\theta}_{\\text{fed}}) \\le \\sqrt{\\bigl(1+\\chi^2(\\mathcal{D}_{\\tau_i}\\,\\|\\,\\bar{\\mathcal{D}}_\\tau)\\bigr)\\, R_{\\max} H\\,(\\epsilon_{\\text{approx}}+\\epsilon_{\\text{opt}})}',
    tone: 'green',
  },
  {
    tag: 'Theorem 2 / 2′',
    title: 'Environment-level non-robustness',
    body: 'There exist environment configurations for which any federated optimum leaves a strictly positive worst-client gap. That gap has an irreducible lower bound that no capacity, data, training time, or optimizer can remove.',
    formula:
      '\\Delta_{\\text{pol}} \\;\\ge\\; \\Omega\\!\\bigl(R_{\\max} H\\, \\delta\\bigr), \\qquad \\delta := \\sup_{i\\neq j,\\,(s,a)} D_{\\mathrm{TV}}\\!\\bigl(P_i, P_j\\bigr)',
    tone: 'red',
  },
];

export const conditions = [
  {
    tag: 'C1',
    title: 'Common optimal, off support',
    body: 'One shared policy is optimal in every environment, and its occupancy avoids the region where the dynamics disagree.',
  },
  {
    tag: 'C2',
    title: 'Action preserving',
    body: 'The optimal action set is identical across clients on every reachable state, even when the underlying value functions differ.',
  },
  {
    tag: 'C3',
    title: 'Self-revealing environment',
    body: 'Environment identity is inferable from the observation history, so the policy can adapt in context. This route is uniquely available to LLM agents.',
  },
];

export const conditionsNote =
  'Under C1 or C2 the worst-client gap is exactly zero; under C3 it vanishes as the in-context inference slacks vanish, for any divergence δ.';

export const patterns = [
  {
    tag: 'A',
    name: 'Stable',
    sub: 'Task-level robust',
    desc: 'The federated curve tracks the uniform baseline at every checkpoint, however aggressively task mass is split across clients.',
    trigger: 'Task-level heterogeneity (Theorem 1).',
    tone: 'green',
  },
  {
    tag: 'B',
    name: 'Recovered',
    sub: 'Environment-level robust',
    desc: 'Despite differing dynamics, one shared policy is optimal for every client, so the curve matches the single-environment baseline. For LLM agents this usually comes from in-context environment identification.',
    trigger: 'One of C1, C2, C3 holds.',
    tone: 'teal',
  },
  {
    tag: 'C',
    name: 'Degrade',
    sub: 'Stable but lower',
    desc: 'Performance settles a finite margin below the baseline while training stays stable and converges. The gap stays under the worst-case floor.',
    trigger: 'The conditions hold only approximately.',
    tone: 'amber',
  },
  {
    tag: 'D',
    name: 'Collapse',
    sub: 'Worst case',
    desc: 'Performance degrades sharply, often with oscillation or divergence across seeds, as client gradients disagree on the optimal action. The floor binds.',
    trigger: 'All of C1, C2, C3 fail.',
    tone: 'red',
  },
];

export const config = {
  federation: [
    { k: 'Clients (N)', v: '100' },
    { k: 'Tasks per client (|Xᵢ|)', v: '100' },
    { k: 'Clients per round (M)', v: '2' },
    { k: 'Local epochs per round (E)', v: '3' },
    { k: 'Communication rounds (T)', v: '70' },
    { k: 'Total local epochs (T·E)', v: '210' },
    { k: 'Trajectories per epoch', v: '64, with replacement' },
    { k: 'Aggregation', v: 'FedAvg, uniform parameter averaging' },
    { k: 'Crosses the boundary', v: 'Model parameters only, never raw data' },
  ],
  optimizers: [
    { name: 'GRPO', detail: 'group size G = 8, KL β = 0.01, entropy 0.001, low-variance KL.' },
    { name: 'PPO', detail: 'GAE λ = 1.0, clip 0.2, dual-clip 3.0, separate critic.' },
  ],
  setup: [
    { k: 'Backbones', v: 'Qwen2.5-1.5B / 3B / 7B-Instruct, Llama-3.2-3B-Instruct' },
    { k: 'Benchmarks', v: 'WebShop (up to 15 steps), ALFWorld (up to 50 steps)' },
    { k: 'Compute', v: '4 × H100 80GB, about 1,800 GPU-hours, 3 seeds' },
  ],
};

// Main backbone results. Percent success rate (ALFWorld All, WebShop Success), mean and std over 3 seeds.
export const table1 = {
  caption: 'Success rate (%) under a uniform client distribution, mean and std over 3 seeds. FedAgent matches centralized training within a few points without sharing any data, and far exceeds single-client local training.',
  optimizers: ['GRPO', 'PPO'],
  data: {
    GRPO: [
      { model: 'Qwen2.5-1.5B-Instruct', alf: { cen: '55.7', cenSd: '1.8', fed: '64.1', fedSd: '0.0' }, web: { cen: '60.4', cenSd: '2.4', fed: '62.0', fedSd: '3.9' } },
      { model: 'Qwen2.5-3B-Instruct',   alf: { cen: '68.2', cenSd: '2.4', fed: '67.2', fedSd: '1.6' }, web: { cen: '65.1', cenSd: '5.5', fed: '63.0', fedSd: '4.8' } },
      { model: 'Qwen2.5-7B-Instruct',   alf: { cen: '77.1', cenSd: '3.3', fed: '76.6', fedSd: '3.1' }, web: { cen: '71.4', cenSd: '3.3', fed: '68.8', fedSd: '3.1' } },
      { model: 'Llama-3.2-3B-Instruct', alf: { cen: '52.1', cenSd: '0.9', fed: '59.4', fedSd: '2.7' }, web: { cen: '56.8', cenSd: '8.6', fed: '57.8', fedSd: '6.2' } },
    ],
    PPO: [
      { model: 'Qwen2.5-1.5B-Instruct', alf: { cen: '58.9', cenSd: '2.4', fed: '67.2', fedSd: '1.6' }, web: { cen: '54.7', cenSd: '1.6', fed: '59.9', fedSd: '3.3' } },
      { model: 'Qwen2.5-3B-Instruct',   alf: { cen: '67.2', cenSd: '3.1', fed: '69.3', fedSd: '3.3' }, web: { cen: '61.5', cenSd: '5.5', fed: '58.9', fedSd: '4.8' } },
      { model: 'Qwen2.5-7B-Instruct',   alf: { cen: '77.6', cenSd: '0.9', fed: '78.6', fedSd: '1.8' }, web: { cen: '69.8', cenSd: '2.4', fed: '71.4', fedSd: '3.9' } },
      { model: 'Llama-3.2-3B-Instruct', alf: { cen: '53.1', cenSd: '4.1', fed: '59.9', fedSd: '4.8' }, web: { cen: '55.7', cenSd: '7.9', fed: '54.2', fedSd: '7.0' } },
    ],
  },
  localNote: 'For reference, single-client local training on Qwen2.5-7B reaches only 14.1% to 42.2% on ALFWorld, against 76.6% for FedAgent.',
};

export const bibtex = `@article{chen2026fedagent,
  title   = {Is Decentralized LLM Agent RL Robust to Heterogeneity? An Asymmetric Tale},
  author  = {Chen, Canyu and Zhu, Kangyu and Chen, Zhaorun and Zhou, Zhanhui and
             Diao, Shizhe and Lu, Yiping and Li, Tian and Li, Manling and Song, Dawn},
  journal = {arXiv preprint},
  year    = {2026},
  url     = {https://fed-agent.github.io/}
}`;

// Section ids shared by all variants (used by nav + scroll-spy).
export const sections = [
  { id: 'abstract', label: 'Abstract' },
  { id: 'asymmetry', label: 'Asymmetry' },
  { id: 'method', label: 'Method' },
  { id: 'heterogeneity', label: 'Heterogeneity' },
  { id: 'mechanism', label: 'Mechanism' },
  { id: 'results', label: 'Results' },
  { id: 'citation', label: 'Cite' },
];
