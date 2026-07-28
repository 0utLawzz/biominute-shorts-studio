---
name: API codegen export barrel
description: Orval regenerates runtime Zod schemas and TypeScript schema types separately.
---

The API Zod package must export generated runtime schemas from `generated/api`, but must not wildcard-export `generated/types` because names such as `CreateEpisodeBody` collide with runtime schemas.

**Why:** Orval regenerates both folders and a wildcard type export causes TypeScript duplicate-export errors and can hide `.safeParse()` runtime values.

**How to apply:** Keep the selective type re-export list in the package barrel and run the post-codegen normalization helper after Orval.