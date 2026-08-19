import type { CaseInput } from "../types";
import { apiRequest } from "./client";
import type {
  CaseListResponseDto,
  CaseResponseDto,
  CreateCaseRequestDto,
  DDxDriverPatientPayloadDto,
  PatientInputDto,
  UpdateCaseRequestDto,
} from "./types";

export interface CasesApiPaths {
  collection: string;
  detail: (caseId: string) => string;
}

export interface CasesApi {
  list: () => Promise<CaseListResponseDto>;
  get: (caseId: string) => Promise<CaseResponseDto>;
  create: (request: CreateCaseRequestDto) => Promise<CaseResponseDto>;
  update: (caseId: string, request: UpdateCaseRequestDto) => Promise<CaseResponseDto>;
}

function optionalText(value: string) {
  const normalized = value.trim();
  return normalized === "" ? undefined : normalized;
}

function labeledBlock(label: string, value: string | undefined) {
  return value ? `${label}: ${value}` : null;
}

export function mapCaseInputToPatientInputDto(input: CaseInput): PatientInputDto {
  const parsedAge = input.age.trim() === "" ? undefined : Number(input.age);

  return {
    patient_id: input.patientId.trim(),
    age: parsedAge !== undefined && Number.isFinite(parsedAge) ? parsedAge : undefined,
    sex: input.sex || undefined,
    chief_complaint: input.chiefComplaint.trim(),
    initial_information: input.initialInformation.trim(),
    medical_history: optionalText(input.medicalHistory),
    medications: optionalText(input.medications),
    known_conditions: optionalText(input.knownConditions),
    risk_factors: optionalText(input.riskFactors),
  };
}

/**
 * Maps product-level structured patient data into the fields accepted by
 * ddxdriver.utils.Patient. Evaluation-only ground-truth fields are never added.
 */
export function mapPatientInputToDDxDriverPayload(
  patient: PatientInputDto
): DDxDriverPatientPayloadDto {
  const initialInformation = [
    labeledBlock("Age", patient.age?.toString()),
    labeledBlock("Sex", patient.sex),
    labeledBlock("Chief complaint", patient.chief_complaint),
    labeledBlock("Initial information", patient.initial_information),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const patientProfile = [
    labeledBlock("Medical history", patient.medical_history),
    labeledBlock("Current medications", patient.medications),
    labeledBlock("Known conditions", patient.known_conditions),
    labeledBlock("Relevant risk factors", patient.risk_factors),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return {
    patient_id: patient.patient_id,
    patient_initial_info: initialInformation,
    patient_profile: patientProfile,
  };
}

export function mapCaseInputToDDxDriverPayload(
  input: CaseInput
): DDxDriverPatientPayloadDto {
  return mapPatientInputToDDxDriverPayload(mapCaseInputToPatientInputDto(input));
}

export function createCasesApi(paths: CasesApiPaths): CasesApi {
  return {
    list: () => apiRequest<CaseListResponseDto>(paths.collection),

    get: (caseId) => apiRequest<CaseResponseDto>(paths.detail(caseId)),

    create: (request) =>
      apiRequest<CaseResponseDto>(paths.collection, {
        method: "POST",
        body: request,
      }),

    update: (caseId, request) =>
      apiRequest<CaseResponseDto>(paths.detail(caseId), {
        method: "PUT",
        body: request,
      }),
  };
}
