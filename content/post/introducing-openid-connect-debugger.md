---
title: "Introducing the OpenID Connect debugger"
description: "A new tool to help troubleshoot OAuth 2.0 and OpenID Connect flows."
date: 2018-01-30T07:55:31-08:00
tags: ["oidc"]
banner: none
---

<img src="/img/post/introducing-openid-connect-debugger/oidcdebugger-gear.png" class="headshot">

The OAuth 2.0 and OpenID Connect protocols are used all over the web. Big platforms like Google and Facebook use them extensively for both authorization and social login (the ubiquitous Facebook Login button). These protocols are powerful, but unfortunately they aren't always easy to use.

If you've ever struggled to set up OAuth or OpenID Connect, you're not alone! I got so tired of fighting with bad requests and cryptic responses that I decided to write a tool to make it easier.

<!--more-->

#### Why OAuth is hard

There are a few reasons why OAuth (and OpenID Connect) flows are tricky to implement. There's a lot of confusion around the OAuth protocol, and many people don't quite understand how it's _supposed_ to work. I didn't fully grasp it myself until recently. (If you're in that camp, I'd recommend Keith Casey's excellent [Web Security: OAuth and OpenID Connect video course](https://www.lynda.com/Web-Development-tutorials/Web-Security-OAuth-OpenID-Connect/642498-2.html).)

However, even after I understood the protocol better, I still had difficulty:

* **Getting the initial request working.** The initial authorization request needs the right client ID, response type, response mode, scopes, etc. Getting everything just right takes some trial and error.
* **Decoding responses.** If an error occurs, you'll probably get an error response that's URL-encoded, like `?error=You+messed+up%21`. Copying that into a URL decoder is another step that gets in the way of figuring out what went wrong.
* **Capturing POST callbacks.** If your request was successful, the remote system may POST back to your redirect URI. That's extra annoying to debug, because you need an HTTP server on your end ready to grab and decode the POST body.

I noticed these same frustrations coming up every time I had to work with OAuth and OpenID Connect flows. It seemed like a good place for a tool that could help.


#### Introducing the OpenID Connect debugger

After a few months of tweaking in my spare time, the first version is ready! Jump over to the **OAuth debugger** (https://oauthdebugger.com) or **OpenID Connect debugger** (https://oidcdebugger.com).

(The latter includes a checkbox for `id_token` and sends the `openid` scope by default. That's the only difference! If in doubt, use the [OpenID Connect debugger](https://oidcdebugger.com).)

**Want to see it in action?** You can [try it](https://oidcdebugger.com?authorize_uri_hint=https%3A%2F%2Faccounts.google.com%2Fo%2Foauth2%2Fv2%2Fauth&redirect_uri_hint=https%3A%2F%2Foidcdebugger.com%2Fdebug&client_id_hint=194853530508-urd4bp97kjg9kc2ke7bh28g8e5kkra0h.apps.googleusercontent.com&scope_hint=openid%20profile&state_hint=foobar&response_type_hint=id_token&response_mode_hint=fragment) with my own demo Google client.

This tool does two things: first, it helps you assemble the request and get all the parameters just right. It includes form elements for all the common parameters and builds the authorization request URL dynamically.

![Switch response mode](/img/post/introducing-openid-connect-debugger/switch-response-mode.gif)

Second, it handles the callback response. If the server responds with an error, the message is decoded so you can figure out what went wrong. It doesn't matter if the callback uses the `form_post` mode (an HTTP POST), or the `query` or `fragment` modes (an HTTP GET). The debugger will capture and decode anything you or the authorization server throws at it.

![Error and success results](/img/post/introducing-openid-connect-debugger/error-and-success.gif)


#### How to use the debugger

All you need to do is temporarily set your OAuth client redirect URI to `https://oidcdebugger.com/debug` (or the equivalent on `oauthdebugger.com`):

![Add temporary redirect URI to OAuth client](/img/post/introducing-openid-connect-debugger/temp-redirect-uri.png)

Once you've used the debugger to test the flow and get everything working, remove it and point the redirect URI back to your application.


#### Request for feedback

Hopefully this tool makes working with OAuth 2.0 and OpenID Connect a little less stressful. {{< heart >}}

What could make this tool more useful? I'd love to hear your ideas. Send me your feedback [on Twitter](https://twitter.com/nbarbettini) or in the comments below.

All of the source code is [available on Github](https://github.com/nbarbettini/oidc-debugger). If you run into problems, please file an issue and let me know!
