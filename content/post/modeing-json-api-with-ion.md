---
date: 2017-07-04T14:58:13-07:00
draft: true
title: Modeling beautiful JSON APIs with ION
---

JSON is by far the most popular response format for modern APIs today. It's not hard to see why: it's easy for both humans and machines to read. Virtually all platforms and devices can read and write JSON, making it nearly as ubiquitous as HTML. JSON is unstructured and squishy, which makes it easy to model and modify documents (maybe a little too easy).

If you're building an API, especially one with more than a few endpoints, you'll most likely want to adopt a schema or pattern for your responses. This could be as simple as one or two common response properties, or it could be a complex message envelope. Unlike XML, JSON doesn't have a built-in way of defining a document schema (the downside of unstructured and squishy).

There are a few popular ways to add schemas to JSON, but they all have drawbacks.

<!--more-->

Schema-fied JSON comes in two basic flavors, depending on the goal: making JSON work more like XML, or facilitating [HATEOAS][what-is-hateoas].

[JSON-Schema][json-schema-def] falls into the first camp. If you need to define a strict, XSD-style message schema, JSON-Schema might be a good choice. Unfortunately, being so strict tends to reduce some of the things that made JSON nice in the first place.

[HAL][hal-def], [JSON-API][json-api-def], and (to a lesser extent) [Collection-JSON][collection-json-def] are examples of formats that help facilitate HATEOAS in JSON APIs. (HATEOAS is the core REST idea that APIs should express behavior as links in the response document. Read more in my [introduction to HATEOAS][what-is-hateoas].)

HAL ...?

There's a new kid on the block called [ION][ion-def] (not to be confused with [Amazon's ION][amazon-ion]). It's currently being finalized and will be sent to the IETF as a formal draft soon. Like HAL and JSON-API, ION is meant to help achieve HATEOAS in a JSON API. After playing with it for a while, I like it even better than HAL. It feels like a clean, natural extension to JSON.

# The ION hypermedia type

(basic responses, hateoas)

# Linking between resources

# Collections of resources

(forms later, fin)
