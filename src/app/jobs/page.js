// src/app/jobs/page.js
import { getProfessionalJobs, getCompanyJobsWithApplicants } from "../actions";
import { prisma } from "../lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import JobsClient from "./JobsClient"; // Birazdan yapacağız

export default async function JobsPage() {
  const session = (await cookies()).get("session")?.value;
  let user = null;
  let jobs = [];
  let companyListings = [];

  if (session) {
    try {
        const secret = new TextEncoder().encode("civildai");
        const { payload } = await jwtVerify(session, secret);
        user = await prisma.user.findUnique({ where: { email: payload.email } });
    } catch(e) {}
  }

  // SENARYO 1: FİRMA İSE -> Kendi ilanlarını ve başvuruları getir
  if (user?.role === 'COMPANY') {
      companyListings = await getCompanyJobsWithApplicants(user.id);
  }

  // SENARYO 2: HERKES -> Tüm aktif ilanları getir (Client tarafında filtreleyeceğiz)
  jobs = await getProfessionalJobs({ category: 'ALL' });

  return <JobsClient user={user} initialJobs={jobs} companyListings={companyListings} />;
}