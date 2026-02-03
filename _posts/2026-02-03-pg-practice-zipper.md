---
layout: post
title: "Zipper - Proving Grounds Practice"
summary: "PHAR or ZIP wrapper (phar://path/zipname.zip/file) → Remote Code Execution → www-data shell → 7za wildcard zip (7zip wildcard) exploit → Linked zip file (ln -s /root/secret enox.zip) → File content reveal on error message → root"
---

# Zipper - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed HTTP and SSH ports were open.

<img width="841" height="520" alt="00 - nmap" src="https://github.com/user-attachments/assets/54504dc6-5942-4679-8ee5-6b85ebbc7c2c" />

### Web Enumeration
Website had a single point where we could input a file. Files were then converted to a zip.

<img width="1507" height="664" alt="01 - website" src="https://github.com/user-attachments/assets/acc61adf-42d6-4a4c-9b70-4f896caab46d" />

## Exploitation
### PHAR or ZIP wrapper
When I clicked Home, a parameter named file occured. So, I thought maybe this parameter gets a name and appends `.php` at the end.

<img width="1509" height="384" alt="02 - 0 home" src="https://github.com/user-attachments/assets/010dbd23-d4aa-45ed-8392-0e0745b8ebd3" />

To test this idea, I created a file named `test.php` which executes `phpinfo()` function.

<img width="363" height="57" alt="02 - test php" src="https://github.com/user-attachments/assets/19e1b790-a78d-49f2-866d-464814846111" />

Then uploaded it to site.

<img width="1046" height="832" alt="03 - uploaded" src="https://github.com/user-attachments/assets/72ff55c7-ecca-4e4a-971c-e758f808d9f4" />

Then using phar wrapper, I tried to access it without adding `.php` extension and it worked.

<img width="1499" height="484" alt="04 - gg" src="https://github.com/user-attachments/assets/bae22b9d-fddf-4036-93cd-2c9f7f65a08e" />

I then simply downloaded [pentestmonkey/php-reverse-shell](https://github.com/pentestmonkey/php-reverse-shell), and updated the IP.

<img width="944" height="354" alt="05 - pentest monkey" src="https://github.com/user-attachments/assets/fb533efa-b0dc-459c-96cd-5a7dd076a2a5" />

Then simply uploaded the file and accessed with PHAR wrapper to get a reverse shell.

<img width="1097" height="803" alt="06 - obtained the shell" src="https://github.com/user-attachments/assets/457864b4-9dcb-4dbe-8dec-63872c8205f1" />

And I simply obtained local flag.

<img width="752" height="459" alt="07 - local" src="https://github.com/user-attachments/assets/b444c32d-df65-455b-9cf2-61dca3a944de" />

## Privilege Escalation
### 7za wildcard exploitation
There was a cron job running on behalf of the root.

<img width="846" height="280" alt="08 - crontab" src="https://github.com/user-attachments/assets/43ddbf26-67c7-4f89-a87c-30e4b3e6f66e" />

I checked the file and found out it was using `7za` with root's password to zip files with wildcard zip.

<img width="643" height="121" alt="09 - opt backup" src="https://github.com/user-attachments/assets/020ee27b-a298-4cdd-909b-72dd2ec8f8cb" />

So I did some research and found that `7za wildcard` can be exploited using links to reveal file contents with error disclosure. 
To do that:
1. We need to create a zip file and link it to a file where we do not have read access, for example: `ln -s /root/.ssh/id_rsa root.zip`
2. Then when 7za is called with `*zip`, it will give error on `root.zip` and reveal the contents of `/root/.ssh/id_rsa` on its output

However, there was already a linked file named `enox.zip` on the target machine.

<img width="666" height="295" alt="10 - enox zip" src="https://github.com/user-attachments/assets/9ec1a3e8-3ef7-44b2-a0e9-3b7962e78f5b" />

As root backup cron job saves output of the command to a `backup.log` file, we could simply read it to reveal `/root/secret` file's content.

<img width="1250" height="450" alt="11 - wildcard" src="https://github.com/user-attachments/assets/8b1c57c5-741c-4b18-b505-3516968c26c9" />

We could also use `pspy64` to check the command as it directly uses password on command line.

<img width="1577" height="102" alt="11 - wildcard2" src="https://github.com/user-attachments/assets/4b8744c3-3b31-4f56-8a15-ef8fe55175e3" />

Then use it to obtain root shell.

<img width="803" height="439" alt="12 - root flag" src="https://github.com/user-attachments/assets/31e2ecba-1272-4424-b4ac-ae2a72c27445" />
