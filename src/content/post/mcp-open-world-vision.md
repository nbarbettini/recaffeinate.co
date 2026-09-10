---
title: "MCP's big, open-world vision"
description: "Understanding MCP for the web, and for the intranet"
date: 2026-09-06T08:55:00-07:00
tags: ["mcp"]
---

You don't need to fully understand [how MCP works]() to feel how useful it is: paste an MCP server URL into ChatGPT or Cursor and your agent gets new capabilities.

The ability to "paste and go" is **more foundational** than it may appear. MCP's big vision is that a client and server that have never connected before can do so without any prior setup. This is analogous to how browsers work on the web today, and is often referred to as an "open-world system".

MCP's open-world vision is sometimes misunderstood, because many MCP developers are _not_ actually building in the open world. In this post, I'll explain how to think about MCP whether you're building for the open web or not.

## Open world by default

By default, MCP assumes that the client developer (the builder of an agent), the server developer, and the user of an agent have no prior relationship. [SEP-991](https://modelcontextprotocol.io/seps/991-enable-url-based-client-registration-using-oauth-c) describes the technical vision:

> MCP's value comes from its ability to connect arbitrary clients and servers, making the 'no pre-existing relationship' case critical to address.

In plain terms, this means that I can tell my agent to connect to `https://mcp.linear.com/mcp`, and it will work even if that server has never heard of my agent before. Similarly, my agent doesn't need to have special code to _specifically_ handle Linear's MCP server - it just has code to connect to MCP servers _generally_.

This is how web browsers have worked since the beginning of the web. When I type `https://microsoft.com` into Chrome or Firefox, I expect I can browse that site without pre-configuring anything. I just type the URL and go. The web is a great example of an open-world system, and one that MCP draws heavy inspiration from.

It puts MCP in a uniquely complex corner of security (and OAuth), and TODO

## MCP for the open web, MCP for the closed intranet

But open-world isn't the whole story. Not everyone is building MCP servers for the web!

I talk to enterprises every day that are rolling out MCP, and they need:
- pre-registered servers approved by IT
- a gateway to manage and control MCP connections
- enterprise authorization systems to govern MCP
- telemetry, logging, and observability of MCP traffic

Inside of an enterprise, many of MCP's open-world design constraints don't make sense. Why do all this OAuth stuff when [API keys feel easier]()?


## Why doesn't MCP just...

MCP is open-world by default, and that shapes the design and constraints of the core protocol. Some things, like [client credential grant]() and headers carrying authorization policy, are useful in the enterprise (closed) world, but can't pass the design test: "What is a general-purpose client supposed to do with this?"

That is why MCP has [extensions]()!



2. **Name it:** no prior relationship = most common. Quote SEP-991. Give it the name "open world."
3. **Three-party test + web analogy.**
4. **Closed world is allowed; it is not the default.** EMA / pre-registration as the respectful contrast.
5. **The design test.** One example. Point forward.
6. **Stop.** Do not solve denials.




