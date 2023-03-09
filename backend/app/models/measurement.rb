class Measurement < ApplicationRecord
    belongs_to :instrument
    belongs_to :room

    def room_name
        self.room.name
    end

    def as_json(options={})
        super(
            only: [:id, :timestamp, :measure_type, :measure_float, :instrument_id],
            methods: [:room_name]
        )
    end
end
