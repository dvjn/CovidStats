from flask import Blueprint, request

import json

frontend = Blueprint('frontend', __name__)

@frontend.route('/', methods=['GET'])
def index():
    return {'hello':'hunny bunny'}
