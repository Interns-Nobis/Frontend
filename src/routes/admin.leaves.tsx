import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/hrms/StatusBadge";
import { Check, X } from "lucide-react";


export const Route = createFileRoute("/admin/leaves")({
  component: LeavesPage,
});

function LeavesPage() {
  const [leaveRequests, setLeaveRequests] =
    useState<any[]>([]);

  useEffect(() => {
  fetch("http://127.0.0.1:8000/leave/")
    .then((res) => res.json())
    .then((data) => setLeaveRequests(data))
    .catch((err) => console.error(err));
}, []);


    const pendingCount = leaveRequests.filter(
  (leave) => leave.status === "Pending"
).length;

const approvedCount = leaveRequests.filter(
  (leave) => leave.status === "Approved"
).length;

const rejectedCount = leaveRequests.filter(
  (leave) => leave.status === "Rejected"
).length;

  return (
    <RoleLayout items={adminNav} role="Admin" user="Admin User">
      <PageHeader title="Leave Requests" description="Approve or reject leave requests." />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

  <Card>
    <CardContent className="p-4">
      <h3 className="font-semibold">Pending</h3>
      <p className="text-2xl font-bold">
        {pendingCount}
      </p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-4">
      <h3 className="font-semibold">Approved</h3>
      <p className="text-2xl font-bold">
        {approvedCount}
      </p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-4">
      <h3 className="font-semibold">Rejected</h3>
      <p className="text-2xl font-bold">
        {rejectedCount}
      </p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-4">
      <h3 className="font-semibold">Total</h3>
      <p className="text-2xl font-bold">
        {leaveRequests.length}
      </p>
    </CardContent>
  </Card>

</div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((l, index) => (
                <TableRow key={l.leave_id}>
                  <TableCell className="font-medium">
  <div>
    <div>{l.first_name} {l.last_name}</div>
    <div className="text-xs text-muted-foreground">
      Employee ID: {l.emp_id}
    </div>
  </div>
</TableCell>
                  <TableCell>{l.leave_type}</TableCell>
                  <TableCell>{l.start_date}</TableCell>
                  <TableCell>{l.end_date}</TableCell>
                  <TableCell className="text-muted-foreground">{l.reason}</TableCell>
                  <TableCell><StatusBadge status={l.status} /></TableCell>
                  <TableCell className="text-right">
                    {l.status === "Pending" ? (
                      <div className="flex justify-end gap-1">
                       <Button
  size="sm"
  variant="ghost"
  className="text-emerald-600"
  onClick={async () => {
    try {
      await fetch(
        `http://127.0.0.1:8000/leave/approve/${l.leave_code}`,
        {
          method: "PUT",
        }
      );

      const response = await fetch(
        "http://127.0.0.1:8000/leave/"
      );

      const data = await response.json();

      setLeaveRequests(data);

    } catch (error) {
      console.error(error);
    }
  }}
>
  <Check className="h-4 w-4" />
</Button>


<Button
  size="sm"
  variant="ghost"
  className="text-red-600"
  onClick={async () => {
    try {
      await fetch(
        `http://127.0.0.1:8000/leave/reject/${l.leave_code}`,
        {
          method: "PUT",
        }
      );

      const response = await fetch(
        "http://127.0.0.1:8000/leave/"
      );

      const data = await response.json();

      setLeaveRequests(data);

    } catch (error) {
      console.error(error);
    }
  }}
>
  <X className="h-4 w-4" />
</Button>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </RoleLayout>
);
}
