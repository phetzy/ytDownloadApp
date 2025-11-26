export async function GET() {
  const adsContent = `google.com, pub-3595854121600052, DIRECT, f08c47fec0942fa0`
  
  return new Response(adsContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
