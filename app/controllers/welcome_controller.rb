class WelcomeController < ApplicationController
  def index
  end

  def getArticlesFromNewYorkTimes
    tag = URI::encode(params['tag'])
    nytimes_api_url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=#{tag}&api-key=012f47373932293cd853c040f0d8e47d:12:70248475"
    api_response = HTTParty.get(nytimes_api_url)
    response = JSON.parse(api_response.body)

    articles = response['response']['docs']

    result = {}
    articles.each do |article|
      keywords = article['keywords']
      article_title = article['headline']['main']
      article_url = article['web_url']
      city = ''
      if keywords
        keywords.each do |keyword|
          if keyword['name'] == 'glocations'
            city = keyword['value']
          end
        end
      end

      if city != ''
        if !result.has_key?(city)
          result[city] = {}
          result[city]['articles'] = []

          # For this new city, we need to find the geocodes. We'll use the Google API for this.
          google_geocodes_api = "https://maps.googleapis.com/maps/api/geocode/json?address=#{URI::encode(city)},USA&key=AIzaSyCURVsAEL5JnBtfrvzOj2nBkdB7hT0jzEA"
          api_response = HTTParty.get(google_geocodes_api)
          geocodes_response = JSON.parse(api_response.body);

          address = geocodes_response['results'][0]
          geocodes = address['geometry']['location']

          result[city]['latitude'] = geocodes['lat']
          result[city]['longitude'] = geocodes['lng']
        end

        article_hash = {}
        article_hash['title'] = article_title
        article_hash['url'] = article_url
        result[city]['articles'] << article_hash
      end


    end

    render json: result
  end

  def getLocationInfo
    result = {}
    location = URI::encode(params['location'])

    google_geocodes_api = "https://maps.googleapis.com/maps/api/geocode/json?address=#{URI::encode(location)},USA&key=AIzaSyCURVsAEL5JnBtfrvzOj2nBkdB7hT0jzEA"
    api_response = HTTParty.get(google_geocodes_api)
    geocodes_response = JSON.parse(api_response.body);

    address = geocodes_response['results'][0]
    geocodes = address['geometry']['location']

    result['latitude'] = geocodes['lat']
    result['longitude'] = geocodes['lng']

    render json: result

  end
end
