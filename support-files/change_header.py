import os

folder_path = './canti'

new_menu_item = '<li><a class="item" href="error/">Accedi</a></li>'

def add_menu_item_to_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    if '<ul>' in content:
        content = content.replace('</ul>', f'    {new_menu_item}\n</ul>', 1)
    
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f"Aggiunto il menu nel file: {file_path}")

for filename in os.listdir(folder_path):
    if filename.endswith('.html'):
        file_path = os.path.join(folder_path, filename)
        add_menu_item_to_html(file_path)