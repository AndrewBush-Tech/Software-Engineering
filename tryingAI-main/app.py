"""

Code for 'response' variable and 'generate prompt' function is taken 
from examples at OpenAI (https://platform.openai.com/playground) and
modified to fit current project

"""

import os
import requests
import openai
from flask import Flask, redirect, render_template, request, url_for

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/", methods=("GET", "POST"))
def index():
    if request.method == "POST":
        one = request.form["one"]
        two = request.form["two"]
        three = request.form["three"]
        wikiresponse = requests.get('http://localhost:8000/search', params={'one': one, 'two': two, 'three': three})
        summary = wikiresponse.json()['summary']
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=generate_prompt(one, two, three, summary),
            temperature=1.0,
            max_tokens=2048
        )
        return redirect(url_for("index", result=response.choices[0].text))

    result = request.args.get("result")
    return render_template("index.html", result=result)


def generate_prompt(one, two, three, summary):
    return f"""Write a killer pitch for VC investors for a startup involving three random terms. 
    It should be extremely compelling and informed, with advanced vocabulary terms and outrageous
    claims about the efficacy of the product. Incorporate the feeling from this wikipedia page: {summary}"
    The terms are {one.capitalize()}, {two.capitalize()}, and {three.capitalize()}."""
