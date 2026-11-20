import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, SITE_CONFIG } from "@/content/projects";
import { CaseStudyView } from "@/components/ui/case-study-view";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};

  const title = `${project.title} — Case Study | Rohith EP`;
  return {
    title,
    description: project.summary,
    openGraph: {
      title,
      description: project.summary,
      url: `${SITE_CONFIG.url}/work/${project.slug}`,
      images: [{ url: project.image, alt: project.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.summary,
      images: [project.image],
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projectIndex = PROJECTS.findIndex((p) => p.slug === slug);
  if (projectIndex === -1) notFound();

  const project = PROJECTS[projectIndex];
  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];

  return <CaseStudyView project={project} nextProject={nextProject} />;
}
