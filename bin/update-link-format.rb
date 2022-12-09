#!/usr/bin/env ruby

files = Dir["**/*.md"]

files.each do |filename|
  text = File.read(filename)

  new_text = text
    .gsub(/(?<![`!])\[\[(?!(#|\/))(.+?)\]\]/, '[[notes/\2]]')
    .gsub(/\[\[#(.+?)\]\]/, '[\1](#\1)')
  
  File.write(filename, new_text)
end
