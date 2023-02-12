class Api::V1::MeasurementsController < ApplicationController
    def index
        @measurements = Measurement.all
        render json: @measurements
    end

    def filter_measurements
        room_names = filter_params[:room_names]
        measure_types = filter_params[:measure_types]
        @measurements = Measurement.where(room_name: room_names, measure_type: measure_types)
        render json: @measurements
    end

    private

    def filter_params
        params.permit(
            :room_names => [],
            :measure_types => []
        )
      end


end