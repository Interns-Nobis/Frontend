import {
  createFileRoute,
  Outlet,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";

import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/hrms/StatusBadge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Search,
  Eye,
  Check,
  X,
  Plus,
} from "lucide-react";

export const Route = createFileRoute(
  "/admin/candidates"
)({
  component: CandidatesPage,
});

function CandidatesPage() {
  const nav = Route.useNavigate();

  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");

  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/candidate/")
      .then((res) => res.json())
      .then((data) => {
        setCandidates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = candidates.filter((c) => {
    const matchFilter =
      filter === "All" ||
      (c.status && c.status.includes(filter));

    const matchQ =
      !q ||
      c.name?.toLowerCase().includes(q.toLowerCase()) ||
      c.email?.toLowerCase().includes(q.toLowerCase());

    return matchFilter && matchQ;
  });

  return (
    <RoleLayout
      items={adminNav}
      role="Admin"
      user="Admin User"
    >
      <PageHeader
        title="Candidate Management"
        description="Review and manage candidate applications."
        action={
          <Button
            onClick={() =>
              nav({
                to: "/admin/create-candidate",
              })
            }
            className="bg-[#F58220] hover:bg-[#D96E12]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Candidate
          </Button>
        }
      />

      <Card className="mb-4">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />

            <Input
              placeholder="Search by name or email..."
              className="pl-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <Tabs
            value={filter}
            onValueChange={setFilter}
          >
            <TabsList>
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Submitted">
                Submitted
              </TabsTrigger>
              <TabsTrigger value="Under Review">
                Review
              </TabsTrigger>
              <TabsTrigger value="Approved">
                Approved
              </TabsTrigger>
              <TabsTrigger value="Rejected">
                Rejected
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8"
                  >
                    Loading candidates...
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filtered.map((c) => (
                  <TableRow
                    key={c.candidate_id}
                  >
                    <TableCell>
                      {c.candidate_id}
                    </TableCell>

                    <TableCell>
                      {c.name}
                    </TableCell>

                    <TableCell>
                      {c.email}
                    </TableCell>

                    <TableCell>
                      {c.mobile}
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        status={c.status}
                      />
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            window.location.href =
                              `/admin/candidates/${c.candidate_id}`;
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-emerald-600"
                        >
                          <Check className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading &&
                filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8"
                    >
                      No candidates found.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
        </Card>

      <Outlet />
    </RoleLayout>
  );
}