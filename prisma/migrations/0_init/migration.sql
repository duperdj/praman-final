-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "DemoClock" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "simulatedNow" TIMESTAMP(3),

    CONSTRAINT "DemoClock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Applicant" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "aadhaarLike" TEXT NOT NULL,
    "samagraId" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "tehsil" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "familyId" TEXT,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "statedAnnualIncome" INTEGER NOT NULL,
    "incomeSource" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL,
    "lang" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL DEFAULT 'income-certificate',
    "formData" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "headlineHi" TEXT NOT NULL,
    "headlineEn" TEXT NOT NULL,
    "requiredInput" TEXT,
    "decidedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "reasonHi" TEXT NOT NULL,
    "reasonEn" TEXT NOT NULL,
    "meta" TEXT,

    CONSTRAINT "Signal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlaState" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "workingDaysAllowed" INTEGER NOT NULL DEFAULT 3,
    "workingDaysElapsed" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "breachedAt" TIMESTAMP(3),
    "penaltyAccruedInr" INTEGER NOT NULL DEFAULT 0,
    "appealDraftHi" TEXT,
    "appealDraftEn" TEXT,

    CONSTRAINT "SlaState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "samagraFamilyId" TEXT NOT NULL,
    "headName" TEXT,
    "district" TEXT NOT NULL,
    "tehsil" TEXT NOT NULL,
    "isUrban" BOOLEAN NOT NULL DEFAULT false,
    "ekycStatus" TEXT NOT NULL DEFAULT 'VALID',
    "ekycUpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "signature" TEXT,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Officer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "tehsil" TEXT NOT NULL,

    CONSTRAINT "Officer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appeal" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'FIRST',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "reasonHi" TEXT NOT NULL,
    "reasonEn" TEXT NOT NULL,
    "againstOfficerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filedAt" TIMESTAMP(3),

    CONSTRAINT "Appeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenaltyLedger" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "appealId" TEXT,
    "officerId" TEXT,
    "ratePerDay" INTEGER NOT NULL DEFAULT 250,
    "breachDays" INTEGER NOT NULL DEFAULT 0,
    "amountInr" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACCRUING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PenaltyLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlaEvent" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlaEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriorCertificate" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "declaredIncome" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriorCertificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Decision_applicationId_key" ON "Decision"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "SlaState_applicationId_key" ON "SlaState"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Family_samagraFamilyId_key" ON "Family"("samagraFamilyId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_number_key" ON "Certificate"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_applicationId_key" ON "Certificate"("applicationId");

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signal" ADD CONSTRAINT "Signal_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlaState" ADD CONSTRAINT "SlaState_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appeal" ADD CONSTRAINT "Appeal_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appeal" ADD CONSTRAINT "Appeal_againstOfficerId_fkey" FOREIGN KEY ("againstOfficerId") REFERENCES "Officer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenaltyLedger" ADD CONSTRAINT "PenaltyLedger_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenaltyLedger" ADD CONSTRAINT "PenaltyLedger_appealId_fkey" FOREIGN KEY ("appealId") REFERENCES "Appeal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenaltyLedger" ADD CONSTRAINT "PenaltyLedger_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlaEvent" ADD CONSTRAINT "SlaEvent_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriorCertificate" ADD CONSTRAINT "PriorCertificate_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

