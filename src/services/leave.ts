export async function fetchLeaves() {
  const response = await fetch("http://127.0.0.1:8000/leave");

  if (!response.ok) {
    throw new Error("Failed to fetch leaves");
  }

  return response.json();
}