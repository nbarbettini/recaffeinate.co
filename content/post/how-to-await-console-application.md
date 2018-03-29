---
title: "Async/await in a console application"
description: Using asynchronous methods in a command-line application
date: 2017-08-08T07:49:04-07:00
tags: ["dotnet"]
---

I'm a big fan of the async/await pattern introduced in C#. It's one of the best ways to reason about asynchronous code, and it's spreading to [Python](https://www.python.org/dev/peps/pep-0492/) and [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) too.

Every once in a while, I need to run some async code in a .NET command-line application, but the Console Application template in Visual Studio makes it annoyingly difficult to do.

<!--more-->

Here's the problem: the entry point of a C# console application is `static void Main()`. In order to await asynchronous code, the method must be marked with `async`, but doing this results in a compiler error:

> an entry point cannot be marked with the 'async' modifier

An easy fix is to move the async code block into a separate method that you can mark with `async` and call from `Main`:

```csharp
class Program
{
    static void Main(string[] args)
    {
        // Call SomeAsyncCode() somehow
    }

    private static async Task SomeAsyncCode()
    {
        // Use await here!
        await Task.Delay(10);

        // Other async goodness...
    }
}
```

You *could* synchronously wait for the async method by using `.Result` or `.Wait()`, but this causes a different problem that may not be obvious at first.

## Exceptions wrapped in AggregateException

What happens when your asynchronous code throws an exception?

```csharp
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
```

You'd expect this code to catch and log the `ArgumentException`, but it doesn't. Instead of catching the `ArgumentException`, the program will crash with an unhandled `AggregateException`:

![An unhandled exception of type 'System.AggregateException' occurred in mscorlib.dll. One or more errors occurred](/img/post/aggregate-exception.jpg)

Where did `AggregateException` come from? (Warning: compiler internals ahead. Skip down if you just want the solution!)

Under the hood, the compiler generates a state machine to handle the async code block. Every exception that occurs while executing the async code is rolled up in an `AggregateException`. In this case, the `AggregateException` wraps a single `ArgumentException`, but it could contain multiple exceptions.

You don't normally see `AggregateException` when you use `await`, because the compiler "unrolls" the `AggregateException` for you and throws the first one it sees. It's part of the syntactic sugar that comes with `await`.

If you block with `.Result` or `.Wait()` instead of using `await`, you have to deal with the `AggregateException` behavior yourself.

## Unwrap exceptions manually

Instead of blocking with `.Result`, use `.GetAwaiter().GetResult()`:

```csharp
try
{
    var result = SomeAsyncCode().GetAwaiter().GetResult();
}
catch (ArgumentException aex)
{
    Console.WriteLine($"Caught ArgumentException: {aex.Message}");
}
```

This time, the `ArgumentException` will be caught as you'd expect, because `.GetAwaiter().GetResult()` unrolls the first exception the same way `await` does. This approach follows the [principle of least surprise][least-surprise] and is easier to understand.

## Coming soon: async main

There's currently a [proposal on the C# Language board](https://github.com/dotnet/csharplang/issues/97) to add "native" async entry points in C# 7.1. If this proposal is accepted and added to the language, the above example becomes much simpler (and more familiar) with `await`:

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

I like the proposed syntax and hope it makes the cut. Until then, I'll stick with the `GetAwaiter().GetResult()` workaround!

## Further reading

* [Is Task.Result the same as .GetAwaiter.GetResult()?](https://stackoverflow.com/q/17284517/3191599) on StackOverflow
* [A Tour of Task, Part 6: Results](https://blog.stephencleary.com/2014/12/a-tour-of-task-part-6-results.html) on Stephen Cleary's blog
* [Champion "Async Main" (C# 7.1)](https://github.com/dotnet/csharplang/issues/97) on dotnet/csharplang

[least-surprise]: https://en.wikipedia.org/wiki/Principle_of_least_astonishment
