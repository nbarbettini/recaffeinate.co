---
title: "Introducing the MCP Debugger"
description: "A free tool to test MCP servers the way an agent experiences them."
date: 2026-03-16T05:55:31-08:00
tags: ["mcp", "mcpdebugger"]
---

<img src="/img/post/introducing-mcp-debugger/mcp-logo-sm.png" class="headshot">

I've been building and testing Model Context Protocol (MCP) servers in production for the past year. One thing has become painfully clear: there's a huge gap between a server that "implements MCP" and one that agents can actually use reliably.

If you've ever wired up an MCP server and wondered why your agent can't seem to call any tools, you're not alone!

I got tired of debugging these problems by hand, so I built <a href="https://mcpdebugger.dev" target="_blank">MCP Debugger</a> to do it for me.


## Why MCP servers break

Reading the MCP spec is one thing. Implementing an HTTP server that real clients can talk to is another.

In my experience, things often go wrong in a few common areas:

* **Authorization flows don't work end-to-end.** MCP depends on OAuth 2.1 and a dizzying array of extensions (PKCE, Protected Resource Metadata, Client ID Metadata Documents). If any one link in the chain is broken, clients can't connect. Getting everything just right takes trial and error.
* **Tool metadata is missing or ambiguous.** A server might return tools without robust descriptions or without parameter types, so the agent has to guess what to pass... and guesses wrong.
* **Frameworks have spec gaps.** Most devs use an MCP server framework to jump-start their projects, but some frameworks have incomplete spec coverage that the developer never notices until a client tries to connect in the wild.

To make matters worse, the MCP spec has been evolving quickly, especially around authorization and security. These changes are **good**, but keeping up with a moving target is hard, and the failure modes are subtle.


## Introducing MCP Debugger

I built a tool that interacts with your server the same way a real MCP client would, and reports what happens. Give it a server URL and it will:

* Connect and authorize as a real MCP client
* Discover the server's tools and inspect their metadata
* Run protocol-level validation checks
* Report exactly where things deviate from what agents expect

The result is a report that tells you what would cause an agent to fail... before the problem actually occurs.


## Try it out

Head over to <a href="https://mcpdebugger.dev" target="_blank">mcpdebugger.dev</a>, paste your server URL, and get a report in a few seconds.

<a href="https://mcpdebugger.dev" target="_blank"><img src="/img/post/introducing-mcp-debugger/screenshot.webp" alt="MCP Debugger report screenshot: B grade"></a>

This is an early release and the checks will evolve as the ecosystem grows.

What could make this tool more useful? I'd love to hear your ideas! Reach me on <a href="https://x.com/nbarbettini">X</a> or <a href="https://www.linkedin.com/in/nbarbettini/">LinkedIn</a>.
