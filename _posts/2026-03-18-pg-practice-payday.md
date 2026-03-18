---
layout: post
title: "PayDay - Proving Grounds Practice"
summary: "CS-Cart 1.3.3 → Local File Inclusion (LFI) → Remote Code Execution → Default credentials username and password are same patrick:patrick → sudo ALL user can execute ALL comands as sudo → root"
---

# PayDay - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed SSH, HTTP and some mail ports were open.

<img width="871" height="320" alt="00nmap" src="https://github.com/user-attachments/assets/93c25ab4-7fad-4fe2-b161-6bf8c7f4a7c8" />

### Web Enumeration
Visiting the website revealed it was `CS-Cart` website.

<img width="1293" height="836" alt="01web" src="https://github.com/user-attachments/assets/10dbe143-9d25-470a-8d32-0acf039baba9" />

Later, I searched how to find `CS-Cart` version and found this post ([https://forum.cs-cart.com/t/how-to-find-my-cs-cart-version/13327](https://forum.cs-cart.com/t/how-to-find-my-cs-cart-version/13327)) 
which explains all you need to do is add `?version` to your website like this `http://test.com/?version`. So I did it and found out it was `CS-Cart 1.3.3`.

<img width="1293" height="263" alt="02version" src="https://github.com/user-attachments/assets/1fc55bf0-9804-4c3b-a50a-56f94aec40d5" />

## Exploitation
### CS-Cart 1.3.3 LFI
This version was vulnerable to LFI via below URL.
```
http://<IP>/classes/phpmailer/class.cs_phpmailer.php?classes_dir=../../../../../../../../../../../etc/passwd%00
```

So I simply searched it and found out there was a user named `patrick`.

<img width="1294" height="305" alt="03LFI" src="https://github.com/user-attachments/assets/90063f53-49d0-481b-bc81-3454068cde68" />

### CS-Cart 1.3.3 RCE
This version was also vulnerable to malicious file upload leading to RCE. I found an exploit [reatva/CS-Cart-1.3.3-RCE](https://github.com/reatva/CS-Cart-1.3.3-RCE). It needed admin login so at first I tried to login admin page. 
I only used default `admin:admin` credentials and it worked.

<img width="1290" height="836" alt="04admin" src="https://github.com/user-attachments/assets/3bd9471f-0957-4703-87df-401201ca2284" />

<img width="1291" height="829" alt="05admin admin" src="https://github.com/user-attachments/assets/55f4230e-4623-495c-93ab-f8f43d67aaf3" />

Later, I simply executed the exploit and got reverse shell as `www-data`.

<img width="808" height="116" alt="06exploit" src="https://github.com/user-attachments/assets/764e41df-3619-4108-b835-05be80ada3d2" />

<img width="688" height="329" alt="07rev" src="https://github.com/user-attachments/assets/a88c57bc-4842-4eec-af1b-fcd3a07441a0" />

And I read the user flag.

<img width="641" height="278" alt="08flag" src="https://github.com/user-attachments/assets/579c24d7-4821-42c7-80af-5ca684e0ea57" />

## Privilege Escalation
### default credentials and sudo ALL
Later, I tried many methods but non of them worked. This was an old system and I could not execute anything.

I then tried default credentials `patrick:patrick` and it worked. Moreover, calling `sudo -l` revealed I could run ALL commands as sudo. So I simply executed `sudo bash` and got root.

<img width="713" height="596" alt="09root" src="https://github.com/user-attachments/assets/25ad0fae-765e-4f69-b294-f8839e972c56" />
