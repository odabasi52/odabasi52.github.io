---
layout: post
title: "Sea - Proving Grounds Practice"
summary: "SeaCMS 11.1 → Local File Inclusion (LFI) → read database.php → SSH login → pspy64 → bin_replacer scheduled task → sudo NOPASSWD ps → replace binaries → root"
---

# Sea - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed FTP, SSH, HTTP and 55743 ports were open.

<img width="975" height="708" alt="00nmap" src="https://github.com/user-attachments/assets/317a4403-43f3-4bb2-a494-79592b69d55c" />

### FTP Anonymous
FTP Anonymous login was enabled and there were log files.

<img width="575" height="303" alt="03ftp anon" src="https://github.com/user-attachments/assets/37f5df50-b3d9-4c4a-b2fd-afb4a0802196" />

They included different paths and I think it was pentest logs.

<img width="789" height="212" alt="04logs" src="https://github.com/user-attachments/assets/feadf652-f142-46cb-a553-ebc862b59abc" />

So I tried to visit a path and it redirected me to login page which was `SeaCMS` site.

<img width="1281" height="642" alt="06seacms" src="https://github.com/user-attachments/assets/2b0d67fa-3bbd-4568-ab90-e50562bca485" />

## Exploitation
### SeaCMS 11.1 LFI 
SeaCMS was vulnerable to LFI as seen below.

<img width="1577" height="461" alt="07lfi" src="https://github.com/user-attachments/assets/20601f96-599f-4031-9beb-0622e0d79756" />

So I checked logs and found `database.php` file.

<img width="736" height="66" alt="08databasephp" src="https://github.com/user-attachments/assets/18f1cf1c-9776-4f71-8614-cbd9fcad04ac" />

Later, I tried to read it via LFI and found SSH credentials.

<img width="1581" height="274" alt="09ssh" src="https://github.com/user-attachments/assets/69ed1a01-49b4-4475-b802-bc83dbb19081" />

And I simply logged in and got user shell.

<img width="939" height="323" alt="10localflag" src="https://github.com/user-attachments/assets/e506486c-c677-4d3c-9300-b69dcd816f23" />

## Privilege Escalation
### bin_replacer binary and sudo NOPASSWD ps
I executed `sudo -l` and found NOPASSWD ps was allowed. Moreover, I checked `$PATH` and found `$HOME/bin` was also path variable.

<img width="1036" height="132" alt="11PATH" src="https://github.com/user-attachments/assets/abc5364d-5b51-45cc-a826-55c07f7d50ae" />

Then I executed `pspy64` and found `bin_replacer` binary was running once a minute. 

It was a script that replaces (`$HOME/bin/.*`) hidden files with binaries under `/bin`.
- `clean="${name#.}"`: this part removes preceding `.` from filename
- `if [[ -x "$DEST_DIR/$clean" ]]; then`: this part checks if filename is really an executable binary name under `/bin` and if it is, it replaces files

<img width="806" height="482" alt="12binreplacer" src="https://github.com/user-attachments/assets/f092e38f-4710-4b7c-b629-b4c909b17b2a" />

So I simply created a file named `.ps` that just executes `/bin/bash` as seen in below two images.

<img width="547" height="181" alt="13ps" src="https://github.com/user-attachments/assets/803d8fc4-35c5-45fc-a34b-803ad9cc0e21" />

<img width="431" height="65" alt="13ps2" src="https://github.com/user-attachments/assets/e63a4b71-532a-410d-8cdb-5ca5d092cd2d" />

And executing `sudo /bin/ps aux` got me root shell.

<img width="905" height="311" alt="14gg" src="https://github.com/user-attachments/assets/07fc4cdf-894a-4064-a3f6-489078cba1a9" />
