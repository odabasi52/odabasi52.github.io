---
layout: post
title: "Reverse Engineering - CrackMe12"
summary: "Reverse Engineering → x64dbg and x32dbg → win32 API → Anti-Debugger → (1st way) find IsDebuggerPresent call → patch JE,JZ → (2nd way) scyllahide"
---

# CrackMe12
This CrackMe has Anti-Debugging features. If you open it with a debugger and then run, it will detect the debugger and exit. Your task is to bypass the anti-debugging feature.

Link: [https://crackinglessons.com/crackme-12/](https://crackinglessons.com/crackme-12/)

## Application
As seen in below image, program directly closes when opened with a debugger.

<img width="1338" height="887" alt="00 - program quits" src="https://github.com/user-attachments/assets/398f339b-fac6-470a-85a5-d4d28aff8ff7" />

## (1st way) - Patch IsDebuggerPresent call
`IsDebuggerPresent` determines whether the calling process is being debugged by a user-mode debugger.
- If the current process is running in the context of a debugger, the return value is nonzero.
- If the current process is not running in the context of a debugger, the return value is zero.

So at first we can set a breakpoint for IsDebuggerPresent calls, or we can directly search them using InterModular Calls search.

<img width="819" height="201" alt="02 - is debugger present" src="https://github.com/user-attachments/assets/b883d16c-b825-4d8b-8e96-4c88ebf8a3c9" />

Then find the place where it checks for debugger usage on user code.

<img width="927" height="266" alt="03 - user code" src="https://github.com/user-attachments/assets/4a5cea08-a47f-4313-992e-bb0b4f7bcd30" />

As it can be understood, it is calling `IsDebuggerPresent` if it returns non-zero it gives error and quits.

So we can simply patch the `JE (JZ)` command to `JMP` everytime.

<img width="977" height="219" alt="04 - jmp" src="https://github.com/user-attachments/assets/7dcaf47e-e2ae-4ab6-a849-3e123ca8606f" />

And that is it.

<img width="921" height="517" alt="05 - gg" src="https://github.com/user-attachments/assets/e4cafed6-ea90-4cb4-85f2-158e3801c06a" />

## (2nd way) ScyllaHide
`ScyllaHide` plugin can be downloaded from here: [https://github.com/x64dbg/scyllahide](https://github.com/x64dbg/scyllahide)

It allows to hide debugger features. `ScyllaHide` usage can be seen below.

<img width="690" height="270" alt="06 - scyllahide" src="https://github.com/user-attachments/assets/ac0e5e0d-a6db-460b-a170-a9f0b2369ae0" />

<img width="661" height="552" alt="07 - scyllahide" src="https://github.com/user-attachments/assets/3ea6ded8-c31e-4e65-9dca-0bce8271c692" />

And that is it. It simply hides debugger features and you can execute the program.

<img width="1373" height="540" alt="08 - gg" src="https://github.com/user-attachments/assets/d94ef0ac-1498-4746-ac9a-323e90c0783d" />





