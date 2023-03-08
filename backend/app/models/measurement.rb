class Measurement < ApplicationRecord
    belongs_to :establishment
    belongs_to :room
    belongs_to :instrument
end
