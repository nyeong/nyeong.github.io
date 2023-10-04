require 'asciidoctor'
require_relative 'template'
require_relative 'note'

module Dungji
class Converter < (Asciidoctor::Converter.for 'html5')
  register_for 'html5'

  def convert_inline_anchor node
    case node.type
    when :xref
      if (path = node.attributes['path'])
        # `<<file.adoc>>`으로 링크를 건 cross references
        slug = path_to_slug path
        if (n = Note.find(slug))
          text = node.text || n.title
          node.target = n.url
        else
          text = node.text || path
        end
        %(<a href="#{node.target}">#{text}</a>)
      else
        super node
      end
    else
      super node
    end
  end

  def path_to_slug path
    path = path.slice(...-5) if path.end_with?('.html')
    path = path.slice(...-5) if path.end_with?('index')
    "/" + path
  end
end
end
