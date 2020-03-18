import pandas as pd
from collections import defaultdict

params = ['Confirmed', 'Deaths', 'Recovered']

data_link = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-{param}.csv'

def get_data(param):
    global locations
    link = data_link.format(param=param)
    data = pd.read_csv(link)
    data['Province/State'] = data['Province/State'].fillna('All')
    data = data[~data['Province/State'].str.contains(', ')]
    data['Parameter'] = param
    data = data.drop(['Lat', 'Long'], axis=1)
    return data

covid_data = pd.concat([get_data(param) for param in params], ignore_index=True).set_index(['Country/Region', 'Province/State', 'Parameter']).sort_index()

country_aggregates = covid_data.groupby(level=[0,2]).sum()
country_aggregates = pd.concat([country_aggregates], keys=['All'], names=['Province/State']).reorder_levels(['Country/Region', 'Province/State', 'Parameter'])

global_aggregate = covid_data.groupby(level=[2]).sum()
global_aggregate = pd.concat([global_aggregate], keys=['All'], names=['Province/State'])
global_aggregate = pd.concat([global_aggregate], keys=['All'], names=['Country/Region'])

covid_data = pd.concat([covid_data, country_aggregates, global_aggregate]).reset_index().drop_duplicates(subset=['Country/Region', 'Province/State', 'Parameter'], keep='first').set_index(['Country/Region', 'Province/State', 'Parameter']).sort_index()

countries = set()
states = defaultdict(list)

for idx, _ in covid_data.groupby(level=[0,1]):
    countries.add(idx[0])
    states[idx[0]].append(idx[1])

def sort_with_all(data):
    data = sorted(data)
    data.insert(0, data.pop(data.index('All')))
    return data

countries = sort_with_all(countries)
for country in states.keys():
    states[country] = sort_with_all(states[country])
