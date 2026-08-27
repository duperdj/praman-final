// Typed client for Lane A's four API routes (HANDOFF §4). Lane B talks to the
// backend only through these — never by importing lib/engine etc.
import type { Application, Decision, SlaState, RegistrySnapshot, IncomeSource, Lang } from "@/lib/contracts";

export type ApplyInput = {
  applicant: {
    fullName: string;
    phone: string;
    aadhaarLike: string;
    samagraId: string;
    dateOfBirth: string;
    district: string;
    tehsil: string;
    addressLine: string;
  };
  statedAnnualIncome: number;
  incomeSource: IncomeSource;
  purpose: string;
  lang: Lang;
  isSamadhanEkDin?: boolean;
};

export type ApplyResult = { application: Application; decision: Decision; sla: SlaState };
export type StatusResult = ApplyResult & {
  registry: RegistrySnapshot;
  serviceType?: string;
  formData?: Record<string, string> | null;
};

export type ServiceApplyInput = {
  applicant: ApplyInput["applicant"];
  form: Record<string, string>;
  lang: Lang;
  isSamadhanEkDin?: boolean;
};

export async function applyToService(slug: string, input: ServiceApplyInput): Promise<ApplyResult> {
  const res = await fetch(`/api/services/${encodeURIComponent(slug)}/apply`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return jsonOrThrow<ApplyResult>(res);
}
export type OfficerCase = { application: Application; decision: Decision; sla: SlaState; currentOwner: string | null };
export type OfficerQueue = { count: number; queue: OfficerCase[] };

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = "";
    try {
      detail = JSON.stringify(await res.json());
    } catch {
      /* ignore */
    }
    throw new Error(`API ${res.status} ${res.statusText} ${detail}`);
  }
  return res.json() as Promise<T>;
}

export async function createApplication(input: ApplyInput): Promise<ApplyResult> {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return jsonOrThrow<ApplyResult>(res);
}

export async function getApplication(id: string): Promise<StatusResult> {
  const res = await fetch(`/api/applications/${encodeURIComponent(id)}`, { cache: "no-store" });
  return jsonOrThrow<StatusResult>(res);
}

export async function resolveApplication(
  id: string,
  corrections?: Record<string, string>,
): Promise<StatusResult & { resolved: boolean }> {
  const res = await fetch(`/api/applications/${encodeURIComponent(id)}/resolve`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ corrections: corrections ?? {} }),
  });
  return jsonOrThrow<StatusResult & { resolved: boolean }>(res);
}

export async function tickClock(body: { days?: number; reset?: boolean }): Promise<unknown> {
  const res = await fetch("/api/dev/tick", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return jsonOrThrow<unknown>(res);
}

export async function officerQueue(): Promise<OfficerQueue> {
  const res = await fetch("/api/officer/queue", { cache: "no-store" });
  return jsonOrThrow<OfficerQueue>(res);
}

export async function officerDecision(id: string, approve: boolean, note?: string): Promise<{ ok: boolean }> {
  const res = await fetch(`/api/officer/${encodeURIComponent(id)}/decision`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ approve, note }),
  });
  return jsonOrThrow<{ ok: boolean }>(res);
}

export type DashboardStats = {
  total: number;
  autoIssue: number;
  fieldVerify: number;
  needsInput: number;
  reject: number;
  running: number;
  breached: number;
  met: number;
  penaltyInr: number;
  byTehsil: { tehsil: string; count: number }[];
  autoIssueRate: number;
};

export async function getDashboard(): Promise<DashboardStats> {
  const res = await fetch("/api/dashboard", { cache: "no-store" });
  return jsonOrThrow<DashboardStats>(res);
}

export type DashboardBucket = "total" | "autoIssue" | "running" | "breached" | "penalty";
export type DashboardListItem = {
  id: string;
  name: string;
  tehsil: string;
  district: string;
  serviceType: string;
  outcome: "AUTO_ISSUE" | "FIELD_VERIFY" | "NEEDS_INPUT" | "REJECT" | null;
  slaStatus: "RUNNING" | "MET" | "BREACHED" | "CLOSED" | null;
  workingDaysElapsed: number;
  workingDaysAllowed: number;
  penaltyInr: number;
  dueAt: string | null;
  submittedAt: string;
};
export type DashboardList = { bucket: DashboardBucket; count: number; items: DashboardListItem[] };

export async function getDashboardList(bucket: DashboardBucket): Promise<DashboardList> {
  const res = await fetch(`/api/dashboard/list?bucket=${encodeURIComponent(bucket)}`, { cache: "no-store" });
  return jsonOrThrow<DashboardList>(res);
}

export type LookupResult = {
  count: number;
  results: { id: string; fullName: string; purpose: string; submittedAt: string; outcome: string | null; slaStatus: string | null }[];
};

export async function lookupByPhone(phone: string): Promise<LookupResult> {
  const res = await fetch(`/api/applications/lookup?phone=${encodeURIComponent(phone.replace(/\D/g, ""))}`, { cache: "no-store" });
  return jsonOrThrow<LookupResult>(res);
}

export type VerifyResult = {
  reference: string;
  certified: boolean;
  question: string;
  answer: boolean;
  holderName: string;
  signed: string;
  note: string;
};

export async function verifyIncome(input: { phone?: string; applicationId?: string; threshold: number }): Promise<VerifyResult> {
  const res = await fetch("/api/verify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return jsonOrThrow<VerifyResult>(res);
}

export type MessageInput = {
  kind: "CONTACT" | "GRIEVANCE";
  name: string;
  phone: string;
  email?: string;
  subject: string;
  body: string;
};
export type MessageResult = { reference: string; createdAt: string };

/** Persist a Contact message or a grievance and get back a real reference. */
export async function sendMessage(input: MessageInput): Promise<MessageResult> {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return jsonOrThrow<MessageResult>(res);
}
