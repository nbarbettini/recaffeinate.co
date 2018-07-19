---
title: "Enforce HTTPS correctly in ASP.NET Core APIs"
description: "How to correctly and securely enforce HTTPS in an ASP.NET Core Web API"
date: 2018-03-28T21:07:39-07:00
tags: ["dotnet"]
banner: lynda-rest-api
---

Most ASP.NET developers are familiar with the `[RequireHttps]` attribute that forces HTTPS connections for a particular route or controller. However, if you're building an API in ASP.NET Core, the [official documentation][docs-enforce-ssl] includes this warning:

> Do **not** use RequireHttpsAttribute on Web APIs that receive sensitive information. RequireHttpsAttribute uses HTTP status codes to redirect browsers from HTTP to HTTPS. API clients may not understand or obey redirects from HTTP to HTTPS.

It's important to use HTTPS for *both* your browser applications and APIs, but `[RequireHttps]` only focuses on the former. How should you enforce HTTPS for APIs?

<!--more-->

## Why not RequireHttps?

If you're wondering why you shouldn't use `[RequireHttps]`, take a look at what happens when you use the attribute on a controller:

```
GET http://api.example.com/values

302 Found
Location: https://api.example.com/values
```

`[RequireHttps]` automatically returns the `302 Found` HTTP status code, which will redirect a browser to the secure version of the URL. This has two problems for APIs:

* API clients may not pay attention to 302 redirects
* Any sensitive information a client attempts to send over HTTP could be intercepted

The latter is important to understand. If your API accepts an insecure connection, this can happen:

```
POST http://api.example.com/mysecret
Content-Type: application/json

{
  "secret": "I like JavaScript"
}

302 Found
Location: https://api.example.com/mysecret
```

It doesn't matter if the server tries to redirect the request, or even closes it with an error code. The data (and my secret love of JavaScript) was sent unencrypted and could have been intercepted.

As the docs state, it's a better idea to simply reject insecure HTTP requests entirely. If your API clients aren't sending sensitive information, you could also return an error code like `400 Bad Request`. I'll show you how to do both.

## Reject all insecure connections

The best way to ensure your API clients connect over HTTPS is to make it the only option. This removes the possibility of a client trying to send something sensitive over HTTP, even accidentally.

There are two ways to do this, depending on how you deploy your application:

* **At the reverse proxy layer**. If you have nginx, IIS, or another reverse proxy sitting in front of your application, configure it to only listen on HTTPS. That way, connections over 80 (HTTP) will be rejected.
* **At the server**. If you are serving your application directly from Kestrel (which isn't currently recommended), configure the server to only listen on 443. Thanks to Justin Helsley for pointing this out in the comments:

```csharp
.UseKestrel(options =>
{
    options.Listen(IPAddress.Loopback, 443, listenOptions =>
    {
        listenOptions.UseHttps("certificate.pfx", "password");
    });
});
```

Rui Figueiredo has a great article on [configuring HTTPS in ASP.NET Core from scratch](https://www.blinkingcaret.com/2017/03/01/https-asp-net-core/) that dives into the details of configuring nginx, IIS, or Kestrel. 👍

## Return an HTTP error code

In some APIs, you may want to allow insecure requests but return a status code like `400 Bad Request` to the client. This is **less secure** than rejecting the connection, because any data the client attempts to send in the request could be leaked as described above.

However, if this is the pattern your API needs, you can create a custom attribute that overrides the behavior of `[RequireHttps]`:

```csharp
public class RequireHttpsOrCloseAttribute : RequireHttpsAttribute
{
    protected override void HandleNonHttpsRequest(AuthorizationFilterContext filterContext)
    {
        filterContext.Result = new StatusCodeResult(400);
    }
}
```

Setting the `Result` property short-circuits the rest of the request pipeline, so the request will immediately return HTTP 400. You can then use `[RequireHttpsOrClose]` wherever you'd normally use `[RequireHttps]`:

```csharp
[RequireHttpsOrClose]
public class HomeController
```

Depending on your API semantics, you may want to return a different status code. Thanks to Tim VanFosson for this [contribution](https://github.com/nbarbettini/ApiSecurity/blob/master/ApiSecurity/RequireHttpsOrCloseAttribute.cs):

```csharp
[RequireHttpsOrClose(505)]
public class HomeController
```

## What about HSTS?

The [Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) header instructs browsers to avoid connecting to your site over HTTP, even accidentally.

HSTS is only useful for APIs if the API client observes the header. This could make sense if your API client is a browser (as in the case of a single-page app), but I think it's better to simply reject insecure connections in the first place. It certainly can't hurt to return the header, but don't rely on it as your _only_ method of enforcing HTTPS.

For browser-based applications on the other hand (MVC, Razor and Razor Pages, and static pages that bootstrap SPAs), I'd strongly recommend it! The excellent [NWebSec package](https://docs.nwebsec.com/en/latest/nwebsec/Configuring-hsts.html) makes it easy to add HSTS to your pipeline.

## Easy API security extensions

I've published the above code as a small package called [Recaffeinate.ApiSecurity][as-nuget]. The source is on [Github][as-github] if you want to take a look or add helpers of your own.

Let me know if you have any questions about API security in ASP.NET Core! Leave a comment below or chat with me on [Twitter][twitter].


[docs-enforce-ssl]: https://docs.microsoft.com/en-us/aspnet/core/security/enforcing-ssl
[as-nuget]: https://www.nuget.org/packages/Recaffeinate.ApiSecurity
[as-github]: https://github.com/nbarbettini/ApiSecurity
[twitter]: https://twitter.com/nbarbettini
