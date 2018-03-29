---
title: "Enforce HTTPS correctly in ASP.NET Core APIs"
description: "How to correctly and securely enforce HTTPS in an ASP.NET Core Web API"
date: 2018-03-28T21:07:39-07:00
tags: ["dotnet"]
banner: lynda-rest-api
---

Most ASP.NET developers are familiar with the `[RequireHttps]` attribute that forces HTTPS connections for a particular route or controller. However, if you're building an API, the [ASP.NET Core documentation][docs-enforce-ssl] includes this warning:

> Do **not** use RequireHttpsAttribute on Web APIs that receive sensitive information. RequireHttpsAttribute uses HTTP status codes to redirect browsers from HTTP to HTTPS. API clients may not understand or obey redirects from HTTP to HTTPS.

It's important to use HTTPS for *both* your browser applications and APIs, but `[RequireHttps]` only focuses on the former. How should you enforce HTTPS for APIs?

<!--more-->

## Why not RequireHttps?

If you're wondering why you shouldn't use `[RequireHttps]`, take a look at what happens when you use the attribute on an API controller:

```
GET http://localhost/api/values

302 Found
Location: https://localhost/api/values
```

`[RequireHttps]` automatically returns a `302 Found` status, which will redirect a browser to the secure URL. This has two problems for APIs:

* API clients may not pay attention to `302` redirection status codes
* Any sensitive information a client attempts to send over HTTP could be intercepted

As the docs state, it's a better idea to return `400 Bad Request` (which API clients will be more likely to understand), or to simply reject any HTTP connections entirely.

I think the latter is the best idea, but I'll show you how to do both.

## Require HTTPS or return 400

To return `400 Bad Request` instead of redirecting, you can create a custom attribute that overrides the existing behavior:

```csharp
public class RequireHttpsOrClose : RequireHttpsAttribute
{
    protected override void HandleNonHttpsRequest(AuthorizationFilterContext filterContext)
    {
        filterContext.Result = new BadRequestResult();
    }
}
```

Setting the `Result` property short-circuits the rest of the request pipeline, so the request will immediately return code 400. You can then use `[RequireHttpsOrClose]` wherever you'd normally use `[RequireHttps]`.

## Reject all insecure requests

Unless you have clients that absolutely cannot connect over HTTPS, the best idea is to force HTTPS for all connections to your API. You could do this at the API gateway or reverse proxy layer (if you have one), but you can also do it with a small piece of ASP.NET Core middleware:

```csharp
public static class AbortIfNotHttpsApplicationBuilderExtensions
{
    public static IApplicationBuilder AbortIfNotHttps(this IApplicationBuilder app)
    {
        app.Use(async (context, next) =>
        {
            if (!context.Request.IsHttps)
            {
                context.Abort();
            }

            await next();
        });

        return app;
    }
}
```

Add this at the very top of your `Configure()` request pipeline in `Startup.cs`:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    app.AbortIfNotHttps();

    if (env.IsDevelopment())
    // The rest of your pipeline...
}
```

Now all insecure requests will be rejected. Nice and easy!

## Easy API security extensions

I've published these two classes as a small package called [Recaffeinate.ApiSecurity][as-nuget]. The source code is on [Github][as-github] if you want to take a look or add helpers of your own.

Let me know if you have any questions about API security in ASP.NET Core! Leave a comment below or chat with me on [Twitter][twitter].


[docs-enforce-ssl]: https://docs.microsoft.com/en-us/aspnet/core/security/enforcing-ssl
[as-nuget]: https://www.nuget.org/packages/Recaffeinate.ApiSecurity
[as-github]: https://github.com/nbarbettini/ApiSecurity
[twitter]: https://twitter.com/nbarbettini
