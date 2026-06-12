import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { employees } from "@/data/employees";
import { Pencil, Trash2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  
  const [employee, setEmployee] = useState("");
const [date, setDate] = useState("");
const [status, setStatus] = useState("");

const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
const [searchTerm, setSearchTerm] = useState("");
const [filterStatus, setFilterStatus] = useState("all");
const presentCount = attendanceRecords.filter(
  (record) => record.status === "P"
).length;

const absentCount = attendanceRecords.filter(
  (record) => record.status === "A"
).length;

const wfhCount = attendanceRecords.filter(
  (record) => record.status === "WFH"
).length;

const onSiteCount = attendanceRecords.filter(
  (record) => record.status === "OS"
).length;

const leaveCount = attendanceRecords.filter(
  (record) =>
    record.status === "SL" ||
    record.status === "PL"
).length;
const monthlyAttendance = [
  {
    employee: "Rahul Sharma",
    days: ["P", "P", "WFH", "P", "P"],
  },
  {
    employee: "Amit Kumar",
    days: ["P", "HD", "P", "P", "A"],
  },
];
  return (
    <RoleLayout items={adminNav} role="Admin" user="Admin User">
      <PageHeader
        title="Attendance Management"
        description="Manage employee attendance."
      />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Present</h3>
            <p className="text-2xl font-bold">
  {presentCount}
</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Absent</h3>
            <p className="text-2xl font-bold">
  {absentCount}
</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">WFH</h3>
            <p className="text-2xl font-bold">
  {wfhCount}
</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">On Site</h3>
            <p className="text-2xl font-bold">
  {onSiteCount}
</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Leave</h3>
            <p className="text-2xl font-bold">
  {leaveCount}
</p>
          </CardContent>
        </Card>

      </div>
      <Card className="mb-6">
  <CardContent className="p-6 space-y-4">

    <h2 className="font-semibold text-lg">
      Mark Attendance
    </h2>

    <Input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />

    <Select
      value={employee}
      onValueChange={setEmployee}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Employee" />
      </SelectTrigger>

      <SelectContent>
        {employees.map((employee) => (
  <SelectItem
    key={employee.id}
    value={employee.name}
  >
    {employee.name}
  </SelectItem>
))}
      </SelectContent>
    </Select>

    <Select
      value={status}
      onValueChange={setStatus}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>

      <SelectContent>
  <SelectItem value="P">Present</SelectItem>

  <SelectItem value="WFH">
    Work From Home
  </SelectItem>

  <SelectItem value="OS">
    On Site
  </SelectItem>

  <SelectItem value="HD">
    Half Day
  </SelectItem>

  <SelectItem value="SL">
    Sick Leave
  </SelectItem>

  <SelectItem value="PL">
    Privilege Leave
  </SelectItem>

  <SelectItem value="A">
    Absent
  </SelectItem>
</SelectContent>
    </Select>

    <Button
  onClick={() => {
    const newRecord = {
      employee,
      date,
      status,
    };

    if (editIndex !== null) {
  const updatedRecords = [...attendanceRecords];

  updatedRecords[editIndex] = newRecord;

  setAttendanceRecords(updatedRecords);

  setEditIndex(null);
} else {
  setAttendanceRecords([
    ...attendanceRecords,
    newRecord,
  ]);
}

    setEmployee("");
    setDate("");
    setStatus("");
  }}
>
  Mark Attendance
</Button>

  </CardContent>
</Card>
<Card>
  <CardContent className="p-6">

    <h2 className="font-semibold text-lg mb-4">
      Attendance Register
    </h2>

    <div className="flex gap-4 mb-4">

      <Input
  placeholder="Search Employee"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

      <Select
  value={filterStatus}
  onValueChange={setFilterStatus}
>
        <SelectTrigger>
          <SelectValue placeholder="Filter Status" />
        </SelectTrigger>

        <SelectContent>

  <SelectItem value="all">
    All
  </SelectItem>

  <SelectItem value="P">
    Present
  </SelectItem>

  <SelectItem value="WFH">
    WFH
  </SelectItem>

  <SelectItem value="OS">
    On Site
  </SelectItem>

  <SelectItem value="HD">
    Half Day
  </SelectItem>

  <SelectItem value="SL">
    Sick Leave
  </SelectItem>

  <SelectItem value="PL">
    Privilege Leave
  </SelectItem>

  <SelectItem value="A">
    Absent
  </SelectItem>

</SelectContent>
      </Select>

    </div>

    {attendanceRecords
  .filter((record) =>
    record.employee
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  .filter((record) =>
    filterStatus === "all"
      ? true
      : record.status === filterStatus
  )
  .map((record, index) => (
      <div
        key={index}
        className="border-b py-2"
      >
        <p>
          <strong>Employee:</strong> {record.employee}
        </p>

        <p>
          <strong>Date:</strong> {record.date}
        </p>
        <p>
  <strong>Status:</strong> {record.status}
</p>

        <div className="flex gap-2 mt-2">

  <Button
    size="sm"
    variant="outline"
    onClick={() => {
      setEmployee(record.employee);
      setDate(record.date);
      setStatus(record.status);

      setEditIndex(index);
    }}
  >
    <Pencil className="h-4 w-4" />
  </Button>

  <Button
    size="sm"
    variant="destructive"
    onClick={() => {
      setAttendanceRecords(
        attendanceRecords.filter(
          (_, i) => i !== index
        )
      );
    }}
  >
    <Trash2 className="h-4 w-4" />
  </Button>

</div>
      </div>
    ))}

  </CardContent>
</Card>

<Card className="mt-6">
  <CardContent className="p-6">

    <h2 className="font-semibold text-lg mb-4">
      Monthly Attendance Register
    </h2>

    <div className="overflow-x-auto">

      <table className="w-full border">

        <thead>
          <tr>
            <th className="border p-2">Employee</th>
            <th className="border p-2">1</th>
            <th className="border p-2">2</th>
            <th className="border p-2">3</th>
            <th className="border p-2">4</th>
            <th className="border p-2">5</th>
          </tr>
        </thead>

        <tbody>

          {monthlyAttendance.map((employee, index) => (
            <tr key={index}>

              <td className="border p-2">
                {employee.employee}
              </td>

              {employee.days.map((day, i) => (
                <td
                  key={i}
                  className="border p-2 text-center"
                >
                  {day}
                </td>
              ))}

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  </CardContent>
</Card>

</RoleLayout>
  );
}