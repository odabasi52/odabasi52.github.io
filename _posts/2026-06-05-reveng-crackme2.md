---
layout: post
title: "Reverse Engineering - CrackMe2"
summary: "Reverse Engineering → Detect It Easy (die) → x64dbg and x32dbg → win32 API → CreateFileA, ReadFileEx and MessageBox → create license file"
---

# CrackMe2
Another gui-based crackme written in visual studio 2017 win32 api.

Objectives:
- Without patching, Register it to your name.

Link: [https://crackinglessons.com/crackme-2/](https://crackinglessons.com/crackme-2/)

## Software
It was a simple software. When I opened it it showed `Unregistered` messagebox.

<img width="318" height="182" alt="image" src="https://github.com/user-attachments/assets/1f02067d-cc87-4a34-89ed-c281371daf53" />

## Detect It Easy (die)
Using `DIE` software I found the entry point.

```
EntryPoint = ImageBase + AddressOfEntryPoint --> 0x004013b8
```

<img width="1011" height="523" alt="00 - entrypoint" src="https://github.com/user-attachments/assets/d2836678-f6bc-4d3e-968f-24a92d75365b" />

## x32dbg
Then executed x32dbg and started the software to check user code.

<img width="1408" height="528" alt="01 - run user code step by step" src="https://github.com/user-attachments/assets/96972c31-8e39-48c5-8dfb-0a411d2d2e27" />

Then used step over (`F8`) to find when the pop up occurs. So checked every command step by step and found that `call` at `0040132F` is the cause of the pop up.

<img width="1208" height="481" alt="02 - found function to check" src="https://github.com/user-attachments/assets/019d3e30-f3e2-4310-b3b3-099df669d2fd" />

So I restarted the program and stepped into the call.

<img width="1068" height="289" alt="03 - step into" src="https://github.com/user-attachments/assets/9a959cd4-b331-4c42-89d7-7f1a779e470a" />

---

<img width="1119" height="297" alt="04 - create file" src="https://github.com/user-attachments/assets/b27293c4-be3d-48c2-9ed5-8face721dfbb" />

As seen in above image, it was executing a `CreateFileA` function. It had 7 different parameters. (For more information: [https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilea](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilea))

```c
HANDLE CreateFileA(
  [in]           LPCSTR                lpFileName,
  [in]           DWORD                 dwDesiredAccess,
  [in]           DWORD                 dwShareMode,
  [in, optional] LPSECURITY_ATTRIBUTES lpSecurityAttributes,
  [in]           DWORD                 dwCreationDisposition,
  [in]           DWORD                 dwFlagsAndAttributes,
  [in, optional] HANDLE                hTemplateFile
);
```

The 5th parameter `dwCreationDisposition` is critical for us. When it is set to `3`, it only reads existing file otherwise it returns `-1` (`FFFFFFFF`).

<img width="1355" height="196" alt="06 - returns error" src="https://github.com/user-attachments/assets/936f5ec5-4d30-42b6-8c49-7636455e0b39" />

And as seen in the code if the return value is `-1` (`FFFFFFFF`) it executes `JE` command.

<img width="1305" height="269" alt="05 - check if file exists" src="https://github.com/user-attachments/assets/76a84c4a-5d9d-42d2-b8e0-954df8324eba" />

So what we can do is create a file named `keyfile.txt` as seen in above codes and get a different return value.

<img width="903" height="316" alt="07 - created the file" src="https://github.com/user-attachments/assets/7faea963-5ab8-445d-9ffd-95f1449be6c9" />

This time when executing we can see that it does not jump so command after `JE` are executed.

<img width="1439" height="265" alt="09 - passed" src="https://github.com/user-attachments/assets/6563c208-33f4-4ef1-9cc9-6b42a09d8271" />

So we are simply registered.

<img width="959" height="343" alt="10 - gg" src="https://github.com/user-attachments/assets/0583051b-08a4-4a96-83a7-69bf1ff2c51e" />
