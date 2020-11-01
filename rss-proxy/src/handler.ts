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
    console.log('cache respond')
    cache.delete(url)
    return cached
  } else {
    const now = new Date()
    const weekday = ([
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ] as const)[now.getDay()]
    const shortMonths = ([
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ] as const)[now.getMonth()]
    Intl.DateTimeFormat().format(Date.now())
    // TODO: get from env vars.
    const targetHour = '08:11'
    // Sunday, 06-Nov-94 08:49:37 GMT
    const targetTime = `${weekday} ${shortMonths} ${now.getDate()} ${targetHour}:00 UTC`
    // parseISO(`${format(now, 'yyyy-MM-dd')}T${'01:22'}+09:00`).getTime()
    console.log(targetTime)
    console.log('current timezone offset', now.getTimezoneOffset())
    // target rss should encoded by encodeURIComponent
    const targetUrl = decodeURIComponent(searchParams.get('url')!)

    const body = await (
      await fetch(targetUrl, {
        headers,
      })
    ).text()

    const response = new Response(body, {
      headers: {
        Expires: targetTime,
        'content-type': 'application/rss+xml; charset=UTF-8',
        'x-request-cached': `${Date.now()}`,
      },
    })

    cache.put(url, response.clone())
    return response
  }
}
