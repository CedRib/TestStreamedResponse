from flask import Flask, request, Response
import lorem

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate_text():
    data = request.get_json()
    message = data.get('message')
    print(f"Received message: {message}")
    return "Processing message"

@app.route('/stream', methods=['GET'])
def stream_text():
    def generate():
        text = " ".join([lorem.paragraph() for _ in range(10)])
        yield text

    return Response(generate(), content_type='text/plain')

if __name__ == '__main__':
    app.run(port=5000)
