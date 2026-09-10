const fs = require('fs');

async function test() {
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbw2a5-jUCaIlevOz4Tg-Pq1JS5dA0vq_I5ztDKE6bSarrQhCsHomcMTKY0BfIG1zV1b/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "uploadFile",
        fileName: "test-photo.txt",
        fileData: "data:text/plain;base64,SGVsbG8gV29ybGQ=" // "Hello World"
      }),
      redirect: "follow"
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

test();
