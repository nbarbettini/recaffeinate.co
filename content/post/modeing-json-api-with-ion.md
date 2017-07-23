---
date: 2017-07-04T14:58:13-07:00
draft: true
title: Modeling beautiful JSON APIs with Ion
---

JSON is by far the most popular response format for APIs today. It's not hard to see why: it's easy for both humans and machines to read. Virtually all platforms and devices can read and write JSON, making it nearly as ubiquitous as HTML. JSON is unstructured and squishy, which means it's easy to model dynamic responses. (Maybe a little too easy.)

If you're building an API, especially one with more than a few endpoints, you'll likely want to adopt a schema or pattern for your responses. This could be as simple as one or two common response properties, or it could be a complex message envelope. Unlike XML, JSON doesn't have a built-in way of defining a document schema (the downside of being unstructured and squishy).

There are a few popular ways to add schemas to JSON, but they all have drawbacks. I found one I like a lot better.

<!--more-->

#### Existing JSON schema formats

Schema-fied JSON comes in two basic flavors, depending on the goal: making JSON work more like XML, or facilitating HATEOAS. (HATEOAS is the core REST idea that APIs should express behavior as links in the response document. Read more in my [introduction to HATEOAS]({{< ref "post/what-is-hateoas.md" >}}).)

[JSON-Schema][json-schema-def] falls into the first camp. If you need to define a strict, XSD-style message schema, JSON-Schema might be a good choice. Unfortunately, being so strict tends to reduce some of the things that made JSON nice in the first place.

[HAL][hal-def], [JSON-API][json-api-def], and [Collection+JSON][collection-json-def] are examples of formats that help facilitate [HATEOAS]({{< ref "post/what-is-hateoas.md" >}}) and linking in JSON APIs.

Both HAL and JSON-API documents tend to look like this:

```
{
  "_links": {
    "self": "https://api.example.io/posts/1",
    "next": "https://api.example.io/posts/2
  },
  // the rest of the document...
}
```

The result tends to be documents with huge chunks of links tacked onto the top or bottom. Machines probably won't care, but it's awkward for humans to reason about. When was the last time you bundled up all the `<a>` tags at the bottom of your HTML document?

#### The ION hypermedia type

There's a new kid on the block called [Ion][ion-def], not to be confused with Amazon's [Ion serialization format][amazon-ion-def]. ION describes itself as _**an intuitive JSON-based hypermedia type for REST**_. It's currently being finalized and will be sent to the IETF as a formal draft soon.

Like HAL and JSON-API, ION is meant to help facilitate HATEOAS in a JSON API. Unlike HAL and JSON-API, it's a very short and simple specification that puts a strong emphasis on being friendly to both humans and machines, and adding a minimal amount of cruft to JSON.

Here's a basic Ion document:

```
{
  "firstName": "Luke",
  "lastName": "Skywalker",
  "homeworld": "Tattooine"
}
```

As you can see, any valid JSON is already valid Ion!

#### Linking between resources

Ion adds metadata to an existing JSON structure, but aims to do it in a minimal and clean way. For example, a link between resources is a simple object:

```
{
  "firstName": "Luke",
  "lastName": "Skywalker",
  "homeworld": { "href": "https://api.galaxy/planets/tattooine" }
}
```

Links can have additional metadata in the form of a [link relation][link-relations], such as `self`:

```
{
  "self": {
      "href": "https://api.galaxy/people/100",
      "rel": ["self"]
  },
  "firstName": "Luke",
  "lastName": "Skywalker",
  "homeworld": { "href": "https://api.galaxy/planets/tattooine" }
}
```

If you think of [HATEOAS]({{< ref "post/what-is-hateoas.md" >}}) with the "API clients are like browsers" analogy, a link between resources is like an `<a href="">`, and a self-referential link is like the current address.

Because it's common to include a self-referential link in responses, the Ion spec will implicitly assume a root `href` member should have a `self` relation. This resource is equivalent to the one above:

```
{
  "href": "https://api.galaxy/people/100",
  "firstName": "Luke",
  "lastName": "Skywalker",
  "homeworld": { "href": "https://api.galaxy/planets/tattooine" }
}
```


#### Collections of resources

Ion also defines what collections (arrays) of resources should look like:

```
{
  "href": "https://api.galaxy/people"
  "rel": ["collection"],
  "value": [
    {
      "href": "https://api.galaxy/people/100",
      "firstName": "Luke",
      "lastName": "Skywalker",
      "homeworld": { "href": "https://api.galaxy/planets/tattooine" }
    },
    {
      "href": "https://api.galaxy/people/101",
      "firstName": "Han",
      "lastName": "Solo",
      "homeworld": { "href": "https://api.galaxy/planets/corellia" }
    }
  ]
}
```

I really like Ion's approach to minimal metadata. Links between resources is one half of the HATEOAS story, but to fully close the loop we need a way to model any kind of state change (such as creating a new user). I'll cover one of Ion's best features, [Forms][ion-forms], in a future post.

If you want to get involved, the Ion Working Group is [on GitHub][ionwg-github] and actively soliciting feedback on the formal Ion draft.


[json-schema-def]: http://json-schema.org
[hal-def]: http://stateless.co/hal_specification.html
[json-api-def]: http://jsonapi.org/
[collection-json-def]: http://amundsen.com/media-types/collection/
[ion-def]: https://ionwg.org
[amazon-ion-def]: https://amzn.github.io/ion-docs/index.html
[link-relations]: https://www.iana.org/assignments/link-relations/link-relations.xhtml#link-relations-1
[ion-forms]: https://ionwg.org/#forms
[ionwg-github]: https://github.com/ionwg/ion-doc/issues
