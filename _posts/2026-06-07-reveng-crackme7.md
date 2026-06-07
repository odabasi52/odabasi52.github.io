---
layout: post
title: "Reverse Engineering - CrackMe7"
summary: "Reverse Engineering → Detect It Easy (die) → x64dbg and x32dbg → win32 API → Registration bypass via EAX register manipulation"
---

# CrackMe7
This CrackMe teaches a specific method of cracking which is to trace the eax value and patch it.

Link: [https://crackinglessons.com/crackme-7/](https://crackinglessons.com/crackme-7/)

## Software
It was a software that shows registration status.

<img width="329" height="261" alt="00 - 0 unregistered" src="https://github.com/user-attachments/assets/0997fbf4-b672-43a9-9b7d-44d8d13c022f" />

## Detect It Easy (die)
Using `DIE` software I found the entry point.

```
EntryPoint = ImageBase + AddressOfEntryPoint --> 0x00401353
```

<img width="1261" height="510" alt="00 - die" src="https://github.com/user-attachments/assets/c3fae4c0-8b4a-4595-ba07-1b2a5287da6b" />

## x32dbg
Then using `step over (F8)` and searching step by step, I found the commands where it is checking if registered or not.

<img width="904" height="144" alt="01 - place" src="https://github.com/user-attachments/assets/c30eb359-f314-46e0-ad4b-2461c5052bf6" />

Then what I did is:
1. I removed first `JE` to avoid it jumping.
2. By avoiding it jumping, it sets `EAX` value to `2` which make test result in not zero so `zero flag (ZF)` is not set to one. Which means we are registered.

<img width="872" height="92" alt="02 - patch" src="https://github.com/user-attachments/assets/84ea676b-338b-4fbd-b239-d3179f8eb022" />

That is it, easy.

<img width="335" height="268" alt="03 - gg" src="https://github.com/user-attachments/assets/5e0626e2-0ecb-424a-ace4-d25da068c981" />

