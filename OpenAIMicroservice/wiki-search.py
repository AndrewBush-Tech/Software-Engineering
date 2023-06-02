import wikipedia
import json
from flask import Flask, render_template, request

app = Flask(__name__)


def clean_text(text):
    """
    This function removes special characters from a given text and returns the cleaned text.
    """
    # List of special characters to remove
    special_chars = "!@#$%^&*()_+=-[]{}|\\;':\"<>,.?/~`"

    # Remove special characters from text
    for char in special_chars:
        text = text.replace(char, "")

    # Convert all letters to lowercase
    text = text.lower()

    # Return cleaned text
    return text

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template('index.html')

@app.route("/search", methods=["GET"])
def search():
    """
    Performs the Wikipedia search based on the provided parameters and returns the result as JSON.
    """
    one = request.args.get("one")
    two = request.args.get("two")
    three = request.args.get("three")

    # Clean search terms
    cleaned_terms = "{} {} {}".format(one, two, three)
    cleaned_terms = clean_text(cleaned_terms)

    try:
        # Search for page with cleaned terms
        wikipedia.set_lang("en")
        page = wikipedia.page(cleaned_terms)

        # Create response dictionary
        response = {
            "title": page.title,
            "url": page.url,
            "summary": page.summary,
        }

        # Return response as JSON
        return json.dumps(response)
    except wikipedia.exceptions.PageError:
        return json.dumps({"error": "No results found."})
    
if __name__ == "__main__":
    app.run(debug=True)
