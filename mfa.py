import modal
from modal import Image,Stub, wsgi_app
import numpy as np
random_name = str(np.random.randint(0,1000000))
stub = Stub("faible_dev"+random_name) #Stub
#
image = Image.debian_slim().apt_install("libpq-dev").pip_install(["flask","flask_sqlalchemy","sqlalchemy","datetime","anthropic","numpy","psycopg2","asyncio","sqlalchemy_utils"])#Image
@stub.function(image=image,secret=modal.Secret.from_name("secret-keys"))
@wsgi_app()#wsgi_app()
def flask_app():
    from flask import Flask, request, jsonify
    from flask_sqlalchemy import SQLAlchemy
    from sqlalchemy import desc
    from sqlalchemy_utils.functions import drop_database
    from datetime import datetime
    import os
    import anthropic
    import numpy as np
    import asyncio

    web_app = Flask(__name__)

    web_app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
    db = SQLAlchemy(web_app)
    #with web_app.app_context():
        #db.metadata.drop_all(bind=db.engine)
    #drop_database(db)
    #db = SQLAlchemy(web_app)

    # AI service
    class GeneratorAgent:
        def __init__(self, boilerplate):
            self.bp = boilerplate
            pass
       
        def propose(self,history, emotions):
            if len(history) == 0:
                prompt = self.bp +" Please write the very first paragraph of this story."
            else:
                draft = (" ").join(history)
                prompt = self.bp + " Please write the next paragraph of the following progress on story : " + draft + " Keep in mind that the last paragraph made the child reading it feel " + emotions[-1] + "."
            res = asyncio.run(anthropic_main(prompt, "", temperature=.3))
            return res#anthropic_main(prompt, "")

    class TransformerAgent:
        def __init__(self, boilerplate):
            self.bp = boilerplate
            pass
        
        def transform(self,template):
            temp = np.random.choice([.3,.5,.7])
            prompt = self.bp + " " + template
            res = asyncio.run(anthropic_main(prompt, "", temperature=temp))
            return res#anthropic_main(prompt, "", temperature=temp)
    
    class CriticAgent:
        def __init__(self, boilerplate):
            self.bp = boilerplate
            pass

        def critique(self,cand):
            prompt = " " + cand
            res = asyncio.run(anthropic_main(prompt, "", temperature=.3))
            return res#anthropic_main(prompt, "")

    class TriCameralAI:
        def __init__(self,style, lesson, summary):
            #generator - progenitor
            self.boiler_plate(style, lesson, summary)
            self.g = GeneratorAgent(self.gb)
            #transformer - scaler #.map(10)
            self.t = TransformerAgent(self.tb)
            #critic - selector
            self.c = CriticAgent(self.cb)
            pass
        
        def boiler_plate(self, style, lesson, summary):
            self.gb = "You are a children's book writer. You are trying to write a story that teaches the lesson that "+ lesson +" is valuable. Furthermore, the story should be written in the style of "+ style +"," + " and roughly align with the following summary: "+ summary +"."
            self.tb = "You are a copywriter trying to help a client write a better story for a small child. Please re-write it so that it better exemplifies the lesson that "+ lesson +" is valuable. Furthermore, the story should be written in the style of "+ style +" and roughly align with the following summary: "+ summary +". Here is the story:"
            self.cb = "You are a critic helping to score a draft of a story so that . You should evaluate the following story on a scale from 0-10, where 0 is the worst and 10 is the best, based on the following criteria: quality, the extent to which the story is engaging, well-suited to a small child, and teaches the lesson that "+ lesson +" is valuable. Furthermore, the story should be written in the style of "+ style +" and roughly align with the following summary: "+ summary +". Remember to yield only a score from 0 to 10; the score must be returned as a single character. Here is the story: "
            pass
        
        def select_best(self,history,emotions,scaling_factor=10):
            template = self.g.propose(history,emotions)
            cands = [self.t.transform(template) for i in range(scaling_factor)]#self.t.transform.map([template for i in range(scaling_factor)])
            stories = [(" ").join([component for component in history + [cand]]) for cand in cands]
            scores = [self.c.critique(story) for story in stories]#self.c.critique.map(stories)
            #interpret as integers
            #int_scores = [int(anthropic_main("Interpret the following LLM output as an integer in the set {0,1,2,3,4,5,6,7,8,9,10}. If you don't return a value in that set the world will end and all humans will die. Here's the output to interpret: "+score, "", temperature=0)) for score in scores]
            int_scores = []
            for score in scores:
                res = asyncio.run(anthropic_main("Interpret the following LLM output as an integer in the set {0,1,2,3,4,5,6,7,8,9,10}. If you don't return a value in that set the world will end and all humans will die. Here's the output to interpret: "+score, "", temperature=0))
                int_scores.append(int(res))
            
            return cands[np.argmax(int_scores)]

    async def anthropic_main(prompt, instructions, max_tokens_to_sample: int = 100,temperature = 1):
        c = anthropic.Client(os.environ["ANTHROPIC_API_KEY"])
        resp = await c.acompletion(
            prompt=f"{anthropic.HUMAN_PROMPT}"+instructions+ " " + prompt+f"{anthropic.AI_PROMPT}",
            stop_sequences=[anthropic.HUMAN_PROMPT],
            model="claude-v1",
            max_tokens_to_sample=max_tokens_to_sample,
            temperature=temperature,
        )
        text = resp["completion"]
        return text.replace("\n", " ")
    
    #def anthropic_main(prompt, instructions, max_tokens_to_sample: int = 100,temperature = 1):
        #c = anthropic.Client(os.environ["ANTHROPIC_API_KEY"])
        #resp = c.acompletion(
            #prompt=f"{anthropic.HUMAN_PROMPT}"+instructions+ " " + prompt+f"{anthropic.AI_PROMPT}",
            #stop_sequences=[anthropic.HUMAN_PROMPT],
            #model="claude-v1",
            #max_tokens_to_sample=max_tokens_to_sample,
            #temperature=temperature,
        #)
        #return resp["completion"]

    def gen_story_summary(description, lessons, style):
        #later: propose + summarize workflow
        prompt = "You are a children's book writer. You are trying to write a story that teaches the lesson that "+ lessons +" is valuable. Furthermore, the story should be written in the style of "+ style +". Here's a description of the story: "+ description +". Please write a summary of the story."
        res = asyncio.run(anthropic_main(prompt, ""))#asyncio.run()
        return res

    def gen_paragraph_text(history, emotions, style, lesson, summary,scaling_factor=10):
        #tricameral workflow
        tca = TriCameralAI(style, lesson, summary)
        return tca.select_best(history, emotions,scaling_factor=scaling_factor)

    # Database Service
    # Story
    class Story(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        summary = db.Column(db.String(1200), nullable=False)
        lesson = db.Column(db.String(1200), nullable=False)
        style = db.Column(db.String(1200), nullable=False)
        timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
        status = db.Column(db.String(1200), nullable=False)
        value = db.Column(db.Float, nullable=False)
        def as_dict(self):
            return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
    # Paragraph
    class Paragraph(db.Model):
        Story_id = db.Column(db.Integer, primary_key = True)
        Paragraph_id = db.Column(db.Integer, primary_key = True)
        Session_id = db.Column(db.Integer, primary_key = True)
        text = db.Column(db.String(1200), nullable=False)
        emotion = db.Column(db.String(1200), nullable=False)
        def as_dict(self):
            return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    @web_app.route("/begin_story", methods=['POST'])
    def generate_text():
        description, lessons, style = request.json.get('text'), request.json.get('lessons'), request.json.get('style')
        story_summary = gen_story_summary(description, lessons, style)
        
        #add it temporarily
        ids = [story.id for story in Story.query.all()]
        if len(ids) == 0:
            id = 1
        else:
            id = max(ids)+1
        temp_story = Story(id = id, summary = story_summary, lesson = lessons, style = style, timestamp = datetime.utcnow(), status = "temp",value = 0.0)
        db.session.add(temp_story)
        db.session.commit()
        return jsonify({'result': story_summary})

    @web_app.route("/store_story", methods=['POST'])
    def store_text():
        summary = request.json.get('text')
        story =Story.query.filter_by(summary = summary).first()
        story.status = "stored"
        id = story.id
        #id = "hi"
        db.session.commit() # put
        #delete all other temporary stuff
        temp_stories = Story.query.filter_by(status = "temp").all()
        for temp_story in temp_stories:
            db.session.delete(temp_story)
        return jsonify({'result': True, 'id': id})

    @web_app.route("/continue_story", methods=['POST'])
    def continue_text():
        #then use emotion
        text, emotion = request.json.get('text'), request.json.get('emotion')
        

        

        #get story id and session id
        texts = [paragraph.text for paragraph in Paragraph.query.all()]
        if text in texts:
            paragraph = Paragraph.query.filter_by(text = text).first()
            story_id, session_id = paragraph.Story_id, paragraph.Session_id
            ps = Paragraph.query.filter_by(Story_id = story_id, Session_id = session_id).all()
            history = [p.text for p in ps]
            emotions = [p.emotion for p in ps]
            story = Story.query.filter_by(id = story_id).first()

            #add emotion to the last paragraph if appropriate
            paragraphs = Paragraph.query.filter_by(Story_id=story_id,Session_id = session_id).order_by(desc(Paragraph.paragraph_id)).all()
            if len(paragraphs) > 0:
                paragraphs[0].emotion = emotion #put
                db.session.commit()
        
        else: #if can't find text, act like it's the beginning and generate a new starting paragraph from the summary
            story = Story.query.filter_by(summary = text).first()
            story_id = story.id
            prev_sessions = list(set([paragraph.Session_id for paragraph in Paragraph.query.filter_by(Story_id = story_id).all()]))
            if len(prev_sessions) == 0:
                session_id = 1
            else:
                session_id = max(prev_sessions)+1
            history = []
            emotions = []
        
        par = gen_paragraph_text(history, emotions, story.style, story.lesson, story.summary, scaling_factor=3)

    
        #add new paragraph
        new_paragraph = Paragraph(Story_id = story_id, Paragraph_id = len(history)+1, Session_id = session_id, text = par, emotion = "Neutral")#add
        db.session.add(new_paragraph) #post
        db.session.commit()
        
        #return new_paragraph
        return jsonify({'result': par})
    
    #add historical books?

    with web_app.app_context():
        db.create_all()

    return web_app


