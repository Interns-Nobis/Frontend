import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { candidateNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";
import { DocumentCard } from "@/components/hrms/DocumentCard";
import { mockDocuments } from "@/data/mockData";

export const Route = createFileRoute("/candidate/documents")({
  component: () => (
    <RoleLayout items={candidateNav} role="Candidate" user="Aarav Sharma">
      <PageHeader title="Documents" description="Upload all required documents to complete your onboarding." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockDocuments.map((d) => (
          <DocumentCard key={d.name} name={d.name} file={d.file} uploaded={d.uploaded} />
        ))}
      </div>
    </RoleLayout>
  ),
});
