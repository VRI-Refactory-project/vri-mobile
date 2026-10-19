import { Platform } from "react-native";

import { getJson, postForm, postJson } from "./api";
import type { AuthUser } from "./auth";
import { startSession } from "./session";

// Matches apps/interpreters in vri-api.
export type VerificationStatus = "INACTIVE" | "APPROVED" | "REJECTED";
export type Specialisation = "GENERAL" | "MEDICAL" | "LEGAL";

export type CertificationDocument = {
  id: number;
  document: string;
  document_name: string;
  certificate_type: string;
  issuing_organisation: string;
  uploaded_at: string;
  rejection_reason: string;
};

export type InterpreterProfile = {
  id: number;
  full_name: string;
  email: string;
  verification_status: VerificationStatus;
  is_available: boolean;
  specialisation: Specialisation;
  certifications: CertificationDocument[];
  created_at: string;
};

/** A file chosen with expo-document-picker. `file` is only set on web. */
export type PickedFile = {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
  file?: File;
};

// The API accepts these (FileExtensionValidator on CertificationDocument.document).
export const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"];
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];
// The API sets no size limit; keep uploads reasonable for mobile data.
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

type RegistrationResponse = { access: string; refresh: string; user: AuthUser };

/** POST /api/v1/auth/register/interpreter/ (V2-003 step 1). Signs the new interpreter in. */
export async function registerInterpreter(input: {
  full_name: string;
  phone_number: string;
  email: string;
  password: string;
  specialisation?: Specialisation;
}): Promise<AuthUser> {
  const { access, refresh, user } = await postJson<RegistrationResponse>(
    "/api/v1/auth/register/interpreter/",
    input,
  );
  await startSession(access, refresh, user);
  return user;
}

/** GET /api/v1/interpreters/me/: verification status and the documents uploaded so far. */
export function getInterpreterProfile(): Promise<InterpreterProfile> {
  return getJson<InterpreterProfile>("/api/v1/interpreters/me/");
}

/**
 * POST /api/v1/interpreters/certifications/upload/ (multipart). Needs a signed-in user.
 * The API requires `document`, `certificate_type` and `issuing_organisation`.
 */
export function uploadCertification(
  file: PickedFile,
  certificateType: string,
  issuingOrganisation: string,
): Promise<CertificationDocument> {
  const form = new FormData();
  if (Platform.OS === "web" && file.file) {
    form.append("document", file.file, file.name);
  } else {
    // React Native's FormData reads a { uri, name, type } object from the device.
    form.append("document", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType ?? "application/octet-stream",
    } as unknown as Blob);
  }
  form.append("certificate_type", certificateType.trim());
  form.append("issuing_organisation", issuingOrganisation.trim());
  return postForm<CertificationDocument>(
    "/api/v1/interpreters/certifications/upload/",
    form,
  );
}
