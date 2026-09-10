const fs = require('fs');
const crypto = require('crypto');

async function test() {
  try {
    // Generate 1MB of random data
    const randomBytes = crypto.randomBytes(1024 * 1024);
    const base64Data = randomBytes.toString('base64');
    const dataUrl = `data:application/octet-stream;base64,${base64Data}`;
    
    console.log("Payload length:", dataUrl.length);

    const res = await fetch("https://script.google.com/macros/s/AKfycbw2a5-jUCaIlevOz4Tg-Pq1JS5dA0vq_I5ztDKE6bSarrQhCsHomcMTKY0BfIG1zV1b/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "uploadFile",
        fileName: "test-large.bin",
        fileData: dataUrl
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
