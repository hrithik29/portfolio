import Image from "next/image";
import Container from "../components/Container";
import Section from "../components/Section";
import PageHeader from "../components/PageHeader";
import { workProjects } from "@/data/work-projects";

export default function WorkPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Work"
          description="Case studies from products I've shipped — each one links to the full PDF write-up."
        />

        <div className="flex flex-col gap-6">
          {workProjects.map((project) => (
            <a
              key={project.slug}
              href={project.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row gap-5 rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-5 hover:border-neutral-600 transition-colors"
            >
              <div className="relative w-full sm:w-64 shrink-0 aspect-video rounded-lg overflow-hidden border border-neutral-800">
                <Image
                  src={project.thumbnail}
                  alt={`${project.title} case study thumbnail`}
                  fill
                  sizes="(max-width: 640px) 100vw, 256px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <span
                  className="text-xs font-semibold tracking-wider uppercase mb-2"
                  style={{ color: project.accent }}
                >
                  {project.tag}
                </span>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-neutral-200">
                  {project.title}
                </h2>
                <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                  {project.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-300 group-hover:text-white">
                  View case study (PDF)
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17L17 7M17 7H7M17 7V17"
                    />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </Section>
    </Container>
  );
}
