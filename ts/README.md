# cloudflare-workers-note

https://blog.cloudflare.com/unit-testing-worker-functions/
https://developers.cloudflare.com/workers/examples/redirect

# memo

```js
const base = "https://example.com";
const statusCode = 301;

async function handleRequest(request) {
  const { headers, url } = request;
  const { searchParams } = new URL(url);
  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  };
  // target rss encoded by encodeURIComponent
  const targetRss = decodeURIComponent(searchParams.get("url"));

  const response = await fetch(targetRss, {
    headers,
  });

  return new Response(response, {
    headers: {
      ...init,
      response.headers
    }
  });
}

addEventListener("fetch", async (event) => {
  event.respondWith(handleRequest(event.request));
});
```
