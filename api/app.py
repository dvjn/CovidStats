from flask import Blueprint, request

from numpy import nan
import json
from .data import covid_data, countries, states, params
curr_date = covid_data.columns[-1]
last_date = covid_data.columns[-2]
last_week = covid_data.columns[-8]
last_month = covid_data.columns[-31]

api = Blueprint('api', __name__)

@api.route('/get_data/', methods=['GET'])
def get_data():
    args = [
        {'id':'Country/Region', 'req': request.args.get('country', False)}, 
        {'id':'Province/State', 'req': request.args.get('state', False)}, 
        {'id':'Parameter', 'req': request.args.get('parameter', False)}
    ]
    return covid_data.loc[tuple(arg['req'] if arg['req'] else slice(None) for arg in args), :].to_dict("split")

@api.route('/get_top_countries/', methods=['GET'])
def get_top_countries():
    ret_data = dict()
    for param in params:
        ret_data[param] = covid_data.loc[(slice(None), 'All', param), :].sort_values(by=curr_date, ascending=False)[:6].reset_index(['Province/State', 'Parameter'], drop=True)
        ret_data[param]['current'] = ret_data[param][curr_date]
        ret_data[param]['dayChange'] = ret_data[param]['current'] - ret_data[param][last_date]
        ret_data[param]['weekChange'] = ret_data[param]['current'] - ret_data[param][last_week]
        ret_data[param]['monthChange'] = ret_data[param]['current'] - ret_data[param][last_month]
        ret_data[param] = ret_data[param][['current', 'dayChange', 'weekChange', 'monthChange']].to_dict('index')
    return ret_data

@api.route('/get_countries/', methods=['GET'])
def get_countries():
    return countries

@api.route('/get_states/', methods=['GET'])
def get_states():
    return states.get(request.args.get('country', 'All'), [])