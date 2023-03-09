class CreateRooms < ActiveRecord::Migration[7.0]
    def change
      create_table :rooms do |t|
        t.string :name
        t.references :establishment, index: true, foreign_key: true
        t.timestamps
      end
    end
  end