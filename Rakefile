import 'toolchain/Rakefile'

task :environment do
  ENV['CONTENT_PATH'] = File.dirname(__FILE__)
end

task default: %w[environment docs:all]
