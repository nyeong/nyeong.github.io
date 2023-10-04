require 'erb'

module Dungji
	class Template
		@@templates = {}

		# template not includes ext like .html.erb 
		def self.render(template, args)
			read_template(template)
				.result(Struct.new(*args.keys).new(**args).instance_eval { binding })
		end

		private
		def self.read_template(template)
			return @@templates[template] if @@templates[template]
			template_path = File.join(TEMPLATE_DIR, template + '.html.erb')
		  content = File.read(template_path)
			erb = ERB.new(content)

			@@templates[template] = erb
		end
	end
end
