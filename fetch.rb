# frozen_string_literal: true
#
#
require 'fileutils'

REPO_PATH = '../merchant-documentation-gateway'

ASSETS = %w[index index.adoc shortcuts.adoc docinfo.html docinfo-footer.html samples tables resources]
MAPPING = {
  'auto-generated' => 'auto-generated',
  'images/icons' => 'icons',
  'images' => 'images',
}


puts "Moving #{REPO_PATH}/#{ASSETS} -> content/"
# FileUtils.cp_r(ASSETS, 'content/')

MAPPING.each do |from, to|
  puts "Moving #{REPO_PATH}/#{from} -> content/#{to}"
  # FileUtils.cp_r(
  #   File.join(REPO_PATH, from), File.join('content', to)
  # )
end
