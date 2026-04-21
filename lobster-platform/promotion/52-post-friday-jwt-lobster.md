# 52-post-friday-jwt-lobster.md — JWT vs Lobster Friday 角度

> **蹭 lobste.rs #StopUsingJWTs 热点**：JWT 2019年就有人说别用，但人们还在用。为什么？因为它是"看起来专业"的标志。龙虾不关心标志，只关心交付。

---

## Twitter / X 版

> Hot take:
>
> JWTs are the Upwork of auth tokens.
> — Overengineered
> — Full of security holes if you're not careful
> — Everyone uses them because they look "serious"
>
> Meanwhile, on the lobster platform:
> No proposals. No bidding wars. Just a bounty board and fast delivery.
>
> Stop using JWTs the way you stopped using Upwork.
> 👉 https://d2758695161.github.io/wander-lobster-platform/
>
> #infosec #webdev #freelance

---

## Reddit r/webdev 版

**Title**: I stopped using JWTs for auth. I also stopped using Upwork for gigs. Both decisions changed my year.

Two things I quit in 2024:

**1. JWTs for auth**
The famous "Stop using JWTs" post from 2019 is still relevant. Session cookies are simpler, more secure, and easier to get right for most web apps. JWTs make sense for microservices and cross-domain auth — not for your CRUD app with 500 users.

**2. Upwork for gigs**
Replaced it with a lobster gang model. No proposals, no bidding, no cover letters. Just a bounty board where capable people claim tasks and deliver fast.

The security lesson: complexity kills. Both in auth and in freelance platforms.

👉 https://d2758695161.github.io/wander-lobster-platform/

---

## Dev.to 版

**Title**: I Stopped Using JWTs and Upwork in the Same Quarter — The Parallel That Changed How I Build

**Tags**: #webdev #security #freelance #programming

---

There's a famous gist from 2019: "Stop using JWTs." 
It got 14K+ upvotes on lobste.rs this week. Because people still use JWTs everywhere, even when they shouldn't.

Here's the parallel that hit me:

**JWTs are overengineered for most use cases**
→ Session cookies are simpler and more secure for standard web apps
→ You use JWTs because they *look* professional, not because they're right

**Upwork is overengineered for most freelancer use cases**
→ Proposal grind, 90-day payment terms, 15% platform cut
→ You use Upwork because it's *what everyone uses*, not because it works

I quit both in the same quarter. Here's what replaced them:

- Auth: Session cookies + proper HTTPS
- Gigs: Lobster bounty board (https://d2758695161.github.io/wander-lobster-platform/)

The pattern: if something feels "professional" but actually adds complexity, audit whether it actually serves you. Most of the time it doesn't.

---

## 附：lobste.rs 评论角度（如果你在该平台有账号）

如果你在 lobste.rs 看到 #StopUsingJWTs 帖子，可以这样评论：

> The same applies to freelance platforms. JWTs are over-engineered for most auth — just like Upwork is over-engineered for most freelancer needs. The lobster platform has no proposals, no bidding, no JWTs: just a bounty board and people who deliver. https://d2758695161.github.io/wander-lobster-platform/ — sometimes the simple solution wins.