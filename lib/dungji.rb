require 'pathname'
require 'logger'
require 'fileutils'

module Dungji
  TEMPLATE_DIR = File.join(Dir.getwd, 'lib/dungji/templates')
  SOURCE_DIR = File.join(Dir.getwd, '_source')
  BUILD_DIR = File.join(Dir.getwd, '_build')
  NOTES_DIR = File.join(SOURCE_DIR, 'notes')
  ASSETS_DIR = File.join(Dir.getwd, 'assets')
  # BASE_URL = "https://annyeong.me"
  BASE_URL = "http://localhost:8000"

  # Build a static site from the given source.
  def self.build
    FileUtils.rm_rf BUILD_DIR if File.directory? BUILD_DIR
    Dir.mkdir BUILD_DIR
    Dir.new(ASSETS_DIR).each_child do |c|
      FileUtils.cp_r File.join(ASSETS_DIR, c), BUILD_DIR
    end
    logger = Logger.new(STDOUT)

    Note.all.each do |n|
      path = File.join(BUILD_DIR, n.html_path)
      Pathname(path).dirname.mkpath if path.include? '/'
      File.open(path, "w+") do |f|
        begin
          f.write n.to_html
        rescue => e
          logger.warn("#{n.html_path} raised some error: #{e}")
        else
          logger.info("#{n.html_path} has been created")
        end
      end
    end
  end
end

require_relative 'dungji/note'
require_relative 'dungji/template'
