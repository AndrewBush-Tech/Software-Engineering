# Software-Engineering-front-end/weather-app
In the project directory, you can run:
### `npm install`
### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
The page will reload when you make changes.\
You may also see any lint errors in the console.
# Software-Engineering-front-end/OpenAI
In the project directory, you can run:
### `pip install -r requirements.txt`
### `flask run`
Runs the app in the development mode.\
Open [http://localhost:5000](http://localhost:5000) to view it in your browser.
# Software-Engineering-front-end/quakes-main
In the project directory, you can run:
### `python quakeFlask.py`

# Software-Engineering-front-end/OpenAIMicroservice
## How to REQUEST data from the microservice:
* Include "https://fejxhfgkg7.execute-api.us-east-2.amazonaws.com/Beta/search".
* Include three parameters at end of URL one="put parameter here", two="put parameter here",three="put parameter here".
* Error handling for special characters: "!@#$%^&*()_+=-[]{}|\\;':\"<>,?/~`." 
* Error handling for Uppercase letters. 
* Will handle multiple input parameters at a time.
* Will handle one or two missing input parameters.
* Will only handle human readable words as input parameters.
* Query parameter keys cannot be changed and must remain as 'one','two', and 'three'.

#### Example of an acceptable user input parameter:
* ?cat
* &DOG
* The dog ran
* Te Quiero,

#### Example of an unacceptable user input parameter:
* sdchjbgwei
* VDBSWJDHL
* kqwajbxciBB kJBsxd;kiqwe

#### Example call:

"CODE HERE"
```python 
api_url = 'https://fejxhfgkg7.execute-api.us-east-2.amazonaws.com/Beta/search'
wikiresponse = requests.get(api_url, params={'one': one, 'two': two, 'three': three})
summary = wikiresponse.json()['summary']
print(summary)
```
## How to RECEIVE data from the microservice:
* Request will receive a JSON file object with keys: "title", "url", "summary", and their correspopnding values in response to the wikipedia search.
* Failed request or no corresponding values will receive the following JSON error response: "{"error": "No results found."}. 

#### Example of Received a successful request: 
Example user inputs following parameters 'one': Python, 'two': Programming, 'three':Language would result in receiving the following response:

"JSON"
```json
{"title": "Python (programming language)", "url": "https://en.wikipedia.org/wiki/Python_(programming_language)", "summary": "Python is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation via the off-side rule.Python is dynamically typed and garbage-collected. It supports multiple programming paradigms, including structured (particularly procedural), object-oriented and functional programming. It is often described as a \"batteries included\" language due to its comprehensive standard library.Guido van Rossum began working on Python in the late 1980s as a successor to the ABC programming language and first released it in 1991 as Python 0.9.0. Python 2.0 was released in 2000. Python 3.0, released in 2008, was a major revision not completely backward-compatible with earlier versions. Python 2.7.18, released in 2020, was the last release of Python 2.Python consistently ranks as one of the most popular programming languages.\n\n"}
```

## UML Sequence Diagram for Microservice:

[UML Microservice (5).pdf](https://github.com/drewbush1990/CS361/files/11512158/UML.Microservice.5.pdf)
