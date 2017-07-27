---
title: "Await in a console application"
description: Using asynchronous methods in a command-line application
date: 2017-07-27T07:49:04-07:00
draft: true
tags: ["dotnet"]
---

I'm a big fan of the `async`/`await` pattern introduced in C#. It's one of the best ways to reason about asynchronous code, and it's spreading to [Python](https://www.python.org/dev/peps/pep-0492/) and [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) too.

Every once in a while, I need to run some async code in a .NET command-line application, but the Console Application template in Visual Studio makes it annoyingly difficult to do.

<!--more-->

Here's the problem: the entry point of a C# console application is `static void Main()`. In order to await asynchronous code, the method must be marked with `async`, but doing this in a console application results in a compiler error:

> an entry point cannot be marked with the 'async' modifier

An easy fix is to move the async code block into a separate `private static async Task<>` method, that you call from `Main`.

You *could* synchronously wait for the async code by calling `.Result` or `.Wait()` on the Task, but this causes a different problem that may not be obvious at first.

#### Exceptions wrapped in AggregateException

What happens when your asynchronous code throws an exception?

```csharp
class Program
{
    static void Main(string[] args)
    {
        try
        {
            var result = SomeAsyncCode().Result;
        }
        catch (ArgumentException aex)
        {
            Console.WriteLine($"Caught ArgumentException: {aex.Message}");
        }
    }

    private static async Task<string> SomeAsyncCode()
    {
        await Task.Delay(10);
        throw new ArgumentException("Oh noes!");
    }
}
```

Instead of catching the `ArgumentException` as you'd expect, the program will crash with an uncaught `AggregateException`:

![Code throws an AggregateException](/img/post/aggregate-exception.jpg)

Where did `AggregateException` come from?

Under the hood, the compiler generates a state machine to handle the async code block. Every exception that occurs in this chunk of async code is rolled up in an `AggregateException`. In this case, the `AggregateException` wraps a single `ArgumentException`, but it could contain many exceptions.

You don't normally see `AggregateException` when you write async code, because when you use the `await` keyword, the compiler "unrolls" the `AggregateException` for you and throws the first one it sees. It's part of the syntactic sugar that comes with `await`. If you block with `.Result` or `.Wait()`, you have to deal with the aggregation behavior yourself.

#### Blocking and unwrapping exceptions

Instead of blocking with `.Result`, use `.GetAwaiter().GetResult()`:

```csharp
static void Main(string[] args)
{
    try
    {
        var result = SomeAsyncCode().GetAwaiter().GetResult();
    }
    catch (ArgumentException aex)
    {
        Console.WriteLine($"Caught ArgumentException: {aex.Message}");
    }
}
```

Using this syntax, the behavior is much more familiar, because `.GetAwaiter().GetResult()` unrolls the exception the same way `await` does. This time, an `ArgumentException` will be caught.

#### Coming soon: async main

There's currently a [proposal on the C# Language board](https://github.com/dotnet/csharplang/issues/97) for adding "native" async entry points to C# 7.1. If this proposal is accepted and added to the language, the above example becomes much simpler (and more familiar):

```csharp
static async Task Main(string[] args)
{
    try
    {
        await Task.Delay(10);
        throw new ArgumentException("Oh noes!");
    }
    catch (ArgumentException aex)
    {
        Console.WriteLine($"Caught ArgumentException: {aex.Message}");
    }
}
```

The workaround I've detailed in this post works, but I like this proposed syntax much better. I hope it ends up in C# 7.1!

#### Further reading

* [Is Task.Result the same as .GetAwaiter.GetResult()?](https://stackoverflow.com/q/17284517/3191599)
* [A Tour of Task, Part 6: Results](https://blog.stephencleary.com/2014/12/a-tour-of-task-part-6-results.html)
* [Champion "Async Main" (C# 7.1)](https://github.com/dotnet/csharplang/issues/97)
