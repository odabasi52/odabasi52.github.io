---
layout: post
title: "Reverse Engineering - CrackMe9"
summary: "Reverse Engineering → Detect It Easy (die) → x64dbg and x32dbg → win32 API → JMP patching → Memory Patching and updating serial key"
---

# CrackMe9
To practice patching memory directly.

Objectives:
- Find the correct serial key
- Change it to a different key of your choice

Link: [https://crackinglessons.com/crackme-9/](https://crackinglessons.com/crackme-9/)

## Software
It was a software that asks for a serial key and shows `Sorry Wrong Key`.

<img width="435" height="353" alt="00 - app" src="https://github.com/user-attachments/assets/0c52a720-ccac-4dbf-b094-55a6b014a958" />


## Detect It Easy (die)
Using `DIE` software I found the entry point.

```
EntryPoint = ImageBase + AddressOfEntryPoint --> 0x00402254
```

<img width="1126" height="505" alt="01 - die" src="https://github.com/user-attachments/assets/3be462ec-2329-457e-ac4f-008d5462a59c" />

## x32dbg
At first I checked string references and found `Sorry Wrong Key`.

<img width="998" height="143" alt="02 - string" src="https://github.com/user-attachments/assets/1cb29bde-a9f6-42f3-a6dd-201af5c66214" />

The Logic was simple it was checking if `ESI` register is zero by `test esi, esi` then executes `JE` command accordingly.

<img width="946" height="195" alt="03 - serial key" src="https://github.com/user-attachments/assets/e7a78494-4b13-474d-bee0-ed191a7a89fa" />

Because `ESI` register was not `0` the `test` command causes `ZF` to be `0` and `JE` is not executed.

So I checked commands before `test` to understand what is setting `ESI` to non-0. It can be understood that a string comparison is happening and then value of `EAX` is moved to `ESI` to test. 

String comparison occurs between a user entered value and a value stored in memory which can be seen in below image.

<img width="1075" height="351" alt="04 -serial key" src="https://github.com/user-attachments/assets/4d5585ca-8c6e-491e-a98d-2b2182794422" />

So we can follow the dump and update the serial key.

<img width="883" height="542" alt="05 - serial key memoryu" src="https://github.com/user-attachments/assets/1adaddff-3210-4913-8d38-442e2ba51f43" />

<img width="771" height="352" alt="06 - UPDATE" src="https://github.com/user-attachments/assets/d282cf9f-7402-4a73-9189-a77b90ea0456" />

<img width="497" height="67" alt="07 - updated" src="https://github.com/user-attachments/assets/4ce3092c-5237-40d9-9d42-4e50df133161" />

And that is it.

<img width="448" height="347" alt="08 - gg" src="https://github.com/user-attachments/assets/0436d963-c4e6-449f-a0c5-95c5739a9141" />



