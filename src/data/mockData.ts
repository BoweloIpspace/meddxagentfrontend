import type {
  Case,
  DifferentialEntry,
  EvidenceSource,
  HistoryQuestion,
  DiagnosticIteration,
  AgentActivity,
} from "../types";

/* ── Current differential (Iteration 3) ── */
export const currentDifferential: DifferentialEntry[] = [
  { rank: 1, diagnosis: "Community-acquired pneumonia", confidence: "High", change: { direction: "up", previousRank: 2 } },
  { rank: 2, diagnosis: "Acute bronchitis", confidence: "Moderate", change: { direction: "down", previousRank: 1 } },
  { rank: 3, diagnosis: "Pulmonary embolism", confidence: "Moderate", change: { direction: "up", previousRank: 4 } },
  { rank: 4, diagnosis: "Asthma exacerbation", confidence: "Low", change: { direction: "down", previousRank: 3 } },
  { rank: 5, diagnosis: "COPD exacerbation", confidence: "Low", change: { direction: "new" } },
];

/* ── Evidence sources ── */
export const evidenceSources: EvidenceSource[] = [
  {
    type: "PubMed",
    title: "Community-acquired pneumonia: diagnosis and management",
    snippet: "Empirical antibiotic therapy guided by local resistance patterns remains the cornerstone of CAP management. Chest X-ray consolidation with leukocytosis strongly supports the diagnosis.",
    relevance: "High",
  },
  {
    type: "PubMed",
    title: "Pulmonary embismus in emergency department presentation",
    snippet: "Wells score and D-dimer testing are recommended for risk stratification. Tachycardia with pleuritic chest pain warrants consideration even when respiratory symptoms dominate.",
    relevance: "Medium",
  },
  {
    type: "Wikipedia",
    title: "Community-acquired pneumonia",
    snippet: "Symptoms include cough, fever, breathing difficulty, and chest pain. Diagnosis is based on symptoms and chest imaging. Risk factors include COPD, diabetes, and heart failure.",
    relevance: "Medium",
  },
  {
    type: "Clinical Guideline",
    title: "BTS Guidelines for the Management of Community Acquired Pneumonia",
    snippet: "CURB-65 score recommended for severity assessment. Outpatient treatment appropriate for low-severity cases. Consider atypical pathogens in younger patients.",
    relevance: "High",
  },
];

/* ── Evidence summary ── */
export const evidenceSummary =
  "The combination of productive cough, fever (38.4°C), elevated WBC (14.2), and chest X-ray showing right lower lobe consolidation is highly consistent with community-acquired pneumonia. The CURB-65 score of 1 suggests outpatient management is appropriate. Pulmonary embolism should be excluded given the pleuritic component of chest pain.";

/* ── History questions ── */
export const historyQuestions: HistoryQuestion[] = [
  {
    question: "When did the symptoms begin?",
    response: "Approximately 5 days ago. Started with a mild cough that has progressively worsened.",
    timestamp: "09:42",
  },
  {
    question: "Have you experienced any fever or chills?",
    response: "Yes, I've had intermittent fevers. My temperature was 38.4°C this morning at the emergency department.",
    timestamp: "09:43",
  },
  {
    question: "Do you have any chest pain? If so, can you describe it?",
    response: "Yes, there's a sharp pain on the right side when I take deep breaths. It's worse with coughing.",
    timestamp: "09:44",
  },
  {
    question: "Are you producing any sputum? What color is it?",
    response: "Yes, I've been coughing up yellowish-green sputum for the past 3 days.",
    timestamp: "09:45",
  },
  {
    question: "Do you have any history of lung disease or smoking?",
    response: "I smoked occasionally in my 20s but quit 10 years ago. No prior lung disease.",
    timestamp: "09:46",
  },
];

/* ── Diagnostic iterations ── */
export const iterations: DiagnosticIteration[] = [
  {
    iteration: 1,
    timestamp: "09:42",
    differential: [
      { rank: 1, diagnosis: "Acute bronchitis", confidence: "Moderate" },
      { rank: 2, diagnosis: "Community-acquired pneumonia", confidence: "Moderate" },
      { rank: 3, diagnosis: "Asthma exacerbation", confidence: "Low" },
      { rank: 4, diagnosis: "Pulmonary embolism", confidence: "Low" },
    ],
    evidenceSummary: "Initial presentation of cough and dyspnea. Limited history available. Bronchitis is most common cause but pneumonia cannot be excluded.",
    changes: [],
  },
  {
    iteration: 2,
    timestamp: "09:46",
    differential: [
      { rank: 1, diagnosis: "Acute bronchitis", confidence: "Moderate", change: { direction: "down", previousRank: 1 } },
      { rank: 2, diagnosis: "Community-acquired pneumonia", confidence: "Moderate", change: { direction: "up", previousRank: 2 } },
      { rank: 3, diagnosis: "Asthma exacerbation", confidence: "Low", change: { direction: "down", previousRank: 3 } },
      { rank: 4, diagnosis: "Pulmonary embolism", confidence: "Moderate", change: { direction: "up", previousRank: 4 } },
    ],
    evidenceSummary: "Fever and productive sputum increase likelihood of infectious etiology. Pleuritic chest pain raises concern for PE. Chest X-ray pending.",
    changes: [
      { diagnosis: "Pulmonary embolism", direction: "up", previousRank: 4, newRank: 4 },
    ],
  },
  {
    iteration: 3,
    timestamp: "09:52",
    differential: currentDifferential,
    evidenceSummary,
    changes: [
      { diagnosis: "Community-acquired pneumonia", direction: "up", previousRank: 2, newRank: 1 },
      { diagnosis: "Acute bronchitis", direction: "down", previousRank: 1, newRank: 2 },
      { diagnosis: "Pulmonary embolism", direction: "up", previousRank: 4, newRank: 3 },
      { diagnosis: "COPD exacerbation", direction: "new", newRank: 5 },
    ],
  },
];

/* ── Activity timeline ── */
export const activities: AgentActivity[] = [
  { id: "1", timestamp: "09:41", stage: "history_taking", title: "Case initiated", description: "Patient presentation received. Beginning diagnostic process." },
  { id: "2", timestamp: "09:42", stage: "history_taking", title: "Question generated", description: "Asking about symptom onset timeline." },
  { id: "3", timestamp: "09:43", stage: "history_taking", title: "Patient information updated", description: "Onset timeline recorded: 5 days, progressive." },
  { id: "4", timestamp: "09:43", stage: "history_taking", title: "Question generated", description: "Asking about fever and chills." },
  { id: "5", timestamp: "09:44", stage: "history_taking", title: "Patient information updated", description: "Fever confirmed: 38.4°C." },
  { id: "6", timestamp: "09:44", stage: "history_taking", title: "Question generated", description: "Asking about chest pain characteristics." },
  { id: "7", timestamp: "09:45", stage: "knowledge_retrieval", title: "PubMed search executed", description: "Query: productive cough fever pleuritic chest pain differential diagnosis" },
  { id: "8", timestamp: "09:45", stage: "knowledge_retrieval", title: "Evidence synthesized", description: "3 sources reviewed. CAP and PE identified as primary considerations." },
  { id: "9", timestamp: "09:46", stage: "diagnosis_strategy", title: "Differential updated", description: "Iteration 2 complete. 4 diagnoses ranked." },
  { id: "10", timestamp: "09:47", stage: "history_taking", title: "Question generated", description: "Asking about sputum production." },
  { id: "11", timestamp: "09:48", stage: "history_taking", title: "Patient information updated", description: "Productive cough with purulent sputum confirmed." },
  { id: "12", timestamp: "09:49", stage: "knowledge_retrieval", title: "PubMed search executed", description: "Query: purulent sputum community-acquired pneumonia CURB-65" },
  { id: "13", timestamp: "09:50", stage: "knowledge_retrieval", title: "Evidence synthesized", description: "BTS guidelines retrieved. CURB-65 scoring applicable." },
  { id: "14", timestamp: "09:51", stage: "knowledge_retrieval", title: "PubMed search executed", description: "Query: pleuritic chest pain pulmonary embolism Wells score" },
  { id: "15", timestamp: "09:52", stage: "diagnosis_strategy", title: "Differential updated", description: "Iteration 3 complete. CAP promoted to rank #1. COPD added." },
];

/* ── Full active case ── */
export const activeCase: Case = {
  id: "CASE-2025-0042",
  patient: {
    id: "PT-8841",
    age: 42,
    sex: "Male",
    chiefComplaint: "Acute shortness of breath with worsening cough",
    initialInformation: "Patient presents to ED with 5-day history of progressive cough, dyspnea, and pleuritic chest pain. Temperature 38.4°C. SpO2 94% on room air.",
    medicalHistory: "No significant past medical history. Occasional smoker in 20s, quit 10 years ago.",
    medications: "None",
    knownConditions: "None",
    riskFactors: "Former smoker (social, 20s, quit 10 years ago)",
    confirmedSymptoms: [
      "Productive cough (5 days)",
      "Fever (38.4°C)",
      "Pleuritic chest pain (right-sided)",
      "Purulent sputum",
      "Dyspnea on exertion",
    ],
    newlyDiscovered: [
      "No prior lung disease",
      "No current medications",
      "Quit smoking 10 years ago",
    ],
  },
  status: "active",
  createdAt: "2025-01-15T09:41:00Z",
  updatedAt: "2025-01-15T09:52:00Z",
  currentIteration: 3,
  maxIterations: 5,
  differential: currentDifferential,
  activities,
  iterations,
  historyQuestions,
  evidence: evidenceSources,
  evidenceSummary,
};

/* ── Case history list ── */
export const caseHistory: Case[] = [
  activeCase,
  {
    id: "CASE-2025-0041",
    patient: {
      id: "PT-7723",
      age: 67,
      sex: "Female",
      chiefComplaint: "Recurrent headaches with visual disturbances",
      initialInformation: "Patient reports 3-week history of progressive headaches, worse in the morning, with intermittent visual changes.",
      confirmedSymptoms: ["Bilateral headaches", "Visual blurring", "Nausea"],
      newlyDiscovered: [],
    },
    status: "completed",
    createdAt: "2025-01-14T14:20:00Z",
    updatedAt: "2025-01-14T15:05:00Z",
    currentIteration: 4,
    maxIterations: 5,
    differential: [
      { rank: 1, diagnosis: "Idiopathic intracranial hypertension", confidence: "High" },
      { rank: 2, diagnosis: "Migraine with aura", confidence: "Moderate" },
      { rank: 3, diagnosis: "Temporal arteritis", confidence: "Low" },
    ],
    activities: [],
    iterations: [],
    historyQuestions: [],
    evidence: [],
    evidenceSummary: "Presentation consistent with raised intracranial pressure. MRI recommended to exclude space-occupying lesion.",
  },
  {
    id: "CASE-2025-0040",
    patient: {
      id: "PT-6619",
      age: 35,
      sex: "Male",
      chiefComplaint: "Abdominal pain and bloody stools",
      initialInformation: "Patient presents with 2-week history of bloody diarrhea, crampy abdominal pain, and urgency.",
      confirmedSymptoms: ["Bloody diarrhea", "Abdominal cramping", "Urgency", "Mild fever"],
      newlyDiscovered: [],
    },
    status: "completed",
    createdAt: "2025-01-13T11:10:00Z",
    updatedAt: "2025-01-13T11:55:00Z",
    currentIteration: 3,
    maxIterations: 5,
    differential: [
      { rank: 1, diagnosis: "Ulcerative colitis", confidence: "High" },
      { rank: 2, diagnosis: "Infectious colitis", confidence: "Moderate" },
      { rank: 3, diagnosis: "Crohn's disease", confidence: "Low" },
    ],
    activities: [],
    iterations: [],
    historyQuestions: [],
    evidence: [],
    evidenceSummary: "Young male with bloody diarrhea and urgency. Inflammatory bowel disease should be strongly considered. Stool cultures and colonoscopy recommended.",
  },
  {
    id: "CASE-2025-0039",
    patient: {
      id: "PT-5502",
      age: 58,
      sex: "Female",
      chiefComplaint: "Chest tightness and palpitations",
      initialInformation: "Patient reports episodic chest tightness with palpitations, occurring at rest and during mild exertion.",
      confirmedSymptoms: ["Chest tightness", "Palpitations", "Mild dyspnea"],
      newlyDiscovered: [],
    },
    status: "draft",
    createdAt: "2025-01-12T08:30:00Z",
    updatedAt: "2025-01-12T08:30:00Z",
    currentIteration: 1,
    maxIterations: 5,
    differential: [
      { rank: 1, diagnosis: "Atrial fibrillation", confidence: "Moderate" },
      { rank: 2, diagnosis: "Anxiety disorder", confidence: "Low" },
    ],
    activities: [],
    iterations: [],
    historyQuestions: [],
    evidence: [],
    evidenceSummary: "",
  },
];
