import { apiRequest } from "./client";
import type { DiagnosisResponseDto, RunDiagnosisRequestDto } from "./types";

export interface DiagnosisApiPaths {
  run: string;
}

export interface DiagnosisApi {
  run: (request: RunDiagnosisRequestDto) => Promise<DiagnosisResponseDto>;
}

export function createDiagnosisApi(paths: DiagnosisApiPaths): DiagnosisApi {
  return {
    run: (request) =>
      apiRequest<DiagnosisResponseDto>(paths.run, {
        method: "POST",
        body: request,
      }),
  };
}
