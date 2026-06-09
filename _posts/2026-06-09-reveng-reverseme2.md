---
layout: post
title: "Reverse Engineering - ReverseMe2 by Lena"
summary: "Reverse Engineering → Detect It Easy (die) → x64dbg and x32dbg → win32 API → Keyfile creation → serial key fetching step by step debugging → xAnalyzer"
---

# ReverseMe2 by Lena
This reverseme is written by Lena and is one of the classic reverseme’s used to learn reversing. Use this in conjunction with xAnalyzer plugin for x64dbg to practice serial key fishing.

Link: [https://crackinglessons.com/reverseme2-by-lena/](https://crackinglessons.com/reverseme2-by-lena/)

## Software
The software was only showing `Evaluation Period is Out of Date` message.

<img width="407" height="183" alt="00 - out of date" src="https://github.com/user-attachments/assets/4be1ac64-25df-408b-be01-5d0c0eaa1b22" />

## Detect It Easy (die)
Using `DIE` software I found the entry point.

```
EntryPoint = ImageBase + AddressOfEntryPoint --> 0x00401000
```

<img width="1040" height="563" alt="01 - dier" src="https://github.com/user-attachments/assets/176b7e67-657d-4bfc-acd1-0e00ec92ff06" />

## x32dbg
After opening x32dbg, I searched the string and found the address.

<img width="1272" height="121" alt="02 - string" src="https://github.com/user-attachments/assets/debc1240-3064-48c3-9f2f-a86d80cdd574" />

Before these commands, It was executing `CreateFile` command which was set to open only existing files and the file name was `Keyfile.dat`.

<img width="1329" height="294" alt="03 - open existing" src="https://github.com/user-attachments/assets/ed1816bf-826c-445b-9092-42796ca0e14d" />

So I created that file.

<img width="662" height="57" alt="04 - created" src="https://github.com/user-attachments/assets/4431257f-275a-4735-8c01-223e66850d25" />

However this time the app was showing another error `Keyfile is not valid`.

<img width="220" height="141" alt="05 - file is not valid" src="https://github.com/user-attachments/assets/5483e7cc-d949-4780-ac09-8a8e8dd5f921" />

So I debugged it and found the part where it reads the file contents.

<img width="1034" height="262" alt="06 - suspicious" src="https://github.com/user-attachments/assets/fb408c4b-2ee1-4637-b8d8-7d6524b246af" />

So code can be seen below:

```
push 0                                     | LPOVERLAPPED lpOverlapped = NULL
push reverseme2-by-lena.402173             | LPDWORD lpNumberOfBytesRead = 402173
push 46                                    | DWORD nNumberOfBytesToRead = 46
push reverseme2-by-lena.40211A             | LPVOID lpBuffer = 40211A
push eax                                   | HANDLE hFile
call <JMP.&ReadFile>                       | ReadFile
test eax,eax                               |
jne reverseme2-by-lena.4010B4              |
jmp reverseme2-by-lena.4010F7              |
xor ebx,ebx                                |
xor esi,esi                                |
cmp dword ptr ds:[402173],10               |
jl reverseme2-by-lena.4010F7               |
mov al,byte ptr ds:[ebx+40211A]            |
cmp al,0                                   |
je reverseme2-by-lena.4010D3               |
cmp al,47                                  | 47:'G'
jne reverseme2-by-lena.4010D0              |
inc esi                                    |
inc ebx                                    |
jmp reverseme2-by-lena.4010C1              |
cmp esi,8                                  |

jl reverseme2-by-lena.4010F7               |
jmp reverseme2-by-lena.401205              |
```

This code simply does below things sequentially: 
1. it reads the file to a 46 byte buffer.
2. `cmp dword ptr ds:[402173],10` is used to check if the file includes a string longer then 16 character and if not it jumps to a place where wrong message is shown.

<img width="878" height="509" alt="08 - comparison" src="https://github.com/user-attachments/assets/333fa70b-54aa-4ffc-ae81-88f49eeed307" />

3.  `cmp al,0` is used to check if file is empty and if it is it jumps.
4.  `cmp al,47` is used to check if file includes `G` character and it counts them by `inc esi` command.
5.  When the loop finished (all characters are checked), it checks if there was more than 8 G using `cmp esi,8` command. If there is, we simply jump to a good end.

<img width="874" height="156" alt="09 - minimum 8G" src="https://github.com/user-attachments/assets/c845afb6-d2e8-4031-bbb8-893f98d3c644" />

So to sum the things up, I created a pseudo code for this part:

```
file = "Keyfile.dat"
if file not exists:
  exit

content = read file
if content.length < 16:
  exit

i = 0
g = 0
while (i < content.length):
  if content[i] = null:
    exit
  if content[i] = 'G':
    g++
  i++

if g > 8:
  good ending
```

So I updated `Keyfile.dat` to include 9 G characters.

<img width="244" height="102" alt="10 - 8g" src="https://github.com/user-attachments/assets/7fca8442-527c-44d0-8bda-bd9b711965f7" />

And that was it.

<img width="543" height="164" alt="11 - gg" src="https://github.com/user-attachments/assets/f37e8a52-1333-446f-86bd-55fe575c835c" />

