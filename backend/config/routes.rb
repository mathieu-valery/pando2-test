Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :measurements, only: [:index]
      post 'filter_measurements', action: :filter_measurements, controller: :measurements
    end
  end
end
