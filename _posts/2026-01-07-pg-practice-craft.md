---
layout: post
title: "Craft - Proving Grounds Practice"
summary: "LibreOffice (ODT) Macro generation → ODT Upload to RCE → Write permission to C:\\xampp\\htdocs (web folder) → SeImpersonatePrivilege → GodPatato and nc64.exe to get a reverse shell → Administrator"
---

# Craft - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed only HTTP port was open.

<img width="976" height="358" alt="00 - nmap" src="https://github.com/user-attachments/assets/c4a3206a-40b3-4512-8d5a-532243566c43" />

### Web Enumeration
Website had upload functionality.

<img width="1920" height="758" alt="01 - website" src="https://github.com/user-attachments/assets/32f7706c-ab47-40d6-92d2-a837fecd7845" />

And it was only allowing odt files.

<img width="974" height="169" alt="02 - odt file upload" src="https://github.com/user-attachments/assets/6be13bd2-48ed-4e12-acf5-a3aff94428d4" />

## Exploitation
At first I tried to bypass but only odt was allowed. Then I tried ODT information disclosure and obtained NTLMv2 hash but could not crack it.

### LibreOffice (ODT) Macro to RCE 
After some reserach I found that libre office can run macros which can be used to obtain RCE. So steps to create and assign a macro is liste below.

1. Tools > Macros > Edit Macros to open Macro Menu

<img width="1219" height="673" alt="08 - odt macro" src="https://github.com/user-attachments/assets/6d911c78-9db5-48d9-9803-9e5f10ee5ffb" />

2. Tools > Select Macro to open Macro Creation Menu

<img width="941" height="387" alt="09 - select macro" src="https://github.com/user-attachments/assets/acde2275-2b5a-4914-87dd-f53a0127445d" />

3. Create a new Macro

<img width="664" height="452" alt="10 - new macro" src="https://github.com/user-attachments/assets/45721705-4120-4071-9af2-a4e1ce6a2e78" />

4. Edit Macro to run shell commands

<img width="1152" height="434" alt="11 - shell command test" src="https://github.com/user-attachments/assets/22227e0c-a4cc-40e3-97c3-0cf9b6f80784" />

5.  Tools > Customize to open Event menu and assign Macro

<img width="1802" height="810" alt="12 - tools customize" src="https://github.com/user-attachments/assets/678fe166-f0e7-4e2c-bd49-20fb0d8439d7" />

6. Assign Macro to Open Document Event

<img width="1152" height="630" alt="13 - assign macro" src="https://github.com/user-attachments/assets/5afd44f0-dd62-4602-b449-60198ec1154e" />

7. Test it

<img width="1441" height="696" alt="14 - rce" src="https://github.com/user-attachments/assets/5f111599-9140-4a2e-895d-92482012d808" />

As seen in above steps we can run commands. So all we need to do is update macro to gain Reverse Shell.

<img width="1441" height="696" alt="15 - revshell encoded" src="https://github.com/user-attachments/assets/7f99393e-4a82-4837-be1f-ea1312f1fccb" />

With this update I got the user and flag.

<img width="718" height="196" alt="16 - revshell" src="https://github.com/user-attachments/assets/3144489a-aa91-47a2-ba69-2ecf31bd3943" />

<img width="718" height="289" alt="17 - flag" src="https://github.com/user-attachments/assets/04167ad1-8760-451b-99fd-b81362ec985f" />

## Lateral Movement
### Write to C:\xampp\htdocs
User had write access to web folder, so I simply uploaded a reverse php shell.

<img width="1007" height="437" alt="18 - upload revshell" src="https://github.com/user-attachments/assets/d84f36fd-6d01-4d29-bab1-4ecf87ae9d28" />

## Privilege Escalation
### SeImpersonatePrivilege
Service account had SeImpersonatePrivilege.

<img width="1356" height="883" alt="19 - seimpersonate" src="https://github.com/user-attachments/assets/8f9745b3-d718-4882-a252-8a1e4a420f8e" />

I used GodPatato to exploit it and got reverse shell using nc64.exe

<img width="1050" height="543" alt="20 - nc" src="https://github.com/user-attachments/assets/6447ca54-dba0-47d3-b223-11f71aedf317" />

And I got the Administrator flag.

<img width="917" height="694" alt="21 - root" src="https://github.com/user-attachments/assets/1a39d12e-7ae2-49a0-8ef0-795e2397acb0" />

