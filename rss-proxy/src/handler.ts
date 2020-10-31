import { format, parseISO } from 'date-fns'

export async function handleRequest(request: Request): Promise<Response> {
  const { headers, url } = request
  const { searchParams } = new URL(url)
  if (!searchParams.get('url')) {
    return new Response(`url unspecified`, {
      status: 400,
    })
  }
  const cache = caches.default
  const cached = await cache.match(url)
  if (cached) {
    return cached
  } else {
    const now = Date.now()
    // TODO: get from env vars.
    const targetHour = '01:28'
    const targetTime = parseISO(
      `${format(now, 'yyyy-MM-dd')}T${targetHour}+09:00`,
    ).getTime()
    // parseISO(`${format(now, 'yyyy-MM-dd')}T${'01:22'}+09:00`).getTime()
    console.log(targetTime)
    console.log(
      parseISO(`${format(now, 'yyyy-MM-dd')}T${targetHour}+00:00`).getTime(),
    )
    console.log(now)
    const diff = targetTime - now
    console.log(diff)
    // target rss should encoded by encodeURIComponent
    const targetUrl = decodeURIComponent(searchParams.get('url')!)

    const body = await (
      await fetch(targetUrl, {
        headers,
      })
    ).text()

    console.log(`${format(now, 'yyyy-MM-')}T${targetHour}+09:00`)

    const response = new Response(body, {
      headers: {
        'cache-control': `s-maxage=${diff}`,
        'content-type': 'application/rss+xml; charset=UTF-8',
      },
    })

    cache.put(url, response.clone())
    return response
  }
}
