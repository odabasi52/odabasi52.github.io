---
layout: post
title: "Reverse Engineering - CrackMe8"
summary: "Reverse Engineering → Detect It Easy (die) → x64dbg and x32dbg → win32 API → JMP patching → Memory Patching and hardware breakpoints"
---

# CrackMe8
This crackme is for learning how to put hardware breakpoints on memory addresses and then patch it to register the program.

Link: [https://crackinglessons.com/crackme-8/](https://crackinglessons.com/crackme-8/)

## Software
It was a simple software showing `UN-REGISTERED`.

<img width="398" height="320" alt="00 - 0 program" src="https://github.com/user-attachments/assets/92e77676-f33b-4075-b6e3-d28699e278a5" />

## Detect It Easy (die)
Using `DIE` software I found the entry point.

```
EntryPoint = ImageBase + AddressOfEntryPoint --> 0x00402254
```

<img width="727" height="443" alt="00 - die" src="https://github.com/user-attachments/assets/365f6d6b-ad14-4b4e-992b-9af1b6085b5d" />

## x32dbg
I first opened string reference searcher.

<img width="1217" height="898" alt="01 - string" src="https://github.com/user-attachments/assets/347044e6-29c5-4e41-b678-334c96f802a0" />

Then searched for `UN-REGISTERED` string, and found an address.

<img width="841" height="682" alt="02 - search" src="https://github.com/user-attachments/assets/a971ba96-0a0b-4eb9-8ef9-9cd6fda98064" />

Then analyzing the logic I understood that it checks for some value then jumps.

### First Way (JMP Patch)
The command `JE` jumps and does not execute below commands so we can not see `REGISTERED` status. 

<img width="1284" height="331" alt="03 - logic" src="https://github.com/user-attachments/assets/d1f9890c-5a30-4b63-b771-4a8652248cdf" />

I simply updated it to `JMP` next address which is simply doing nothing so we become registered.

<img width="1058" height="131" alt="04 - updated to jmp next instruciton" src="https://github.com/user-attachments/assets/f4c7ab4f-bf67-415f-87ad-05bd03acd213" />

<img width="402" height="331" alt="05 - registered" src="https://github.com/user-attachments/assets/0c9862fc-4287-4578-94d1-c5ec525422c3" />

### Second Way (Memory Patching)
We can also set a breakpoint on memory access and update the memory which causes `ZF` to be `1` and eventually causes `JE` command to be executed.

Whenever there is a `JMP` command, we can be sure there must be a `test` or `cmp` command above it which sets `ZF`. So at first I found the `CMP` command.

<img width="1060" height="114" alt="06 - setting memory" src="https://github.com/user-attachments/assets/339168aa-fee0-47a8-9ab6-03cafd31ddb0" />

Then followed the address on memory dump.

<img width="730" height="165" alt="07 - dump" src="https://github.com/user-attachments/assets/aa06f43f-0d58-45a2-affa-0e662f53a864" />

Then set an hardware breakpoint to analyze if this is the address that causes `ZF` to be `1`.

<img width="627" height="368" alt="08 - hardware breakpoint" src="https://github.com/user-attachments/assets/53a26be0-a8ef-4838-bc8f-557392180643" />

After making sure address is right, I edited the binary to be `1` which causes `ZF` to be `0` so `JE` is never executed.

<img width="601" height="634" alt="09 - edit binary" src="https://github.com/user-attachments/assets/c0b93e5d-a57f-4c4c-845e-c6a763e627e5" />

<img width="1088" height="631" alt="10 - edited" src="https://github.com/user-attachments/assets/899033bd-7641-4165-aa1a-b4570da74072" />

And that is it.

<img width="402" height="331" alt="05 - registered" src="https://github.com/user-attachments/assets/0d6ab02d-cc7d-4d07-8adc-f25a5bfa43ea" />
