---
layout: post
title: "Access - Proving Grounds Practice"
summary: "File upload via Ticket.php endpoint (php blacklist) → .htaccess file upload bypass (custom .cybersec extension) → reverse shell .cybersec file upload → RCE access → BloodHound SharpHound enumeration → svc_mssql Kerberoastable user discovery → Kerberoasting via Rubeus → hash cracking (svc_mssql credentials) → RunAsCs reverse shell as svc_mssql → SeManageVolume privilege token enable script → SeManageVolumeExploit C:\ full access → Administrator shell access"
---

# Access - Proving Grounds Practice

## Enumeration
### Nmap 
Nmap scan revealed that target is probably DC. Moreover, it showed that target had HTTP, HTTPs ports were open.

<img width="1534" height="818" alt="00 - nmap" src="https://github.com/user-attachments/assets/47e84a06-5918-4a28-8b7c-f05e0fa88366" />

### Web Enumeration
The website had 'Buy Now' button, which when clicked opens a pop-up tab where you can select a file.

<img width="1611" height="792" alt="01 - Buy Now Button" src="https://github.com/user-attachments/assets/27828921-ed5a-441b-9aa1-23cf56ce13d5" />

<img width="1524" height="681" alt="02 - File Upload" src="https://github.com/user-attachments/assets/129d49cf-4e75-4927-a93e-62815b3d49c3" />

When we select a file, it sends a POST request to Ticket.php endpoint.

<img width="1539" height="839" alt="03 - POST" src="https://github.com/user-attachments/assets/628d5c02-f424-4cb5-88a3-0a2947a9cdf1" />

Then we can access it by visiting uploads directory.

<img width="869" height="369" alt="04 - uploads no control" src="https://github.com/user-attachments/assets/ef05ed79-fc0e-437b-8faf-fc39676c4eb9" />

However, we can not upload any php, phar or phtml files.

<img width="1546" height="735" alt="05 - php not allowed" src="https://github.com/user-attachments/assets/87934267-eb2d-4f02-9894-11719b6b940a" />

## Exploitation
### Bypassing File Upload via .htaccess
So at first I tried some known methods such as null byte (%00) and double extension but none of them worked. Then I found [this medium post](https://medium.com/@ryangcox/web-shell-upload-via-extension-blacklist-bypass-file-upload-vulnerability-f98ee877aff1) which explain we can ues .htaccess file to upload a file with different extension but make it interpreted like php file.
So I uploaded a .htaccess file and made .cybersec extension my new .php extension.

<img width="1534" height="818" alt="06 -  htaccess" src="https://github.com/user-attachments/assets/3a790c97-1d16-4d5a-bd4e-bf6e58b1fb75" />

Then uploaded a php reverse shell with that extension.

<img width="1534" height="818" alt="07 -  cybersec" src="https://github.com/user-attachments/assets/14e295dc-574f-445f-821f-6afaf4f71b4b" />

Then got the reverse shell by simply visiting.

<img width="1376" height="786" alt="08 - initial foothold" src="https://github.com/user-attachments/assets/5ba4cdf9-b330-4782-bbbc-a7a6036c8fd7" />

## Lateral Movement
### Kerberoasting
I then ran winpeas.exe and found nothing, then searched some config files and found nothing again. Then ran SharpHound and found no direct path. However, I found that svc_mssql user is kerberoastable.

<img width="1154" height="326" alt="09 - kerberoastable" src="https://github.com/user-attachments/assets/bebcf738-b74c-45bd-8992-5c8b11e461f2" />

So I used rubeus to simply kerberoast the svc_mssql user.

<img width="1884" height="566" alt="10 - kerberoasted" src="https://github.com/user-attachments/assets/d60604c7-83c6-4580-b781-c5901cd87b77" />

Then using rockyou.txt as a wordlist, I brute forced and cracked it.

<img width="1899" height="862" alt="11 - cracked" src="https://github.com/user-attachments/assets/d2c15ee9-4b9a-4b0f-bdda-00bcd7f4b61f" />

### Getting Shell As svc_mssql
This was the hardest part. WinRM was not allowed for svc_mssql and I did not know what to do. Then while trying runas, I remembered [RunAsCs](https://github.com/antonioCoco/RunasCs) which can be used to get a reverse shell using newly found credentials.
So I ran it and got the reverse shell as svc_mssql.

<img width="1526" height="163" alt="12 - run runascs" src="https://github.com/user-attachments/assets/f51799eb-88bb-4e7b-9247-abac50418fa5" />

### User Flag
Then simply read user flag.

<img width="737" height="558" alt="13 - revshell and user flag" src="https://github.com/user-attachments/assets/68fd1f9a-5d37-4836-8deb-ce5ef3651b4a" />

## Privilege Escalation
### Enable All Privilege Tokens
The svc_mssql user had SeManageVolume privilege but, it was disabled. However, enabling it was easy [Lee Holmes shared a post](https://www.leeholmes.com/adjusting-token-privileges-in-powershell/) with powershell script to enable one by one. Morover, [This guy](https://medium.com/@markmotig/enable-all-token-privileges-a7d21b1a4a77) updated the script to enable all privileges, so I simply used this script.

<img width="1140" height="480" alt="14 - enabled all privileges" src="https://github.com/user-attachments/assets/a697da2a-a1a8-4008-9fdc-705fc15bf726" />

### SeManageVolumeExploit and Root Flag
Then I googled SeManageVolume privilege escalation and found [this repo](https://github.com/CsEnox/SeManageVolumeExploit). It was simple, we run an executable file and get full access to the C:\ volume.
So I ran it and read the Administrator flag.

<img width="862" height="887" alt="15 - root" src="https://github.com/user-attachments/assets/06635edb-c9c1-4464-af73-821e2c37775a" />
