import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute(
  "/admin/employees/$id"
)({
  component: EmployeeDetail,
});

function EmployeeDetail() {
  const { id } = Route.useParams();

  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/employees/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEmployee(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  useEffect(() => {
  console.log("Employee ID:", id);

  fetch(`http://127.0.0.1:8000/employees/${id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setEmployee(data);
    });
}, [id]);

  if (!employee) {
    return (
      <div className="p-6">
        Loading Employee...
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 border rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">
        Employee Details
      </h2>

      <div className="space-y-2">
        <p>
          <strong>ID:</strong>{" "}
          {employee.employee_id}
        </p>

        <p>
          <strong>Name:</strong>{" "}
          {employee.employee_name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {employee.email}
        </p>

        <p>
          <strong>Department:</strong>{" "}
          {employee.department}
        </p>

        <p>
          <strong>Sub Department:</strong>{" "}
          {employee.sub_department}
        </p>

        <p>
          <strong>Designation:</strong>{" "}
          {employee.designation}
        </p>
      </div>
    </div>
  );
}