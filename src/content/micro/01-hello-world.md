---
title: "Hello World - Why This"
description: ''
pubDate: Dec 1 2025
---
I think having control of your own data is great. The same is true for decentralized social media. I've always been a primary user of microblog platforms (like Twitter/X). Having experienced both the traditional and "decentralized" approaches to microblogs, they both have some particular shortcoming in terms of what I want to get out of "social media".

## Twitter/X
This is fairly self explanatory. The rebranding of Twitter to X and Musk's new ownership of the platform shifted the direction of the platform to be ever more political. X Premium boosting visibility is also something I wasn't a particular fan of. You can't view anything without signing in either, so goodbye viewing stuff anonymously. There's just a lot of "features" here I'm not a fan of. Needless to say, there's a lot of reasons to not post stuff there.


## Fediverse
I initially moved to the `Fediverse` (on Misskey/Sharkey). Interoperability between different platforms is very cool, and the wide variety of platforms to choose from means that picking any platform never made me feel like "missing out" elsewhere.

However, this in itself has a problem. If you create an account on someone else's instance, you are a part of their *walled garden*. Now I'm sure that they are a wonderful person who equally values data ownership/agency, however it doesn't change the fact that someone else holds your content/data and you rely on them for that service.

So then the alternative here is self-hosting a single person instance. This solves everything, **BUT** the fact that its quite expensive to pay for the bandwidth + storage if you are a small instance and end up federating with a lot of instances. This wasn't a compromise I wanted, since the name of the game with the Fediverse is being able to connect cross-platform. Great if you have the resources, but not particularly worth it for a single person starting fresh. There's not really a good way to handle this right now, which is why federation with a very large platform like Threads is limited.

## Bluesky
`Bluesky` is one of the drop-in alternatives for Twitter. Its built on the AT-Protocol, which does actually solve a lot of the problems of ActivityPub (Fediverse) in terms of handling small self-hosted instance with large ones.
AtProto allows you to host a `PDS (Personal Data Server)` which stores all your own posts, profile info, and follows. This boils down to meaning that you really only need to be responsible for serving your own content, which you also own on your own machine. There's also a lot of fine-grain features that help with not getting overwhelmed by firehose traffic.

While this is great, the issue is that the service is not truly "federated" (yet?). Its still early days for the platform and protocol, Most people are still on `bsky.social`. This means that to get anything to read at all you'd still need to pull from the big central relay. Even if we were successful in this, its not entirely clear what the costs would be for running all these components together (is it even worth it for a single person?). I think AtProto is promising, but its still early days and who knows where it'll go...

# Now What
Its time to try something new. From a surface view the idea of [IndieWeb](https://indieweb.org/) is a good solution from the perspective of creating the content. You basically just build a website/blog (which nowadays is dirt cheap to host something static), you then just add some special HTML ([microformats](https://indieweb.org/microformats)) and now you've got a common protocol similar to a post (only now you can leverage the power of HTML/CSS and customize it however you want). Then implemtning [webmentions](https://indieweb.org/Webmention) gives the ability for other people to interact with your content. Using a bridging/syndication service like [Bridgy Fed](https://fed.brid.gy/) you can post to the Fediverse and Bluesky as well as allow others from there to interact with your post.

So that's what this is. Let's see how it goes.
