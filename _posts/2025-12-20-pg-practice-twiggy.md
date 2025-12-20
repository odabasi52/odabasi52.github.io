# Twiggy - Proving Grounds Practice

## Enumeration
### Nmap 
Initial nmap scan revealed SSH port, HTTP port, non standard ports (4505, 4506) which run ZeroMQ and HTTP service running on port 8000.

<img width="1010" height="649" alt="00 - nmap" src="https://github.com/user-attachments/assets/6d44f520-3bcb-4fd3-9926-b4b398dda6b6" />

### WEB Enumeration
I tried sql injection to brute forcing and none of them worked. Fuzzing revealed sitemap.xml file is accessible but it did not have any information I do not know.

<img width="1662" height="669" alt="01 - sitemap xml" src="https://github.com/user-attachments/assets/db861cba-fd51-40c8-b82c-e475abab751e" />

Then I found that port 8000 has a different response header which has the value of saltapi 3000-1

<img width="1527" height="558" alt="02 - salt api" src="https://github.com/user-attachments/assets/63796952-1372-4922-a5b1-d336e46ec149" />

I googled it and found out it was vulnerable to RCE

<img width="1920" height="778" alt="03 - salt api" src="https://github.com/user-attachments/assets/76781e5a-e515-467a-b024-950bf38b287a" />

## Exploitation (Directly Root)
I tried to run reverse shells but none of them worked. Then I tried reading files and found out I could read passwd and shadow files. I tried to bruteforce root password but it did not work.

<img width="1791" height="579" alt="04 - read passwd" src="https://github.com/user-attachments/assets/a158e091-c07f-4508-8899-883fe4a78d3b" />

Then I thought that if I can read shadow file, it means I probably am root. So I tried to update passwd file with this simple command:
```bash
pw=$(openssl passwd Password123); echo "r00t:${pw}:0:0:root:/root:/bin/bash" >> passwd
```
And added a new root user with Password123 password.

<img width="1285" height="571" alt="05 - saved passwd" src="https://github.com/user-attachments/assets/74d61ff5-790e-451b-9d1b-672ef0483988" />

<img width="1535" height="765" alt="06 - updated" src="https://github.com/user-attachments/assets/5ff1216a-9d23-4d44-94ba-41d2d783112c" />

Then I simply got root shell with ssh.

<img width="999" height="549" alt="07 - got the root" src="https://github.com/user-attachments/assets/6f32d010-43bf-4cb2-9663-d7cc161d92e4" />
