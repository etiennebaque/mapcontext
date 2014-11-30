class WelcomeController < ApplicationController
  def index
  end

  def getArticlesFromNewYorkTimes
    tag = URI::encode(params['tag'])

    result = {}
    result_articles = {}

    result_articles['tag'] = params['tag']

    (0..2).each do |page|
      nytimes_api_url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=#{tag}&page=#{page}&api-key=012f47373932293cd853c040f0d8e47d:12:70248475"
      api_response = HTTParty.get(nytimes_api_url)
      response = JSON.parse(api_response.body)

      articles = response['response']['docs']

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
          if result[city]['articles'].length <= 5
            result[city]['articles'] << article_hash
            result[city]['more'] = false
          else
            result[city]['more'] = true
          end
        end

      end
    end

    result_articles['result'] = result

    render json: result_articles
  end


  def getArticlesFromNewYorkTimesGeo
    tag = URI::encode(params['tag'])

    result = {}
    result_articles = {}
    result_articles['tag'] = params['tag']

    georesults = {}
    georesults['type'] = 'FeatureCollection'
    georesults['features'] = []

    (0..2).each do |page|
      nytimes_api_url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=#{tag}&page=#{page}&api-key=012f47373932293cd853c040f0d8e47d:12:70248475"
      api_response = HTTParty.get(nytimes_api_url)
      response = JSON.parse(api_response.body)

      articles = response['response']['docs']

      articles.each do |article|
        keywords = article['keywords']
        article_title = article['headline']['main']
        article_url = article['web_url']
        pub_date = article['pub_date']

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
            result[city]['articles'] = {}

            # For this new city, we need to find the geocodes. We'll use the Google API for this.
            google_geocodes_api = "https://maps.googleapis.com/maps/api/geocode/json?address=#{URI::encode(city)},USA&key=AIzaSyCURVsAEL5JnBtfrvzOj2nBkdB7hT0jzEA"
            api_response = HTTParty.get(google_geocodes_api)
            geocodes_response = JSON.parse(api_response.body);

            address = geocodes_response['results'][0]
            geocodes = address['geometry']['location']

            result[city]['latitude'] = geocodes['lat']
            result[city]['longitude'] = geocodes['lng']
          end

          article_to_add = {'title' => article_title, 'url' => article_url}

          result[city]['articles'].each do |article_date, article_list|
            result[city]['articles'][article_date] << article_to_add
          end

          if !result[city]['articles'].has_key?(pub_date)
            result[city]['articles'][pub_date] = [article_to_add]
          end

          #if result[city]['articles'].length <= 5
            #result[city]['articles'] << article_hash
            #result[city]['more'] = false
          #else
            #result[city]['more'] = true
          #end
        end

      end
    end

    # ---------------------------------

    # Time to create the 'feature' nodes, for the GeoJSON object.
    georesults['test'] = []
    result.each do |city, loc_info|
      latitude = loc_info['latitude']
      longitude = loc_info['longitude']

      loc_info['articles'].each do |article_date, articles|
        feature = {}
        feature['type'] = 'Feature'
        feature['properties'] = {}
        feature['geometry'] = {'type' => 'Point', 'coordinates' => [latitude,longitude,1]}

        article_date_value = article_date.gsub('T',' ').gsub('Z','')
        formatted_date = DateTime.strptime(article_date_value, '%Y-%m-%d %H:%M:%S').strftime('%Y-%d-%m %H:%M')
        feature['properties']['time'] = formatted_date
        #feature['properties']['articles'] = articles
        #feature['properties']['popupContent'] = "test"
        #feature['properties']['city'] = city

        georesults['features'] << feature

        articles_html = "<strong>#{city}</strong> - Related story published on #{formatted_date}<br><ul>"
        articles.each do |art_hash|
          articles_html += "<li>#{art_hash['title']} - <a href='#{art_hash['url']}'>Read story</a></li>"
        end
        articles_html += "</ul>"

        georesults['test'] << [latitude,longitude,{'time' => formatted_date},articles_html]

      end
    end

    #result_articles['result'] = result

    render json: georesults
  end


  def getLocationInfo
    result = {}
    location = params['location']

    google_geocodes_api = "https://maps.googleapis.com/maps/api/geocode/json?address=#{location.gsub(' ','+')},USA&key=AIzaSyCURVsAEL5JnBtfrvzOj2nBkdB7hT0jzEA"
    api_response = HTTParty.get(google_geocodes_api)
    geocodes_response = JSON.parse(api_response.body);

    address = geocodes_response['results'][0]
    geocodes = address['geometry']['location']

    result['latitude'] = geocodes['lat']
    result['longitude'] = geocodes['lng']
    result['city'] = location

    render json: result

  end
end
