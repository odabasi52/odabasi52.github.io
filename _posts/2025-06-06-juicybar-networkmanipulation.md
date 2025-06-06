# Juicy Bar CTF - Network Manipulation
In this post, I’ll walk through the solutions to the network manipulation challenges I was able to solve. Unlike my other posts, I couldn’t complete all the challenges this time, so I’ll only be sharing the ones I managed to crack.

Before we begin, let’s set up the Burp Suite proxy for our Android environment. 

First, export the Burp certificate and push it to the emulator. 

![00 - Setup Proxy](https://github.com/user-attachments/assets/8a4df12a-7906-4666-8137-a7dc2d9a7ebc)

![01 - certificate](https://github.com/user-attachments/assets/285a58ed-8737-4e98-b284-8a20e2fa41f3)

![03 - Proxy](https://github.com/user-attachments/assets/a2cb1625-492d-49ea-8867-4ea83c765ebf)

Next, access a rooted shell and run the script created by Tim Perry from HTTP Toolkit. This script installs the certificate as a trusted root, allowing us to intercept HTTPS traffic.

![04 - Inject root cert](https://github.com/user-attachments/assets/0834e569-87b2-4f85-a26f-8dd033610886)

## HTTP(s)
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/ad2fddcf-7a55-4eb9-b843-acd16679779f)

#### 2 - Obtaining 1st Flag
The first HTTPS challenge was straightforward. I simply set up the proxy and captured the HTTP response.

![01 - Get the flag](https://github.com/user-attachments/assets/fdd8e031-9734-472d-9176-509ec1984bf1)

![02 - LEsson Learned](https://github.com/user-attachments/assets/624757f4-a210-4133-9d64-224a6a486fb9)

#### 3 - Obtaining 2nd Flag
The second flag was also easy to obtain, thanks to the system certificate we had already set up. Although the traffic was over HTTPS, it didn’t matter since we could intercept it. The only trick was modifying a boolean value in the request to true to reveal the flag.

![04 - Flag](https://github.com/user-attachments/assets/cb6c32df-dfff-4817-bf7f-1271a208f651)

![05 - Lesson Learned](https://github.com/user-attachments/assets/902868e2-780c-4fad-ab6d-af42dd4269ff)

#### 4 - Obtaining 3rd Flag 
For the third flag, I intercepted the server response and modified the log_flag boolean to true. This triggered the client-side app to log the flag in logcat.

![06 - intercept response](https://github.com/user-attachments/assets/43dce4db-98e8-4824-9349-e2ef4a7aef89)

![07 - Lesson LEarned](https://github.com/user-attachments/assets/b80a9a37-b3d4-4f07-8fc2-ac24c6cbd319)

## WebSocket
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/82db97fa-afd2-41fa-9fe3-7cf873f7f887)

#### 2 - Obtaining Flag
The WebSocket challenge was easy, thanks to Burp's built-in WebSocket support. I simply opened the WebSocket tab and found the flag in the messages.

![01 - Socket](https://github.com/user-attachments/assets/58d73900-3da4-4e6e-9a4f-538f7abfc459)

![02 - lesson learned](https://github.com/user-attachments/assets/1d47998a-acce-4f58-a015-39d8dee7b671)

## MQTT
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/67943333-413f-4876-acb6-4f9afe0f87c3)

#### 2 - Obtaining 1st Flag
I was only able to capture the first flag in the MQTT challenge, which was fairly straightforward. While the proxy was running, I opened Wireshark and monitored all outgoing connections from my machine. One of them was using the MQTT protocol, and I found the flag in that traffic.

![01 - Flag](https://github.com/user-attachments/assets/d8138e97-990a-4e83-85c9-6c281f0cad6c)

![02  - lesson learned](https://github.com/user-attachments/assets/a755b5d5-de36-4a9f-a335-885aef213796)

#### 3 - Trying for 2nd Flag
The second part of the challenge required modifying the topic from /flag_22 to /flag_2 which was a typo. I attempted to recreate the MQTT message using Scapy, but couldn’t get it to work. I believe I was close to solving it, but I’m not yet confident enough with crafting MQTT packets manually.

![03  - wireshark dump](https://github.com/user-attachments/assets/336fe67e-945f-46ba-b42e-098fb908a0fa)

## Sharks on the Wire
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/2e269f5b-df8b-483a-bf30-e3b6a2207fd2)

#### 2 - Obtaining 1st Flag
I was only able to retrieve the first flag in the Sharks on the Wire challenge. It was exposed through an unencrypted DNS request, which clearly revealed the flag.

![01 - First flag](https://github.com/user-attachments/assets/cd12063b-065f-4c07-966b-af55269f667c)

![02 - lesson learned](https://github.com/user-attachments/assets/9b87eb95-7371-4a0d-a390-3f30f3c6e9ec)

The second flag was more challenging—it involved an encrypted request, and I wasn’t sure how to proceed from there.

I gave my best effort but couldn’t solve the remaining challenges, such as Certificate Pinning and the DNS-related one.
