Rails.application.routes.draw do
  # Health check route
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    post '/auth/signup', to: 'auth#signup'
    post '/auth/login', to: 'auth#login'
    post '/auth/logout', to: 'auth#logout'
    get '/auth/verify', to: 'auth#verify_token'
    post '/auth/forgot-password', to: 'auth#forgot_password'
    get '/auth/verify-reset-token', to: 'auth#verify_reset_token'
    post '/auth/reset-password', to: 'auth#reset_password'

    # Appointments routes
    resources :appointments, only: [:index, :create, :show, :update, :destroy]

    # Admin routes
    namespace :admin do
      get '/dashboard', to: 'admin#dashboard'
      get '/users', to: 'admin#users'
      get '/users/:id', to: 'admin#user_details'
      delete '/users/:id', to: 'admin#delete_user'
      patch '/users/:id/promote', to: 'admin#promote_user'
      patch '/users/:id/demote', to: 'admin#demote_user'
      
      get '/appointments', to: 'admin#all_appointments'
      delete '/appointments/:id', to: 'admin#delete_appointment'
    end
  end

  # Root path (optional)
  # root "posts#index"
end
