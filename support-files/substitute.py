import os
import re

pattern = re.compile(r'(<li><a href="\.\./)(\w+)\.html(">)')

for filename in os.listdir():
    if filename.endswith(".html"):
        with open(filename, "r", encoding="utf-8") as file:
            content = file.read()
        
        new_content = pattern.sub(r'\1\2/\3', content)

        with open(filename, "w", encoding="utf-8") as file:
            file.write(new_content)

print("✅ Sostituzione completata in tutti i file HTML!")