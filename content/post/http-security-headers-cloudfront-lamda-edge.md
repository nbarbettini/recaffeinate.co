---
date: 2017-10-23T08:47:49-07:00
draft: true
title: Add HTTP security headers to any site with CloudFront and Lambda@Edge
---

HTTP security headers like `Strict-Transport-Security` and `Content-Security-Policy` are becoming an important tool in the fight against phishing and cross-site attacks. Good support for these headers in major browsers means there's no downside to adding them to your site.

I'm a big fan of [using CloudFront for distribution and HTTPS]({{< ref "post/cheap-static-sites-with-s3-cloudfront.md" >}}), but CloudFront doesn't have a built-in way to add HTTP headers. In this post I'll show how to use Amazon Lambda@Edge to add security headers (or any other headers you need) to a CloudFront distribution.

<!-- more -->

Scott Helme's awesome tool [security-headers.io](https://security-headers.io) will give your site a grade based on how many security headers you currently return. Here's what the result looked like for this site before I added security headers:

![recaffeinate.co gets an F](/img/post/recaffeinate-security-f.png)



### Why add security headers to a static site?



Set up CloudFront

## Enforce basic security headers with Lambda@Edge

## Add Content-Security-Policy in report-only mode

report-uri

## Enforce Content-Security-Policy
