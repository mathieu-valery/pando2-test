namespace :extract do
    desc "extract csv to database"
    task measurements: :environment do
        require "csv"
        files = ["20211101_B3D54FD00007B2.csv", "20211101_B3D54FD000088A.csv", "20211101_B3D54FD000088F.csv"]
        files.each do |file|
            puts "extracting file: #{file}"
            csv_text = File.read(Rails.root.join("lib", "csvs", file))
            csv = CSV.parse(csv_text, :headers => true, :encoding => "ISO-8859-1")
            csv.each do |row|
                attributes = row.to_hash
                new_measurement = Measurement.new(attributes)
                new_measurement.save!
              end
            puts 'done !'
        end
        puts 'extracted csv files successfully !'
    end
end