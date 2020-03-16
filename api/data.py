import pandas as pd

params = ['Confirmed', 'Deaths', 'Recovered']

data_link = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-{param}.csv'

locations = None

def get_data(param):
    link = data_link.format(param=param)
    if param==params[0]:
        global locations
        data = pd.read_csv(link)
        locations = data[['Country/Region', 'Province/State', 'Lat', 'Long']]
        data = data.drop(['Lat', 'Long'], axis=1)
    else:
        data = pd.read_csv(link).drop(['Lat', 'Long'], axis=1)
    data['Province/State'] = data['Province/State'].fillna('NaN')
    return data.set_index(['Country/Region', 'Province/State']).stack()

covid_data = pd.DataFrame({param:get_data(param) for param in params})
covid_data.index = covid_data.index.rename(['Country/Region', 'Province/State', 'Date'])
covid_data = covid_data.reset_index()
# covid_data['Date'] = pd.to_datetime(covid_data['Date'])

if __name__=='__main__':
    print(covid_data.info())
