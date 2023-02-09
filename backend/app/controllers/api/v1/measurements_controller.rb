class Api::V1::MeasurementsController < ApplicationController
    def index
        @measurements = Measurement.all
        render json: @measurements
    end
end