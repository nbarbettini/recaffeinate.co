---
title: "Why does MCP use OAuth instead of API keys?"
description: "Is OAuth MCP's biggest mistake?"
previewimage: "/img/post/why-mcp-uses-oauth/mcp-oauth-preview.webp"
previewimagealt: "Three hand-drawn keys on a keyring with an orange MCP tag"
date: 2026-11-20T08:55:00-08:00
tags: ["mcp", "oauth", "security"]
series:
  name: "Model Context Protocol explained"
  order: 2
canonical: "https://aaif.io/blog/why-does-mcp-use-oauth-instead-of-api-keys"
---

_This article was originally published on the [Agentic AI Foundation blog](https://aaif.io/blog/why-does-mcp-use-oauth-instead-of-api-keys)._

<img src="/img/post/why-mcp-uses-oauth/mcp-oauth-square.webp" class="headshot" alt="Three hand-drawn keys on a keyring with an orange MCP tag" width="628" height="628">

An engineer I talked to recently described OAuth as **MCP's biggest mistake**. Wouldn't it be way simpler to just use API keys?

Fair question! OAuth is complicated and jargon-y, and it feels like overkill if all you want to do is give some tools or data to an agent.

Some MCP servers really do need OAuth, but not all. I'll explain when OAuth is needed, and when it might not be.

## The general-purpose vision

MCP's [big vision](/post/mcp-open-world-vision) is that clients and servers that have never met can communicate with each other. As the user of an agent, I just paste a URL into my agent and go, without configuring a custom integration.

This is how web browsers work: to visit `google.com` I just type that address into my browser. I don't need to manually set up a relationship between my computer and Google. The same idea applied to MCP means general-purpose clients[^general-purpose-clients] like Claude and goose can connect to any server that speaks MCP.

Remote[^local-servers] MCP servers fall into two categories themselves:

1. Unprotected servers, like a weather server that anyone can access, that do not require auth
2. Protected servers that deal with _your_ data specifically, or otherwise require login or authentication

When you think of connecting your agent to a service like GitHub, Linear, or Figma, that's a remote protected MCP server. In this post, I'm focusing on that category.

There are two reasons why API keys aren't a good solution here. First, **user experience**: finding or generating an API key in a service I want to use, then pasting it into my MCP client isn't a user-friendly experience for non-developers.

Let's say we required MCP servers to host an endpoint that automatically provisioned API keys, so the user's experience was simple (no complex pre-setup, just type and go to start connecting). Then we have a different problem: **standardization**.

## Auth by any other name

There are many MCP servers in the wild. General-purpose clients can't have special code to deal with each one, because that won't scale: client developers would spend all their time writing similar code for thousands of different servers.

So, auth must be **standardized**. Auth must also be **discoverable**, because a client connecting to a server it's [never seen before](/post/mcp-open-world-vision) needs to ask, "What do I need to provide in order to connect?"

Could API keys work in a user-friendly, standard, and discoverable way?

They could. Clients need a way to obtain an API key for a server they haven't talked to before, like the provisioning endpoint we imagined above. It's important for the client to identify itself so the server knows who is calling, and for the server to verify the end-user's identity. It's also crucial to get the end-user's consent for the client to act on their behalf.

Clients and servers also need:

- A way to agree on what the API key can _do_ (read-only? read and write?)
- A way for the API key to expire after a period of time, so a leaked key's exposure is minimized
- A way to get a fresh API key after one expires

It's _possible_ to do all of this with API keys. The hard part is getting everyone on both sides of the client/server equation to agree on how to do it. If you manage to do that, you've basically reinvented OAuth! 😉

The reason MCP adopted OAuth 2.1 and its extensions is because they provide the things MCP needs: [first-connection discovery](https://www.rfc-editor.org/rfc/rfc9728.html), [client identification](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-client-id-metadata-document), explicit user consent and scoped access, [expiry and renewal](https://www.rfc-editor.org/rfc/rfc9700.html#section-4.14). These standards already exist, are widely used, and in many cases have been stress-tested for years or decades.

But that's not the whole story, because not every MCP client/server pair needs OAuth!

## You ~~ain't gonna~~ might not need it

I think what developers are often _actually_ struggling with is,

- Do I really need to understand all this OAuth stuff to build an MCP server?
- What if my company's requirements differ from what the MCP spec says?

Many enterprises already have a well-defined security architecture built on top of API keys, mTLS, OAuth client credentials, or something else. The team building MCP servers is asked to fit MCP's square OAuth peg into a round hole.

This is where the distinction between general-purpose clients and custom clients matters. If your goal is for off-the-shelf ChatGPT or Cursor to talk to your MCP server, you _should_ stick closely to the spec, and that means OAuth for protected servers. However, if only custom clients will talk to your MCP server, you have a lot more leeway:

|                        | General-purpose client  | Custom client               |
| ---------------------- | ----------------------- | --------------------------- |
| **Unprotected server** | No auth needed          | No auth needed              |
| **Protected server**   | Follow MCP's OAuth flow | Agree on auth ahead of time |

Teams building vertical or in-house agents often build the client and server together. If you control both sides of the equation, then you can pre-arrange the relationship and use API keys, the OAuth [client credentials](https://modelcontextprotocol.io/extensions/auth/oauth-client-credentials) or [EMA extensions](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization), or your own internal auth scheme. You can't assume a general-purpose client is pre-configured for it, but you can ensure your custom client is.

## Conclusion

MCP's big vision is that general-purpose clients can talk to servers they haven't met before, and OAuth supplies an existing standard for achieving that vision. Many MCP server developers I talk to are building servers for that general-purpose vision, but not all.

The client/server mix you're building for matters. A protected server that needs to work with general-purpose clients is exactly the problem MCP's OAuth flow solves. If you're building the client and server together, you can agree on another approach.

Is there a specific MCP + OAuth topic you'd like demystified? Let me know on LinkedIn or [X](https://x.com/nbarbettini)!

[^general-purpose-clients]:
    By general-purpose, I mean a client that can connect to MCP servers it doesn't have any prior relationship to. You can also call them "off-the-shelf clients". Claude, ChatGPT, goose, Hermes, Cursor, and OpenClaw are all examples of general-purpose clients.

    The key distinction is: These clients and agents do not have special code to handle specific MCP servers. They support the "type and go" experience, and don't _require_ the user to manually set up special connection details for each server.

    The opposite are custom clients, which are purpose-built to talk to specific MCP servers. They are often embedded directly within a vertical or special-purpose agent.

[^local-servers]: Local (stdio) MCP servers are out of scope here, because they run on the end-user's machine and are not multi-user.
