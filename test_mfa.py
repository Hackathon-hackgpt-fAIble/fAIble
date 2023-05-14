import requests
import json
from alembic import op
import sqlalchemy as sa
#post
#
def upgrade():
    op.alter_column('Story', 'summary', type_=sa.String(1200))
    op.alter_column('Story', 'lessons', type_=sa.String(1200))
    op.alter_column('Story', 'style', type_=sa.String(1200))
    op.alter_column('Story', 'status', type_=sa.String(1200))

    op.alter_column('Paragraph', 'text', type_=sa.String(1200))
    op.alter_column('Paragraph', 'emotion', type_=sa.String(1200))


base = "https://joshuapurtell--faible-dev109186-flask-app-dev.modal.run"


text = "Write a children's story about a baby sloth that loses its family and has to find them again."
lessons = "The importance of patience"
style = "Ping the Duck"
url = base+"/begin_story"
headers = {'Content-Type': 'application/json'}
data = {'text': text, 'lessons':lessons, 'style':style}
re = requests.post(url,data=json.dumps(data),headers=headers)
print(re)
print(re.json())
summary = re.json()['result']
print("Summary: ", summary)


url = base+"/store_story"
headers = {'Content-Type': 'application/json'}
data = {'text': summary}
re = requests.post(url,data=json.dumps(data),headers=headers)
print(re)
print(re.json())
print("ID ",re.json()["id"])


url = base+"/continue_story"
headers = {'Content-Type': 'application/json'}
data = {'text': summary, 'emotion':'happy'}
re = requests.post(url,data=json.dumps(data),headers=headers)
print(re)
print(re.json())
print("Paragraph: ", re.json()['result'])


url = base+"/continue_story"
headers = {'Content-Type': 'application/json'}
data = {'text': re.json()['result'], 'emotion':'happy'}
re = requests.post(url,data=json.dumps(data),headers=headers)
print(re)
print(re.json())
print("Paragraph 2: ", re.json()['result'])