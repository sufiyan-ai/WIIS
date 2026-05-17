import os, re
root = 'C:/Sufiyan/his-website/public'
count = 0
for d, _, fs in os.walk(root):
  for f in fs:
    if f.endswith(('.html', '.css', '.js')):
      path = os.path.join(d, f)
      with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
      
      # Replace src="images/" or href="images/" with src="/images/"
      new_content = re.sub(r'(src|href)=[\'\"](images|css|js)/', r'\1="/\2/', content)
      new_content = re.sub(r'url\([\'\"]?(images|css|js)/', r'url(\'/\1/', new_content)
      new_content = re.sub(r'(src|href)=[\'\"]\.\./(images|css|js)/', r'\1="/\2/', new_content)
      new_content = re.sub(r'url\([\'\"]?\.\./(images|css|js)/', r'url(\'/\1/', new_content)
      
      if content != new_content:
        with open(path, 'w', encoding='utf-8') as file:
          file.write(new_content)
        count += 1
        print(f'Fixed paths in {path}')
print(f'Total files fixed: {count}')
