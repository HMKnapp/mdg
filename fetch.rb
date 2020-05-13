# frozen_string_literal: true

require 'fileutils'

WORKSPACE = File.expand_path('~/Work/github')
MDG_PATH = File.join(WORKSPACE, 'merchant-documentation-gateway')
POC_PATH = File.join(WORKSPACE, 'docs-template')

Dir.mkdir('content') unless Dir.exist?('content')

##################################
# MERCHANT DOCUMENTATION GATEWAY #
##################################
puts '======================================'
puts '=== MERCHANT DOCUMENTATION GATEWAY ==='
puts '======================================'
MDG_ASSETS = %w[index index.adoc shortcuts.adoc include samples tables resources].map do |asset|
  File.join(MDG_PATH, asset)
end
MDG_MAPPING = {
  'auto-generated' => 'auto-generated',
  'mermaid' => 'mermaid',
  'images' => 'images',
  'images/icons' => 'icons',
  'images/logo/wirecard_logo.png' => 'images/logo.png',
}

puts "Moving #{MDG_ASSETS} -> content/"
FileUtils.cp_r(MDG_ASSETS, 'content/')

MDG_MAPPING.each do |from, to|
  puts "Moving #{from} -> content/#{to}"
  FileUtils.cp_r(
    File.join(MDG_PATH, from), File.join('content', to)
  )
end

####################
# PROOF OF CONCEPT #
####################
puts '========================'
puts '=== PROOF OF CONCEPT ==='
puts '========================'

DOCINFO = %w[docinfo.html docinfo-footer.html docinfo-search.html]
POC_CONTENT_ASSETS = (%w[css js fonts].concat(DOCINFO)).map do |asset|
  File.join(POC_PATH, 'content', asset)
end
POC_ASSETS = %w[Rakefile .vale.ini].map do |asset|
  File.join(POC_PATH, asset)
end

puts "Moving content/#{POC_CONTENT_ASSETS} -> content/"
FileUtils.cp_r(POC_CONTENT_ASSETS, 'content/')
FileUtils.cp_r(POC_ASSETS, './')

FileUtils.rm(%w[ie print screen].map do |css|
  path = File.join('content', 'css', "#{css}.css")
  return path if File.file? path
end.compact)
