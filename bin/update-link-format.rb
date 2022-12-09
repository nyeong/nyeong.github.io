#!/usr/bin/env ruby

files = Dir["**/content/*.md"]

files.each do |filename|
  text = File.read(filename)

  new_text = text
    .gsub(/(?<![`!])\[\[(?!(#|\/))(.+?)\]\]/, '[[notes/\2]]')
    .gsub(/\[\[#(.+?)\]\]/) do |match|
      t = match.gsub(/\[\[#(.+?)\]\]/, '\1')
      "[#{t}](##{t.gsub(' ', '-')})"
    end
    .gsub(/^# .+\n/, '') # remove h1 headers
  
  File.write(filename, new_text)
end
