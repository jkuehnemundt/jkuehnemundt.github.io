---
layout: post
title:  "Comments in Code – Necessary or Redundant?"
date:   2025-04-15 15:00:00 +0200
categories: cleancode
tags: cleancode
usemathjax: true
description: "Why the why belongs in comments, the business context in Git, and the rest in readable code."
topics: [clean-code]
---

I often come across the question of how much we should comment our code – or whether we should at all. In many projects, you’ll find comments explaining how something works or what requirements it’s based on. But do we really need that?

_Uncle Bob (Robert C. Martin, Clean Code) puts it pretty bluntly:_

> Comments are always failures. We must have them because we cannot always express ourselves without them, but their use is not a cause for celebration.”

And honestly? I tend to agree. Comments usually aren’t a sign of clean code – they’re often a sign that the code isn’t clear enough on its own. Even with the best intentions, comments can go stale. The code changes, the comment doesn’t – and suddenly, it’s more misleading than helpful.

💡 __Business requirements don’t belong in comments__

I’ve seen plenty of comments trying to explain business logic or why something had to be done a certain way. That might seem helpful at first, but it quickly becomes a problem when the code gets updated. You’re left wondering: “Does this comment still apply? Or is this just outdated noise?”

That’s why I’ve started doing things differently: I include the ticket ID in my commit messages – short, consistent, and easy to trace back.

🔍 __Let Git do the heavy lifting__

With ```git blame```, it’s easy to find out who last touched a piece of code and which commit it was. If that commit includes a ticket ID (like ```PLAT-456```), I can look up the context:

- What was the reasoning behind this?
- Was there a discussion?
- Were there any alternatives?

And the best part? This works even years later – as long as your Git history and ticket system are still intact.

🛠️ __But sometimes, a comment is the better choice__

That said, there are situations where a quick in-code comment can really help – especially when you’re dealing with:

- Performance hacks
- Platform-specific quirks
- Workarounds for weird bugs

In cases like that, it’s often faster to leave a short explanation in the code rather than rely on someone checking git blame. Something like:

``` // Using a for loop here instead of LINQ for performance reasons ```

That tiny line can save the next person a bunch of head-scratching.

🧭 __In the end...__

Comments aren’t evil – they’re just not a substitute for writing clean, understandable code. If you do leave a comment, use it to explain the why, not the what.

Everything else? Better to keep it in the ticket. With a good Git workflow and ticket references in your commits, you get solid, traceable documentation – without cluttering up your codebase.
