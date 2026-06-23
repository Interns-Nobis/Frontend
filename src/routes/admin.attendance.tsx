import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Pencil, Trash2 } from "lucide-react";

import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

const [employees, setEmployees] = useState<any[]>([]);

const [open, setOpen] = useState(false);


useEffect(() => {
  fetch("http://127.0.0.1:8000/employees/")
    .then((res) => res.json())
    .then((data) => setEmployees(data))
    .catch((err) => console.error(err));
}, []);

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

   <Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      role="combobox"
      className="justify-between"
    >
      {employee
        ? (() => {
            const emp = employees.find(
              (e) =>
                String(e.emp_id) === employee
            );

            return emp
              ? `${emp.first_name} ${emp.last_name} (${emp.emp_id})`
              : "Select Employee";
          })()
        : "Select Employee"}

      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </PopoverTrigger>

  <PopoverContent className="w-[350px] p-0">
    <Command>
      <CommandInput placeholder="Search employee..." />

      <CommandList>
        <CommandEmpty>
          No employee found.
        </CommandEmpty>

        <CommandGroup>
          {employees.map((emp) => (
            <CommandItem
              key={emp.emp_id}
              value={`${emp.first_name} ${emp.last_name} ${emp.emp_id}`}
              onSelect={() => {
                setEmployee(
                  String(emp.emp_id)
                );

                setOpen(false);
              }}
            >
              <Check
                className={`mr-2 h-4 w-4 ${
                  employee ===
                  String(emp.emp_id)
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />

              {emp.first_name} {emp.last_name}
              {" "}
              ({emp.emp_id})
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>

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

      console.log("Employee:", employee);
      console.log("Date:", date);
      console.log("Status:", status);

      if (!employee || !date || !status) {
  alert("Please select Employee, Date and Status");
  return;
}

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
        
  <strong>Employee:</strong>{" "}
  {record.first_name} {record.last_name}
  {" "}({record.emp_id})

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



</RoleLayout>
  );
}