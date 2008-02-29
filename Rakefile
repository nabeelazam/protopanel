require 'rake'
require 'rake/packagetask'

PROTOPANEL_ROOT     = File.expand_path(File.dirname(__FILE__))
PROTOPANEL_SRC_DIR  = File.join(PROTOPANEL_ROOT, 'src')
PROTOPANEL_DIST_DIR = File.join(PROTOPANEL_ROOT, 'dist')
PROTOPANEL_PKG_DIR  = File.join(PROTOPANEL_ROOT, 'pkg')
PROTOPANEL_VERSION  = '0.0.1'

task :default => [:dist, :package, :clean_package_source]

desc "Builds the distribution"
task :dist do
  $:.unshift File.join(PROTOPANEL_ROOT, 'lib')
  require 'protodoc'
  
  Dir.chdir(PROTOPANEL_SRC_DIR) do
    File.open(File.join(PROTOPANEL_DIST_DIR, 'protopanel.js'), 'w+') do |dist|
      dist << Protodoc::Preprocessor.new('protopanel.js')
    end
  end
end

Rake::PackageTask.new('protopanel', PROTOPANEL_VERSION) do |package|
  package.need_tar_gz = true
  package.package_dir = PROTOPANEL_PKG_DIR
  package.package_files.include(
    '[A-Z]*',
    'dist/protopanel.js',
    'lib/**',
    'src/**',
    'test/**'
  )
end

desc "Builds the distribution, runs the JavaScript unit tests and collects their results."
task :test => [:dist, :test_units]

require 'test/lib/jstest'
desc "Runs all the JavaScript unit tests and collects the results"
JavaScriptTestTask.new(:test_units) do |t|
  testcases        = ENV['TESTCASES']
  tests_to_run     = ENV['TESTS']    && ENV['TESTS'].split(',')
  browsers_to_test = ENV['BROWSERS'] && ENV['BROWSERS'].split(',')
  
  t.mount("/dist")
  t.mount("/test")
  
  Dir["test/unit/*.html"].sort.each do |test_file|
    tests = testcases ? { :url => "/#{test_file}", :testcases => testcases } : "/#{test_file}"
    test_filename = test_file[/.*\/(.+?)\.html/, 1]
    t.run(tests) unless tests_to_run && !tests_to_run.include?(test_filename)
  end
  
  %w( safari firefox ie konqueror opera ).each do |browser|
    t.browser(browser.to_sym) unless browsers_to_test && !browsers_to_test.include?(browser)
  end
end

task :clean_package_source do
  rm_rf File.join(PROTOPANEL_PKG_DIR, "protopanel-#{PROTOPANEL_VERSION}")
end
