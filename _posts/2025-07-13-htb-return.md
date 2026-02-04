---
layout: post
title: "Return - Hack The Box"
summary: "Update server IP for Printer → LDAP Pass Back Attack (ldap pass-back) → Capture credentials using WireShark → Server Operators Group → Update service path → SYSTEM shell"
---

# Return - Hack The Box

## Enumeration
### Nmap
The Nmap scan revealed open ports for SMB, LDAP, and Kerberos, which strongly suggests that the target is a Domain Controller. Additionally, an HTTP port was also found to be open.

<img width="1365" height="758" alt="00 - nmap output" src="https://github.com/user-attachments/assets/83087126-911b-4d86-865e-ee001cde554c" />

### WEB
Web enumeration revealed a settings page that allowed updating the server IP address for the printer service. This service was communicating over cleartext LDAP.

<img width="1526" height="820" alt="01 - settings" src="https://github.com/user-attachments/assets/db87f956-d871-487e-a31b-1b44d0035764" />

## Exploitation
### LDAP Pass-Back Attack
From there, it was straightforward. I followed the guide in [this post](https://www.linkedin.com/pulse/ldap-pass-back-attack-simple-guide-jose-pacheco-eejkf/) and successfully carried out an LDAP Pass-Back Attack.
I started a listener and updated the server IP with my own. As a result, I was able to capture the cleartext login credentials using Wireshark.

<img width="435" height="119" alt="02 - listener" src="https://github.com/user-attachments/assets/09b26a1c-6b7a-4990-afe9-cd4eda3f8653" />

<img width="1256" height="524" alt="03 - my ip" src="https://github.com/user-attachments/assets/1ecea03f-daa1-4537-a97b-f765aac16a49" />

<img width="1919" height="789" alt="04 - got the password" src="https://github.com/user-attachments/assets/eb9ae1ca-4597-4e15-96a8-bd62a2dbf2ea" />

### Got The User
<img width="1360" height="490" alt="05 - got the user" src="https://github.com/user-attachments/assets/6235bea1-a44f-4e82-8f9b-02f9de8ce7a0" />

## Privilege Escalation
### Server Operators Group
Privilege escalation was straightforward—the current service account was a member of the Server Operators group. I leveraged this by updating the binpath of the VMware Tools service (which runs with SYSTEM privileges) to execute nc.exe. After starting a listener and restarting the service, I received a SYSTEM shell. (Followed [this post](https://www.hackingarticles.in/windows-privilege-escalation-server-operator-group/))

<img width="1546" height="687" alt="07 - privesc start" src="https://github.com/user-attachments/assets/b3555d9a-5f56-4436-ac43-d09ef32d59a4" />

<img width="1470" height="214" alt="08 - rev shell" src="https://github.com/user-attachments/assets/3eaa663d-8a9e-4518-a33e-bad089b7cfa6" />

<img width="884" height="373" alt="09 - gotcha" src="https://github.com/user-attachments/assets/4a68586b-8cb2-45df-b4f2-3ab6febfd390" />

## Pwned
<img width="701" height="668" alt="pwned" src="https://github.com/user-attachments/assets/4a2b47af-f951-4059-9fd7-4d029aaf49b8" />




