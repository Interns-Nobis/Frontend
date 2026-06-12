import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { candidateNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/candidate/dashboard")({
  component: () => (
    <RoleLayout items={candidateNav} role="Candidate" user="Candidate">
     <PageHeader
  title="Welcome"
  description="Complete your onboarding process."
/>

<Card className="mb-6 border-2 border-[#F58220]">
  <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h2 className="text-xl font-bold text-[#123D7A]">
        Complete Your Onboarding Form
      </h2>

      <p className="text-muted-foreground">
        Your onboarding information is pending submission.
        Complete the form to start HR review.
      </p>
    </div>

    <Button
      className="bg-[#F58220] hover:bg-[#D96E12]"
      onClick={() => window.location.href = "/candidate/onboarding"}
    >
      Start Onboarding
    </Button>
  </CardContent>
</Card>
    </RoleLayout>
  ),
});
