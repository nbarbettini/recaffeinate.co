---
title: "Why does MCP use OAuth?"
description: "Is OAuth MCP's biggest mistake?"
date: 2026-08-29T08:55:00-07:00
tags: ["mcp", "oauth", "security"]
---

When I talk to engineering teams about MCP, a common question I hear is: **Why does MCP use OAuth?**

One engineer I talked to recently described OAuth as MCP's biggest mistake. OAuth is complicated and jargony (true), and it feels like overkill if all you want to do is give some tools or data to an agent. Wouldn't it be simpler to use API keys?

Yes it would! MCP _would_ be simpler without OAuth, but much less useful. I'll explain why.


## Building the open world

MCP's [grand vision](todo) is an open world where clients and servers can communicate with each other as easily as entering a URL.

This is how web browsers work: signing into google.com doesn't require anything beyond entering an address. For the web, open-world means that web browsers like Chrome and Firefox are **general-purpose clients**. Browsers can talk to any web server that speaks the same protocols they do, and as a user you don't need to set up your web browser in a special way to connect to each website.

For MCP, open-world means general-purpose clients like Claude and ChatGPT can connect to servers that speak MCP. There are two cases:
1. MCP servers that don't need authentication(*), like a weather server that everyone can access.
2. MCP servers that require authentication, because they deal with _your_ data and you need to sign in first.

There is one other case that's important to discuss first: Not all MCP servers **need** to be general-purpose!

## Internal world

MCP's grand open-world vision (and the constraints it imposes) only matter if you're building a server that needs to interoperable with general-purpose clients. In many cases, you don't! If you are building a custom agent and control the MCP client code, you control both sides of the equation. This is true of many internally-built agents at companies I work with.

The key point is: MCP's open-world constraints (like OAuth, as we'll see) only matter if you want general-purpose agents like ChatGPT and Goose to connect to your server.

## An auth by any other name

If you do want the Claudes and Gooses of the world to connect to your server, _and_ your server doesn't just handle public data, then MCP needs a way for clients to authenticate to servers. Clients can't have special code or requirements built into them for each server, because that won't scale. It also won't scale to ask users (especially non-technical users) to copy and paste an API key for your server into their agent.

So, authentication must be **standardized** (clients and servers can agree on a way to do it) and **discoverable** (clients can ask a server what it requires before connecting). But couldn't API keys work in a standard, discoverable way?

They could. Clients first need a way to obtain an API key for a server they haven't talked to before. This doesn't have to be complicated - maybe a small API on the server to issue an API key to the client. It's important for the client to identify itself so the server knows who is calling. It's also important to identify the end-user so the API key can be _for_ that user, otherwise it could let the user access things they shouldn't.

Clients and servers also need:
- A way to agree on what the API key can _do_ (read-only? read and write? only some resources?)
- A way to allow the API to expire after a period of time, so a leaked key's exposure is minimized
- A way to get a fresh API key after one expires

It's _possible_ to do all of this with API keys. The hard part is getting everyone on both sides of the equation to agree on each step. If you manage to do that - congratulations, you've reinvented OAuth! 😉 It has [first-connection discovery](todo link PRM), [client identification](todo link CIMD), explicit user consent and scoped access, [expiry, and rotation](todo link expiry? BCP?).

I understand why devs ask me, "Why doesn't MCP use API keys instead of OAuth". API keys really do _feel_ easier, because as developers we don't think twice about copypasting an API key to get something working. But in the limit, using API keys for MCP authentication would approximate OAuth anyway.


## Conclusion

There are three cases for MCP server developers to think about. Are you:
0. Serving custom clients, _not_ general-purpose clients? Use API keys, or anything else you want!
1. Serving general-purpose clients, but users don't need to sign in? You don't need authentication.
2. Serving general-purpose clients and users need to sign in? Use OAuth, because the general-purpose clients already support it.


Fortunately, the MCP ecosystem is already building out robust client support and SDKs, to help make connecting to remote MCP servers easy. And for server developers, identity providers like Descope and WorkOS make it easy to put auth in front of an MCP server.

Yes, OAuth is dense and full of jargon. It feels more complicated than it needs to be. I'm writing an [MCP + OAuth series](todo category link) here on my blog to help cut through the jargon. If you aren't familiar with the basics of OAuth, or need a refresher, watch my talk [OAuth and OpenID Connect in plain English](yt link).

Is there a specific MCP + OAuth topic you'd like demystified? Let me know on [LinkedIn](todo post link) [X](https://x.com/nbarbettini).


(*) For the true identity nerds: I am choosing to use _authentication_ rather than _authorization_ here to simplify the language. Yes, OAuth is technically about authorization, but for all intents and purposes it is being used for authentication here.