// src/app/projects/page.js
import { getUserProjects, createProject } from "../actions";
import { prisma } from "../lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import ProjectsClient from "./ProjectsClient"; // Birazdan yapacağız

export default async function ProjectsPage() {
  const session = (await cookies()).get("session")?.value;
  if (!session) redirect("/login");

  let user = null;
  let projects = [];

  try {
    const secret = new TextEncoder().encode("civildai");
    const { payload } = await jwtVerify(session, secret);
    
    user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (user) {
        projects = await getUserProjects(user.id);
    }
  } catch (e) {
    redirect("/login");
  }

  return <ProjectsClient user={user} initialProjects={projects} />;
}