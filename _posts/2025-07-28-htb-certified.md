---
layout: post
title: "Certified - Hack The Box"
summary: "Bloodhound-python (Bloodhound Python) → WriteOwner pver a Group → GenericWrite over a service account → Shadow Credentials attack → shell → GenericAll over CA_OPERATOR → certipy → ADCS ESC9 → Administrator"
---

# Certified - Hack The Box

## Enumeration
### Nmap
Initial Nmap scan revealed SMB, LDAP, Kerberos and WinRM ports open, which indicates target is Domain Controller.

<img width="532" height="350" alt="00 - nmap" src="https://github.com/user-attachments/assets/b0e6d42c-f279-477c-8958-7d71f8f048da" />

### User Enumeration
A user was given to us initially, so using given credentials I applied rid brute forcing and created a user list.

<img width="662" height="286" alt="01 - userList" src="https://github.com/user-attachments/assets/459d9c4e-cff6-48ab-bd3f-6cb5b782d3af" />

### Trying AS-REP Roasting
Using the user list, I tried ASREP Roasting which did not reveal anything.

<img width="592" height="98" alt="01 - userList asrep try" src="https://github.com/user-attachments/assets/d0834d02-a722-4397-a321-4f3c2c56504a" />

### Trying Kerberoasting
Then tried kerberoasting attack and got a ticket for the management_svc user, but it was not crackable.

<img width="760" height="188" alt="02 - SPN" src="https://github.com/user-attachments/assets/25dc1bcb-4547-49f6-ae9b-ec4c501ef00c" />

### LDAP Search
Did an LDAP search and checked description fields, which also did not reveal anything useful.

<img width="460" height="106" alt="03 - ldapsearch try" src="https://github.com/user-attachments/assets/8d895ac9-7e5b-4a57-b056-3d87aacd1009" />

### BloodHound
Then ran bloodhound and found a way to get a shell.

<img width="508" height="164" alt="04 - bloodhound python" src="https://github.com/user-attachments/assets/7ecaca42-3f2d-4d93-a636-2da7a15ac727" />

<img width="472" height="331" alt="05 - path to admin" src="https://github.com/user-attachments/assets/900ad0b9-3169-41cf-9f67-b95c5d0341cb" />

## Exploitation
### WriteOwner
Current user judith had WriteOwner permissions over Management group. So simply following the steps, I added judith to Management group.

<img width="656" height="78" alt="06 - 0 writeowned" src="https://github.com/user-attachments/assets/664dfb4a-c187-47fa-a4b5-e8c97ae47fed" />

<img width="751" height="56" alt="06 - 1 writeowned" src="https://github.com/user-attachments/assets/06363a69-948f-4abb-a8e9-b8f7242d66ec" />

<img width="422" height="37" alt="06 - 2 writeowned" src="https://github.com/user-attachments/assets/a6632bca-dae2-4a53-862f-bae8088f1c0b" />

<img width="362" height="46" alt="06 - 3 verify" src="https://github.com/user-attachments/assets/27ddae30-d76b-41c2-b25e-3dc413abcf54" />

### GenericWrite (Shadow Credentials)
Management group had generic write over management_svc. So we could either do targeted kerberoasting (which I tried at the beginning and could not crack the ticket) or we can apply Shadow Credentials attack.

So I followed steps to apply shadow credentials attack.

<img width="532" height="140" alt="07 - 0 shadowcreds" src="https://github.com/user-attachments/assets/c32d4c86-d93e-4e79-b92c-c1fb4543bba1" />

<img width="452" height="133" alt="07 - 1 shadowcreds" src="https://github.com/user-attachments/assets/e68b7dfc-5b11-4864-bab4-889664bef62a" />

<img width="407" height="77" alt="07 - 2 shadowcreds" src="https://github.com/user-attachments/assets/060e3e30-d1be-4e54-ade7-215af94b3cd0" />

### Got The User

<img width="530" height="122" alt="08 - userFlag" src="https://github.com/user-attachments/assets/2121581d-09e0-41f9-b672-1f29316bce74" />

## Privilege Escalation
### GenericAll
management_svc user had generic all permissions over CA_OPERATOR.

<img width="500" height="199" alt="09 - generic all" src="https://github.com/user-attachments/assets/9de48d44-b1dd-4d68-be45-bf0d64a9f9e0" />

So I could force change CA_OPERATOR's password.

<img width="494" height="27" alt="10 - set password" src="https://github.com/user-attachments/assets/e2b106f5-1222-4bc5-b596-6ee9ac977996" />

### ADCS - ESC9
Using CA_OPERATOR, I enumerated for vulnerable certificate templates, and found a template that is vulnerable to ESC9.

<img width="359" height="94" alt="11 - certipy 0" src="https://github.com/user-attachments/assets/cb66a288-9aa0-44b3-a809-0cfaf0e9c89a" />

<img width="535" height="41" alt="11 - certipy 1" src="https://github.com/user-attachments/assets/54bbda67-38f7-48f0-ae97-c91512887ce0" />

So the scenario was simple, management_svc user had generic all permissions over CA_OPERATOR and CA_OPERATOR has vulnerable certificate template.

I can exploit ESC9 by updating CA_OPERATOR's upn to Administrator using management_svc credentials. I followed [this steps](https://github.com/ly4k/Certipy/wiki/06-%E2%80%90-Privilege-Escalation) to do that and get the Administrator hash.

### Got The Shell
Then I got the administrator shell using psexec.

<img width="520" height="158" alt="12 - root" src="https://github.com/user-attachments/assets/cc4a9787-dc18-445e-8cb9-860d056907d5" />

## Pwned
The machine was fully compromised.

<img width="307" height="284" alt="pwned" src="https://github.com/user-attachments/assets/5d0ec02e-ade8-4354-a7cc-ef3e509fc5de" />
