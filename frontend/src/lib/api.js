const BASE = import.meta.env.VITE_API_URL || "";

async function parseResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export async function transcribe(audioBlob) {
  const form = new FormData();
  form.append("file", audioBlob, "audio.webm");
  const response = await fetch(`${BASE}/api/transcribe`, {
    method: "POST",
    body: form,
  });
  return parseResponse(response);
}

export async function interpret(transcript) {
  const response = await fetch(`${BASE}/api/interpret`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });
  return parseResponse(response);
}

export async function scanDocument(imageBase64) {
  const response = await fetch(`${BASE}/api/scan-document`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageBase64 }),
  });
  return parseResponse(response);
}
