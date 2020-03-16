from flask import Blueprint, request

import json
from .data import covid_data, params

api = Blueprint('api', __name__)

def select_by_country_state(country, state):
    if country and state:
        return covid_data[(covid_data['Country/Region']==country) & (covid_data['Province/State']==state)]    
    elif country:
        return covid_data[covid_data['Country/Region']==country]
    else:
        return covid_data

@api.route('/', methods=['GET'])
def time_series_data():
    data = select_by_country_state(request.data.get('country', None), request.data.get('state', None))
    data = data.groupby(by=['Date']).sum()[params]
    return json.loads(data.to_json())