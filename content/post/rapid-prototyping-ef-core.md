---
title: "Rapid Prototyping with Entity Framework Core InMemory"
date: 2017-07-28T08:33:32-07:00
draft: true
tags: ['dotnet']
---

When you're building a large web application or API that uses a database, it's common to set up a development database on your local machine. The local database needs to be of the same type as your production database, so you don't have any surprises when you push your code to production.

Requiring a local SQL Server or Mongo installation can be a pain if you're collaborating with other people on a project. It also means you need to write migrations or scripts to reset the database so you always have a clean, repeatable starting point when writing code or running tests.

The new [InMemory provider][mem-provider] provides an alternative. Instead of setting up a local database, you point Entity Framework to an in-memory store that acts like a real database (LINQ and everything) without the hassle of setting one up. It's one of my favorite features of Entity Framework Core.

<!--more-->

#### Caveats

As described in the [documentation][mem-provider], InMemory isn't a true relational database. That means that if your code relies on database constraints to throw errors (when saving new data, for example), InMemory will behave differently than a database like SQL Server.

For most prototyping and testing, this won't matter. If you need to test against a true relational database, you can use [SQLite in-memory][sqlite-provider] instead.

#### Wire up InMemory

When you create your `DbContext`, you'll need to add a special constructor that InMemory requires:

{{< gist 02abc016237e4b051be7b5172c1ff80f >}}

Then, in the `ConfigureServices` method of the `Startup` class, specify that you want to use the InMemory provider:

{{< gist 649fdcf3c6659420b9d1591b399ad33a >}}

You need to have `using Microsoft.EntityFrameworkCore` at the top of your Startup file in order to see the `UseInMemoryDatabase` method (something that's tripped me up more than once).

#### Add test data

#### Example

[mem-provider]: https://docs.microsoft.com/en-us/ef/core/miscellaneous/testing/in-memory
[sqlite-provider]: https://docs.microsoft.com/en-us/ef/core/miscellaneous/testing/sqlite
