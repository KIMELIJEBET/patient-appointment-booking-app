Rails.application.routes.draw do
  # Health check route
  get "up" => "rails/health#show", as: :rails_health_check

  post '/signup', to: 'auth#signup'
post '/login', to: 'auth#login'
post '/logout', to: 'auth#logout'


  # Appointments routes
  resources :appointments, only: [:index, :create, :show, :update, :destroy]

  

  # Root path (optional)
  # root "posts#index"
end
