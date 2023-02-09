namespace :extract do
    desc "extract csv to database"
    task measurements: :environment do
        require "csv"
        puts 'extracting...'
        csv_text = File.read(Rails.root.join("lib", "csvs", "20211101_B3D54FD000088F.csv"))
        csv = CSV.parse(csv_text, :headers => true, :encoding => "ISO-8859-1")
        csv.each do |row|
            attributes = row.to_hash
            new_measurement = Measurement.new(attributes)
            new_measurement.save!
          end
        puts 'done !'
    end
end