from flask import Blueprint, request

import json
from .data import covid_data, locations, params

api = Blueprint('api', __name__)

def select_by_country_state(country, state):
    if country and state:
        return covid_data[(covid_data['Country/Region']==country) & (covid_data['Province/State']==state)]    
    elif country:
        return covid_data[covid_data['Country/Region']==country]
    else:
        return covid_data

@api.route('/get_time_series/', methods=['GET'])
def time_series_data():
    data = select_by_country_state(request.args.get('country'), request.args.get('state'))
    data = data.groupby(by=['Date']).sum()[params]
    return data.to_dict()

@api.route('/get_locations/', methods=['GET'])
def get_locations():
    return locations.to_dict("index")

@api.route('/get_countries/', methods=['GET'])
def get_countries():
    return locations['Country/Region'].unique().tolist()

@api.route('/get_regions/', methods=['GET'])
def get_regions():
    return [region for region in locations[locations['Country/Region']==request.args.get('country')]['Province/State'].unique().tolist() if region!='NaN']