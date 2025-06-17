import pyautogui
import time
import random
import platform

# Detect OS
is_mac = platform.system() == 'Darwin'

print("Running... Switch to your code editor. Starts in 5 seconds.")
time.sleep(5)

while True:
    # Press Enter 2 or 3 times
    for _ in range(random.randint(2, 3)):
        pyautogui.press('enter')
        time.sleep(0.1)

    # Press save combo
    if is_mac:
        pyautogui.hotkey('command', 's')
    else:
        pyautogui.hotkey('ctrl', 's')

    print("Typed and saved. Waiting 30 seconds...")
    time.sleep(30)