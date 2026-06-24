import { useState, useEffect } from "react";
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
useEffect(() => {
  fetch("http://127.0.0.1:8000/attendance/")
    .then((res) => res.json())
    .then((data) => setAttendanceRecords(data))
    .catch((err) => console.error(err));

}, []);


const [searchTerm, setSearchTerm] = useState("");
const [filterStatus, setFilterStatus] = useState("all");
const presentCount = attendanceRecords.filter(
  (record) => record.status_code === "P"
).length;

const absentCount = attendanceRecords.filter(
  (record) => record.status_code === "A"
).length;

const wfhCount = attendanceRecords.filter(
  (record) => record.status_code === "WFH"
).length;

const onSiteCount = attendanceRecords.filter(
  (record) => record.status_code === "OS"
).length;

const [editingAttendanceId, setEditingAttendanceId]=
  useState<number | null>(null);

const leaveCount = attendanceRecords.filter(
  (record) =>
    record.status_code === "SL" ||
    record.status_code === "PL"
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
      onValueChange={(value) => {
      console.log("Dropdown selected:", value);
      setEmployee(value);
}}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Employee" />
      </SelectTrigger>

      <SelectContent>
        {employees.map((employee) => (
  <SelectItem
    key={employee.emp_id}
    value={String(employee.emp_id)}
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
  onClick={async () => {
    try {

      const attendancePayload = {
        employee_id: Number(employee),
        attendance_date: date,
        status: status,
      };

      let response;

      if (editingAttendanceId !== null) {

        response = await fetch(
          `http://127.0.0.1:8000/attendance/${editingAttendanceId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(attendancePayload),
          }
        );

      } else {

        response = await fetch(
          "http://127.0.0.1:8000/attendance/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(attendancePayload),
          }
        );

      }

      const result = await response.json();

      console.log(result);

      const attendanceResponse = await fetch(
        "http://127.0.0.1:8000/attendance/"
      );

      const attendanceData =
        await attendanceResponse.json();

      setAttendanceRecords(attendanceData);

      setEmployee("");
      setDate("");
      setStatus("");

      setEditIndex(null);
      setEditingAttendanceId(null);

    } catch (error) {
      console.error(error);
    }
  }}
>
  {editingAttendanceId !== null
    ? "Update Attendance"
    : "Mark Attendance"}
</Button>

  </CardContent>
</Card>.

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
      String(record.emp_id).includes(searchTerm)
  )
  .filter((record) =>
    filterStatus === "all"
      ? true
      : record.status_code === filterStatus
  )
  .map((record, index) => (
      <div
        key={index}
        className="border-b py-2"
      >
        <p>
          <strong>Employee ID:</strong> {record.emp_id}
        </p>

        <p>
          <strong>Date:</strong> {record.attendance_date}
        </p>
        <p>
  <strong>Status:</strong> {record.status_code}
</p>

        <div className="flex gap-2 mt-2">

  <Button
    size="sm"
    variant="outline"
    onClick={() => {
      setEmployee(record.emp_id);
      setDate(record.attendance_date);
      setStatus(record.status_code);

      setEditIndex(index);
      setEditingAttendanceId(record.attendance_id);
    }}
  >
    <Pencil className="h-4 w-4" />
  </Button>

  <Button
  size="sm"
  variant="destructive"
  onClick={async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/attendance/${record.attendance_id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      console.log(result);

      const attendanceResponse = await fetch(
        "http://127.0.0.1:8000/attendance/"
      );

      const attendanceData =
        await attendanceResponse.json();

      setAttendanceRecords(attendanceData);

    } catch (error) {
      console.error(error);
    }
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