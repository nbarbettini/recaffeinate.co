---
title: "Better route linking in ASP.NET Core"
date: 2017-08-01T06:41:51-07:00
draft: true
tags: ["dotnet"]
banner: lynda-rest-api
---

ASP.NET Core uses [route templates][route-templates] and [attributes][attr-routing] to define how methods in an API controller should be bound to routes or endpoints in the API:

```
[HttpGet("/post/{id}")]
public Task<IActionResult> GetPostByIdAsync(int id)
{
    // find a post!
}

[HttpPost("/posts/new")]
public Task<IActionResult> NewPostAsync()
{
    // create a new post...
}
```

Simple enough!

You can provide a unique name for each route if you need to link to the route somewhere else. In this post, I'll show you how to name your routes, and share some best practices I've developed for linking between routes in ASP.NET Core.

<!--more-->


#### Named routes

You can specify an optional string name as another parameter of the attribute:

```
[HttpGet("/post/{id}", Name = "GetPost")]
```

Route names have no impact on ASP.NET Core's route matching behavior, but they're quite handy if you need to generate URLs and links between routes from application code. Because ASP.NET Core identifies a route by its name, the name you provide must be globally unique.


#### URL generation in ASP.NET Core

If you need to generate a URL in your application (to link to an MVC action, or for [HATEOAS]({{< ref "post/what-is-hateoas.md" >}}) in an API), ASP.NET Core provides the `Url` helper property in controllers and views:

```
var linkToRoute = Url.Link("GetPost", new { id = 1 });
// Produces: http://your-base-url/controller/post/5
```

The `IUrlHelper` object does all the heavy lifting of determining the base URL of your application, picking the right protocol (HTTP or HTTPS), generating the full path to the route you specified, and appending any route values (the second parameter above). It requires that you specify a route by name, hence the need to add the `Name` property to the `HttpVerb` attribute.

Since the `IUrlHelper` only identifies a route by name, no two methods can have the same route name -- route names must be globally unique.

The route name makes for a nice separation between declaring the route and (later) linking to it, but it starts to smell a bit like a [magic string][magic-string]. What if you decide to rename a route? Unless you replaced the name everywhere in your code, calls to `Url.Link()` using the old name would start failing silently with no warning.

Wouldn't it be nice for the compiler to give you a warning instead?


#### Named routes with `nameof`

The `nameof` keyword provides a simple way to get the compiler to work for you:

```
[HttpGet("/post/{id}", Name = nameof(GetPostByIdAsync))]
public Task<IActionResult> GetPostByIdAsync(int id)
{
    // find a post!
}

// Later:
var link = Url.Link(
    routeName: nameof(PostsController.GetPostByIdAsync),
    routeValues: new { id = 1 });
```

By naming the method with a long, descriptive name (`GetPostById` instead of `Get` or `GetPost`), and using `nameof` to name the route after the method, the compiler will ensure that references to the route by name will always be correct, anywhere in your code. Less magic strings, more compiler warnings, less unexpected behavior.

#### Strongly-typed parameter lists

The second parameter to `Url.Link` defines the **route values** that should be passed to the route -- parts of the path or query string, for example:

```
// Given this definition:
[HttpGet("/post/{id}")]

// These route values:
var link = Url.Link(
    routeName: nameof(PostsController.GetPostByIdAsync),
    routeValues: new { id = 1 });

// Match the token in the definition to produce:
/post/1
```

You can pass a number of types for the `routeValues` parameter: a `RouteValuesDictionary` instance, a `Dictionary<string, object>`, or an anonymous type (like the above). I like the clean syntax of passing an anonymous type, but the lack of IntelliSense or type checking means it's easy to misspell or forget a parameter. It'd be nice to get some compiler help here, too.

Instead of defining the route parameters in the method signature, you can wrap them up in a simple POCO:

```
public class GetPostByIdParameters
{
    [FromRoute]
    public int Id { get; set; }
}
```
The `[FromRoute]` attribute in the POCO isn't strictly necessary (ASP.NET Core's model binder is smart), but it helps remove any ambiguity about what the `Id` property is intended for.

The new method definition will look like:

```
public Task<IActionResult> GetPostByIdAsync(GetPostByIdParameters parameters)
{
    // Use parameters.Id instead of id here
}
```

Rewriting the method in this way doesn't affect the routing or model binding behavior, at least not for simple cases.

Now providing route values to `Url.Link` is type-safe and checked by the compiler:

```
var link = Url.Link(
    routeName: nameof(PostsController.GetPostByIdAsync),
    routeValues: new GetPostByIdParameters { Id = 1 });
```

#### Further reading

The ASP.NET Core documentation has some great reference material on routing and URL generation:

* [Routing fundamentals][route-templates]
* [Routing to controllers in MVC](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/routing)
* [Route template reference](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/routing#route-template-reference)
* [URL generation reference](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/routing#url-generation-reference)

Let me know your favorite tips and tricks for routing and URL generation in ASP.NET Core!


[route-templates]: https://docs.microsoft.com/en-us/aspnet/core/fundamentals/routing
[attr-routing]: https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/routing#attribute-routing-with-httpverb-attributes
[url-gen]: https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/routing#url-generation
[magic-string]: http://deviq.com/magic-strings/
