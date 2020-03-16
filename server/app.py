from flask import Flask
from flask_restplus import Api, Resource

app = Flask(__name__)
api = Api(app, version='1.0', title='COVID-19 Data API')

@api.route('/hi')
class COVID(Resource):
    def get(self):
        return {'hello':'world'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')