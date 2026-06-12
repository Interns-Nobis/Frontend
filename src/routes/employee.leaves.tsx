import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { employeeNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";
import { DashboardCard } from "@/components/hrms/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/hrms/StatusBadge";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Sun, Heart, Sparkles } from "lucide-react";
import { mockLeaves } from "@/data/mockData";

export const Route = createFileRoute("/employee/leaves")({
  component: LeavesPage,
});

function LeavesPage() {
  
  const availableLeave = 8.5;
const usedLeave = 2;
const monthlyCredit = 1.75;
const carryForwardLimit = 10;
  const [open, setOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [reason, setReason] = useState("");

const [leaveRequests, setLeaveRequests] =
  useState<any[]>(mockLeaves);
  const calculateDays = (
  startDate: string,
  endDate: string
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const difference =
    end.getTime() - start.getTime();

  return (
    Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ) + 1
  );
};
  return (
    <RoleLayout items={employeeNav} role="Employee" user="Ananya Rao">
      <PageHeader
        title="Leave Management"
        description="View balances and manage your leave requests."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Apply Leave</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Apply for Leave</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Leave Type</Label>
                  <Select
  value={leaveType}
  onValueChange={setLeaveType}
>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="privilege">
  Privilege Leave
</SelectItem>

<SelectItem value="sick">
  Sick Leave
</SelectItem>

<SelectItem value="emergency">
  Emergency Leave
</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Start Date</Label><Input
  type="date"
  value={fromDate}
  onChange={(e) =>
    setFromDate(e.target.value)
  }
/></div>
                  <div className="space-y-1.5"><Label>End Date</Label><Input
  type="date"
  value={toDate}
  onChange={(e) =>
    setToDate(e.target.value)
  }
/></div>
                </div>
                <div className="space-y-1.5">
                  <Label>Reason</Label>
                  <Textarea
  placeholder="Brief reason..."
  rows={3}
  value={reason}
  onChange={(e) =>
    setReason(e.target.value)
  }
/>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button
  onClick={() => {
    if (
  !leaveType ||
  !fromDate ||
  !toDate ||
  !reason
) {
  alert("Please fill all fields");
  return;
}
const totalDays =
  calculateDays(fromDate, toDate);

if (totalDays <= 0) {
  alert("Invalid date range");
  return;
}

if (totalDays > availableLeave) {
  alert("Insufficient leave balance");
  return;
}
    const newLeave = {
      id: Date.now().toString(),
      employeeName: "Ananya Rao",
      type: leaveType,
      from: fromDate,
      to: toDate,
      reason,
      status: "Pending",
    };

    setLeaveRequests([
      ...leaveRequests,
      newLeave,
    ]);

    setLeaveType("");
    setFromDate("");
    setToDate("");
    setReason("");

    setOpen(false);
  }}
>
  Submit Request
</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
<div className="grid sm:grid-cols-4 gap-4 mb-6">

  <DashboardCard
    label="Available Leave"
    value={availableLeave}
    icon={Sparkles}
    accent="text-emerald-600 bg-emerald-100"
  />

  <DashboardCard
    label="Used Leave"
    value={usedLeave}
    icon={Heart}
    accent="text-red-600 bg-red-100"
  />

  <DashboardCard
    label="Monthly Credit"
    value={monthlyCredit}
    icon={Sun}
    accent="text-amber-600 bg-amber-100"
  />

  <DashboardCard
    label="Carry Forward Limit"
    value={carryForwardLimit}
    icon={Sparkles}
    accent="text-blue-600 bg-blue-100"
  />

</div>

<Card className="mb-6">
  <CardContent className="p-6">

    <h3 className="font-semibold text-lg mb-3">
      Leave Policy
    </h3>

    <ul className="space-y-2">
      <li>• 1.75 leave credits are added every month.</li>
      <li>• Unused leave balance carries forward month to month.</li>
      <li>• Maximum 10 leave days can be carried forward to the next year.</li>
      <li>• Any balance above 10 days expires at year end.</li>
    </ul>

  </CardContent>
</Card>
      <Card>
        <CardHeader><CardTitle>Leave Requests</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.type}</TableCell>
                  <TableCell>{l.from}</TableCell>
                  <TableCell>{l.to}</TableCell>
                  <TableCell className="text-muted-foreground">{l.reason}</TableCell>
                  <TableCell><StatusBadge status={l.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </RoleLayout>
  );
}
