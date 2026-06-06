---
layout: post
title: "Reverse Engineering - CrackMe4"
summary: "Reverse Engineering → Detect It Easy (die) → x64dbg and x32dbg → JNLE, JG and JMP → Call Stack → win32 API → MessageBox,GetLocalTime → Unlimited Trial Period → Change time value"
---

# CrackMe4
A gui-based crackme written in visual studio 2017 win32 api, simulating a 30-day trial period software.

Objectives:
- Crack it to extend beyond 30 days
- In the About screen – also extend it to beyond 30 days

Link: [https://crackinglessons.com/crackme-3/](https://crackinglessons.com/crackme-4/)

## Software
The software was simply showing remaining days.

<img width="433" height="274" alt="00 - SOFTWARE" src="https://github.com/user-attachments/assets/6adebcbd-847c-47e4-bbd6-dac1e18ffe4e" />

## x32dbg
This time I did not use DIE. I used animate over and found the call that calculates trial period and stepped into it.

<img width="1020" height="86" alt="01 - trial" src="https://github.com/user-attachments/assets/cd73abe2-d7ba-43f5-986f-64cdefd6ad8f" />

Now there is 2 way we can bypass this.

## 1st way (No trial expiration)
We can simply patch `JG` (`JNLE`) check to `JMP` to always have license no matter the trial period remaining.

<img width="1032" height="116" alt="02 - jmp every time" src="https://github.com/user-attachments/assets/3adaf3de-4237-4375-a9eb-c0872eefbb23" />

And to update the about page we can use call stach method by pausing the program.

<img width="1108" height="646" alt="03 - call stack" src="https://github.com/user-attachments/assets/d0b5c313-bf90-47ad-8474-551f87c1ac39" />

<img width="1255" height="259" alt="04 - again" src="https://github.com/user-attachments/assets/e69cf812-56a9-4f60-a0c1-f6b8d451a4c4" />

Then udpate it to `JMP` also.

<img width="1185" height="233" alt="05 - jmp" src="https://github.com/user-attachments/assets/c361f4ca-aa04-4dae-bc53-af322cd6b44d" />

And then simply patch it. 

<img width="374" height="335" alt="06 - patching" src="https://github.com/user-attachments/assets/8f7c9663-1349-4d8c-b78f-e793a95610de" />

<img width="770" height="742" alt="07 - patching" src="https://github.com/user-attachments/assets/b6d76fc7-0c8a-4367-a2c7-c388cfe38608" />

That is it. We now have unlimited trial period.

## 2nd way (Update the time)
While checking the calculation commands we can see that it get local time with `GetLocalTime` command then calculates how many days passed and stores it on `eax`. Then on `ecx` register it stores total time which is 30 days. Then it executes a `sub` command to calculate remaining days.

<img width="940" height="210" alt="08 - another method" src="https://github.com/user-attachments/assets/e71bb6cf-fae0-4bee-acea-ad6bf61290af" />

So what we can do is update the `ecx` register value on `mov` command to high value such as `0xFFFF`.

<img width="685" height="106" alt="09 - sus" src="https://github.com/user-attachments/assets/1b9148e9-e487-4610-bcf6-65a1c753a658" />

And that is it.

<img width="440" height="239" alt="10 - another way" src="https://github.com/user-attachments/assets/8e3b6f88-18b5-4225-b1ae-016bd88d010b" />
