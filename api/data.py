import pandas as pd

params = ['Confirmed', 'Deaths', 'Recovered']

data_link = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-{param}.csv'
if __name__=="__main__":
    data_link = 'dummy_data/time_series_19-covid-{param}.csv'

def get_data(link):
    data = pd.read_csv(link).drop(['Lat', 'Long'], axis=1)
    data['Province/State'] = data['Province/State'].fillna('NaN')
    return data.set_index(['Country/Region', 'Province/State']).stack()

data = {param:get_data(data_link.format(param=param)) for param in params}

covid_data = pd.DataFrame(data)
covid_data.index = covid_data.index.rename(['Country/Region', 'Province/State', 'Date'])
covid_data = covid_data.reset_index()
# covid_data['Date'] = pd.to_datetime(covid_data['Date'])

if __name__=='__main__':
    print(covid_data.info())
