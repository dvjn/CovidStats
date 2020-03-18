from flask import Blueprint, request

from numpy import nan
import json
from .data import covid_data, countries, states, params

api = Blueprint('api', __name__)

@api.route('/get_time_series/', methods=['GET'])
def time_series_data():
    country, state = request.args.get('country', 'All'), request.args.get('state', 'All')
    dataformat = request.args.get('format', 'index')
    return {
            'country': country, 
            'state': state, 
            'data': covid_data.loc[(country, state, slice(None)), :].reset_index(level=['Country/Region','Province/State'], drop=True).to_dict(dataformat)
        }

@api.route('/get_countries/', methods=['GET'])
def get_countries():
    return countries

@api.route('/get_states/', methods=['GET'])
def get_states():
    return states.get(request.args.get('country', 'All'), [])