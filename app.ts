import { makeCaptcha } from "https://deno.land/x/svg_captcha@v1.0.0/mod.ts";

async function handleRequest(request: Request) {
  const { pathname } = new URL(request.url);

  // This is how the proxy works:
  // 1. A request comes in for a specific asset.
  // 2. We construct a URL to that asset.
  // 3. We fetch the asset and respond to the request.

  // Check if the request is for style.css.
  if (pathname.startsWith("/style.css")) {
    //  Construct a new URL to style.css by using the URL
    //  of the script (mod.ts) as base (import.meta.url).
    const style = new URL("style.css", import.meta.url);
    // Fetch the asset and return the fetched response
    // to the client.

    return new Response((await fetch(style)).body, {
      headers: {
        "content-type": "text/css; charset=utf-8",
      },
    });
  }
  if (pathname.startsWith("/captcha")) {
    //  Construct a new URL to style.css by using the URL
    //  of the script (mod.ts) as base (import.meta.url).

    const { svgContext, text } = makeCaptcha({
      height: 300,
      width: 600,
      textOption: {
        fontSize: 7,
      },
    });
    return new Response(svgContext, {
      headers: {
        "content-type": "image/svg+xml",
        "XX-Text": text,
      },
    });
  }

  return new Response(
    `<html>
        <head>
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <h1>Example</h1>
          <img src="captcha">
        </body>
      </html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    },
  );
}

addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});
