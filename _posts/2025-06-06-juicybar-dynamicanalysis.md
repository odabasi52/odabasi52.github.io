---
layout: post
title: "Juicy Bar CTF - Dynamic Code Analysis"
summary: "Set up Frida dynamic instrumentation on Android emulator, hooked target functions to capture return values and bypass security checks, hooked UUID.toString() to override with specific UUID value, captured runtime encryption IV/key/values and converted hex to ASCII, brute-forced 4-digit PIN via Frida function calls with error handling, performed timing attack on 10-digit PIN by collecting 200 samples per digit to measure response times."
---
# Juicy Bar CTF - Dynamic Code Analysis
In this post, we’ll walk through the solutions for all four dynamic analysis challenges.
I followed the official Frida Android tutorial (https://frida.re/docs/android/) to set up Frida before starting the challenge.

## Meet with Frida
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/415c34df-699f-47c3-b2eb-25f17c694f0a)

#### 2 - Obtaining 1st Flag
Obtaining the first flag was straightforward. I created a Frida script to hook the target function and print its return value, which revealed the flag.

![01 - Code1](https://github.com/user-attachments/assets/8b1b5793-9198-495f-b877-a3888ef11494)

![01 - Hook getFlag1](https://github.com/user-attachments/assets/faa516dc-4718-49ae-b6c4-bad93fa9b7f0)

![02 - Lesson Learned](https://github.com/user-attachments/assets/d80f86e3-bf5a-4605-95b5-ce3f7f3d19f6)

#### 3 - Obtaining 2nd Flag
The second flag was more challenging, involving checks on a static member, return value, and class member variables. To bypass this, I developed a Frida script that dynamically modified the return value and member variables at runtime, which allowed me to retrieve the flag.

![03 - Code3](https://github.com/user-attachments/assets/f9d0bcb3-abf8-46df-b16c-91aca3c41120)

![03 - Flag2](https://github.com/user-attachments/assets/942465df-e0d8-4259-b92e-ea05df051208)

![04 - Lesson Learned](https://github.com/user-attachments/assets/330e583e-ee55-4899-9bbd-888c7ca9a421)

#### 4 - Obtaining 3rd Flag 
The third flag involved verifying that the value of UUID.randomUUID().toString() was a specific, non-random UUID. I wrote a script to hook the UUID.toString() method directly, capture its output, and successfully retrieve the flag.

![05 - Code3](https://github.com/user-attachments/assets/bb8840b3-6891-4fd1-b914-8cc423710d49)

![05 - Flag3](https://github.com/user-attachments/assets/854c48d8-cce9-401b-933f-ee119dbe7866)

![06 - LEsson Learned](https://github.com/user-attachments/assets/a73bb479-c36d-4812-84ff-2fb0d3f17a6a)

## Obfuscated Secrets
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/671a1e5e-a1e0-4b82-a0a4-d6eecd2f780d)

#### 2 - Obtaining Flag

The obfuscated secrets challenge was trickier due to its heavily obfuscated encryption function. To be honest, I leveraged ChatGPT to analyze and understand the function. Once I had a clear picture, I developed a hook script to capture the IV, key, and the encrypted/decrypted values during runtime.

![01 - code](https://github.com/user-attachments/assets/e371a0c3-aac2-4b22-a996-5dff65201fcf)

![02 - Frida](https://github.com/user-attachments/assets/42a4bb31-93d6-4657-a4fd-d54ac04faaa6)

The code output indicated that the decrypted message was "check IV and key," which resembled hex values. When I converted those hex values to ASCII, I successfully obtained the flag.

![03 - flag](https://github.com/user-attachments/assets/2ee0308e-89ca-4fe9-ba44-ebf050de0f61)

![04 - lesson learned](https://github.com/user-attachments/assets/a0bcab49-62b5-45d7-874e-428c448d95d8)

## Brute Force
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/2db2ac8c-5918-4f01-b6f2-ee5fd61959dc)

#### 2 - Obtaining Flag
The brute force challenge was straightforward. I wrote a Frida script that instantiates the target class and calls the getFlag method with values from 0000 to 9999 inside a try-catch block. If no error occurred, the input was the correct PIN, and the flag was revealed.

![01 - code part](https://github.com/user-attachments/assets/de869b28-2dd9-45f6-a7a3-2d1528667834)

![02 - PIN](https://github.com/user-attachments/assets/8e5a88e7-9faf-4c67-a0f6-671bb4caa60a)

![03 - Lesson Learned](https://github.com/user-attachments/assets/d925f141-adc0-40b8-b661-06a6de7b6130)

## Time Your Attack
#### 1 - Description

![00 - Description](https://github.com/user-attachments/assets/c8e24bd5-a0c4-4cab-aaae-8321c129c9bf)

#### 2 - Obtaining Flag
The “Time Your Attack” challenge was very difficult. I relied on ChatGPT to help me understand the partially decompiled code, which included a significant amount of assembly instructions that made analysis challenging.

![01 - InputProvided](https://github.com/user-attachments/assets/fcc2f301-396a-438e-9245-d1cdfc36e7aa)

After analyzing the decompiled function, I realized it verifies the 10-digit PIN one digit at a time. If a digit is correct, the function takes longer to respond, allowing a timing attack to deduce the PIN step by step.

I then created a script that exploited this timing behavior to brute force the PIN. Due to noisy output, I collected 200 samples per digit to accurately measure the response time and reliably identify each correct digit.

![02 - code](https://github.com/user-attachments/assets/f72780cf-e034-46a7-9691-ae256af45681)

![03 - pin](https://github.com/user-attachments/assets/10931757-6cce-4c2c-8df1-2b4e0044f539)

![04 - lesson learned](https://github.com/user-attachments/assets/4639a328-cc41-4c1c-a2e7-173adc74a87a)
