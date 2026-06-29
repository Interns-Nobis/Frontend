export async function fetchDashboard() {
  const response = await fetch("http://127.0.0.1:8000/dashboard");

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard");
  }

  return response.json();
}