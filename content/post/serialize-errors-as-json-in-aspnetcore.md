---
title: "Serialize all errors as JSON in ASP.NET Core"
description: Automatically return pretty error responses in an ASP.NET Core API
date: 2017-08-01T12:55:32-07:00
tags: ["dotnet"]
banner: lynda-rest-api
---

A web API that returns JSON responses should be expected to return errors or exceptions as JSON messages, too. You can use [exception filters][exception-filters] in ASP.NET Core MVC to trap and serialize exceptions that occur within MVC. However, if an exception is thrown before (or after) the MVC pipeline, it won't be handled by the filter and the client will get an ugly error message (or a `500 Internal Server Error`).

A more universal solution that can trap and serialize _any_ exception that happens during a request is an exception handling middleware component. The syntax is a little different than an exception filter, but the principle is the same.

In this post, I'll show you how to write error handling middleware and how to extend it with custom behavior.

<!--more-->

#### Exception middleware

The basic pattern for any ASP.NET Core middleware is a class with an `Invoke` method:

```csharp
public class BasicMiddleware
{
    public Task Invoke(HttpContext context)
    {
        // do something with context
    }
}
```

You can't use `catch` to trap an exception here, because the exception has already occured by the time the middleware is called. Instead, use `IExceptionHandlerFeature.Error` to retrieve it.

Here's a working example that uses JSON.NET to serialize a custom response:

```csharp
public class JsonExceptionMiddleware
{
    public async Task Invoke(HttpContext context)
    {
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var ex = context.Features.Get<IExceptionHandlerFeature>()?.Error;
        if (ex == null) return;

        var error = new 
        {
            message = ex.Message
        };

        context.Response.ContentType = "application/json";

        using (var writer = new StreamWriter(context.Response.Body))
        {
            new JsonSerializer().Serialize(writer, error);
            await writer.FlushAsync().ConfigureAwait(false);
        }
    }
}
```

The `UseExceptionHandler` method in the `Configure` method of the `Startup` class adds your exception handling middleware to the ASP.NET Core pipeline. Since order matters for middleware, make sure you wire it up above the `UseMvc` line:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    // other code...
    
    app.UseExceptionHandler(new ExceptionHandlerOptions 
    {
        ExceptionHandler = new JsonExceptionMiddleware().Invoke
    });
    
    app.UseMvc();
}
```

Now your middleware will be invoked whenever an unhandled exception occurs anywhere in your ASP.NET Core application.

#### Return more detail in development

It's a good idea to return generic error messages in production, so you don't leak information about your application. However, in development, the more detail the better.

You can use `IHostingEnvironment` in the `Configure` method to determine whether ASP.NET Core is running in [development or production mode][dev-prod]. It can be passed to your middleware component:

```csharp
// env is injected in the Configure method constructor
app.UseExceptionHandler(new ExceptionHandlerOptions 
{
    ExceptionHandler = new JsonExceptionMiddleware(env).Invoke
});
```

By passing `IHostingEnvironment` to your exception handling middleware, the middleware code can choose whether to respond with a generic message, or the full exception message and stack trace:

```csharp
if (env.IsDevelopment())
{
    error.Message = ex.Message;
    error.Detail = ex.StackTrace;
}
else
{
    error.Message = DefaultErrorMessage;
    error.Detail = ex.Message;
}
```

Alternatively, you could perform this check in the `Configure` method, and add different middleware to the pipeline if the app was in development versus production mode.

There's a full example of this exception handler class in my [Beautiful REST API example][beautiful-repo] repo. Check out [JsonExceptionMiddleware.cs][code] if you're curious!


[exception-filters]: https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/filters#exception-filters
[beautiful-repo]: https://github.com/nbarbettini/BeautifulRestApi/
[code]: https://github.com/nbarbettini/BeautifulRestApi/blob/master/src/Infrastructure/JsonExceptionMiddleware.cs
[dev-prod]: https://docs.microsoft.com/en-us/aspnet/core/fundamentals/environments
