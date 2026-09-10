const fs = require('fs');

async function test() {
  const url = 'https://script.google.com/macros/s/AKfycbw2a5-jUCaIlevOz4Tg-Pq1JS5dA0vq_I5ztDKE6bSarrQhCsHomcMTKY0BfIG1zV1b/exec';
  const payload = {
    action: 'uploadFile',
    fileName: 'test_photo',
    fileData: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA='
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (e) {
    console.error("Fetch error:", e.message);
  }
}

test();
