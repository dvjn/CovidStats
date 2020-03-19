from flask import Blueprint, request

from numpy import nan
import json
from .data import covid_data, countries, states, params

api = Blueprint('api', __name__)

@api.route('/get_data/', methods=['GET'])
def get_data():
    args = [
        {'id':'Country/Region', 'req': request.args.get('country', False)}, 
        {'id':'Province/State', 'req': request.args.get('state', False)}, 
        {'id':'Parameter', 'req': request.args.get('parameter', False)}
    ]
    return covid_data.loc[tuple(arg['req'] if arg['req'] else slice(None) for arg in args), :].to_dict("split")

@api.route('/get_countries/', methods=['GET'])
def get_countries():
    return countries

@api.route('/get_states/', methods=['GET'])
def get_states():
    return states.get(request.args.get('country', 'All'), [])