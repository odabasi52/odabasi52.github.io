# Blogger - OffSec Proving Grounds

## Objective
Utilize enumeration and web enumeration techniques to uncover vulnerabilities. Engage in privilege escalation by abusing sudo permissions to gain elevated access. This lab is designed to harness your skills in identifying and exploiting system weaknesses.

## Enumeration
### Nmap
Initial Nmap enumeration revealed open SSH and HTTP ports.

![00 - nmap output](https://github.com/user-attachments/assets/e43243ec-ad37-42f7-9849-26b757d32c10)

### WEB Enumeration
While analyzing the website structure, I came across a blog page that was unexpectedly placed under the /assets/fonts/ folder.

![01 - found blog page](https://github.com/user-attachments/assets/7ce571bd-9293-46c4-996e-3a4a71fdadde)

The blog page turned out to be a WordPress installation, but it was only accessible via the blogger.pg domain. To access it locally, I added an entry for blogger.pg to my /etc/hosts file.

![02 - etc hosts](https://github.com/user-attachments/assets/c85c2feb-a0cb-4107-8415-b2900cdc4231)

![03 - wp login](https://github.com/user-attachments/assets/c554ac13-c651-4164-a949-b7553298c8fa)

### Wordpress Enumeration
I then attempted user enumeration and brute-forcing against the WordPress login. While I was able to identify valid usernames, the brute-force attack did not yield any working credentials.

![04 - wpscan user](https://github.com/user-attachments/assets/12874d3c-6fdc-4b64-9d65-a2c7eb4d5aa4)

Using aggressive plugin detection, I identified a vulnerable plugin "wpDiscuz" installed on the WordPress site.

![05 - aggressive detection](https://github.com/user-attachments/assets/dda2a440-a982-4c7a-8a5c-11ee7529717d)

![06 - plugins](https://github.com/user-attachments/assets/d8920735-d17f-4ace-9c8e-56146ec9f0ee)

![07 - probable exploit](https://github.com/user-attachments/assets/07571727-7084-4053-abc3-ca56ad78e30d)

## Exploitation

The vulnerability in the wpDiscuz plugin affects the blog post comment section, allowing attackers to upload PHP files disguised as image files by using GIF magic numbers. I leveraged this by using a publicly available script that uploads a PHP web shell as a comment attachment to any chosen blog post.

![08 - exploit](https://github.com/user-attachments/assets/a306632d-5849-4801-95ed-d46a47dc14ae)

![09 - got the shell](https://github.com/user-attachments/assets/1b96cabd-e291-4dd3-bd6a-b549d5c96645)

The initial web shell uploaded via the vulnerable comment section was non-responsive. To gain a more stable shell, I executed a Python reverse shell from within it, which successfully established a fully interactive connection back to my listener.

![10 - python shell](https://github.com/user-attachments/assets/63038ba4-7794-477f-bfad-27d0d9480d56)

![11 - user flag](https://github.com/user-attachments/assets/e7a57859-433e-4aed-9581-16706eb0026f)

## Privilege Escalation

Once inside the system, I located database credentials in the wp-config.php file. Using these, I accessed the MySQL database and found a hashed password belonging to the user james. However, despite several attempts, I was unable to crack the hash.

![12 - db pass](https://github.com/user-attachments/assets/6d48cb7a-1745-486c-a195-09f00b287df4)

![13 - james db log,n](https://github.com/user-attachments/assets/7073b375-688b-4d6e-8cbe-a8d311cffba9)

I then discovered a backup script listed in the crontab jobs, which used the tar * command-suggesting a potential for wildcard-based privilege escalation. However, upon further inspection, I realized that the script was executed in a directory where I lacked write permissions, making the exploit path unfeasible.

![14 - can not execute tar wildcard no permission](https://github.com/user-attachments/assets/d7276ab8-73f8-415b-a228-117592a720bb)

Later, I found a .creds file under the /opt directory, which appeared to contain encrypted credentials. However, I was unable to decrypt the file, so this path did not lead to privilege escalation either.

![15 - creds revealed nothing](https://github.com/user-attachments/assets/c4608444-8adb-4670-85f7-d45bc5108995)

While exploring the system, I noticed a vagrant user listed in /etc/passwd and confirmed the presence of their home directory. I tried the default credentials vagrant:vagrant, which successfully granted access. Running sudo -l revealed that the vagrant user had passwordless sudo privileges. I then executed sudo bash -p to escalate privileges and obtained a root shell.

![16 vagrant:vagrant then nopasswd and flag](https://github.com/user-attachments/assets/5d53b0eb-eb0f-4f9f-b87e-8ebe06d2cb1d)












