from flask_api import FlaskAPI
from flask_cors import CORS

from api.app import api
from frontend.app import frontend

app = FlaskAPI(__name__)
CORS(app)
app.register_blueprint(frontend)
app.register_blueprint(api, url_prefix='/api')

if __name__=='__main__':
    app.run(debug=True)