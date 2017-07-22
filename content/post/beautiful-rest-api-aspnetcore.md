---
date: 2017-07-04T14:40:56-07:00
draft: true
title: Beautiful RESTful APIs in ASP.NET Core
tags: ["dotnet"]
---

(intro)

(hateoas)

Today, I'll show you how to solve this problem with ASP.NET Core and the ION hypermedia type. (If you want an introduction to ION, read [Modeling JSON APIs with ION][ion-intro]).

<!--more-->

# Why ASP.NET Core?

ASP.NET Core is an open-source web framework from Microsoft that runs on top of .NET Core (also open-source). It's faster than Node/Express (by a [long shot][perf-vs-node]), and it works well with modern web patterns like MVC and single-page apps. And you get the awesome features of C# like async/await and LINQ.

If you haven't tried ASP.NET Core lately (or ever!), read my post on [building a minimal JSON API](aspnetcore-api) with ASP.NET Core.

(fast, statically-typed, big ecosystem, runs anywhere)

# Modeling resources in ASP.NET Core

