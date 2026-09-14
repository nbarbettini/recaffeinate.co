---
title: "Why does MCP use OAuth?"
description: "Is OAuth MCP's biggest mistake?"
date: 2026-08-29T08:55:00-07:00
tags: ["mcp", "oauth", "security"]
---

An engineer I talked to recently described OAuth as MCP's biggest mistake. Why does MCP use OAuth at all? OAuth is complicated and jargony (true), and it feels like overkill if all you want to do is give some tools or data to an agent. Wouldn't it be simpler to just use API keys?

It might be! MCP _could_ be simpler without OAuth, but less useful. I'll explain why.


## Building for the open world

MCP's [big vision](/post/mcp-open-world-vision) is that clients and servers that have never met can communicate with each other. Paste a URL into your agent and go - no prior setup required.

This is how web browsers work: visiting google.com doesn't require anything beyond entering an address. For MCP, it means general-purpose clients like Claude and Goose can connect to any server that speaks MCP.

Broadly speaking, there are two factors to solve for:
- Does your server support general-purpose clients, or custom clients?
- Does your server need authentication(*), because it deals with private data?

| | General-purpose clients | Custom clients |
|---|---|---|
| Not authenticated | Simple | Simple |
| Authenticated |  | Often provided by the organization |


1. MCP servers that don't need authentication, like a weather server that everyone can access.
2. MCP servers that need authentication, because they deal with _your_ data and you need to sign in first.


There is one other case that's important to discuss first: Not all MCP servers **need** to be general-purpose!

## Auth by any other name

If you do want the Claudes and Gooses of the world to connect to your server, _and_ your server doesn't just handle public data, then MCP needs a way for clients to authenticate to servers. Clients can't have special code or requirements built into them for each server, because that won't scale. It also won't scale to ask users (especially non-technical users) to copy and paste an API key for your server into their agent.

So, authentication must be **standardized** (clients and servers can agree on a way to do it) and **discoverable** (clients can ask a server what it requires before connecting). But couldn't API keys work in a standard, discoverable way?

They could. Clients first need a way to obtain an API key for a server they haven't talked to before. This doesn't have to be complicated - maybe a small API on the server to issue an API key to the client. It's important for the client to identify itself so the server knows who is calling. It's also important to identify the end-user so the API key can be _for_ that user, otherwise it could let the user access things they shouldn't.

Clients and servers also need:
- A way to agree on what the API key can _do_ (read-only? read and write? only some resources?)
- A way to allow the API to expire after a period of time, so a leaked key's exposure is minimized
- A way to get a fresh API key after one expires

It's _possible_ to do all of this with API keys. The hard part is getting everyone on both sides of the equation to agree on each step. If you manage to do that - congratulations, you've reinvented OAuth! 😉 It has [first-connection discovery](todo link PRM), [client identification](todo link CIMD), explicit user consent and scoped access, [expiry, and rotation](todo link expiry? BCP?).

I do understand why devs ask me, "Why doesn't MCP use API keys instead of OAuth?" API keys really do _feel_ easier, because as developers we don't think twice about copy-pasting an API key to get something working. But in the limit, using API keys for MCP authentication would approximate OAuth anyway.

I think what developers are often struggling with is, "Do I really need to understand all this OAuth stuff just to build an MCP server?"

## You ~~Ain't Gonna~~ Might Not Need It



## Conclusion

There are three cases for MCP server developers to think about. Are you:
0. Serving custom clients, _not_ general-purpose clients? Use API keys, or anything else you want!
1. Serving general-purpose clients, but users don't need to sign in? You don't need authentication.
2. Serving general-purpose clients and users need to sign in? Use OAuth, because the general-purpose clients already support it.


Fortunately, the MCP ecosystem is already building out robust client support and SDKs, to help make connecting to remote MCP servers easy. And for server developers, identity providers like Descope and WorkOS make it easy to put auth in front of an MCP server.

Yes, OAuth is dense and full of jargon. It feels more complicated than it needs to be. I'm writing an [MCP + OAuth series](todo category link) here on my blog to help cut through the jargon. If you aren't familiar with the basics of OAuth, or need a refresher, watch my talk [OAuth and OpenID Connect in plain English](yt link).

Is there a specific MCP + OAuth topic you'd like demystified? Let me know on [LinkedIn](todo post link) or [X](https://x.com/nbarbettini)!


(*) For the true identity nerds: I am choosing to use _authentication_ rather than _authorization_ here to simplify the language. Yes, OAuth is technically about authorization, but for all intents and purposes it is being used for authentication here.