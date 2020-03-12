# frozen_string_literal: true
#
#

REPO_PATH = '../merchant-documentation-gateway'

default = Hash.new('.')
ASSETS = %w[index index.adoc shortcuts.adoc docinfo.html docinfo-footer.html samples tables resources]

MAPPING = {
  'auto-generated' => 'auto-generated',
  'images/icons' => 'icons',
  'images' => 'images',
}

ASSETS += MAPPING.keys

ASSETS.each do |asset|
  puts "Moving #{REPO_PATH}/#{asset} -> content/#{MAPPING[asset]}"
end
