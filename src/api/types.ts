import type { CaseStatus, PatientSex } from "../types";

export type PersistableCaseStatus = Extract<CaseStatus, "draft" | "ready">;

/**
 * Structured patient data owned by the product/API boundary.
 * This preserves the form fields required to reopen and edit a case.
 */
export interface PatientInputDto {
  patient_id: string;
  age?: number;
  sex?: PatientSex;
  chief_complaint: string;
  initial_information: string;
  medical_history?: string;
  medications?: string;
  known_conditions?: string;
  risk_factors?: string;
}

/**
 * Exact frontend representation of the patient fields accepted by
 * ddxdriver.utils.Patient for clinical execution.
 *
 * Evaluation-only gt_pathology and gt_ddx are intentionally absent.
 */
export interface DDxDriverPatientPayloadDto {
  patient_id: string;
  patient_initial_info: string;
  patient_profile: string;
}

export interface CreateCaseRequestDto {
  patient: PatientInputDto;
  status: PersistableCaseStatus;
}

export interface UpdateCaseRequestDto {
  patient: PatientInputDto;
  status: PersistableCaseStatus;
}

export interface CaseResponseDto {
  id: string;
  patient: PatientInputDto;
  status: CaseStatus;
  created_at: string;
  updated_at: string;
}

export type CaseListResponseDto = CaseResponseDto[];

export interface RunDiagnosisRequestDto {
  case_id: string;
  patient: DDxDriverPatientPayloadDto;
}

/**
 * Final diagnosis payload mirrors DDxDriver's real output fields.
 * No confidence scores or fabricated evidence metadata are represented.
 */
export interface DiagnosisResponseDto {
  pred_ddx: string[];
  ddx_rationale: string;
  dialogue_history: string;
  rag_content: string;
}
