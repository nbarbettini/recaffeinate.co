---
title: "Serialize all errors as JSON in ASP.NET Core"
date: 2017-08-03T19:35:32-07:00
draft: true
tags: ["dotnet"]
---

A web API that returns JSON responses should be expected to return errors or exceptions as JSON messages, too. You can use [exception filters][exception-filters] in ASP.NET Core MVC to trap and serialize exceptions that occur within MVC. However, if an exception is thrown before (or after) the MVC pipeline, it won't be handled by the filter and the client will get an ugly error message (or a `500 Internal Server Error`).

A more universal solution that can trap and serialize _any_ exception that happens during a request is an exception handling middleware component. The syntax is a little different than an exception filter, but the principle is the same. In this post, I'll show you how to write error handling middleware and how to extend it with custom behavior.

<!--more-->

#### Exception middleware

The basic pattern for any ASP.NET Core middleware is a class with an `Invoke` method:

{{< gist fecdeebfb93ace7c239aa79963dbe19e >}}

You can't use `catch` to trap an exception here, because the exception has already occured by the time the middleware is called. Instead, use `IExceptionHandlerFeature.Error` to retrieve it.

Here's a working example that uses JSON.NET to serialize a custom response:

{{< gist 14b0e2d87c99034b60f9db9df5b7ecf4 >}}

Use the `UseExceptionHandler` method to wire up your class in the `Configure` method. It's important to put it directly above the `UseMvc` line:

{{< gist 3b5a421a47b1f3151da4feaf9cd08ba5 >}}

Now your middleware will be invoked whenever an unhandled exception occurs anywhere in your ASP.NET Core application.

#### Return more detail in development

It's a good idea to return generic error messages in production, so you don't leak information about your application. However, in development, the more detail the better.

You can use `IHostingEnvironment` in the `Startup` class to determine whether ASP.NET Core is running in development or production mode. It's available from the `ApplicationServices` container in the `Configure` method:

{{< gist 01030ef83df9d87452e60c0c65e4cf86 >}}

By passing `IHostingEnvironment` to your exception handling middleware, the middleware can choose whether to respond with a generic message, or the full exception message and stack trace:

{{< gist 010c028e3b4141b97af1780d9372e23d >}}

I have a full example of this exception handler class in my [Beautiful REST API example][beautiful-repo] repo. Check out [JsonExceptionMiddleware.cs][code] if you're curious!


[exception-filters]: https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/filters#exception-filters
[beautiful-repo]: https://github.com/nbarbettini/BeautifulRestApi/
[code]: https://github.com/nbarbettini/BeautifulRestApi/blob/master/src/Infrastructure/JsonExceptionMiddleware.cs
