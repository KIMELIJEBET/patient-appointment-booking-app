class Api::AuthController < Api::ApplicationController
  skip_before_action :authorize_request, only: [:signup, :login, :forgot_password, :reset_password, :verify_reset_token]

  def signup
    user = User.new(user_params)
    if user.save
      token = encode_token({ user_id: user.id })
      render json: { user: format_user(user), token: token, message: 'User created successfully' }, status: :created
    else
      render json: { message: 'Failed to create user', errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: params[:user][:email])
    if user && user.authenticate(params[:user][:password])
      token = encode_token({ user_id: user.id })
      render json: { user: format_user(user), token: token, message: 'Logged in successfully' }, status: :ok
    else
      render json: { message: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def verify_token
    if current_user
      render json: { user: format_user(current_user), token: request.headers['Authorization']&.split(' ')&.last, authenticated: true }, status: :ok
    else
      render json: { message: 'Token is invalid or expired', authenticated: false }, status: :unauthorized
    end
  end

  def forgot_password
    user = User.find_by(email: params[:email])
    if user
      user.generate_password_reset_token
      # In production, send email with reset link
      reset_link = "#{ENV['FRONTEND_URL'] || 'http://localhost:3001'}/reset-password?token=#{user.password_reset_token}"
      render json: { 
        message: 'Password reset link sent to your email',
        reset_link: reset_link # For development/testing
      }, status: :ok
    else
      # Don't reveal if email exists for security
      render json: { 
        message: 'If an account exists with this email, a reset link has been sent' 
      }, status: :ok
    end
  end

  def verify_reset_token
    user = User.find_by(password_reset_token: params[:token])
    
    if user && !user.password_reset_expired?
      render json: { message: 'Valid token', valid: true }, status: :ok
    else
      render json: { message: 'Invalid or expired token', valid: false }, status: :unauthorized
    end
  end

  def reset_password
    user = User.find_by(password_reset_token: params[:token])
    
    if !user
      render json: { message: 'Invalid reset token' }, status: :unauthorized
      return
    end

    if user.password_reset_expired?
      render json: { message: 'Reset token has expired' }, status: :unauthorized
      return
    end

    if user.reset_password(params[:password], params[:password_confirmation])
      render json: { message: 'Password reset successfully' }, status: :ok
    else
      render json: { message: 'Failed to reset password', errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def logout
    # For JWT, logout is typically handled on the client side by deleting the token.
    render json: { message: 'Logged out successfully' }, status: :ok
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  def format_user(user)
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  end
end

