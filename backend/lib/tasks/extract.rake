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
                instrument = Instrument.find_or_initialize_by(serial_number: attributes["serial_number"])
                if instrument.new_record?
                    instrument.brand = attributes["brand"]
                    instrument.save!
                    puts 'new instrument created'
                end
                establishment = Establishment.find_or_initialize_by(name: attributes["establishment_name"])
                if establishment.new_record?
                    establishment.city = attributes["establishment_name"]
                    establishment.postcode = attributes["establishment_postcode"]
                    establishment.address = attributes["establishment_address"]
                    establishment.latitude = attributes["establishment_latitude"]
                    establishment.longitude = attributes["establishment_longitude"]
                    establishment.save!
                    puts 'new establishment created'
                end
                room = Room.find_or_initialize_by(name: attributes["room_name"], establishment_id: establishment.id)
                if establishment.new_record?
                    room.save!
                    puts 'new room created'
                end
                new_measurement = Measurement.new(
                    timestamp: attributes["timestamp"],
                    measure_type: attributes["measure_type"],
                    measure_float: attributes["measure_float"],

                )
                new_measurement.instrument = instrument
                new_measurement.room = room
                new_measurement.save!
              end
            puts 'done !'
        end
        puts 'extracted csv files successfully !'
    end
end