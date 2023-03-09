class Room < ApplicationRecord
    belongs_to :establishment
    has_many :measurements
end