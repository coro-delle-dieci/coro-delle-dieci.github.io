import os

folder_path = './canti'

wrong_header = '''\
                <li><a href="../index/">Home</a></li>
                <li><a href="../canti/">Canti</a></li>
                <li><a href="../calendario/">Calendario</a></li>
                <li><a class="item" href="error/">Accedi</a></li>'''

correct_header = '''\
                <li><a class="item" href="index/">Home</a></li>
                <li><a class="item" href="canti/">Canti</a></li>
                <li><a class="item" href="calendario/">Calendario</a></li>
                <li><a class="item" href="error/">Accedi</a></li>'''

for filename in os.listdir(folder_path):
    if filename.endswith('.html'):
        file_path = os.path.join(folder_path, filename)

        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        if wrong_header in content:
            content = content.replace(wrong_header, correct_header)

            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"✅ Intestazione corretta in: {filename}")
        else:
            print(f"ℹ️ Nessuna modifica necessaria in: {filename}")