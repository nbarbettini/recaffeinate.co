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

Shoutcloud proudly states that they have libraries for "leading webscale platforms" like Node, Ruby, and Go, but sadly they seem to have left out the .NET stack. What's a responsible .NET developer to do?

<!--more-->

Have no fear: [Shoutcloud.NET](https://www.nuget.org/packages/Shoutcloud.NET) is here. If you aren't happy with `string.ToUpperCase()`, and want to do things in an `async` way for no reason, this library is for you!

Install it via the Package Manager GUI, or the console:

```
PM> install-package Shoutcloud.NET
```
