from flask import Flask, request, jsonify
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

def create_app():
    app = Flask(__name__)

    @app.route('/')
    def hello_world():
        return 'Hello, World!'
    
    # Load GPT-4 model and tokenizer
    model = AutoModelForCausalLM.from_pretrained('nomic-ai/gpt4all-j')
    tokenizer = AutoTokenizer.from_pretrained('nomic-ai/gpt4all-j')

    @app.route('/generate', methods=['POST'])
    def generate_text():
        input_text = request.json['input_text']
        max_length = request.json.get('max_length', 100)
        num_return_sequences = request.json.get('num_return_sequences', 1)
        continuation = request.json.get('continuation', None)
        modifiers = request.json.get('modifiers', [])

        # Tokenize the input text and continuation
        input_ids = tokenizer.encode(input_text, return_tensors='pt')
        continuation_ids = tokenizer.encode(continuation, return_tensors='pt') if continuation else None

        # Apply modification qualifiers
        for modifier in modifiers:
            modifier_ids = tokenizer.encode(modifier, return_tensors='pt')
            input_ids = torch.cat((input_ids, modifier_ids), dim=1)

        # Generate text using GPT-4
        outputs = model.generate(
            input_ids,
            continuation_ids=continuation_ids,
            max_length=max_length,
            num_return_sequences=num_return_sequences,
            early_stopping=True
        )

        # Decode the generated output
        generated_text = [tokenizer.decode(output, skip_special_tokens=True) for output in outputs]

        return jsonify({'generated_text': generated_text})

    return app