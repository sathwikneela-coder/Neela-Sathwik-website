import re
from html.parser import HTMLParser

class FormParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.in_question = False
        self.in_option = False
        self.questions = []
        self.current_question = None

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        # Class names in Google Forms often look like this:
        # M7eMe: question text
        # sId0Ce: section title
        # etc.
        # But we can also look for role="listitem" or other common aria/data attributes
        cl = attrs_dict.get('class', '')
        
        # Let's inspect class attributes and find what's useful.
        
def main():
    with open("temp_form.html", "r", encoding="utf-8") as f:
        html_content = f.read()
    
    # Let's search for text strings that might represent questions.
    # Google Forms JSON data usually contains a list of questions in `_docs_flag_initialData` or `WIZ_global_data`.
    # Let's print out text strings that look like questions/labels.
    
    # Let's find WIZ_global_data or similar JSON strings in the file.
    match = re.search(r'FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?);', html_content)
    if match:
        print("Found FB_PUBLIC_LOAD_DATA_!")
        data_str = match.group(1)
        # We can extract text elements
        texts = re.findall(r'"([^"]{3,100})"', data_str)
        print("Extracted strings from load data:")
        for t in set(texts):
            if any(word in t.lower() for word in ['email', 'name', 'phone', 'service', 'budget', 'details', 'website', 'design', 'brand']):
                print(f" - {t}")
    else:
        # Let's check docs_flag_initialData
        match_init = re.search(r'_docs_flag_initialData\s*=\s*(.*?);', html_content)
        if match_init:
            print("Found _docs_flag_initialData!")
            data_str = match_init.group(1)
            # Find strings
            texts = re.findall(r'"([^"\\]{3,150})"', data_str)
            for t in sorted(list(set(texts))):
                if any(word in t.lower() for word in ['email', 'name', 'phone', 'service', 'budget', 'details', 'website', 'design', 'brand', 'select', 'logo']):
                    print(f" - {t}")

if __name__ == "__main__":
    main()
