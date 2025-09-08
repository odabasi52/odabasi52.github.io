# EscapeTwo - Hack The Box

## Enumeration
### Nmap and DNS
Initial nmap scan revealed common Domain Controller ports and MSSQL port were open. Moreover, DNS enumeration revealed the Domain Controller FQDN.

<img width="1212" height="839" alt="00 - nmap and dns" src="https://github.com/user-attachments/assets/f312f139-2cad-4652-a8cc-76caa779f088" />

### SMB Enumeration
A user was given to me. Using the given credentials I enumerated SMB Shares. Two of the shares were unusual.

<img width="1318" height="225" alt="01 - initial suer" src="https://github.com/user-attachments/assets/a04852ca-2938-4fd5-be74-3ec2c5030922" />

The Accounting Department share included 2 excel files.

<img width="1017" height="286" alt="02 - accounting" src="https://github.com/user-attachments/assets/ce85adcb-d3b1-4ce8-80b9-a59faec9689d" />

I opened them using [XLSX Viewer website](https://jumpshare.com/viewer/xlsx). Inside it, there was credentials for MSSQL service account and oscar user.

<img width="720" height="284" alt="03 - passwords" src="https://github.com/user-attachments/assets/9d22eab5-aacc-4e51-acdb-93d0ad1b18d3" />

## Exploitation
### MSSQL
I logged in to MSSQL using found credentials.

<img width="1192" height="323" alt="04 - mssql" src="https://github.com/user-attachments/assets/51093179-c839-4bbd-ab67-8064846448eb" />

Then I ran reverse shell using xp_cmdshell.

<img width="1693" height="142" alt="05 - revshell" src="https://github.com/user-attachments/assets/3cb831e4-a9e4-4c94-b768-c07c18ece9d7" />

Then I tried some privilege escalation methods but it did not work. Later, while I was browsing through directories I found an SQL config file which included service account "sql_svc" and its password.

<img width="542" height="397" alt="06 - config file" src="https://github.com/user-attachments/assets/932e77f6-c5cd-4200-9438-55ee25afb0a6" />

Checking the credentials I found out it was a valid password.

<img width="1281" height="81" alt="07 - valid login" src="https://github.com/user-attachments/assets/f4737d99-8f63-412b-b08e-5ddf2c849f63" />

Then I tried many things and nothing worked. 

I could brute force all users with all valid passwords I found. Before I do that, I checked Users directory and found there was only ryan, sql_svc and Administrator directories. So I thought maybe user "ryan" set the service account so its password may be same as ryan's password. I tried and it worked.

<img width="1692" height="161" alt="08 - password reuse" src="https://github.com/user-attachments/assets/3cf38ddb-887f-46a9-86d0-69f7932e1de4" />

Using evil-winrm I logged in and got the user flag.

<img width="1068" height="243" alt="09 - user flag" src="https://github.com/user-attachments/assets/a2e56ff7-82e7-40ab-a515-02f33fa7e0f4" />

## Privilege Escalation
At first, I ran bloodhound and found that Ryan was WriteOwner to CA_SVC which is probably service account that can request certificates. 

<img width="904" height="279" alt="10 - write owner" src="https://github.com/user-attachments/assets/237ffc3a-663c-4234-a778-c734689e6945" />

So, I applied steps from [Hacking Articles blog](https://www.hackingarticles.in/abusing-ad-dacl-writeowner/) and changed the password of the target user.

<img width="1068" height="344" alt="11 - change password" src="https://github.com/user-attachments/assets/ba1bcd62-13a9-4689-a4af-fa53875583dd" />

Then I ran certipy and found out a template was vulnerable to ESC4.

<img width="759" height="47" alt="12 - certipy" src="https://github.com/user-attachments/assets/0356ade6-69b2-42d6-b790-0f9834f87095" />

<img width="732" height="610" alt="13 - esc4" src="https://github.com/user-attachments/assets/276b1628-76f7-4d23-b05f-f7eaa0ae0409" />

Following steps from the [official certipy wiki](https://github.com/ly4k/Certipy/wiki/06-%E2%80%90-Privilege-Escalation) I got the administrator hash. Then I logged in with this hash and got the root flag.

<img width="1221" height="237" alt="14 - root" src="https://github.com/user-attachments/assets/ba66ea5c-c71f-4956-a9bb-47c0aaba7391" />

## Pwned
The machine was pwned.

<img width="721" height="699" alt="15 - pwned" src="https://github.com/user-attachments/assets/4a8c149e-ec41-4a3c-a7ad-a6d3a791a71f" />
