---
date: 2017-07-04T14:40:56-07:00
draft: true
title: What is HATEOAS?
---

HATEOAS, or _Hypertext as the Engine of Application State_, is a complicated-sounding term for a simple idea:

> **A client interacts with a REST API entirely through the responses provided dynamically by the server.**

Put even more simply:

> **You shouldn't need _any_ documentation or out-of-band information to use a REST API.**

This may sound odd, because the first stop for any developer working with a new API is the documentation. How could you interact with an unfamiliar API without any out-of-band information?

<!--more-->

You typically need to read API docs to understand:

* What endpoints are available
* How requests are structured
* What responses to expect

One of the distinguishing features of the REST architecture is this idea that the responses _themselves_ should tell you what you can do and how you can do it. This is HATEOAS in a nutshell, although it could also be referred to as "discoverability".

#### Clients are like browsers

Think about how your browser interacts with a site like [Wikipedia][wiki]. It doesn't have any special Wikipedia-specific code -- it knows how to render HTML and CSS, and that's about it (relatively speaking). Everything the browser needs to know about what it can do next is included in the document itself!

Imagine this simplified response:

```
<html>
  <a href="/wiki/Main_Page">Main Page</a>
  <a href="wiki/Help:Contents">Help</a>

  <form name="login" action="/login" method="post">
    <input type="text" name="username">
    <input type="password" name="password">
    <input type="submit">
  </form>
</html>
```

A REST API might return JSON or XML instead, but the principle is the same. Here's what a JSON response might look like, modeled with [Ion]({{< ref "post/modeling-json-api-with-ion.md" >}}):

```
{
  "main": { "href": "/wiki/Main_Page" },
  "help": { "href": "/wiki/Help:Contents" },

  "login": {
    "href": "/login",
    "rel": ["form"],
    "method": "POST",
    "value": [
      { "name": "username" },
      { "name": "password", "secret": true }
    ]
  }
}
```

If you think of the client like a browser, you already understand HATEOAS.

#### Links and state transitions

There are two ideas represented in the example above: **links** between resources, and **state transitions**.

A state transition is anything that you can do that changes the application state -- like logging in, creating a new post, or deleting a resource. In HTTP, these are "unsafe" verbs like PUT, POST, and DELETE. HTML represents these as `form` elements.

To truly satisfy the HATEOAS constraint, a REST API should express both where the client can go (a graph of links) and what it can change (allowed state transitions) in the response document.

#### Entry point or root document

When you use your browser to visit a deep URL, you rarely type the entire address manually. Instead, you visit the site's home page (or a bookmark you already have) and then use links to navigate to the location you want.

It's no different for REST APIs -- a starting point or "root" document allows a client to truly discover how to use an API just like a browser.

A simple root document could look like (using [Ion]({{< ref "post/modeling-json-api-with-ion.md" >}}) again):

```
{
  "href": "https://api.example.io",
  "users": { "href": "https://api.example.io/users" },
  "orders": { "href": "https://api.example.io/orders" }
}
```

#### Further reading

I didn't understand the concept of HATEOAS when I first started working on APIs, but the analogy to web browsers finally "clicked" it into place.

If you want to explore this idea further, here's some good reading:

* Dr. Fielding's [doctoral dissertation on REST][fielding-rest]
* REST Cookbook on [HATEOAS][rest-cookbook-hateoas]


[wiki]: https://en.wikipedia.org/wiki/HATEOAS
[fielding-rest]: http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
[rest-cookbook-hateoas]: http://restcookbook.com/Basics/hateoas/