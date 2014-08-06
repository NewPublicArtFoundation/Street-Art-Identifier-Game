require 'rubygems'
require 'bundler'
Bundler.require
require './database.rb'
require 'json'
require 'net/http'



set :root, File.dirname(__FILE__)

get '/' do
  send_file 'index.html'
end

get '/get_graffiti' do
  content_type :json
  url = URI.parse('http://www.publicartfound.com/api/return_a_graffiti.json')
  req = Net::HTTP::Get.new(url.to_s)
  res = Net::HTTP.start(url.host, url.port) {|http|
    http.request(req)
  }

  { :data => res.body }.to_json
end
