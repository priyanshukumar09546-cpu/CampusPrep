import os
import glob

user_uploaded_dir = r"C:\Users\ASUS\.gemini\antigravity\brain\400e251e-308d-43c4-b07e-49088ec97f30\.user_uploaded"
files = glob.glob(os.path.join(user_uploaded_dir, "*"))
files.sort(key=lambda x: os.path.getmtime(x), reverse=True)

for f in files:
    print(f, os.path.getmtime(f))
