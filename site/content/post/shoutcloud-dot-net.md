+++
date        = "2016-04-10T16:30:57-07:00"
title       = "Asynchronous uppercase at scale"
description = "HELLO, WORLD?"
draft       = true
slug        = "shoutcloud-dot-net"
categories  = ".NET"
tags        = ["async", "fun"]
+++

[shoutcloud.io](http://shoutcloud.io/) is a hilarious parody of software-as-a-service offerings that provides All Caps as a Service. If you aren't happy with the uppercasing function built into your language of choice, you can make an (absolutely spurious) HTTP request to `API.SHOUTCLOUD.IO/V1/SHOUT` and get back a shoutier version of any string.

Shoutcloud proudly states that they have libraries for "leading webscale platforms" like Node, Ruby, and Go. Sadly, they seem to have left out the .NET stack. What's a responsible .NET developer to do?

<!--more-->

Have no fear: [Shoutcloud.NET](https://www.nuget.org/packages/Shoutcloud.NET) is here. If you aren't happy with `string.ToUpper()`, and want to do things over HTTP for no reason, this library is for you!

Install it via the Package Manager GUI, or the console:

```
PM> install-package Shoutcloud.NET
```

Then, make HTTP requests to get uppercased strings thousands of times slower than native code:

{{< gist c8e2e400e0ed7ab8647d00750ffd075f >}}

Of course, there's full compatibility with the TPL: `UPCASE` returns an awaitable Task, and takes an optional `CancellationToken` parameter. (You may be shouting, but you're not a barbarian!)

The library is compatible with these platforms:

* .NET framework 4.5.1 and higher
* DNX (full) 4.5.1 and higher
* DNX (CoreCLR, `dotnet`) 5.4 and higher

The source code is [on Github](https://github.com/nbarbettini/SHOUTCLOUD.NET). Happy shouting!
