---
layout: post
title: "Kevin - Proving Grounds Practice"
summary: "HP Power Manager 4.2 (Build 7) → CVE-2009-3999 → MSFConsole → Remote Code Execution → SYSTEM Shell"
---

# Kevin - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed HTTP, SMB and some common windows ports were open. Moreover, it revealed that target was vulnerable to Eternal Blue.

<img width="1180" height="829" alt="00 - nmap 1" src="https://github.com/user-attachments/assets/062a75f2-614e-4532-b88c-90ca32580f21" />

<img width="1180" height="733" alt="00 - nmap 2" src="https://github.com/user-attachments/assets/743fc779-5ac0-44ce-b92a-3bd062f2bf83" />

However, because target was x86 the MS17_010 exploit did not work.

<img width="1878" height="313" alt="01 - 0 not working" src="https://github.com/user-attachments/assets/4f1116df-5a1b-4bc2-9f0a-1b09daab7121" />

### Web Enumeration
So I checked the website and found it was HP Power Manager website.

<img width="1918" height="387" alt="01 - web hp" src="https://github.com/user-attachments/assets/8bf90be3-bf67-42d7-bbc9-6441b6fd04c1" />

The credentials were left default so I simply logged in with admin:admin credentials.

<img width="1918" height="530" alt="02 - admin admin logged in" src="https://github.com/user-attachments/assets/c6087486-0ce9-44cf-a920-a4e632c18c73" />

Then I checked the Help tab and found out it was HP Power Manager 4.2 (Build 7)

<img width="1918" height="714" alt="03 - version" src="https://github.com/user-attachments/assets/46f517f7-ba8f-4e58-a5dd-15d8396e0b7c" />

## Exploitation (Directly SYSTEM)
### CVE-2009-3999
Stack-based buffer overflow in goform/formExportDataLogs in HP Power Manager before 4.2.10 allows remote attackers to execute arbitrary code via a long fileName parameter.

The target was vulnerable to RCE. So I simply used msfconsole module named `exploit/windows/http/hp_power_manager_filename` and obtained SYSTEM Shell.

<img width="1180" height="565" alt="root" src="https://github.com/user-attachments/assets/8473b092-053e-4cb8-883d-cfdfaec40b60" />


