# IoT Firmware Extraction

## Introduction
Firmware extraction from an embedded device involves reading the contents of the flash memory where the software - including the operating system, applications, and configurations - is stored. This process allows analysts to understand the device’s internal workings and identify potential security vulnerabilities. In modern IoT and OT devices, firmware is often not publicly distributed or may be protected using proprietary compression or encryption. As a result, firmware extraction typically focuses on direct access to the device’s flash memory.
The process generally starts with identifying the flash chip on the PCB, connecting it via a suitable interface and programmer (such as an SPI programmer), and dumping its contents. Before extracting the firmware, it's crucial to determine the model of the flash chip. Most embedded flash chips are 8-pin packages - you can identify them by inspecting the chip's markings (e.g., MX25L12835F). If the label is dirty or faded, clean it with alcohol and brush with chalk to enhance visibility. If the text is too small, use a magnifier or digital microscope.
Once the chip model is confirmed, you can determine the correct pinout and choose an appropriate interface for extraction.

## Firmware Extraction Methods
### 1. Downloading from the Manufacturer’s Website
Some manufacturers provide firmware files on their official websites. This is the easiest method - simply identify your device and search the manufacturer’s support or download section, or check forums and platforms like GitHub. If available, download and unpack the update package to extract the firmware file. However, this method has become less reliable as more manufacturers restrict public access or use encrypted formats.

### 2. Capturing Update Traffic with MITM
If the device has a “check for update” button or feature, intercepting the firmware during an update process is possible. MITM (Man-in-the-Middle) tools like Wireshark, mitmproxy, or Bettercap can be used. If updates are fetched over HTTP, firmware files are often easy to locate and extract. For HTTPS traffic, you'll need to route the device through a proxy using your custom certificate - such as installing your own root certificate on the mobile app controlling the device. Once intercepted, the firmware file can be downloaded or extracted from the captured URL.

### 3. Exploiting Web Interfaces or Services
Another approach is to gain shell access by exploiting vulnerabilities in device services like web interfaces, Telnet, or SSH. Start by scanning open ports using tools like Nmap, then test web interfaces using Burp Suite for command injection. If a root shell is obtained, you can use commands like dd if=/dev/mtd0 of=/tmp/fw.bin to dump the firmware. Default credentials or password dumping may help with Telnet or SSH access. This method is non-destructive and allows in-system extraction, but only works if exploitable services are available.

### 4. Hardware-Based Firmware Extraction
Hardware extraction methods use physical interfaces such as UART, SPI, JTAG/SWD, and sometimes I²C. These methods provide direct or debug-level access to the device:

#### 4a. UART
Universal Asynchronous Receiver-Transmitter (UART) often outputs debug messages and can sometimes provide shell access. Locate the TX, RX, and GND pins on the PCB using a multimeter or oscilloscope. Use a USB-UART adapter (e.g., FTDI, CP2102) to connect to a PC, then use terminal software like PuTTY or minicom. If access is successful, you may obtain a root shell or U-Boot interface, allowing you to mount partitions and extract files using dd, cat, or even over TFTP.

#### 4b. SPI
Identify the SPI flash chip (commonly SOIC8, TSOP8, or WSON) on the PCB by reading its label. Use a logic analyzer (e.g., Saleae, BusPirate) to monitor SPI lines during boot, or connect directly to the chip using a clip or by soldering. SPI flash programmers like CH341A, XGecu TL866, or FlashcatUSB are commonly used, along with software like Flashrom or AsProgrammer. This method avoids chip removal, but can be disrupted by concurrent CPU access to the flash.

#### 4c. JTAG/SWD
Locate the JTAG or SWD pins on the PCB - typically TDO, TDI, TCK, TMS, TRST or SWDIO, SWCLK. Tools like JTAGulator can help identify the pinout. Use a debug adapter (e.g., SEGGER J-Link, ST-Link) and connect via OpenOCD or UrJTAG. Once connected, halt the CPU and extract memory using commands like dump_image. This method offers full memory access but may be blocked by software or hardware protections.

#### 4d. I²C
Although less common for firmware storage, some devices use EEPROMs over I²C. Locate the SDA and SCL lines and scan the bus using tools like Bus Pirate, a logic analyzer, or an Arduino. If firmware is stored on the EEPROM, read commands can be used to retrieve it. This method is simple and cheap, but is mostly seen in older or simpler devices.

## Chip-Off Firmware Extraction
Chip-off is considered a last-resort method. It involves desoldering the flash chip from the PCB and reading it using a universal programmer. This approach is chosen when all other interfaces are unavailable or locked, or when the device is non-functional. Chip-off allows complete access to the flash memory without interference from the CPU or OS, but will not work if the data is hardware encrypted (e.g., AES-protected).

### Step-by-Step Chip-Off Process
#### Identify the Flash Chip
Check the PCB for the flash package type - TSOP, SOIC, QFP, or BGA. Use chip markings or schematics to identify the exact model and retrieve its datasheet for pinout information.

#### Desolder the Chip
Use a hot air rework station or desoldering tools. Apply flux to the pins, preheat the board (optional), and gently heat the area to remove the chip using tweezers. For BGA packages, specialized tools and thermal protection for nearby components are necessary.

#### Mount on Programmer
Insert the chip into a compatible adapter (e.g., SOP8, SOP16) and connect to a universal programmer such as XGecu TL866, RT809H, or Dediprog. Select the correct chip model and communication protocol (SPI, ONFI, etc.) in the software. Manual selection may be required if auto-detection fails.

#### Read and Save Dump
Perform the Read operation at a moderate speed to avoid errors. After reading, verify the dump, then save it as a binary image. Analyze the dump using tools like Binwalk, Ghidra, or IDA Pro. Check for file systems, encryption, or compressed segments.

## Recommended Tools and Software
#### Programmers: 
XGecu TL866/T56, RT809H, Dediprog SF100/SF600, FlashcatUSB, CH341A
#### Software: 
Xgpro, SF Software, Flashrom, Binwalk, Ghidra, IDA Pro
#### Others: 
UART adapters, logic analyzers, hot air stations, microscope, multimeter

## Final Thoughts
Chip-off is a powerful but high-risk technique that bypasses most hardware and software restrictions. It requires precision and experience, as mishandling can damage the chip, PCB traces, or other components. Always attempt less invasive methods first, and consider chip-off only when necessary and when encryption is unlikely or can be bypassed.

