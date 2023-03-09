class Measurement < ApplicationRecord
    belongs_to :instrument
    belongs_to :room
end
