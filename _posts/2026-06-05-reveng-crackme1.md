---
layout: post
title: "Reverse Engineering - CrackMe1"
summary: "Reverse Engineering → Detect It Easy (die) → x64dbg and x32dbg → Serial Key obtaining or Serial Key bypass → win32 API → GetDlgItemTextA and MessageBox → patching"
---

# CrackMe1
## Software
At first I opened the software and analyzed it. It was a simple app that shows a messagebox when wrong serial number is entered.

<img width="504" height="252" alt="00 - 0 serial key" src="https://github.com/user-attachments/assets/9798d1bd-9ab9-4a8e-bc7d-d75788078f8f" />


## Detect It Easy
Then I analyzed it with `DIE` find the entry point.
```
EntryPoint = ImageBase + AddressOfEntryPoint --> 0x004013bf
```

<img width="1553" height="780" alt="00 - die" src="https://github.com/user-attachments/assets/0ac0c7fa-2266-4984-99c2-0a76614ffea6" />

## x32dbg
Then executed x32dbg then clicked `F9` to start the program and get to user commands.

<img width="869" height="354" alt="01 - 0 click run" src="https://github.com/user-attachments/assets/05fb0dc1-e478-4654-8f42-75c260bfd9ed" />

<img width="1315" height="663" alt="01 - xdbg32 open" src="https://github.com/user-attachments/assets/6950b762-8b5f-4ab2-a1e4-c1f87486ecf3" />

Then I searched the `"Wrong"` string to find where messagebox pops up.

<img width="1432" height="615" alt="02 - search" src="https://github.com/user-attachments/assets/cc2d965e-a313-4e78-a7a5-72f7d43cbbd6" />

<img width="1255" height="662" alt="03 - wrong serial" src="https://github.com/user-attachments/assets/371dfc24-429e-41b9-a912-ef502e0da68f" />

And then clicked the address to go and check the assembly code.

<img width="1070" height="431" alt="04 - wrong" src="https://github.com/user-attachments/assets/21fb7fc7-937c-4423-a4f0-b596d55fc40d" />

## 1st way (Reading Serial Key)
Because this is a local app, it must compare a serial key with the value that user entered. To find it we can check `GetDlgItemTextA` function from win32 api which gets the text that user entered.

Then I set a breakpoint by double clicking it.

<img width="948" height="283" alt="07 - stop" src="https://github.com/user-attachments/assets/f5fb09ad-c1cd-4a27-9716-f94062ea4320" />

Then one by one clicked `step over (F8)` to check where the comparison occurs. As seen in below image, before the cmp command, there is string stored in ECX register which is the correct serial key.

<img width="1242" height="162" alt="08 - comparing" src="https://github.com/user-attachments/assets/e68b3e7d-325c-47c5-85a4-0d1f9ad116bb" />

We can simply enter it and GG.

<img width="403" height="240" alt="06 - gg" src="https://github.com/user-attachments/assets/3c818997-a8b7-4b88-ac75-7fd234668351" />

## 2nd way (Patching to Bypass Serial Key)
Another way is to bypass controls and directly see messagebox. To do this we first neet to understand how messagebox works.

```c
int MessageBox(
  [in, optional] HWND    hWnd, // parent windows (0 = belongs to no parent)
  [in, optional] LPCTSTR lpText, // text
  [in, optional] LPCTSTR lpCaption, // caption
  [in]           UINT    uType // button
);
```

As seen in above code, MessageBox has 4 parameters. 

<img width="451" height="49" alt="image" src="https://github.com/user-attachments/assets/335364b0-75e4-44ea-b3be-46deef270649" />

And as seen in this image it pushes the parameters in reverse order to stack then calls MessageBox. 

So we need to find where it compares and performs jump. As seen in below image, after comparing it directly jumps to bad answer.

<img width="840" height="145" alt="image" src="https://github.com/user-attachments/assets/b9d51246-c9be-4cd6-9700-e816678294f4" />

So to bypass this, we can edit `jne` command to `nop` command and edit return commands to `jmp` to the messagebox.

And make sure that pushes are in correct order.

<img width="872" height="224" alt="09 - patch way" src="https://github.com/user-attachments/assets/12599a3d-ae85-4c7f-84fc-711d1be2ff8b" />

Than simply patch and save.

<img width="507" height="318" alt="10 - patching" src="https://github.com/user-attachments/assets/2c1dd90a-cac9-487b-aade-626d2e3535ac" />

<img width="969" height="736" alt="11 - patched" src="https://github.com/user-attachments/assets/56be05a7-45c3-412c-9666-86a546b70ee6" />

And that's it.

<img width="860" height="358" alt="12 - gg" src="https://github.com/user-attachments/assets/03de9931-1681-4b02-9af4-5c41858b9980" />

