require 'asciidoctor'
require 'date'
require_relative 'template'
require_relative 'converter'

module Dungji
# Represents a note, wrapping Ascidoctor.
class Note
  # path: absolute path for the .adoc file in local
  # slug: starts with `/`. no `index`
  attr_reader :title, :doc, :slug, :path, :updated_at

  def initialize path
    @doc = Asciidoctor.load_file path, safe: :server,
      attributes: { 'experimental' => true, }
    @title = @doc.header.title
    @path = path
    @slug = slugify(path)
    @updated_at = DateTime.parse @doc.attributes["docdatetime"]
  end

  # Absolute URL for this note.
  def url
    return BASE_URL if @slug == '/'
    url = BASE_URL + '/notes' + @slug
    url = url + "/" unless url.end_with?('/')
    url
  end

  # Path to the created HTML file
  def html_path
    return '/index.html' if @slug == '/'
    append = if @slug.end_with? '/'
      'index.html'
    else
      '/index.html'
    end
    '/notes' + slug + append
  end

  # Convert content into HTML
  def to_html = Template.render('note', {
      doc: @doc,
      title: @title,
      body: @doc.convert,
      keywords: @doc.attr('keywords'),
      description: @doc.attr('description'),
    })

  private
  def slugify path
    # drop basepath and '.adoc'
    slug = path.slice((NOTES_DIR.length)...-5)
    slug = slug.slice(...-5) if slug.end_with?('index')
    slug
  end

  # Query
  module Repo
    @@notes = []
    @@slugmap = {}
    def all()
      @@notes
    end

    def first = all.first

    def find(slug)
      @@slugmap[slug]
    end

    # Finds a note by attributes
    # Use `find` when find by slug
    def find_by(**args)
      res = all.find do |n|
        args.map do |k, v|
          begin
            n.send(k) == v
          rescue NoMethodError
            false
          end
        end.all?
      end
      res || []
    end

    private
    def self.gather(directory)
      return @@notes unless @@notes.empty?
      return unless FileTest.directory?(directory)
      dirs = [directory]
      note_paths = []
      until dirs.empty?
        dir = dirs.pop
        Dir.new(dir).each_child do |f|
          f = File.join(dir, f)
          if FileTest.directory?(f)
            dirs << f
          elsif File.extname(f) == ".adoc"
            note_paths << f
          end
        end
      end
      note_paths.map { |p| Note.new(p) }
    end
    @@notes = gather(NOTES_DIR).sort_by!(&:updated_at).reverse!
    @@notes.each do |n|
      @@slugmap[n.slug] = n
    end
    p @@slugmap.keys
  end
  extend Repo
end
end
