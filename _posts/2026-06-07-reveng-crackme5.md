---
layout: post
title: "Reverse Engineering - CrackMe5"
summary: "Reverse Engineering → Detect It Easy (die) → x64dbg and x32dbg → win32 API → MessageBox → auto generated serial key bypass"
---

# CrackMe5
A gui-based crackme written in visual studio 2017 win32 api, which creates a serial key based on user name.

Objectives:
- Enter your first name.
- Crack the software to find a valid serial key for your firstname

Link: [https://crackinglessons.com/crackme-5/](https://crackinglessons.com/crackme-5/)

## Software
It was a simple software which asks for your first name and a serial key.

<img width="566" height="391" alt="00 - app" src="https://github.com/user-attachments/assets/2339b265-559b-4bc0-815e-76168734b2e0" />

## Detect It Easy (die)
Using `DIE` software I found the entry point.

```
EntryPoint = ImageBase + AddressOfEntryPoint --> 0x0040143f
```

<img width="1253" height="583" alt="01 - die" src="https://github.com/user-attachments/assets/e2a5724d-1808-409d-bf95-5a40c8daca61" />

## x32dbg
Using `x32dbg`, I applied call stack method. I entered wrong serial key, clicked checked then paused the program. And found an entry of MessageBox.

<img width="1320" height="539" alt="02 - call stack" src="https://github.com/user-attachments/assets/d0a976c6-8da1-4e41-90ad-53cd4689ab1f" />

Logic was simple it creates a serial key according to the first name entered then compares the serial key you entered. If not equal it jumps.

<img width="1298" height="603" alt="03 - wrong serial key" src="https://github.com/user-attachments/assets/3a803d4a-e788-4f0c-aac4-1c3fd2f8e197" />

I simply updated the logic to first bypass some checks with `JMP` and secondly, instead of `or eax, 1` I wrote `xor eax,eax` to make `eax` register always zero and with this way program can always pass the test and `zero flag` will be set to `1`.

<img width="926" height="267" alt="04 - update" src="https://github.com/user-attachments/assets/2bf9b219-2126-4b92-aec3-cf378946759f" />

And this is it.

<img width="370" height="343" alt="05 - gg" src="https://github.com/user-attachments/assets/8bf4f825-39cc-4fec-ac6c-a901c3d5e616" />
