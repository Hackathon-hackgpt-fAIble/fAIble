from modal import Image, Stub, wsgi_app
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

stub = Stub("faible_dev")
image = Image.debian_slim().pip_install(["flask"])
@stub.function(image=image,secret=modal.Secret.from_name("secret-keys"))
@wsgi_app()
def flask_app():
    from flask import Flask, request, jsonify
    from sqlalchemy import desc
    import os

    web_app = Flask(__name__)

    web_app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
    db = SQLAlchemy(web_app)

    # Database Service
    # Story
    class Story(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        summary = db.Column(db.String(120), nullable=False)
        lesson = db.Column(db.String(120), nullable=False)
        style = db.Column(db.String(120), nullable=False)
        timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
        value = db.Column(db.Float, nullable=False)
        def as_dict(self):
            return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
    # Paragraph
    class Paragraph(db.Model):
        Story_id = db.Column(db.Integer, primary_key = True)
        Paragraph_id = db.Column(db.Integer, primary_key = True)
        Session_id = db.Column(db.Integer, primary_key = True)
        text = db.Column(db.String(120), nullable=False)
        emotion = db.Column(db.String(120), nullable=False)
        def as_dict(self):
            return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    @web_app.route("/begin_story", methods=['POST'])
    def generate_text():
        description, lessons, style = request.json.get('text'), request.json.get('lessons'), request.json.get('style')
        story_summary = summarize_story(gen_story(description, lessons, style))
        return jsonify({'result': story_summary})

    @web_app.route("/store_story", methods=['POST'])
    def store_text():
        summary, lessons, style = request.json.get('text')
        id = len(Story.query.all())
        story = Story(id = id, summary = summary, lesson = lessons, style = style, timestamp = datetime.utcnow(), value = 0.0)
        db.session.add(story)
        db.session.commit()
        return jsonify({'result': True, 'id': id})

    @web_app.route("/continue_story", methods=['POST'])
    def continue_text():
        story_id,session_id,emotion = request.json.get('story_id'),request.json.get('session_id'), request.json('emotion')
        paragraphs = Paragraph.query.filter_by(Story_id=story_id,Session_id = session_id).order_by(desc(Paragraph.paragraph_id)).all()

        #add emotion to the last paragraph
        paragraphs[0].emotion = emotion
        db.session.commit() #put

        #get story info
        story = Story.query.filter_by(id = story_id).first()

        #generate next paragraph
        next_paragraph_text = gen_paragraph_text(paragraphs, emotion, story.style, story.lesson, story.summary)
        next_paragraph = Paragraph(Story_id = story_id, Paragraph_id = len(paragraphs), Session_id = session_id, text = next_paragraph_text, emotion = None)
        db.session.add(next_paragraph)
        return story_id, session_id, next_paragraph_text

    with web_app.app_context():
        db.create_all()

    return web_app


