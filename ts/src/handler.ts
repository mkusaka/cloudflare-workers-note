export async function handleRequest(request: Request): Promise<Response> {
  const cache = caches.default
  const requestUrl = request.url
  const cached = await cache.match(requestUrl)
  if (cached) {
    return cached
  } else {
    const response = new Response(`${Date.now()}`, {
      headers: {
        'cache-control': 'public, s-maxage=10',
      },
    })
    cache.put(request.url, response.clone())
    return response
  }
}
