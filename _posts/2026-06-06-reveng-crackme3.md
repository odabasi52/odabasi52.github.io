---
layout: post
title: "Reverse Engineering - CrackMe3"
summary: "Reverse Engineering → Detect It Easy (die) → x64dbg and x32dbg → win32 API → MessageBox → remove nag → register user"
---

# CrackMe3
Another gui-based crackme written in visual studio 2017 win32 api.

Objectives:
- Remove the 2 nag screens – one at startup and one at close of program.
- In the About screen – change status to Registered.

Link: [https://crackinglessons.com/crackme-3/](https://crackinglessons.com/crackme-3/)

## Software
The software had 2 nag screens while opening the program and when closing it. And about page showed `unregistered`

<img width="142" height="152" alt="00 - nag screen 1" src="https://github.com/user-attachments/assets/bea44283-257d-4a1f-ac65-caece9f1fe14" />

<img width="363" height="356" alt="01 - about" src="https://github.com/user-attachments/assets/ad39c897-b11b-45ea-aa6e-d2f1ec763c53" />

## Detect It Easy
Using `DIE` software I found the entry point.

```
EntryPoint = ImageBase + AddressOfEntryPoint --> 0x00401370
```

<img width="1364" height="518" alt="02 - die entry point" src="https://github.com/user-attachments/assets/d0cb3a04-f291-48ef-9425-859466c661ff" />

## x32dbg
### Removing nag screens
Using `x32dbg` and animate over funcitonality, I found the command that calls the nag screen.

<img width="832" height="428" alt="03 - nag screen caller" src="https://github.com/user-attachments/assets/8d38fc3c-9cef-4142-abb8-8a712b541623" />

The highlighted lines were simply opening nag screens.

<img width="1060" height="218" alt="04 - opener messagebox" src="https://github.com/user-attachments/assets/d98c3d41-82cd-4fd7-9487-dce41ca81ef6" />

So I removed them and set them to `nop`.

<img width="880" height="328" alt="05 - no nag" src="https://github.com/user-attachments/assets/5d4a9274-0ea9-4842-ace6-db58ad9c9605" />

Now to find closing nag screen we can do two things. We can check `intermodular calls` and filter for `MessageBox` or we can pause the program and check for call stack. I checked `intermodular calls`.

<img width="1749" height="848" alt="07 - memory" src="https://github.com/user-attachments/assets/070f8968-47f2-4d64-aa97-af14067a3df0" />

<img width="1175" height="877" alt="08 - messagebox" src="https://github.com/user-attachments/assets/7e5c8c48-fa59-4f16-b5e2-b724f62cf0c8" />

And second messagebox was the closing nag.

<img width="1064" height="198" alt="09 - sus" src="https://github.com/user-attachments/assets/62a7a2ff-d1d1-41fe-bac5-3295e97b85c7" />

Simply deleted it and set to `nop`.

<img width="1235" height="347" alt="10 - no more nag" src="https://github.com/user-attachments/assets/17917c47-c409-4142-b314-1390c75e91c5" />

### Registering user
To show registered message on about page, we can again do two things. We can check `intermodular calls` and filter for `MessageBox` or we can pause the program and check for call stack. I checked `intermodular calls`.

First messagebox was the one checking for registration.

<img width="1141" height="517" alt="11 - suspicious" src="https://github.com/user-attachments/assets/8dd86687-47cf-4d88-8189-7751257a02b2" />

Simply patched it.

<img width="1101" height="341" alt="12 - patched" src="https://github.com/user-attachments/assets/abec9477-d2b2-4ef9-90d6-c3c1ad52083a" />

Then exported it.

<img width="299" height="311" alt="13 - patching" src="https://github.com/user-attachments/assets/4987ae58-37d6-4d0f-9336-022fd334d3da" />

<img width="1088" height="877" alt="14 - PATCHED" src="https://github.com/user-attachments/assets/164da00c-a6dc-45ca-bd07-6db2cfe33516" />

And we are registered.

<img width="417" height="337" alt="15 - GG" src="https://github.com/user-attachments/assets/cd749161-569b-4ad9-9b41-82b1b177a43a" />
