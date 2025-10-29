export async function generateZenaVideo(text: string) {
  const response = await fetch("https://api.d-id.com/talks", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa("c2FidWxsZWxhbUBnbWFpbC5jb20:3SJA1zel0r5bv4JqgNads")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source_url: "https://qvtbox.com/images/zena-face.png",
      script: { type: "text", input: text, provider: { type: "elevenlabs", voice_id: "Rachel" } },
    }),
  });
  const data = await response.json();
  return data.result_url; // lien vidéo mp4
}
