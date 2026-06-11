---
layout: post
title: "Reverse Engineering - CrackMe11"
summary: "Reverse Engineering → Detect It Easy (die) → x64dbg and x32dbg → win32 API → UPX 3.91 packer → Unpack with scylla → PUSHAD, PUSH EBP, POPAD, POP EBP → Hardware Breakpoint → Memory Dump"
---

# CrackMe11
This CrackMe is packed with UPX 3.91 packer

Objectives:
- Unpack it and then patch the unpacked file, or,
- Create a loader for it

Link: [https://crackinglessons.com/crackme-11/](https://crackinglessons.com/crackme-11/)

## Application
It was a simple application where it shows `Sorry Wrong Key` when wrong serial key entered.

<img width="475" height="366" alt="00 - 0 app" src="https://github.com/user-attachments/assets/5c46ce4f-ff12-41e6-b789-cbe8cf1cea48" />

## Detect It Easy
`DIE` software showed that the application was packed with `UPX 3.91` which disallow us to patch it because user module is readonly. 

<img width="1814" height="480" alt="00 - die" src="https://github.com/user-attachments/assets/bc57a704-f937-4006-8832-9e3d573af907" />

## x32dbg
The logic was simple. It was not executing `JE` if serial key was wrong.

<img width="1346" height="406" alt="01 - logic" src="https://github.com/user-attachments/assets/483ffd20-46d9-4d4f-aeba-7eb2dde1e6a6" />

But we could not patch it.

<img width="1099" height="517" alt="02 - cannot patch" src="https://github.com/user-attachments/assets/04a98e1c-2521-4ce9-a794-f73b079be656" />

## Unpacking
To unpack, we first need to restart the program and find where it executed `PUSHAD` or `PUSH EBP`. These commands are characteristics of UPX packers.

<img width="1272" height="184" alt="03 - found pushad" src="https://github.com/user-attachments/assets/e20b7d96-c6bb-44f8-92cc-c804179931cc" />

After finding it, we must step over and execute it. And then we must set a Hardware Breakpoint on EBP register so we can catch `POPAD` or `POP EBP`, which is the last part of packing where it will jump to the user code.

<img width="1920" height="915" alt="04 - EBP value" src="https://github.com/user-attachments/assets/260cd609-a5d5-43a9-baac-5e2b17f68dbd" />

<img width="1546" height="427" alt="05 - follow in dump" src="https://github.com/user-attachments/assets/dc8b8627-f2a4-4785-88d2-8daf70eb9612" />

<img width="759" height="495" alt="06 - set breakpoint" src="https://github.com/user-attachments/assets/06fed147-0488-489e-b69a-e1a3e62650da" />

After setting breakpoint, we can run the program again and it will stop at `POPAD` command.

<img width="1285" height="285" alt="07 - pop ad" src="https://github.com/user-attachments/assets/f8b6f1a4-fb1c-4893-bf5e-3d2c3ed1f894" />

Then stepping over a few times and executing the `JMP` command, we are now on Original Entry Point (OEP).

<img width="1360" height="211" alt="08 - jumped to original place" src="https://github.com/user-attachments/assets/69db46fa-801f-4d14-9d9f-27c1d96707c9" />

Now click step over one more time to load IAT instructions and then open `scylla`.

<img width="1355" height="254" alt="09 - scylla" src="https://github.com/user-attachments/assets/3e34f759-6d77-4bc7-9171-6d8ef7eeaf27" />

Select `File → Dump Memory` and find the memory address where readonly executable is stored. And click `Dump PE` to dump it.

<img width="937" height="820" alt="10 - dump" src="https://github.com/user-attachments/assets/5ce398c1-6188-4e91-b2cc-1bfe32543794" />

Then apply below steps sequentially to fix the executable:
1. IAT Autosearch
2. Get Imports
3. Fix Dump

<img width="1191" height="837" alt="11 - fix dump" src="https://github.com/user-attachments/assets/d66fa864-a17c-488d-bcab-26c8ddc8cf7e" />

And it is fixed.

<img width="1160" height="615" alt="12 - fixed" src="https://github.com/user-attachments/assets/152d1d73-b293-46ab-abd5-344ea034be3a" />

## Patching
Now we can simply open it with x32dbg and patch it.

<img width="884" height="443" alt="14 - pacthed" src="https://github.com/user-attachments/assets/abbf2824-6d71-48ea-bc71-3b9fbec6a600" />

And we won.

<img width="400" height="347" alt="15 - gg" src="https://github.com/user-attachments/assets/8294f0d1-05ff-43f7-b86c-94ea00a2bc06" />



