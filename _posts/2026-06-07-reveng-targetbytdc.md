---
layout: post
title: "Reverse Engineering - Target by TDC"
summary: "Reverse Engineering → Detect It Easy (die) → x64dbg and x32dbg → win32 API → MessageBox and JMP patching → NAG bypass and Registering"
---

# Target by TDC
A gui-based crackme written in visual studio 2017 win32 api, which creates a serial key based on user name.

Objectives:
- Remove the starting Nag Screen
- When the button Re-Check is clicked, a pop-up messagebox appears and you should set it to say “Thank you for registering this software”
- Set the Status box text to: “Clean crack! Good Job!”

Link: [https://crackinglessons.com/6-target-by-tdc/](https://crackinglessons.com/6-target-by-tdc/)

## Software
It was a software where it show NAG at the beginning then checks for the registration status.

<img width="936" height="199" alt="00 - nag" src="https://github.com/user-attachments/assets/9bc7ddbb-c10f-4e96-9f23-d05bd3f92340" />

<img width="307" height="322" alt="01 - hmm" src="https://github.com/user-attachments/assets/a2642eab-061c-4de4-81fb-e036bd3bca4d" />

## Detect It Easy (die)
Using `DIE` software I found the entry point.

```
EntryPoint = ImageBase + AddressOfEntryPoint --> 0x00401000
```

<img width="820" height="380" alt="02 - die" src="https://github.com/user-attachments/assets/8add7fb3-4cfd-483d-9f87-b8ff0e9e7ebc" />

## x32dbg
I opened x32dbg and found the point using `intermodular calls` method.

<img width="1210" height="842" alt="03 - nag" src="https://github.com/user-attachments/assets/24a3b436-0a5b-4207-ad95-ca79200292d2" />

It was executing a `cmp` command and according to its output it executes `JE (JZ)` or not.

<img width="1329" height="206" alt="04 - sus" src="https://github.com/user-attachments/assets/466bcb14-a808-4001-bd9c-f79731c02a04" />

So I updated it to `JMP` to a point where there is no NAG command.

<img width="1204" height="256" alt="05 - update" src="https://github.com/user-attachments/assets/377df931-0b28-4d8b-a5a7-6df0653cf993" />

Then continued debugging and found the location where comparisons about recheck button is executed.

<img width="1261" height="316" alt="06 - recheck" src="https://github.com/user-attachments/assets/f2be2c1d-fad6-4337-93a7-fa9dfd2446bc" />

Updated it too, to bypass registration.

<img width="912" height="231" alt="07 - new patch" src="https://github.com/user-attachments/assets/0b759f1b-cf24-45db-a5ca-c21aacaad2a1" />

And we both bypassed NAG and registered.

<img width="327" height="468" alt="08 - gg" src="https://github.com/user-attachments/assets/34c6f895-fa14-4e78-b144-e39786b405d9" />
