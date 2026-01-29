class ApplicationController < ActionController::API
  SECRET_KEY = Rails.application.secret_key_base

  def encode_token(payload)
    JWT.encode(payload, SECRET_KEY, 'HS256')
  end

  def auth_header
    header = request.headers['Authorization']
    header ||= request.headers['HTTP_AUTHORIZATION']
    header
  end

  def decoded_token
    return unless auth_header

    token = auth_header.split(' ')[1]
    return unless token

    JWT.decode(token, SECRET_KEY, true, algorithm: 'HS256')
  rescue JWT::DecodeError
    nil
  end

  def current_user
    return unless decoded_token

    user_id = decoded_token[0]['user_id']
    @current_user ||= User.find_by(id: user_id)
  end

  def logged_in?
    current_user.present?
  end

  def authorized
    render json: { message: 'Please log in' }, status: :unauthorized unless logged_in?
  end

  protected

  def authorize_request
    authorized
  end
end
