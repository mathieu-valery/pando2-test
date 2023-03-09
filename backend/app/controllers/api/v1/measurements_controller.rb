class Api::V1::MeasurementsController < ApplicationController
    def index
        if filter_params[:room_names].present? && filter_params[:measure_types].present?
            @measurements = Measurement.joins(:room).
            where(room: {name: filter_params[:room_names]}).
            where(measure_type: filter_params[:measure_types])

        elsif filter_params[:room_names].present?
            @measurements = Measurement.joins(:room).
            where(room: {name: filter_params[:room_names]})

        elsif filter_params[:measure_types].present?
            @measurements = Measurement.
            where(measure_type: filter_params[:measure_types])

        else
            @measurements = Measurement.all
        end
        render json: @measurements
    end

    private

    def filter_params
        params.permit(
            :room_names => [],
            :measure_types => [],
        )
    end

end