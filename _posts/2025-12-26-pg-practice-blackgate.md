---
layout: post
title: "BlackGate - Proving Grounds Practice"
summary: "Exploited unauthenticated Redis RCE vulnerability using RedisModules-ExecuteCommand to gain initial shell access."
---

# BlackGate - Proving Grounds Practice

## Enumeration
### Nmap 
Initial Nmap scan revealed Redis and SSH ports were open.

<img width="1043" height="758" alt="00 - nmap" src="https://github.com/user-attachments/assets/136354b2-b543-45f8-8154-a60714219f6e" />

## Exploitation
### Redis RCE
Redis version was vulnerable to RCE and no authentication was required. So I found Redis RCE Github and cloned it.

<img width="1920" height="840" alt="01 - redis rce" src="https://github.com/user-attachments/assets/a96d82ee-0801-4443-bb2e-d4204e813f6a" />

To run commands with Redis, I had to clone RedisModules-ExecuteCommand repo and compile it.

<img width="1920" height="840" alt="01- redismodule" src="https://github.com/user-attachments/assets/da190104-2e3b-485e-bdc0-9ce67c31dc39" />

But because of the GCC version (I think), I could not compile it. I applied the fixes compiler recommended.
1. Add Missing Headers: The errors implicit declaration of function ‘strlen’, ‘strcat’, and ‘inet_addr’ mean the compiler doesn't recognize these functions because the necessary headers haven't been included.

Open module.c (src/module.c) and add the following lines to the top of the file (alongside the other #include statements):
```c
#include <string.h>      // Required for strlen, strcat
#include <arpa/inet.h>   // Required for inet_addr
```
2. Fix Pointer Discard Qualifiers (Warnings): The warning initialization discards ‘const’ qualifier happens because RedisModule_StringPtrLen returns a const char * (a read-only string), but the code assigns it to a char * (a modifiable string).

Update the variable declarations in DoCommand and RevShellCommand to use const:

In DoCommand: Change:
```c
char *cmd = RedisModule_StringPtrLen(argv[1], &cmd_len);
```
To:
```c
const char *cmd = RedisModule_StringPtrLen(argv[1], &cmd_len);
```

In RevShellCommand: Change:
```c
char *ip = RedisModule_StringPtrLen(argv[1], &cmd_len);
char *port_s = RedisModule_StringPtrLen(argv[2], &cmd_len);
```
To:
```c
const char *ip = RedisModule_StringPtrLen(argv[1], &cmd_len);
const char *port_s = RedisModule_StringPtrLen(argv[2], &cmd_len);
```

3. Fix execve Argument (Warning): The warning argument 2 null where non-null expected for execve occurs because execve expects the second argument (argv) to be a pointer to an array of strings, not 0 (NULL). While passing NULL might work on some systems, it is technically incorrect.

In RevShellCommand: Change:
```c
execve("/bin/sh", 0, 0);
```
To:
```c
char *const args[] = {"/bin/sh", NULL};
execve("/bin/sh", args, NULL);
```

4. Then compile in base directory (make all):

<img width="957" height="271" alt="02- make all" src="https://github.com/user-attachments/assets/fe8c19ad-ead7-45ac-8a80-79994e9b42bf" />

Then simply run Redis RCE and get a reverse shell.

<img width="1920" height="840" alt="03 - user flag" src="https://github.com/user-attachments/assets/b84be931-c735-4555-8c6d-8191c2437f57" />

## Privilege Escalation
### sudo -l
We could run redis-status binary without password as super user.

<img width="953" height="166" alt="04 - sudo l" src="https://github.com/user-attachments/assets/b6d6ad61-d382-4fdd-9070-5ad3d72576e1" />

At first I thought this was a BoF challenge and tried to develop an exploit but could not make it work.

### strings
Then I ran strings against the binary and found a password.

<img width="996" height="505" alt="05 - strings revealed a key" src="https://github.com/user-attachments/assets/b55845b5-0329-4741-aaf8-c77afd06f688" />

This was indeed the password for the binary (redis-status), and when we give that password it shows systemctl status page. Because we ran it as sudo we can simply do `!sh` to get a root shell.

<img width="946" height="525" alt="06 - got the root" src="https://github.com/user-attachments/assets/99e71797-a534-4d30-bc49-8f0b08b98060" />

## Privilege Escalation (Kernel Exploit)
I also run linux-exploit-suggester and found some probable exploits.

<img width="1598" height="764" alt="07 - 0 2nd way pwnkit" src="https://github.com/user-attachments/assets/96332e87-7fd2-465c-930f-c9743c17338d" />

PwnKit exploit worked and we got a root shell.

<img width="1210" height="487" alt="07 - 2nd way pwnkit" src="https://github.com/user-attachments/assets/ae8b4f61-c78e-47f0-83e8-6d5c58cfb6c7" />
